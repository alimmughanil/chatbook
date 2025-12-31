<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserType;
use App\Models\Patient;
use App\Models\MedicalRecord;
use App\Enums\ActionType;
use App\Http\Controllers\Core\BaseResourceController;

class MedicalRecordController extends BaseResourceController
{
  protected $model = MedicalRecord::class;

  protected function indexQuery($query, $request)
  {
    $query->with('doctor', 'patient')
      ->when($request->filled("doctor_id"), function ($query) use ($request) {
        $query->where("doctor_id", "=", $request->doctor_id);
      })
      ->when($request->filled("institute"), function ($query) use ($request) {
        $query->whereRelation("doctor", "institute", "=", $request->institute);
      });

    return $query;
  }

  protected function getPage($request, $id = null): array
  {
    $fields = \App\Utils\Helper::getFormFields($this->validation($request));

    return [
      'name' => 'medical_records',
      "inertia" => "MedicalRecord",
      'label' => 'Rekam Medis',
      'url' => '/admin/medical-records',
      'fields' => $fields,
    ];
  }

  protected function validation($request, $id = null): array
  {
    return [
      'validation' => [
        'patient_id' => 'required|exists:patients,id',
        'diagnosis' => 'required|string',
        'treatment' => 'nullable|string',
        'notes' => 'nullable|string',
        'recorded_at' => 'required|date',
      ],
      'default' => [],
    ];
  }

  protected function getFormData($request, $record = null): array
  {
    return [
      ...parent::getFormData($request, $record),
      'patients' => Patient::select('id', 'name')->get(),
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
    if ($user->role === UserType::Admin)
      return true;

    return \App\Utils\Helper::redirectBack(
      'error',
      "Anda tidak diperbolehkan melakukan aksi ini pada {$this->page['label']}"
    );
  }
}
