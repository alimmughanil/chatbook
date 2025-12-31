<?php

namespace App\Http\Controllers\Admin;

use App\Models\Blog;
use App\Utils\Helper;
use App\Enums\ImageType;
use App\Models\BlogImage;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Core\BaseResourceController;

class BlogController extends BaseResourceController
{
  protected $model = Blog::class;
  protected function indexQuery($query, Request $request)
  {
    $query->with('category');
    $query->when($request->filled("status"), fn($q) => $q->where("status", $request->status));
    return $query;
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $categories = BlogCategory::select(["id", "id as value", "name as label"])->where("status", PublishStatusType::Publish)->get();

    if ($this->modelInstance) {
      $this->modelInstance->load('blogImage');
      $this->modelInstance->images = $this->modelInstance->blogImage;
    }

    $formData = [
      ...parent::getFormData($request, $model),
      "status" => PublishStatusType::getValues(),
      "categories" => $categories,
    ];

    return $formData;
  }

  protected function getPage(Request $request, $id = null): array
  {
    $fields = Helper::getFormFields($this->validation($request));

    $page = [
      "name" => "blogs",
      "inertia" => "Admin/Blog",
      "label" => "Artikel Blog",
      "url" => "/admin/blog/blogs",
      "data" => null,
      "fields" => $fields,
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "title" => "required",
        "slug" => "required|string|max:255|unique:blog_categories,slug,$id",
        "category_id" => "required|integer|exists:blog_categories,id",
        "thumbnail" => "nullable",
        "keyword" => "nullable|string",
        "is_slider" => "required|boolean",
        "description" => "required|string",
        "short_description" => "nullable|string",
        "status" => "required|string",
        "published_at" => "nullable|date",
        "images" => "required_if:is_slider,1|array",
      ],
      "default" => [
        "status" => PublishStatusType::Draft,
        "is_slider" => 0,
      ],
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData = parent::saveFiles($request, $validatedData, ['thumbnail']);
    unset($validatedData['images']);

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    $this->saveBlogImage($request, $model);
  }

  public function saveBlogImage($request, $blog)
  {
    $images = $request->file('images');

    $latestImage = collect($request->images)->pluck('id')->whereNotNull()->toArray();
    $blogImage = BlogImage::where('blog_id', $blog->id)->whereNotIn('id', $latestImage)->get();

    if ($blogImage->isNotEmpty()) {
      foreach ($blogImage as $image) {
        if (Storage::disk('public')->exists(substr($image->value, 9))) {
          Storage::disk('public')->delete(substr($image->value, 9));
        }
        $image->delete();
      }
    }

    if (!$images)
      return;

    $directory = 'blog';
    if (!Storage::disk('public')->exists($directory)) {
      Storage::disk('public')->makeDirectory($directory);
    }

    if (!empty($images)) {
      foreach ($images as $image) {
        $fileName = config('app.name') . "-" . str($image->getClientOriginalName())->slug()->value() . "-" . time() . "-" . rand(111, 999) . "." . $image->getClientOriginalExtension();
        $file = Storage::disk('public')->putFileAs($directory, $image, $fileName);
        if (!$file)
          redirect()->back()->with('error', 'Gagal upload file');

        if (!isset($image->id)) {
          BlogImage::create([
            'user_id' => auth()->id(),
            'blog_id' => $blog->id,
            'type' => ImageType::File,
            'label' => $image->getClientOriginalName(),
            'value' => "/storage/$file"
          ]);
        }
      }
    }
  }
}
