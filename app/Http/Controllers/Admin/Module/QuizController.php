<?php

namespace App\Http\Controllers\Admin\Module;

use App\Models\Quiz;
use App\Utils\Helper;
use App\Models\Lesson;
use Illuminate\Http\Request;
use App\Http\Controllers\Core\BaseResourceController;

class QuizController extends BaseResourceController
{
  protected $model = Quiz::class;

  protected function indexQuery($query, Request $request)
  {
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "quizzes",
      "inertia" => "Admin/Module/Quiz",
      "label" => "Kuis",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $params = $request->route()->parameters();
    $url = "/admin/courses/{$params['course_id']}/modules?module_id={$params['module_id']}&lesson_id={$params['lesson_id']}";
    $page["url"] = $url;

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "title" => "required|string|max:255",
        "description" => "nullable|string",
        "grading_type" => "required|string|max:255",
        'duration' => [
          'required',
          'regex:/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/'
        ],
        "duration_seconds" => "nullable|integer",
        "min_score" => "nullable|integer",
        "order" => "nullable|integer",
      ],
      "default" => [],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [...parent::getFormData($request, $model)];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $lesson = null;
    if (isset($routes['lesson_id'])) {
      $lesson = Lesson::find($routes['lesson_id']);
    }
    if (!$lesson)
      throw new \Error("Pelajaran tidak ditemukan", 404);

    if ($this->routeType != 'update') {
      $lastOrderQuiz = Quiz::query()->where('lesson_id', $lesson->id)->max('order');
      $lastOrderQuiz = $lastOrderQuiz ? $lastOrderQuiz : 0;
      $validatedData['order'] = $lastOrderQuiz + 1;
    }

    $validatedData['duration_seconds'] = Helper::timeToSeconds($validatedData['duration']);
    $validatedData['lesson_id'] = $lesson->id;

    return $validatedData;
  }
}
