<?php

namespace App\Http\Controllers\Admin\Module;

use App\Enums\QuestionType;
use App\Models\Quiz;
use App\Utils\Helper;
use App\Models\Lesson;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class QuestionController extends BaseResourceController
{
  protected $model = Question::class;

  protected function indexQuery($query, Request $request)
  {
    $query->with("answers");
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "questions",
      "inertia" => "Admin/Module/Question",
      "label" => "Pertanyaan",
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
        "question_text" => "required|string",
        "type" => "required|string|max:255",
      ],
      "default" => [
        "type" => QuestionType::SingleChoice,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [
      "question_type" => QuestionType::getValues(),
      "question_description" => QuestionType::description(),
    ];

    return [...parent::getFormData($request, $model), ...$formData];
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $params = $request->route()->parameters();
    $lesson = Lesson::find($params['lesson_id']);

    $question = null;
    if ($request->question_id) {
      $question = Question::with(["answers"])->whereId($request->question_id)->first();
    }

    $data = [
      ...parent::indexData($request, $isFormData),
      "title" => $lesson->title,
      "lesson" => $lesson,
      "question" => $question,
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
