<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserType;
use App\Models\Patient;
use App\Enums\ActionType;
use App\Enums\GenderType;
use Illuminate\Http\Request;
use App\Http\Controllers\Core\BaseResourceController;

class PatientController extends BaseResourceController
{
  protected $model = Patient::class;

  protected function indexQuery($query, $request)
  {
    $query->when($request->filled("status"), function ($query) use ($request) {
      $query->where("status", $request->status);
    });

    return $query;
  }

  protected function getPage($request, $id = null): array
  {
    $fields = \App\Utils\Helper::getFormFields($this->validation($request));

    return [
      'name' => 'patients',
      "inertia" => "Patient",
      'label' => 'Data Pasien',
      'url' => '/admin/patients',
      'fields' => $fields,
    ];
  }

  protected function validation($request, $id = null): array
  {
    return [
      'validation' => [
        'name' => 'required|string',
        'address' => 'required|string',
        'phone' => 'required|string',
        'birth_date' => 'required|date',
        'gender' => 'required|string',
        'medical_history' => 'nullable|string',
        'medication_allergy' => 'nullable|string',
      ],
      'default' => [],
    ];
  }

  protected function getFormData($request, $patient = null): array
  {
    return [
      'isAdmin' => $this->isAdmin,
      'page' => $this->page,
      'gender' => GenderType::getValues(),
    ];
  }

  protected function beforeSave($validatedData, $request): array
  {
    $validatedData['user_id'] = auth()->id();
    return [$validatedData];
  }

  protected function getAuthorize($request, $data = null, $action = ActionType::Read)
  {
    $user = auth()->user();
    if ($user->role == UserType::Admin)
      return true;

    return \App\Utils\Helper::redirectBack(
      'error',
      "Anda tidak diperbolehkan melakukan aksi ini pada {$this->page['label']}"
    );
  }
}
