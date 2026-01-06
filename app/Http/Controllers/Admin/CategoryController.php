<?php

namespace App\Http\Controllers\Admin;

use App\Utils\Helper;
use App\Models\Category;
use App\Enums\CategoryType;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Core\BaseResourceController;

class CategoryController extends BaseResourceController
{
  protected $model = Category::class;

  protected function indexQuery($query, Request $request)
  {
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));
    return $query;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "categories",
      "inertia" => "Admin/Category",
      "label" => "Kategori",
      "url" => "/admin/categories",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "parent_id" => "nullable|exists:categories,id",
        "name" => "required|string|max:255",
        "slug" => "nullable|string|unique:categories,slug,$id",
        "type" => "required|string|max:255",
        "thumbnail" => ["nullable", ...[is_file($request->thumbnail) ? ["image", "mimes:jpeg,png,jpg,gif,svg,webp,avif", "max:2048"] : []]],
        "description" => "nullable|string",
        'is_thumbnail_icon' => 'nullable',
        'is_active' => 'nullable',
        'is_featured' => 'nullable',
      ],
      "default" => [
        "type" => CategoryType::Product,
        'is_thumbnail_icon' => false,
        'is_active' => true,
        'is_featured' => false,
      ],
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $formData = [
      ...parent::getFormData($request, $model),
      "type" => CategoryType::getValues()
    ];

    return $formData;
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData = parent::saveFiles($request, $validatedData, ['thumbnail']);

    return $validatedData;
  }
}
