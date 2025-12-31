<?php

namespace App\Http\Controllers\Admin\Module;

use App\Enums\SubmissionGradeResultType;
use App\Enums\SubmissionStatusType;
use App\Models\Quiz;
use App\Utils\Helper;
use Illuminate\Http\Request;
use App\Models\QuizSubmission;
use App\Http\Controllers\Core\BaseResourceController;

class QuizSubmissionController extends BaseResourceController
{
  protected $model = QuizSubmission::class;

  protected function indexQuery($query, Request $request)
  {
    $query->with(['quiz', 'participant', 'answers']);
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));
    $query->when($request->filled("grade_status"), fn($q) => $q->where("grade_status", $request->grade_status));
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "quiz_submissions",
      "inertia" => "Admin/Module/QuizSubmission",
      "label" => "Pengumpulan Kuis",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $params = $request->route()->parameters();
    $url = collect($params)
      ->map(function ($value, $key) {
        $key = str_replace('_id', '', $key);
        $key = str($key)->plural()->value();
        return "{$key}/{$value}";
      })
      ->implode('/');

    if (!str($url)->contains($page["name"])) {
      $url .= "/{$page["name"]}";
    }

    if (in_array($this->routeType, ['edit', 'update', 'destroy'])) {
      $pageUrl = explode("/{$page["name"]}", $url);
      $url = "{$pageUrl[0]}/{$page["name"]}";
    }

    $url = "/admin/{$url}";
    $page["url"] = $url;
    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "total_point" => "nullable|integer",
        "final_score" => "nullable|integer",
        "is_show_score" => "nullable|boolean",
        "status" => "required|string|max:255",
      ],
      "default" => [
        "status" => SubmissionStatusType::Submitted,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [];
    return [...parent::getFormData($request, $model), ...$formData];
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $params = $request->route()->parameters();
    $quiz = Quiz::find($params['quiz_id']);

    $quizSubmission = null;
    if ($request->submission_id) {
      $quizSubmission = QuizSubmission::with(["answers"])->whereId($request->submission_id)->first();
    }

    $data = [
      ...parent::indexData($request, $isFormData),
      "title" => $quiz->title,
      "quiz" => $quiz,
      "quizSubmission" => $quizSubmission,
      "status" => SubmissionStatusType::getValues(),
      "gradeStatus" => SubmissionGradeResultType::getValues()
    ];

    return $data;
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $quiz = Quiz::find($routes['quiz_id']);
    if (!$quiz)
      throw new \Error("Kuis tidak ditemukan", 404);

    $validatedData['quiz_id'] = $quiz->id;
    return $validatedData;
  }
}
