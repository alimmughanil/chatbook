<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use App\Enums\ConfigNotificationType;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ConfigNotificationController extends Controller
{
  protected $options, $hardReload, $multipleInput;
  public function __construct()
  {
    $this->options = array_values(ConfigNotificationType::asArray());
    $this->hardReload = false;
    $this->multipleInput = ['DISBURSEMENT_REQUEST', 'PRODUCT_REQUEST'];
  }
  public function index(Request $request)
  {
    $inputType = [];

    $configurations = Configuration::whereIn('type', $this->options)->get()->groupBy('type');
    $configurations = collect($this->options)->map(function ($option) use ($configurations) {
      if (isset($configurations[$option])) return [$option => $configurations[$option]];
      $configData[$option][0] = [
        'type' => $option,
        'status' => OriginStatusType::Nonactive,
        'value' => null,
        'description' => null
      ];
      return $configData;
    });

    $data = [
      'title' => 'Pengaturan Notifikasi',
      'configurations' => $configurations,
      'status' => array_values(OriginStatusType::asArray()),
      'options' => $this->options,
      'inputType' => $inputType,
      'multipleInput' => $this->multipleInput,
    ];
    return Inertia::render('Admin/Configuration/Notification/Index', $data);
  }
}
