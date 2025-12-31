<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Utils\Helper;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use App\Enums\ConfigurationType;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ConfigurationController extends Controller
{
  private $options, $hardReload, $multipleInput;

  public function __construct()
  {
    $this->options = array_values(ConfigurationType::asArray());
    $this->hardReload = false;
    $this->multipleInput = ['LINK_AFFILIATE', 'SUPPORTED_BANK'];
  }
  public function index(Request $request)
  {
    $inputType = [
      'FEE_PLATFORM' => 'currency',
      'FEE_TRANSFER_BANK' => 'currency',
      'WHATSAPP_NUMBER' => 'tel',
      'EMAIL' => 'email',
      'PAYMENT_GATEWAY_MODE' => 'toggle',
      'LOGIN_REQUIRED' => 'toggle',
      'UNDER_CONSTRUCTION' => 'toggle',
    ];

    $selectOptions = [];
    $hiddenOptions = [];

    $disabledInputs = [
      'DUITKU_DISBURSEMENT'
    ];

    $configurations = Configuration::get()->groupBy('type');

    $configurations = collect($this->options)->map(function ($option) use ($configurations, $disabledInputs) {
      if (in_array($option, $disabledInputs))
        return null;
      if (isset($configurations[$option])) {
        $configData = collect($configurations[$option])->toArray();

        if (!in_array($option, $this->multipleInput)) {
          return [$option => $configData];
        }

        $configData[0] = [
          'type' => $option,
          'status' => OriginStatusType::Active,
          'value' => json_encode($configurations[$option]),
          'description' => null
        ];

        return [$option => [$configData[0]]];
      }

      $configData[$option][0] = [
        'type' => $option,
        'status' => OriginStatusType::Nonactive,
        'value' => null,
        'description' => null
      ];

      return $configData;
    })->filter()->values();

    $options = collect($this->options)->filter(function ($option) use ($disabledInputs) {
      return !in_array($option, $disabledInputs);
    })->values();

    $data = [
      'title' => 'Konfigurasi',
      'configurations' => $configurations,
      'status' => array_values(OriginStatusType::asArray()),
      'options' => $options,
      'inputType' => $inputType,
      'selectOptions' => $selectOptions,
      'hiddenOptions' => $hiddenOptions,
      'multipleInput' => $this->multipleInput,
    ];
    return Inertia::render('Admin/Configuration/Index', $data);
  }

  public function store(Request $request)
  {
    DB::beginTransaction();
    try {
      $requestData = $request->all();
      foreach ($requestData as $data) {
        $data = collect($data)->map(function ($value) {
          collect($value)->map(function ($config) {
            $selecteds = collect(array_keys($config))
              ->filter(fn($selected) => (str($selected)->startsWith('form')))
              ->values();

            $configData = [
              'type' => $config['type'],
              'status' => $config['is_active'] == true ? OriginStatusType::Active : OriginStatusType::Nonactive,
              'value' => $config['value'],
              'description' => $config['description']
            ];

            $this->saveData($config, $configData);

            if ($selecteds->isNotEmpty()) {
              foreach ($selecteds as $selected) {
                [$prefix, $type, $column] = explode('.', $selected);
                $selectedConfig = $config;
                $selectedId = "$type.id";
                if (!empty($selectedConfig[$selectedId])) {
                  $selectedConfig['id'] = $selectedConfig[$selectedId];
                }

                $value = $config[$selected];
                $selectedData = $configData;
                $selectedData['type'] = $type;
                $selectedData[$column] = $value;

                $this->saveData($selectedConfig, $selectedData);
              }
            }
          });
        });
      }

      DB::commit();
      if ($this->hardReload) {
        return Inertia::location('/admin/configuration');
      }
      return redirect()->back()->with('success', "Konfigurasi berhasil disimpan");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', $th->getMessage() ?? 'Kesalahan Server. Konfigurasi gagal disimpan');
    }
  }

  public function destroy($id)
  {
    try {
      $configuration = Configuration::where('id', $id)->first();
      $delete = $configuration->delete();
      return redirect('/admin/configuration')->with('success', 'Hapus Konfigurasi Berhasil');
    } catch (\Throwable $th) {
      return redirect('/admin/configuration')->with('error', 'Kesalahan Server. Hapus konfigurasi gagal');
    }
  }

  public function saveData($config, $configData)
  {
    if (in_array($config['type'], $this->multipleInput))
      return $this->saveMultipleData($config, $configData);

    if (isset($config['id'])) {
      $configuration = Configuration::where('id', $config['id'])->first();
      $configuration->update($configData);
    } else {
      $this->hardReload = true;
      $configuration = Configuration::create($configData);
    }

    Helper::saveCache("config.$configuration->type", $configuration);
  }

  public function saveMultipleData($config, $configData)
  {
    $allConfigs = json_decode($configData['value'], true) ?? [];
    $latestData = collect($allConfigs)->pluck("id")->whereNotNull()->toArray();
    $deleteds = Configuration::where('type', $config['type'])->whereNotIn("id", $latestData)->get();

    if ($deleteds->isNotEmpty()) {
      foreach ($deleteds as $deleted) {
        $deleted->delete();
      }
    }
    
    if (empty($allConfigs))
      return;

    foreach ($allConfigs as $data) {
      $configuration = null;
      if (isset($data['id'])) {
        $configuration = Configuration::where('id', $data['id'])->first();
      }

      if ($configuration) {
        $configuration->update([
          'type' => $config['type'],
          'status' => in_array($data['status'], [1, 'active']) ? OriginStatusType::Active : OriginStatusType::Nonactive,
          'value' => isset($data['value']) ? $data['value'] : null,
          'description' => isset($data['description']) ? $data['description'] : null,
        ]);
      } else {
        $configuration = Configuration::create([
          'type' => $config['type'],
          'status' => in_array($data['status'], [1, 'active']) ? OriginStatusType::Active : OriginStatusType::Nonactive,
          'value' => isset($data['value']) ? $data['value'] : null,
          'description' => isset($data['description']) ? $data['description'] : null,
        ]);
        $this->hardReload = true;
      }
    }

  }
}