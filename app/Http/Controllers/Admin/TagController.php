<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use Illuminate\Http\Request;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class TagController extends BaseResourceController
{
  protected $model = Tag::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "tag",
      "inertia" => "Admin/Tag",
      "label" => "Tag",
      "url" => "/admin/tag",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'title' => 'required',
        'slug' => 'required|unique:' . Tag::class . ',slug,' . $id,
        'is_active' => 'nullable',
        'is_featured' => 'nullable',
      ],
      "default" => []
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [
      ...parent::getFormData($request, $model),
    ];
  }
}
