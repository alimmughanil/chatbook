<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class MakeCrudCommand extends Command
{
  /**
   * Nama dan signature dari perintah konsol.
   *
   * @var string
   */
  protected $signature = 'make:crud {migration_file} {--label=} {--rollback} {--prefix_url=} {--format} {--icon=} {--custom_validation=} {--custom_labels=} {--namespace=}';

  /**
   * Deskripsi dari perintah konsol.
   *
   * @var string
   */
  protected $description = 'Generate a controller and React views, and append resource routes. Use --rollback to reverse.';

  /**
   * Lokasi template (stubs).
   *
   * @var string
   */
  protected $stubsPath = __DIR__ . '/../../../stubs/';

  /**
   * Kamus validasi untuk memetakan nama kolom ke aturan.
   *
   * @var array
   */
  protected $validationDictionary;

  /**
   * Kamus ikon untuk memetakan nama tabel ke kelas ikon.
   *
   * @var array
   */
  protected $iconDictionary;

  /**
   * Jalankan perintah konsol.
   *
   * @return int
   */
  public function handle()
  {
    $this->validationDictionary = require $this->stubsPath . 'Databases/validation.php';
    $this->iconDictionary = require $this->stubsPath . 'Databases/icon.php';

    $migrationFile = $this->argument('migration_file');
    $migrationPath = database_path('migrations/' . $migrationFile . '.php');

    if (!File::exists($migrationPath)) {
      $this->error("Migration file not found at: {$migrationPath}");
      return 1;
    }

    $content = File::get($migrationPath);

    if (!preg_match("/Schema::create\('(?<table>\w+)'/", $content, $matches)) {
      $this->error("Could not find table name in migration file.");
      return 1;
    }
    $tableName = $matches['table'];

    preg_match_all("/->(?<type>\w+)\('(?<column>\w+)'\)(?<options>.*?);/", $content, $columnMatches, PREG_SET_ORDER);

    $modelName = Str::studly(Str::singular($tableName));
    $modelNameCamel = Str::camel($modelName);
    $modelNamePlural = Str::plural($modelName);
    $modelNameCamelPlural = Str::camel($modelNamePlural);
    $subNamespace = $this->option('namespace') ?? "Admin";
    $adminPath = $this->option('namespace') ?? "Admin";
    $subNamespace = str_replace("/", "\\", $subNamespace);

    $pageLabel = $this->option('label') ?? Str::headline($modelName);

    $prefixUrl = $this->option('prefix_url');
    $basePageUrl = Str::kebab($tableName);
    if ($prefixUrl) {
      $pageUrl = Str::of($prefixUrl)->trim('/') . '/' . $basePageUrl;
    } else {
      $pageUrl = "admin/" . $basePageUrl;
    }

    $placeholders = [
      '{{ SubNamespace }}' => $subNamespace,
      '{{ AdminPath }}' => $adminPath,
      '{{ ModelName }}' => $modelName,
      '{{ modelNameCamel }}' => $modelNameCamel,
      '{{ modelNamePlural }}' => $modelNamePlural,
      '{{ modelNameCamelPlural }}' => $modelNameCamelPlural,
      '{{ tableName }}' => $tableName,
      '{{ pageLabel }}' => $pageLabel,
      '{{ pageUrl }}' => $pageUrl,
    ];

    $customLabels = $this->option('custom_labels') ? json_decode($this->option('custom_labels'), true) : [];
    $customValidation = $this->option('custom_validation') ? json_decode($this->option('custom_validation'), true) : [];

    if ($this->option('rollback')) {
      $this->info("Starting rollback for '{$tableName}'...");
      $this->rollbackController($placeholders);
      $this->rollbackReactViews($placeholders);
      $this->rollbackRoute($placeholders);

      $this->info("Rollback complete.");
      return 0;
    }

    $tableHeaderEntries = [];
    $validationRules = '';
    $formFieldsData = '';
    $formProperties = [];
    $useEffectHooks = '';

    $tableHeaderEntries[] = [
      'label' => '#',
      'value' => 'id',
      'type' => 'numbering',
    ];

    foreach ($columnMatches as $match) {
      $column = $match['column'];
      $type = $match['type'];
      $options = $match['options'];

      if (in_array($column, ['id', 'created_at', 'updated_at', 'user_id', 'deleted_at'])) {
        continue;
      }

      $label = $customLabels[$column] ?? Str::headline($column);

      $formType = 'input';
      $formProps = [];
      $isTextEditor = false;

      if (Str::endsWith($column, '_id')) {
        $formType = 'select';
        $formProps['options'] = "props." . Str::plural(Str::beforeLast($column, '_id'));
      } elseif ($column === 'status') {
        $formType = 'select';
        $formProps['options'] = "props.status";
      } elseif (Str::contains($column, ['description', 'content', 'body', 'seo_keyword', 'seo_description'])) {
        $formType = 'textarea';
        $isTextEditor = true;
      } elseif (Str::endsWith($column, '_at')) {
        $formType = 'DatePicker';
      } elseif (Str::contains($column, ['image', 'avatar', 'thumbnail', 'file', 'cover', 'picture', 'photo', 'video'])) {
        $formType = 'FileUploader';
      }

      if ($isTextEditor) {
        $formProps['isTextEditor'] = true;
        $formProps['setData'] = 'js::setData';
      }

      $header = [
        'label' => $label,
        'value' => $column,
      ];

      $searchableColumns = ['name', 'title', 'email', 'phone', 'slug', 'description', 'content', 'body', 'seo_keyword', 'seo_description', 'type', 'order_number'];
      if (Str::contains($column, $searchableColumns)) {
        $header['isSearchable'] = true;
      }

      if (in_array($column, ['thumbnail', 'description', 'seo_keyword', 'seo_description', 'content'])) {
        $header['isDetail'] = true;
      }

      if (Str::endsWith($column, '_at')) {
        $header['type'] = 'date';
      } elseif ($column === 'status') {
        $header['type'] = 'status';
      }

      $tableHeaderEntries[] = $header;

      if ($column === 'slug') {
        $useEffectHooks .= "
    useEffect(() => {
        let filteredSlug = '';
        if (data.name && !isEdit) {
            const slug = slugify(data.name);
            filteredSlug = slug;
        }
        if (!isEdit) {
            setData('slug', filteredSlug);
        }
    }, [data.name]);
";
      }

      if ($column === 'seo_description') {
        $useEffectHooks .= "
    useEffect(() => {
        const desc = data?.seo_description;
        if (desc && desc.length > 160) {
            const truncated = desc.substring(0, 160);
            if (desc !== truncated) {
                setData('seo_description', truncated);
            }
        }
    }, [data?.seo_description]);
";
      }

      $properties = [
        'form' => $formType,
        'props' => array_merge([
          'name' => $column,
          'label' => $label,
        ], $formProps)
      ];

      $formProperties[] = $properties;

      $rule = $customValidation[$column] ?? $this->getValidationRule($column, $options, $tableName);
      $validationRules .= "            \"{$column}\" => \"{$rule}\"," . "\n";
      $formFieldsData .= "        {$column}: ''," . "\n";
    }

    $tableHeaderEntries[] = ['label' => 'Status', 'value' => 'status', 'type' => 'status'];
    $tableHeaderEntries[] = ['label' => 'Dibuat', 'value' => 'created_at', 'type' => 'date', 'isSearchable' => true, 'className' => 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',];
    $tableHeaderEntries[] = ['label' => 'Diperbarui', 'value' => 'updated_at', 'type' => 'date', 'isSearchable' => true, 'className' => 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre'];
    $tableHeaderEntries[] = [
      'label' => 'Dihapus',
      'value' => 'deleted_at',
      'type' => 'date',
      'className' => 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
      'isHidden' => "params.get('deleted_at') != 'show'",
    ];
    $tableHeaderEntries[] = ['label' => 'Aksi', 'value' => 'id', 'type' => 'action'];

    $jsTableHeaders = '';
    foreach ($tableHeaderEntries as $entry) {
      $jsTableHeaders .= '      ' . $this->convertArrayToJsObjectString($entry, 6) . ",\n";
    }

    $validationRules = rtrim($validationRules, ",\n");
    $placeholders['{{ tableHeaderReactArray }}'] = rtrim($jsTableHeaders, ",\n");
    $placeholders['{{ validationRules }}'] = $validationRules;
    $placeholders['{{ formFieldsData }}'] = rtrim($formFieldsData, ",\n");
    $placeholders['{{ useEffectHooks }}'] = $useEffectHooks;
    $placeholders['{{ formProperties }}'] = $this->convertFormPropertiesArrayToJsString($formProperties);

    $this->createController($placeholders);
    $this->createReactView('Index', $placeholders);
    $this->createReactView('Create', $placeholders);
    $this->createReactView('Edit', $placeholders);
    $this->createReactView('MainForm', $placeholders);
    $this->createReactView('Show', $placeholders);

    $this->appendRouteToWebPhp($placeholders);
    $this->appendSidebarMenuEntry($placeholders);

    if ($this->option('format')) {
      $this->runFormatter($modelName, $placeholders);
    }

    $this->info('CRUD files generated successfully, and routes appended laravel routes and AuthenticatedLayout.jsx!');

    return 0;
  }

  protected function createController(array $placeholders)
  {
    $stub = File::get($this->stubsPath . 'Controller/DefaultController.stub');
    $content = str_replace(array_keys($placeholders), array_values($placeholders), $stub);
    $controllerDir = app_path('Http/Controllers/' . $placeholders['{{ AdminPath }}']);
    if (!File::exists($controllerDir)) {
      File::makeDirectory($controllerDir, 0755, true);
    }
    $controllerPath = $controllerDir . '/' . $placeholders['{{ ModelName }}'] . 'Controller.php';
    File::put($controllerPath, $content);
    $this->info("Controller created: {$controllerPath}");
  }

  protected function createReactView(string $viewType, array $placeholders)
  {
    $stub = File::get($this->stubsPath . "View/$viewType.React.stub");
    $content = str_replace(array_keys($placeholders), array_values($placeholders), $stub);
    $content = str_replace("'js::setData'", "setData", $content);

    $viewDir = resource_path('js/Pages/' . $placeholders['{{ AdminPath }}'] . '/' . $placeholders['{{ ModelName }}']);

    if ($viewType == 'MainForm') {
      $viewDir = resource_path('js/Pages/' . $placeholders['{{ AdminPath }}'] . '/' . $placeholders['{{ ModelName }}'] . '/Form');
    }

    if (!File::exists($viewDir)) {
      File::makeDirectory($viewDir, 0755, true);
    }

    $viewPath = $viewDir . '/' . $viewType . '.jsx';
    File::put($viewPath, $content);
    $this->info("React view created: {$viewPath}");
  }

  protected function appendRouteToWebPhp(array $placeholders)
  {
    $backofficeRoutePath = base_path('routes/backoffice.php');
    $webRoutePath = base_path('routes/web.php');

    $targetRoutePath = File::exists($backofficeRoutePath) ? $backofficeRoutePath : $webRoutePath;
    $targetRouteFileName = Str::afterLast($targetRoutePath, '/');

    $controllerClass = $placeholders['{{ SubNamespace }}']
      . "\\"
      . $placeholders['{{ ModelName }}']
      . "Controller";

    $newRoute = "    Route::resource('"
      . substr($placeholders['{{ pageUrl }}'], 5)
      . "', {$controllerClass}::class)->only('php::resourceMethod');";
    $newRoute = str_replace("'php::resourceMethod'", '[...$resourceMethod]', $newRoute);

    if (!File::exists($targetRoutePath)) {
      $this->warn("Route file not found, skipping route append.");
      return;
    }

    $routeFileContent = File::get($targetRoutePath);

    // Cegah duplikasi
    if (Str::contains($routeFileContent, $newRoute)) {
      $this->warn("Route for '" . $placeholders['{{ pageUrl }}'] . "' already exists in routes/{$targetRouteFileName}. Skipping.");
      return;
    }

    $updatedFileContent = $routeFileContent;

    // 1️⃣ Cek blok admin group
    $pattern = '/Route::middleware\(\s*\[\s*\'auth\'\s*,\s*\'role:admin\'\s*\]\s*\)\s*->prefix\(\s*\'admin\'\s*\)\s*->name\(\s*\'admin\.\'\s*\)\s*->group\(\s*function\s*\(\)\s*(?:\s*use\s*\([^)]*\)\s*)?\{([\s\S]*?)\}\s*\);/m';
    if (preg_match($pattern, $routeFileContent, $matches)) {
      $adminGroupContent = $matches[0];
      $newAdminGroupContent = substr($adminGroupContent, 0, -3) // buang "});"
        . $newRoute . "\n});";
      $updatedFileContent = str_replace($adminGroupContent, $newAdminGroupContent, $routeFileContent);

      // 2️⃣ Kalau tidak ada admin group, cek middleware auth group
    } elseif (preg_match('/Route::middleware\(\'auth\'\)->group\(function\s*\(\)\s*\{[\s\S]*?\};/m', $routeFileContent, $matches)) {
      $authGroupContent = $matches[0];
      $newAuthGroupContent = substr($authGroupContent, 0, -3)
        . "\n    " . $newRoute . "\n});";
      $updatedFileContent = str_replace($authGroupContent, $newAuthGroupContent, $routeFileContent);

      // 3️⃣ Kalau tidak ada group sama sekali, append di akhir file
    } else {
      $updatedFileContent = rtrim($routeFileContent) . "\n\n" . $newRoute . "\n";
    }

    File::put($targetRoutePath, $updatedFileContent);
    $this->info("Route '{$newRoute}' appended to routes/{$targetRouteFileName}");
  }


  protected function appendSidebarMenuEntry(array $placeholders)
  {
    $jsonDir = resource_path('json');
    $jsonPath = $jsonDir . '/sidebarMenu.json';

    // Pastikan direktori ada
    if (!File::exists($jsonDir)) {
      File::makeDirectory($jsonDir, 0755, true);
      $this->info("Created directory: {$jsonDir}");
    }

    // Jika file belum ada, inisialisasi sebagai array kosong
    if (!File::exists($jsonPath)) {
      File::put($jsonPath, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
      $this->info("Created new sidebarMenu.json file.");
    }

    // Baca isi JSON
    $menu = json_decode(File::get($jsonPath), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      $this->error("Failed to parse sidebarMenu.json: " . json_last_error_msg());
      return;
    }

    // Ambil variabel dari placeholder
    $pageUrl = $placeholders['{{ pageUrl }}'];
    $pageLabel = $placeholders['{{ pageLabel }}'];
    $iconClass = $this->option('icon')
      ?? ($this->iconDictionary[$placeholders['{{ tableName }}']] ?? 'fas fa-cube fa-fw');

    $prefix = $this->option('prefix_url')
      ? Str::of($this->option('prefix_url'))->after('admin/')->before('/')
      : null;

    $isDropdown = !empty($prefix);

    // ==== Cegah duplikasi ====
    foreach ($menu as $item) {
      if (isset($item['link']) && $item['link'] === "/{$pageUrl}") {
        $this->warn("Sidebar menu entry for '{$pageLabel}' already exists. Skipping.");
        return;
      }
      if (isset($item['dropdown'])) {
        foreach ($item['dropdown'] as $child) {
          if (isset($child['link']) && $child['link'] === "/{$pageUrl}") {
            $this->warn("Sidebar dropdown entry for '{$pageLabel}' already exists. Skipping.");
            return;
          }
        }
      }
    }

    // ==== Tambah entry ====
    if ($isDropdown) {
      $parentTitle = Str::of($prefix)->headline();
      $parentIcon = $this->iconDictionary[Str::plural($prefix)] ?? 'fas fa-cube fa-fw';
      $childMenuItem = [
        'title' => $pageLabel,
        'link' => "/{$pageUrl}"
      ];

      $foundParent = false;
      foreach ($menu as &$item) {
        if ($item['title'] === $parentTitle && isset($item['dropdown'])) {
          $item['dropdown'][] = $childMenuItem;
          $foundParent = true;
          break;
        }
      }

      if (!$foundParent) {
        $menu[] = [
          'title' => $parentTitle,
          'fa_icon' => $parentIcon,
          'icon_provider' => 'fontawesome',
          'dropdown' => [$childMenuItem],
        ];
      }
    } else {
      $menu[] = [
        'title' => $pageLabel,
        'fa_icon' => $iconClass,
        'icon_provider' => 'fontawesome',
        'link' => "/{$pageUrl}",
      ];
    }

    // ==== Simpan kembali ke JSON ====
    File::put($jsonPath, json_encode($menu, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    $this->info("Sidebar menu entry for '{$pageLabel}' added to sidebarMenu.json");
  }



  protected function runFormatter(string $modelName, array $placeholders)
  {
    $filesToFormat = [
      app_path("Http/Controllers/{$placeholders['{{ AdminPath }}']}/{$modelName}Controller.php"),
      resource_path("js/Pages/{$placeholders['{{ AdminPath }}']}/$modelName/Index.jsx"),
      resource_path("js/Pages/{$placeholders['{{ AdminPath }}']}/$modelName/Create.jsx"),
      resource_path("js/Pages/{$placeholders['{{ AdminPath }}']}/$modelName/Edit.jsx"),
      resource_path("js/Pages/{$placeholders['{{ AdminPath }}']}/$modelName/Show.jsx"),
      resource_path("js/Pages/{$placeholders['{{ AdminPath }}']}/$modelName/Form/MainForm.jsx"),
      // resource_path("js/Layouts/AuthenticatedLayout.jsx"),
    ];

    $this->info("Menjalankan Prettier untuk merapikan file...");

    $command = ['npx', 'prettier', '--write', ...$filesToFormat];

    $process = new Process($command);
    $process->run();

    if (!$process->isSuccessful()) {
      $this->error("Gagal menjalankan Prettier. Pastikan Prettier terinstal dan file-file yang dihasilkan sudah ada.");
      $this->error($process->getErrorOutput());
    } else {
      $this->info("File-file berhasil dirapikan.");
    }
  }

  protected function rollbackController(array $placeholders)
  {
    $controllerDir = app_path('Http/Controllers/' . $placeholders['{{ AdminPath }}']);
    $controllerPath = $controllerDir . '/' . $placeholders['{{ ModelName }}'] . 'Controller.php';

    if (File::exists($controllerPath)) {
      File::delete($controllerPath);
      $this->info("Controller deleted: {$controllerPath}");

      if (File::isDirectory($controllerDir) && count(File::files($controllerDir)) === 0) {
        File::deleteDirectory($controllerDir);
        $this->info("Controller directory deleted: {$controllerDir}");
      }
    } else {
      $this->warn("Controller not found, skipping rollback: {$controllerPath}");
    }
  }

  protected function rollbackReactViews(array $placeholders)
  {
    $adminPath = $placeholders['{{ AdminPath }}'];
    $modelName = $placeholders['{{ ModelName }}'];

    $baseViewDir = resource_path("js/Pages/{$adminPath}/{$modelName}");
    $formViewDir = resource_path("js/Pages/{$adminPath}/{$modelName}/Form");

    $filesToDelete = [
      "{$baseViewDir}/Index.jsx",
      "{$baseViewDir}/Create.jsx",
      "{$baseViewDir}/Edit.jsx",
      "{$baseViewDir}/Show.jsx",
      "{$formViewDir}/MainForm.jsx",
    ];

    foreach ($filesToDelete as $file) {
      if (File::exists($file)) {
        File::delete($file);
        $this->info("React view deleted: {$file}");
      } else {
        $this->warn("React view not found, skipping rollback: {$file}");
      }
    }

    if (File::isDirectory($formViewDir) && count(File::allFiles($formViewDir)) === 0) {
      File::deleteDirectory($formViewDir);
      $this->info("React view directory deleted: {$formViewDir}");
    }

    if (File::isDirectory($baseViewDir) && count(File::allFiles($baseViewDir)) === 0) {
      File::deleteDirectory($baseViewDir);
      $this->info("React view directory deleted: {$baseViewDir}");
    }
  }

  protected function rollbackRoute(array $placeholders)
  {
    $backofficeRoutePath = base_path('routes/backoffice.php');
    $webRoutePath = base_path('routes/web.php');

    $targetRoutePath = File::exists($backofficeRoutePath) ? $backofficeRoutePath : $webRoutePath;
    $targetRouteFileName = Str::afterLast($targetRoutePath, '/');

    $controllerClass = $placeholders['{{ SubNamespace }}']
      . "\\"
      . $placeholders['{{ ModelName }}']
      . "Controller";

    $newRoute = "    Route::resource('"
      . substr($placeholders['{{ pageUrl }}'], 5)
      . "', {$controllerClass}::class)->only('php::resourceMethod');";
    $newRoute = str_replace("'php::resourceMethod'", '[...$resourceMethod]', $newRoute);

    if (File::exists($targetRoutePath)) {
      $routeFileContent = File::get($targetRoutePath);
      $updatedFileContent = preg_replace('/\s*' . preg_quote($newRoute, '/') . '/', "", $routeFileContent);
      File::put($targetRoutePath, $updatedFileContent);
      $this->info("Route for '" . $placeholders['{{ pageUrl }}'] . "' rolled back from routes/{$targetRouteFileName}");
    } else {
      $this->warn("Route file not found, skipping route rollback.");
    }
  }

  /**
   * Menghapus entri menu sidebar dari AuthenticatedLayout.jsx.
   *
   * @param array $placeholders
   * @return void
   */

  protected function getValidationRule(string $column, string $options, string $tableName): string
  {
    $baseRule = Str::contains($options, '->nullable()') ? 'nullable' : 'required';
    $typeRule = $this->validationDictionary[$column] ?? $this->validationDictionary['_default'];
    $typeRule = str_replace('{{ tableName }}', $tableName, $typeRule);

    return "{$baseRule}|{$typeRule}";
  }

  protected function convertArrayToJsObjectString(array $array, int $indent = 0): string
  {
    $space = str_repeat(' ', $indent);
    $jsString = "{\n";
    $entries = [];
    foreach ($array as $key => $value) {
      $entry = $space . "  '{$key}': ";
      if (is_array($value)) {
        $entry .= $this->convertArrayToJsObjectString($value, $indent + 2);
      } elseif (is_string($value)) {
        if ($value === 'true' || $value === 'false' || is_numeric($value) || Str::startsWith($value, 'props.') || Str::startsWith($value, 'params.get')) {
          $entry .= $value;
        } else {
          $entry .= "'{$value}'";
        }
      } elseif (is_bool($value)) {
        $entry .= $value ? 'true' : 'false';
      } elseif (is_numeric($value)) {
        $entry .= $value;
      } else {
        $entry .= "'{$value}'";
      }
      $entries[] = $entry;
    }
    $jsString .= implode(",\n", $entries);
    $jsString .= "\n" . $space . "}";
    return $jsString;
  }

  protected function convertFormPropertiesArrayToJsString(array $properties, int $chunkSize = 2): string
  {
    $chunks = array_chunk($properties, $chunkSize);

    $outerJsString = "[\n";
    $chunkStrings = [];

    foreach ($chunks as $chunk) {
      $innerJsString = "  [\n";
      $itemStrings = [];

      foreach ($chunk as $item) {
        if (is_array($item)) {
          $itemStrings[] = $this->convertArrayToJsObjectString($item, 4);
        }
      }

      $innerJsString .= implode(",\n", $itemStrings) . "\n";
      $innerJsString .= "  ]";
      $chunkStrings[] = $innerJsString;
    }

    $outerJsString .= implode(",\n", $chunkStrings) . "\n";
    $outerJsString .= "]";

    return $outerJsString;
  }
}
