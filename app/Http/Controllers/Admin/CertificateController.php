<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PublishStatusType;
use App\Enums\UserType;
use App\Models\ParticipantCertificate;
use App\Utils\Helper;
use App\Models\Course;
use App\Models\Certificate;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Enums\CertificateType;
use App\Enums\ParticipantType;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Core\BaseResourceController;

class CertificateController extends BaseResourceController
{
  protected $model = Certificate::class;


  protected function indexQuery($query, Request $request)
  {
    $query = $query->where('course_id', $request->input('course_id', null));
    return $query;
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $course = Course::filterRole()->whereId($request->course_id)->first();
    $courseId = $request->input('course_id', 'default');

    $certificates = Certificate::with('label')
      ->with('course')
      ->when($courseId != 'default', fn($q) => $q->where('course_id', $request->course_id))
      ->when($courseId == 'default', fn($q) => $q->where('is_default', 1))
      ->filter($request)
      ->get();

    $data = [
      ...parent::indexData($request, $isFormData),
      "course" => $course,
      "certificates" => $certificates,
      "status" => PublishStatusType::getValues()
    ];

    return $data;
  }

  protected function indexValidation(Request $request)
  {
    if (!$request->course_id) {
      return redirect("/admin/certificates?course_id=default");
    }
    return null;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "certificates",
      "inertia" => "Admin/Certificate",
      "label" => "Sertifikat",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $pageUrl = explode("/{$page["name"]}", $page["url"]);
    $page["url"] = "{$pageUrl[0]}/{$page["name"]}";
    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "course_id" => "nullable",
        "type" => "required|string|max:255",
        "paper_width" => "required|numeric",
        "paper_height" => "required|numeric",
        'template' => [[$id ? 'nullable' : 'required'], ...[is_file($request->template) ? ['image', 'mimes:jpeg,png,jpg,webp,avif', 'max:2048'] : []]],
        "description" => "nullable|string",
      ],
      "default" => [
        "status" => PublishStatusType::Draft,
        "is_default" => 0,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $courses = Course::filterRole()->selectOptions('id', 'title')->get()->toArray();
    $courses = [
      [
        "label" => "Untuk semua kursus",
        "value" => "default"
      ],
      ...$courses,
    ];

    $formData = [
      "courses" => $courses,
      'certificateTypes' => array_values(CertificateType::asArray()),
      'participantTypes' => array_values(ParticipantType::asArray()),
    ];

    return [...parent::getFormData($request, $model), ...$formData];
  }
  protected function beforeSave(array $validatedData, Request $request): array
  {
    if ($validatedData['course_id'] == 'default') {
      $validatedData['course_id'] = null;
      $validatedData['is_default'] = 1;
    } else {
      $course = Course::filterRole()->find($validatedData['course_id']);
      if (!$course)
        throw new \Error("Kursus tidak ditemukan", 404);
      $validatedData['course_id'] = $course->id;
    }

    $validatedData['user_id'] = auth()->id();
    $validatedData = parent::saveFiles($request, $validatedData, ['template']);
    return $validatedData;
  }

  public function show($certificateId, Request $request)
  {
    $certificate = Certificate::filterRole()->whereId($certificateId)->with('label', 'course')->first();
    if (!$certificate)
      return redirect()->back()->with("error", "Sertifikat tidak ditemukan");

    if ($certificate->label->isEmpty())
      return redirect()->back()->with("error", "Sertifikat tidak memiliki label");

    $widthInPoints = floatval($certificate->paper_width) * (72 / 2.54);
    $heightInPoints = floatval($certificate->paper_height) * (72 / 2.54);

    $certificate->label = collect($certificate->label)->map(function ($label) {
      $label->type_key = Helper::getCertificateLabelType($label->type);
      return $label;
    });

    $participant = Participant::where('course_id', $certificate->course_id)->first();
    if (!$participant) {
      $participant = Participant::first();
    }

    if (Helper::htmlToString($certificate->description) == '') {
      $certificate->description = null;
    }

    // return view('layouts.certificate', ['certificate' => $certificate, 'participant' => $participant]);
    $pdf = Pdf::loadView('layouts.certificate', ['certificate' => $certificate, 'participant' => $participant])->setPaper([0, 0, $widthInPoints, $heightInPoints], 'potrait');
    return $pdf->stream("sample_" . $certificate?->course?->slug ?? 'default' . ".pdf");
  }

  protected function afterDelete($model, Request $request)
  {
    $this->modelInstance = $model;
  }
  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];

    if ($this->modelInstance) {
      $participant = $this->modelInstance;
      $courseId = $participant?->course_id ?? "default";
      $pageUrl .= "?course_id=$courseId";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }

  protected function actionUpdate($id, Request $request)
  {
    $actions = [
      PublishStatusType::Draft => 0,
      PublishStatusType::Publish => 0,
      PublishStatusType::Archived => 0
    ];
    $actions = [...$actions, ...$request->all()];

    $actions = collect($actions)->filter(function ($value) {
      return $value == "1";
    });

    if ($actions->isEmpty())
      return null;

    if (isset($actions['draft']))
      return $this->updateStatus(PublishStatusType::Draft, $request);
    if (isset($actions['publish']))
      return $this->updateStatus(PublishStatusType::Publish, $request);
    if (isset($actions['archived']))
      return $this->updateStatus(PublishStatusType::Archived, $request);
    return null;
  }

  protected function afterSave($model, Request $request)
  {
    if ($request->publish == 1 || $request->archived == 1) {
      (new ParticipantCertificate)->updateCertificate($model);
    }
  }
}
