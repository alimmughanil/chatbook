<?php

namespace App\Http\Controllers\Admin;

use Error;
use App\Models\Bank;
use App\Models\User;
use App\Models\Wallet;
use App\Enums\BankStatusType;
use App\Enums\UserType;
use App\Models\Withdraw;
use App\Enums\WithdrawStatusType;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use Illuminate\Validation\Rule;
use App\Enums\ConfigurationType;
use Illuminate\Support\Facades\DB;
use App\Enums\DisbursementMethodType;
use Illuminate\Support\Facades\Storage;
use App\Http\Services\Payment\Duitku\DisbursementService;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class WithdrawController extends BaseResourceController
{
  protected $model = Withdraw::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "withdraw",
      "inertia" => "Admin/Withdraw",
      "label" => "Penarikan Dana",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    if ($this->routeType != 'show') {
      $pageUrl = explode("/{$page['name']}", $page['url']);
      $page['url'] = "{$pageUrl[0]}/{$page['name']}";
    }

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    $query->with('bank', 'user')
      ->when(auth()->user()->role == UserType::Partner, function ($query) {
        $query->where('user_id', auth()->id());
      });

    return $query;
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $whatsappConfig = Configuration::where('type', ConfigurationType::WHATSAPP_NUMBER)->where('status', OriginStatusType::Active)->first();
    return [
      ...parent::indexData($request, $isFormData),
      'phoneNumber' => $whatsappConfig?->value,
      'status' => WithdrawStatusType::getValues(),
    ];
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'bank_id' => 'required|exists:banks,id',
        'method' => 'required',
        'fee' => 'nullable',
        'gross_amount' => 'required|numeric|min:10000',
        'net_amount' => 'required|numeric|min:10000',
        'status' => 'nullable',
        'user_id' => [
          Rule::requiredIf(function () {
            return auth()->user()->role == UserType::Admin;
          })
        ],
        'attachment' => ['nullable', 'file', 'mimes:png,jpg,jpeg'],
      ],
      "default" => [
        "status" => WithdrawStatusType::Pending,
        "method" => DisbursementMethodType::MANUAL,
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $duitkuDisbursementConfig = null;
    $method = DisbursementMethodType::getValues();
    if (!$duitkuDisbursementConfig || auth()->user()->role == UserType::Admin) {
      $method = [
        DisbursementMethodType::MANUAL
      ];
    }

    $userId = $request->user_id;
    if (auth()->user()->role != UserType::Admin) {
      $userId = auth()->id();
    }

    $balance = null;
    $bank = null;
    $banks = [];
    $company = [];
    if ($userId) {
      $user = User::where('id', $userId)->first();
      $balance = Wallet::getUserBalance($user);
      $banks = Bank::where('user_id', $userId)->where('status', BankStatusType::Verified)->get();
      $bank = Bank::where('user_id', $userId)->where('status', BankStatusType::Verified)->where('is_primary', 1)->first();
    }

    if (count($banks) > 0) {
      $banks = $banks->map(fn($bank) => ([
        'bank_name' => $bank->bank_name,
        'value' => $bank->id,
        'label' => "$bank->bank_name ($bank->bank_account a.n. $bank->bank_alias)",
      ]))->toArray();
    }

    if (auth()->user()->role == UserType::Admin) {
      $company = User::whereIn('role', [UserType::Partner])->get();

      $company = $company->map(function ($seller) {
        $label = $seller->name;
        if ($seller->phone) {
          $label .= " - $seller->phone - ";
        }
        if ($seller->email) {
          $label .= " - $seller->email - ";
        }

        return ['value' => $seller->id, 'label' => $label];
      })->toArray();
    }

    $bankConfig = null;
    $supportedBanks = [];
    if ($bankConfig) {
      $bankConfig = json_decode($bankConfig->value, true);
      foreach ($bankConfig as $supportedBank) {
        if ($supportedBank['status'] == 1) {
          $supportedBanks[] = $supportedBank['value'];
        }
      }
    }

    $feeTransferConfig = Configuration::where('type', ConfigurationType::FEE_TRANSFER_BANK)->where('status', OriginStatusType::Active)->first();
    $feeTransfer = $feeTransferConfig?->value ?: 0;

    $feePlatformConfig = Configuration::where('type', ConfigurationType::FEE_PLATFORM)->where('status', OriginStatusType::Active)->first();
    $feePlatform = $feePlatformConfig?->value ?: 0;

    return [
      ...parent::getFormData($request, $model),
      'balance' => $balance,
      'banks' => $banks,
      'company' => $company,
      'bank' => $bank,
      'supportedBanks' => $supportedBanks,
      'feeTransfer' => $feeTransfer,
      'feePlatform' => $feePlatform,
      'method' => $method,
      'inquiry' => null,
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $user = auth()->user();
    if ($user->role != UserType::Admin) {
      $validatedData['user_id'] = $user->id;
    }

    if ($this->isEdit)
      return $validatedData;

    // verify admin only use manual transfer
    if ($user->role == UserType::Admin && $validatedData['method'] != DisbursementMethodType::MANUAL) {
      throw new Error('Admin hanya dapat menggunakan metode transfer manual', 422);
    }

    // duitku balance check
    if ($validatedData['method'] != DisbursementMethodType::MANUAL) {
      $duitkuBalance = (new DisbursementService())->getBalance();
      if ($duitkuBalance->responseCode != "00" || intval($duitkuBalance?->effectiveBalance) < $validatedData['net_amount']) {
        throw new Error('Terjadi kendala pada metode transfer ini, harap gunakan metode transfer manual agar penarikan dana dapat diproses', 422);
      }

      if (!isset($request->inquiry)) {
        (new DisbursementService())->inquiry($validatedData);
      }
    }

    $user = User::where('id', $validatedData['user_id'])->first();
    $balance = Wallet::getUserBalance($user);
    $balanceErrorMessage = 'Jumlah saldo anda tidak mencukupi';

    if (!$balance)
      throw new Error($balanceErrorMessage, 422);
    if (intval($validatedData['gross_amount'] > intval($balance->credit_total)) || intval($validatedData['net_amount'] > intval($balance->credit_total)))
      throw new Error($balanceErrorMessage, 422);


    $validatedData['status'] = WithdrawStatusType::Pending;
    $validatedData['transaction_number'] = $validatedData['user_id'] . $validatedData['bank_id'] . time();
    if ($validatedData['method'] == DisbursementMethodType::BIFAST) {
      $validatedData['transaction_number'] = $validatedData['user_id'] . $validatedData['bank_id'] . time();
    }

    $inquiry = $request->inquiry ?? [];
    $feeTransferConfig = Configuration::where('type', ConfigurationType::FEE_TRANSFER_BANK)->where('status', OriginStatusType::Active)->first();
    $feeTransfer = $feeTransferConfig?->value ?: 0;

    $feePlatformConfig = Configuration::where('type', ConfigurationType::FEE_PLATFORM)->where('status', OriginStatusType::Active)->first();
    $feePlatform = $feePlatformConfig?->value ?: 0;

    $feeData = [
      'fee_transfer' => $feeTransfer,
      'fee_platform' => $feePlatform
    ];
    $validatedData['net_amount'] = (int)$validatedData['gross_amount'] - (int) $feePlatform - (int) $feeTransfer;
    $validatedData['detail'] = json_encode([...$feeData, ...$inquiry]);
    $validatedData['submited_user_id'] = auth()->user()->id;

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    if ($this->isEdit)
      return;

    Wallet::create([
      'withdraw_id' => $model->id,
      'user_id' => $model->user_id,
      'debit' => $model->gross_amount,
    ]);

    if ($model->method != DisbursementMethodType::MANUAL) {
      $model->reff_number = $request->inquiry['reff_number'];
      $model->account_name = $request->inquiry['account_name'];
      $model->disburse_id = $request->inquiry['disburse_id'];
      $model->status = WithdrawStatusType::Processing;
      $model->save();
      (new DisbursementService())->process($model->id);
    }
  }


  protected function actionUpdate($id, Request $request)
  {
    $actions = [
      "cancel" => 0,
      "finish" => 0,
    ];
    $actions = [...$actions, ...$request->all()];

    $actions = collect($actions)->filter(function ($value) {
      return $value == "1";
    });

    if ($actions->isEmpty())
      return null;

    if (auth()->user()->role != UserType::Admin) {
      return redirect()->back()->with('error', 'Anda tidak diperbolehkan mengakses fitur ini');
    }

    $this->modelInstance = Withdraw::whereId($id)->first();
    if ($request->cancel == 1)
      return $this->cancelWithdraw($request);
    if ($request->finish == 1)
      return $this->finishWithdraw($request);

    return null;
  }

  private function cancelWithdraw(Request $request)
  {
    $validate = $request->validate([
      'status_message' => [
        Rule::requiredIf(function () {
          return auth()->user()->role == UserType::Admin;
        })
      ],
    ]);

    DB::beginTransaction();
    try {
      $withdraw = $this->modelInstance;
      $withdraw->status = WithdrawStatusType::Cancel;

      if ($request->filled('status_message')) {
        $withdraw->status_message = $request->status_message;
      }

      $wallet = Wallet::where('withdraw_id', $withdraw->id)->first();
      $wallet?->delete();

      $withdraw->save();

      DB::commit();
      return $this->inertiaRedirect($request, 'Update');
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Update penarikan dana gagal: ' . $th->getMessage());
    }
  }
  private function finishWithdraw(Request $request)
  {
    $validated = $request->validate(['attachment' => 'required|file|mimes:png,jpg,jpeg']);
    DB::beginTransaction();

    try {
      $withdraw = $this->modelInstance;
      $validated = parent::saveFiles($request, $validated, ['attachment']);

      $validated['status'] = WithdrawStatusType::Success;
      $withdraw->update($validated);
      DB::commit();

      return $this->inertiaRedirect($request, 'Update');
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Update penarikan dana gagal: ' . $th->getMessage());
    }
  }
}
