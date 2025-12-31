<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class GenerateSchema extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'crud:schema';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Parse all migration files and generate a JSON schema.';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $migrationPath = database_path('migrations');
    $migrationFiles = File::files($migrationPath);

    // Menggunakan array asosiatif untuk hasil akhir
    // { "nama_file.php": [ { "table_name": "...", "columns": [...] } ], ... }
    $allMigrationsData = [];

    // Regex yang disempurnakan
    $regex = '/^\s*\$table->(\w+)\s*\(\s*(?:[\'"]([^\'"]+)[\'"])?.*?\)\s*([^;]*);/m';

    foreach ($migrationFiles as $file) {
      $fileName = $file->getFilename();
      $content = File::get($file->getPathname());

      $fileColumns = [];

      if (preg_match_all($regex, $content, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
          $type = $match[1];
          $column = $match[2] ?? null;
          $modifiers = $match[3];

          $is_required = !str_contains($modifiers, '->nullable()') || str_contains($modifiers, '->required()');
          $is_unique = str_contains($modifiers, '->unique()');

          if (empty($column)) {
            if ($type === 'id') {
              $column = 'id';
            } elseif ($type === 'timestamps') {
              $fileColumns[] = $this->createColumnEntry('timestamp', 'created_at', $modifiers);
              $fileColumns[] = $this->createColumnEntry('timestamp', 'updated_at', $modifiers);
              continue;
            } elseif ($type === 'softDeletes') {
              $column = 'deleted_at';
            } elseif ($type === 'rememberToken') {
              $column = 'remember_token';
            } else {
              continue;
            }
          }

          $label = Str::title(str_replace('_', ' ', $column));

          $fileColumns[] = [
            'column' => $column,
            'type' => $type,
            'label' => $label,
            'is_required' => $is_required,
            'is_unique' => $is_unique,
          ];
        }
      }

      if (!empty($fileColumns)) {
        // **PERUBAHAN DI SINI: Ekstrak nama tabel**
        $tableName = null;

        // 1. Coba tebak dari nama file
        $fileNameWithoutExt = str_replace('.php', '', $fileName);
        $tableStr = preg_replace('/^\d{4}_\d{2}_\d{2}_\d{6}_/', '', $fileNameWithoutExt);

        if (Str::startsWith($tableStr, 'create_') && Str::endsWith($tableStr, '_table')) {
          $tableName = Str::between($tableStr, 'create_', '_table');
        } else if (Str::contains($tableStr, '_to_') && Str::endsWith($tableStr, '_table')) {
          $tableName = Str::between($tableStr, '_to_', '_table');
        } else if (Str::contains($tableStr, '_in_') && Str::endsWith($tableStr, '_table')) {
          $tableName = Str::between($tableStr, '_in_', '_table');
        } else if (Str::startsWith($tableStr, 'modify_') && Str::endsWith($tableStr, '_table')) {
          $tableName = Str::between($tableStr, 'modify_', '_table');
        }

        // 2. Jika gagal, parse dari konten file (fallback)
        if (!$tableName) {
          if (preg_match('/Schema::create\s*\(\s*[\'"]([^\'"]+)[\'"]/', $content, $schemaMatches)) {
            $tableName = $schemaMatches[1];
          } else if (preg_match('/Schema::table\s*\(\s*[\'"]([^\'"]+)[\'"]/', $content, $schemaMatches)) {
            $tableName = $schemaMatches[1];
          }
        }

        // **PERUBAHAN DI SINI: Ubah struktur output**
        $allMigrationsData[$fileName] = [
          [
            'table_name' => $tableName,
            'columns' => $fileColumns
          ]
        ];
      }
    }

    // Tentukan path output dan pastikan direktorinya ada
    $outputPath = resource_path('json/migrations.json');
    File::ensureDirectoryExists(dirname($outputPath));

    // Tulis data baru ke file JSON
    File::put($outputPath, json_encode($allMigrationsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $this->info('Berhasil membuat file JSON skema migrasi!');
    $this->info("Lokasi file: " . $outputPath);

    return 0;
  }

  /**
   * Fungsi pembantu untuk membuat entri kolom.
   */
  protected function createColumnEntry(string $type, string $column, string $modifiers): array
  {
    $is_required = !str_contains($modifiers, '->nullable()');
    $is_unique = str_contains($modifiers, '->unique()');

    if (!str_contains($modifiers, '->required()')) {
      $is_required = false;
    }

    return [
      'column' => $column,
      'type' => $type,
      'label' => Str::title(str_replace('_', ' ', $column)),
      'is_required' => $is_required,
      'is_unique' => $is_unique,
    ];
  }
}