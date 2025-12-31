<?php

namespace App\Http\Controllers\Admin;

use App\Http\Services\Payment\Duitku\DisbursementService;
use App\Enums\UserType;
use Illuminate\Http\Request;
use App\Models\SupportedBank;
use App\Enums\OriginStatusType;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class SupportedBankController extends BaseResourceController
{
  protected $model = SupportedBank::class;

  protected function getPage(Request $request, $id = null): array
  {
    return [
      "name" => "supported-bank",
      "inertia" => "Admin/SupportedBank",
      "label" => "Daftar Bank",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];
  }

  protected function indexQuery($query, Request $request)
  {
    return $query->orderBy('bank_name', 'ASC');
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    return [
      ...parent::indexData($request, $isFormData),
      'status' => OriginStatusType::getValues(),
    ];
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'bank_code' => 'required|string|max:10|unique:' . SupportedBank::class . ',bank_code,' . $id,
        'bank_name' => 'required',
        'limit_transfer_amount' => 'nullable',
        'bi_fast' => 'nullable',
        'status' => 'nullable',
      ],
      'default' => [
        'status' => OriginStatusType::Active,
        'bi_fast' => 0
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [
      ...parent::getFormData($request, $model),
      'status' => OriginStatusType::getValues(),
    ];
  }

  protected function actionUpdate($id, Request $request) {
    if ($id == 'sync-duitku') return $this->syncDuitku($request);
    return false;
  }

  public function syncDuitku(Request $request)
  {
    DB::beginTransaction();
    try {
      $supportedBank = SupportedBank::get()->toArray();
      $listBanks = (new DisbursementService())->getListBank();

      $data = collect($supportedBank)->map(function ($bank) use ($listBanks) {
        $data = [
          'bi_fast' => $bank['bi_fast'] ? 1 : 0,
          'updated_at' => now(),
        ];

        if ($listBanks->responseCode == 00) {
          $bankApi = collect($listBanks->Banks)->firstWhere('bankCode', $bank['bank_code']);
          if (!$bankApi)
            return [
              'bank_code' => $bank['bank_code'],
              'bank_name' => $bank['bank_name'],
              'limit_transfer_amount' => $bank['limit_transfer_amount'],
              'status' => OriginStatusType::Nonactive,
              ...$data
            ];
        }

        return [
          'bank_code' => $bankApi->bankCode,
          'bank_name' => $bankApi->bankName,
          'status' => OriginStatusType::Active,
          'limit_transfer_amount' => $bankApi->maxAmountTransfer ?? null,
          ...$data
        ];
      })->toArray();

      DB::table('supported_banks')->upsert($data, 'bank_code');

      DB::commit();
      return redirect('/admin/supported-bank')->with('success', 'Sinkronisasi data bank berhasil');
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Sinkronisasi data bank gagal');
    }
  }
}
