<?php

namespace App\Http\Controllers\Admin;

use App\Utils\Helper;
use App\Models\Course;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Enums\ParticipantType;
use App\Imports\ParticipantImport;
use App\Enums\ParticipantStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class ParticipantController extends BaseResourceController
{
  protected $model = Participant::class;

  protected function indexQuery($query, Request $request)
  {
    $query = $query->where('course_id', $request->input('course_id', null));
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));
    return $query;
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $course = null;

    if ($request->course_id) {
      $course = Course::filterRole()->whereId($request->course_id)->first();
    }

    $data = [
      ...parent::indexData($request, $isFormData),
      "course" => $course,
    ];

    return $data;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "participants",
      "inertia" => "Admin/Participant",
      "label" => "Peserta",
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
        "course_id" => "required|exists:courses,id",
        "type" => "required|string|max:255",
        "participant_number" => "nullable|string|max:255",
        "name" => "required|string|max:255",
        "email" => "required|string|email|max:255",
        "phone" => "required|string|max:255",
        "institute" => "nullable|string|max:255",
        "job_title" => "nullable|string|max:255",
        "branch" => "nullable|string|max:255",
        "status" => "required|string|max:255",
      ],
      "default" => [
        "type" => ParticipantType::Participant,
        "status" => ParticipantStatusType::Active,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $courses = Course::filterRole()->selectOptions('id', 'title')->get();
    $page = $this->setDefaultValue($request, ["course_id"], $model);

    $formData = [
      "page" => $page,
      "courses" => $courses,
      "participant_type" => ParticipantType::getValues(),
      "status" => ParticipantStatusType::getValues(),
    ];

    return [...parent::getFormData($request, $model), ...$formData];
  }
  protected function beforeSave(array $validatedData, Request $request): array
  {
    $course = Course::filterRole()->find($validatedData['course_id']);
    if (!$course)
      throw new \Error("Kursus tidak ditemukan", 404);

    $validatedData['course_id'] = $course->id;
    $validatedData['participant_number'] = Participant::getParticipantNumber($course);

    return $validatedData;
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
      $pageUrl .= "?course_id=" . $participant?->course_id;
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }

  public function import($id, Request $request)
  {
    $request->validate([
      'excel' => 'required|file|mimes:xlsx,xls,csv',
    ]);

    try {
      $referer = $request->headers->get('referer');

      $course = Course::filterRole()->where('id', $id)->first();
      if (!$course)
        return redirect()->back()->with('error', 'Course tidak ditemukan');
      if ($request->type == 'participant') {
        (new ParticipantImport($course))->import($request->file('excel'));

        if (str($referer)->startsWith(needles: url('/admin/participants'))) {
          return redirect("$referer&import=progress")->with('success', 'Import data peserta sedang diproses, refresh halaman untuk melihat progress');
        }

        return redirect()->back()->with('success', 'Import data peserta berhasil');
      }

      return redirect()->back()->with('error', 'Tipe import tidak ditemukan');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Kesalahan server. Import data peserta gagal');
    }
  }
}
