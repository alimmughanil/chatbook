<?php

namespace App\Http\Controllers\Admin;

use App\Utils\Helper;
use App\Models\Course;
use App\Models\Category;
use App\Enums\CategoryType;
use Illuminate\Http\Request;
use App\Enums\CourseLevelType;
use App\Enums\CoursePaymentType;
use App\Enums\PublishStatusType;
use App\Enums\CourseTimeLimitType;
use App\Http\Controllers\Core\BaseResourceController;

class CourseController extends BaseResourceController
{
  protected $model = Course::class;

  protected function indexQuery($query, Request $request)
  {
    $query->filterRole();
    $query->with('category', 'ratings.user');
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));

    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "courses",
      "inertia" => "Admin/Course",
      "label" => "Kursus",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    if ($this->routeType != 'show') {
      $pageUrl = explode("/{$page['name']}", $page['url']);
      $page['url'] = "{$pageUrl[0]}/{$page['name']}";
    }

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "category_id" => "required|exists:categories,id",
        "title" => "required|string|max:255",
        "slug" => "required|string|max:255|unique:courses,slug,$id",
        "payment_type" => "required|string|max:255",
        "price" => "required_if:payment_type,paid",
        "participant_start_number" => "required|string",
        "participant_format_number" => "required|string|max:255",
        "is_featured" => "nullable",
        "description" => "nullable|string",
        "start_at" => "nullable|date",
        "close_at" => "nullable|date",
        "registration_start_at" => "nullable|date",
        "registration_close_at" => "nullable|date",
        "time_limit" => "required|string|max:255",
        "level" => "required|string|max:255",
        "thumbnail" => ["nullable", ...[is_file($request->thumbnail) ? ["image", "mimes:jpeg,png,jpg,gif,svg,webp,avif", "max:2048"] : []]],
      ],
      "default" => [
        "participant_format_number" => "{NNNN}",
        "participant_start_number" => "0001",
        "payment_type" => CoursePaymentType::Free,
        "time_limit" => CourseTimeLimitType::Unlimited,
        "level" => CourseLevelType::Beginner,
        "status" => PublishStatusType::Draft,
        "price" => 0,
        "is_featured" => 0,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $categories = Category::selectOptions()->whereType(CategoryType::Course)->get();
    $formData = [
      ...parent::getFormData($request, $model),
      "categories" => $categories,
      "status" => PublishStatusType::getValues(),
      "level" => CourseLevelType::getValues(),
      "payment_type" => CoursePaymentType::getValues(),
      "time_limit" => CourseTimeLimitType::getValues(),
    ];

    return $formData;
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData['user_id'] = auth()->id();
    
    if ($validatedData['payment_type'] == CoursePaymentType::Free) {
      $validatedData['price'] = 0;
    }

    if ($validatedData['time_limit'] == CourseTimeLimitType::Unlimited) {
      $validatedData['start_at'] = null;
      $validatedData['close_at'] = null;
      $validatedData['registration_start_at'] = null;
      $validatedData['registration_close_at'] = null;
    }
    
    $validatedData = parent::saveFiles($request, $validatedData, ['thumbnail']);

    return $validatedData;
  }

  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];
    $message = "$type {$this->page["label"]} Berhasil";

    if ($type == 'Tambah' && $this->modelInstance) {
      $pageUrl = "{$pageUrl}/{$this->modelInstance->id}/modules";
      $message .= ". Silahkan tambahkan modul dan materi untuk kursus ini.";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", $message);
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
}
