<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class MakeCrudsCommand extends Command
{
  /**
   * Nama dan signature dari perintah konsol.
   * Ditambahkan opsi --rollback untuk membalikkan semua tindakan.
   *
   * @var string
   */
  protected $signature = 'make:cruds {--rollback}';

  /**
   * Deskripsi dari perintah konsol.
   *
   * @var string
   */
  protected $description = 'Generate or rollback multiple CRUD files based on the list in CrudGenerator.php';

  /**
   * Jalankan perintah konsol.
   *
   * @return int
   */
  public function handle()
  {
    $process = new Process(['git', 'status', '--porcelain']);
    $process->run();
    echo $process->getOutput();

    if ($process->isSuccessful() && !empty(trim($process->getOutput()))) {
      $this->error("Eksekusi tidak dapat dilakukan: Ada file yang belum di-commit. Mohon commit atau stash perubahan Anda terlebih dahulu.");
      return 0;
    }

    $migrations = config('crudgenerator.data');
    $isRollback = $this->option('rollback');

    if (empty($migrations)) {
      $this->error("Tidak ada migrasi yang ditemukan di CrudGenerator.php.");
      return 1;
    }

    $action = $isRollback ? 'rollback' : 'generation';
    $this->info("Memulai multi-CRUD {$action}...");

    foreach ($migrations as $data) {
      $this->info("Memproses: {$data['migration']}");

      $options = [
        'migration_file' => $data['migration'],
      ];

      if (!$isRollback) {
        // Atur opsi untuk pembuatan
        $options['--label'] = $data['label'] ?? null;
        $options['--icon'] = $data['icon'] ?? null;
        $options['--prefix_url'] = $data['prefix_url'] ?? null;
        $options['--custom_validation'] = isset($data['validation']) ? json_encode($data['validation']) : null;
        $options['--custom_labels'] = isset($data['labels']) ? json_encode($data['labels']) : null;
      } else {
        // Atur opsi untuk rollback
        $options['--prefix_url'] = $data['prefix_url'] ?? null;
        $options['--rollback'] = true;
      }

      $options['--format'] = true;
      $options['--namespace'] = $data['namespace'] ?? null;
      $options = array_filter($options, fn($value) => !is_null($value));

      $this->call('make:crud', $options);
      $this->line('');
    }

    $this->info("Multi-CRUD {$action} selesai!");

    return 0;
  }
}
