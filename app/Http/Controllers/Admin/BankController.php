<?php

namespace App\Http\Controllers\Admin;

use App\Models\Bank;
use App\Models\User;
use App\Enums\BankStatusType;
use App\Enums\UserType;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use Illuminate\Validation\Rule;
use App\Enums\ConfigurationType;
use Illuminate\Support\Facades\DB;
use App\Models\SupportedBank;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class BankController extends BaseResourceController
{
  protected $model = Bank::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "bank",
      "inertia" => "Admin/Bank",
      "label" => "Rekening Bank",
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
    $query->with('user')
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
      'status' => BankStatusType::getValues(),
    ];
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'supported_bank_id' => 'required',
        'bank_account' => 'required',
        'bank_alias' => 'required',
        'attachment' => ['nullable', ...[is_file($request->attachment) ? ["image", "mimes:jpeg,png,jpg,gif,svg,webp,avif", "max:2048"] : []]],
        'is_primary' => 'nullable',
        'status' => [Rule::requiredIf(fn() => auth()->user()->role == UserType::Admin)],
        'user_id' => [Rule::requiredIf(fn() => auth()->user()->role == UserType::Admin)],
        'status_message' => [Rule::requiredIf(fn() => $request->reject == 1)],
      ],
      'default' => [
        'status' => BankStatusType::Pending
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $partner = [];
    $status = [];
    if (auth()->user()->role == UserType::Admin) {
      $status = BankStatusType::getValues();
      $partner = User::whereIn('role', [UserType::Partner])->get()->map(function ($user) {
        $label = $user->name;
        if ($user->phone) {
          $label .= " - $user->phone - ";
        }
        if ($user->email) {
          $label .= " - $user->email - ";
        }

        return ['value' => $user->id, 'label' => $label];
      })->toArray();
    }

    $supportedBank = SupportedBank::where('status', OriginStatusType::Active)->get()->map(function ($supportedBank) {
      return ['value' => $supportedBank->id, 'label' => $supportedBank->bank_name];
    })->toArray();

    return [
      ...parent::getFormData($request, $model),
      'supportedBank' => $supportedBank,
      'partner' => $partner,
      'status' => $status,
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    if (auth()->user()->role != UserType::Admin) {
      $validatedData['user_id'] = auth()->id();
      if (!$this->isEdit) {
        $validatedData['status'] = BankStatusType::Pending;
      }
    }

    $supportedBank = SupportedBank::where('id', $validatedData['supported_bank_id'])->first();
    $validatedData['bank_name'] = $supportedBank->bank_name;

    $validatedData = parent::saveFiles($request, $validatedData, ['attachment']);

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    if ($model->is_primary == 1) {
      Bank::whereNot('id', $model->id)->where('user_id', $model->user_id)->update(['is_primary' => 0]);
    }
  }

  protected function actionUpdate($id, Request $request)
  {
    $actions = [
      "verified" => 0,
      "rejected" => 0,
    ];
    $actions = [...$actions, ...$request->all()];

    $actions = collect($actions)->filter(function ($value) {
      return $value == "1";
    });

    if ($actions->isEmpty())
      return null;

    if (isset($actions['verified']))
      return $this->updateStatus(BankStatusType::Verified, $request);
    if (isset($actions['rejected']))
      return $this->updateStatus(BankStatusType::Rejected, $request);


    return null;
  }
}
