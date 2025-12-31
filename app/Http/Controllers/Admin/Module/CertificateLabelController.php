<?php

namespace App\Http\Controllers\Admin\Module;

use App\Models\CertificateLabel;
use App\Utils\Helper;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class CertificateLabelController extends BaseResourceController
{
  protected $model = CertificateLabel::class;

  protected function indexQuery($query, Request $request)
  {
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "certificate_labels",
      "inertia" => "Admin/Module/CertificateLabel",
      "label" => "Label Sertifikat",
      "url" => "/admin/certificates",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "certificate_id" => "required|exists:certificates,id",
        "type" => "required|string|max:255",
        "x_coordinate" => "nullable|numeric|max:255",
        "y_coordinate" => "nullable|numeric|max:255",
        "box_height" => "required|string|max:255",
        "box_width" => "required|string|max:255",
        "font_size" => "nullable|numeric",
      ],
      "default" => [],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [...parent::getFormData($request, $model)];
  }
  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];

    if ($this->modelInstance) {
      $certificateLabel = $this->modelInstance;
      $certificateLabel->load('certificate');
      $courseId = $certificateLabel?->certificate?->course_id ?? "default";
      $pageUrl .= "?course_id=$courseId";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }
}
