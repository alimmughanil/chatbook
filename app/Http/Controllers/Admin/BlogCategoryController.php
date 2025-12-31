<?php

namespace App\Http\Controllers\Admin;

use App\Utils\Helper;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class BlogCategoryController extends BaseResourceController
{
  protected $model = BlogCategory::class;

  protected function indexQuery($query, Request $request)
  {
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));
    return $query;
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [
      ...parent::getFormData($request, $model),
      "status" => PublishStatusType::getValues(),
    ];

    return $formData;
  }
  
  protected function getPage(Request $request, $id = null):array
  {
    $page = [
      "name" => "blog_categories",
      "label" => "Kategori Blog",
      "inertia" => "Admin/BlogCategory",
      "url" => "/admin/blog/blog_categories",
      "data" => null,
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "name" => "required|string|max:255",
        "slug" => "required|string|max:255|unique:blog_categories,slug,$id",
        "thumbnail" => "nullable",
        "description" => "nullable|string",
        "seo_keyword" => "nullable|string",
        "seo_description" => "nullable|string",
        "is_featured" => "required|boolean",
        "status" => "required|string",
      ],
      "default" => [
        "status" => PublishStatusType::Draft,
        "is_featured" => 0,
      ],
    ];
  }
}
