<?php

namespace App\Http\Controllers\Admin;

use App\Models\Doctor;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class DoctorController extends BaseResourceController
{
  protected $model = Doctor::class;

  protected function indexQuery($query, $request)
  {
    $query->when($request->filled("status"), function ($q) use ($request) {
      $q->where("status", $request->status);
    });

    return $query;
  }

  protected function getPage($request, $id = null): array
  {
    return [
      "name" => "doctors",
      "inertia" => "Doctor",
      "label" => "Data Dokter",
      "url" => "/admin/doctors",
      "fields" => \App\Utils\Helper::getFormFields($this->validation($request)),
    ];
  }

  protected function validation($request, $id = null): array
  {
    return [
      "validation" => [
        "name" => "required|string",
        "institute" => "nullable|string",
      ],
      "default" => [],
    ];
  }

  protected function getFormData($request, $model = null): array
  {
    return [
      ...parent::getFormData($request, $model),
      "institutes" => Doctor::select("institute as value", "institute as label")->get(),
      "status" => PublishStatusType::getValues(),
    ];
  }
}
