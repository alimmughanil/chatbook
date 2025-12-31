<?php

namespace App\Http\Controllers\Admin\Module;

use App\Enums\GradingType;
use App\Enums\VisibilityType;
use App\Utils\Helper;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\Request;
use App\Enums\LessonContentType;
use App\Http\Controllers\Core\BaseResourceController;

class ModuleController extends BaseResourceController
{
  protected $model = Module::class;

  protected function indexQuery($query, Request $request)
  {
    $query->orderBy('order');
    return $query;
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $module = null;
    $lesson = null;

    if ($request->module_id) {
      $module = Module::with(["lessons" => ["attachment", "attachmentLink", "quizzes"]])->whereId($request->module_id)->first();
    }

    if ($request->lesson_id) {
      $lesson = Lesson::with(["attachment", "attachmentLink", "quizzes"])->whereId($request->lesson_id)->first();
    }

    $data = [
      "module" => $module,
      "lesson" => $lesson,
      "lesson_content_type" => LessonContentType::getValues(),
      "visibility_type" => VisibilityType::getValues(),
      "quiz_grading_type" => GradingType::getValues(),
    ];
    return $data;
  }


  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "modules",
      "inertia" => "Admin/Module/Module",
      "label" => "Modul",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    $pageUrl = explode("/{$page["name"]}", $page["url"]);
    $page["url"] = "{$pageUrl[0]}/{$page["name"]}";
    $page['base_path'] = $pageUrl[0];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "title" => "required|string|max:255",
        "description" => "nullable|string",
      ],
      "default" => [],
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $course = null;
    if (isset($routes['course_id'])) {
      $course = Course::find($routes['course_id']);
    }
    if (!$course)
      throw new \Error("Kursus tidak ditemukan", 404);
    $validatedData['course_id'] = $course->id;

    if ($this->routeType != 'update') {
      $lastOrderModule = Module::query()->where('course_id', $course->id)->max('order');
      $lastOrderModule = $lastOrderModule ? $lastOrderModule : 0;
      $validatedData['order'] = $lastOrderModule + 1;
    }

    return $validatedData;
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $routes = $request->route()->parameters();
    $course = null;
    if (isset($routes['course_id'])) {
      $course = Course::find($routes['course_id']);
    }

    $formData = [
      "course" => $course,
    ];

    return [...parent::getFormData($request, $model), ...$formData];
  }
}
