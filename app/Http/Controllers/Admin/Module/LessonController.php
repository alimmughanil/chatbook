<?php

namespace App\Http\Controllers\Admin\Module;

use App\Enums\AttachmentContentType;
use App\Models\Quiz;
use App\Rules\YoutubeUrl;
use App\Utils\Helper;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Attachment;
use Illuminate\Http\Request;
use App\Enums\AttachmentType;
use App\Enums\LessonContentType;
use App\Rules\FileOrStoragePath;
use App\Http\Controllers\Core\BaseResourceController;

class LessonController extends BaseResourceController
{
  protected $model = Lesson::class;

  protected function indexQuery($query, Request $request)
  {
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "lessons",
      "inertia" => "Admin/Module/Lesson",
      "label" => "Materi Pelajaran",
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
        "title" => "required|string|max:255",
        "content_type" => "required|string|max:255",
        "visibility" => "nullable",
        "description" => "nullable|string",
        "thumbnail" => "nullable",
        "video_url" => ["required_if:content_type,video", new YoutubeUrl()],
        'duration' => [
          'required',
          'regex:/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/'
        ],
        "duration_seconds" => "nullable|integer",
        "order" => "nullable|integer",
        "attachment" => "nullable|array",
        "attachment_link" => "nullable|array",
      ],
      "default" => [
        "content_type" => LessonContentType::Video,
      ],
      "detail_validation" => [
        "attachment.*" => ["nullable", new FileOrStoragePath(["jpg", "jpeg", "png", "webp", "avif", "pdf", "doc", "docx"], 5120)]
      ],
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $routes = $request->route()->parameters();
    $module = null;
    if (isset($routes['module_id'])) {
      $module = Module::find($routes['module_id']);
    }
    if (!$module)
      throw new \Error("Modul tidak ditemukan", 404);

    $validatedData['module_id'] = $module->id;

    $parts = parse_url($validatedData['video_url']);
    parse_str($parts['query'] ?? '', $query);

    if (isset($query['v'])) {
      $validatedData['thumbnail'] = "https://i.ytimg.com/vi_webp/{$query['v']}/maxresdefault.webp";
    }


    if ($this->routeType != 'update') {
      $lastOrderLesson = Lesson::query()->where('module_id', $module->id)->max('order');
      $lastOrderLesson = $lastOrderLesson ? $lastOrderLesson : 0;
      $validatedData['order'] = $lastOrderLesson + 1;
    }

    $validatedData['duration_seconds'] = Helper::timeToSeconds($validatedData['duration']);

    unset($validatedData['attachment']);
    unset($validatedData['attachment_link']);
    return $validatedData;
  }


  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [
      "lesson_content_type" => LessonContentType::getValues(),
    ];

    return [...parent::getFormData($request, $model), ...$formData];
  }

  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = "/admin/courses/";
    $routes = $request->route()->parameters();
    $modelParam = str($this->model->getTable())->singular()->value();

    if (isset($routes['course_id'])) {
      $pageUrl .= $routes['course_id'];
    }
    $pageUrl .= "/modules/";
    if (isset($routes['module_id'])) {
      $pageUrl .= "?module_id={$routes['module_id']}";
    }
    if (isset($routes[$modelParam])) {
      $pageUrl .= "&{$modelParam}_id={$routes[$modelParam]}";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", "$type {$this->page["label"]} Berhasil");
  }
  protected function afterSave($model, Request $request)
  {
    $attachmentData = [
      "lesson_id" => $model->id,
    ];

    $this->saveAttachments($request, Attachment::class, AttachmentType::Lesson, $attachmentData);

    $attachmentLinkData = [
      ...$attachmentData,
      'type' => AttachmentType::Lesson,
      'content_type' => AttachmentContentType::Link
    ];

    $this->saveMultipleForms($request, Attachment::class, $attachmentLinkData,'attachment_link');

    if ($model->content_type == LessonContentType::Exam) {
      $model->load('quiz');
      $quizData = [
        "lesson_id" => $model->id,
        "title" => $model->title,
        "description" => $model->description,
        "duration" => $model->duration,
        "duration_seconds" => $model->duration_seconds,
      ];

      if ($model->quiz) {
        $model->quiz->update($quizData);
      } else {
        Quiz::create($quizData);
      }
    }
  }
}
