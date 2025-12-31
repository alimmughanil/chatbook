<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TimeUnitType;
use App\Models\User;
use App\Enums\UserType;
use Illuminate\Http\Request;
use App\Models\PortfolioImage;
use App\Models\PortfolioProject;
use App\Models\PortfolioCategory;
use App\Enums\PortfolioStatusType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;
use App\Enums\PublishStatusType;
use Illuminate\Support\Facades\Storage;

class PortfolioProjectController extends BaseResourceController
{
  protected $model = PortfolioProject::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "portfolio_project",
      "inertia" => "Admin/PortfolioProject",
      "label" => "Proyek",
      "url" => "/admin/portfolio/project",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    return $query->with('category', 'user')
      ->when(auth()->user()->role != UserType::Admin, function ($query) {
        $query->where('user_id', auth()->id());
      })
      ->when($request->has('filter'), function ($query) use ($request) {
        $query->where('status', $request->filter);
      })
      ->orderBy('updated_at', 'DESC');
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    return [
      ...parent::indexData($request, $isFormData),
      'status' => PublishStatusType::getValues(),
    ];
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'category_id' => 'required',
        'name' => 'required',
        'slug' => 'required|unique:' . PortfolioProject::class . ',slug,' . $id,
        'thumbnail' => ['nullable', ...[is_file($request->thumbnail) ? ['image', 'mimes:jpeg,png,jpg,gif,svg,webp,avif', 'max:2048'] : []]],
        'description' => 'required',
        'status' => 'required',
        'user_id' => 'nullable',
        'client_id' => 'required',
        'price_min' => 'nullable',
        'price_max' => 'required',
        'duration' => 'nullable',
        'duration_unit' => 'nullable',
        'site_url' => 'nullable',
        'is_show_client' => 'nullable',
        'project_status' => 'required',
        'project_date' => 'required',
        "images" => "nullable|array",
      ],
      "default" => [
        'duration_unit' => TimeUnitType::Day,
        'is_show_client' => true,
        'project_status' => PortfolioStatusType::Active,
        'status' => PublishStatusType::Draft,
        "user_id" => auth()->id(),
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $categories = PortfolioCategory::selectOptions()->get();
    $clients = [];
    if (auth()->user()->role == UserType::Admin) {
      $clients = User::get();
      $clients = $clients->map(fn($client) => ([
        'value' => $client->id,
        'label' => "$client->name - ($client->email - $client->phone)",
      ]))->toArray();
    }

    if ($this->modelInstance) {
      $this->modelInstance->load('portfolioImage');
      $this->modelInstance->images = $this->modelInstance->portfolioImage;
    }

    return [
      ...parent::getFormData($request, $model),
      'status' => PublishStatusType::getValues(),
      'project_status' => PortfolioStatusType::getValues(),
      'time_unit_type' => TimeUnitType::getValues(),
      'categories' => $categories,
      'clients' => $clients,
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData['slug'] = str_replace(' ', '-', strtolower($validatedData['slug']));
    $validatedData['slug'] = preg_replace('/[^A-Za-z0-9-]/', '', $validatedData['slug']);

    $validatedData = $this->savePortfolioCategory($validatedData);
    $validatedData = $this->saveImage($request, $validatedData, $this->modelInstance);
    unset($validatedData['images']);

    if ($validatedData['status'] == PublishStatusType::Draft) {
      $validatedData['published_at'] = null;
    }

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    $this->savePortfolioImage($request, $model);
    $model->load('portfolioImage');
  }

  protected function actionUpdate($id, Request $request)
  {
    if ($request->update_status) {
      $this->modelInstance = $this->model::where('id', $id)->first();
      if (\App\Utils\Helper::authorize($this->modelInstance->user_id) != true)
        return redirect('/admin/portfolio/project')->with('error', 'Anda tidak memiliki akses untuk mengubah proyek ini');

      $validatedData = $request->validate([
        'status' => 'required',
      ]);

      $this->modelInstance->status = $validatedData['status'];
      $this->modelInstance->save();

      return redirect('/admin/portfolio/project')->with('success', 'Update Status Proyek Berhasil');
    }

    return null;
  }

  private function savePortfolioCategory($validatedData)
  {
    if (gettype($validatedData['category_id']) != 'array')
      return $validatedData;
    $title = $validatedData['category_id']['value'];
    $slug = str_replace(' ', '-', strtolower($title));
    $slug = preg_replace('/[^A-Za-z0-9-]/', '', $slug);

    $isExist = PortfolioCategory::where('slug', $slug)->first();
    if ($isExist) {
      $slug .= "-" . time();
    }

    $category = PortfolioCategory::create([
      'title' => $title,
      'slug' => $slug,
    ]);

    $validatedData['category_id'] = $category->id;
    return $validatedData;
  }

  private function saveImage($request, $validatedData, $portfolioProject = null)
  {
    $isDeleteThumbnail = $request->thumbnail == 'delete';

    if ($request->file('thumbnail')) {
      $fileExt = $request->file('thumbnail')->getClientOriginalExtension();
      $fileName = "thumbnail_" . strtolower($validatedData['slug']) . time() . ".$fileExt";
      $file = Storage::disk('public')->putFileAs('image', $request->file('thumbnail'), $fileName);
      if (!$file)
        redirect()->back()->with('error', 'Gagal upload file');
      $validatedData['thumbnail'] = "/storage/$file";
    } else {
      unset($validatedData['thumbnail']);
    }

    if ($isDeleteThumbnail) {
      if (isset($portfolioProject) && Storage::disk('public')->exists(substr($portfolioProject->thumbnail, 9))) {
        Storage::disk('public')->delete(substr($portfolioProject->thumbnail, 9));
      }
      $validatedData['thumbnail'] = null;
    }

    return $validatedData;
  }

  private function savePortfolioImage($request, $portfolioProject)
  {
    $sliderImages = $request->file('images');

    $latestImage = collect($request->images)->pluck('id')->whereNotNull()->toArray();
    $portfolioImage = PortfolioImage::where('portfolio_project_id', $portfolioProject->id)->where('type', 'slider')->whereNotIn('id', $latestImage)->get();

    if ($portfolioImage->isNotEmpty()) {
      foreach ($portfolioImage as $image) {
        if (Storage::disk('public')->exists(substr($image->value, 9))) {
          Storage::disk('public')->delete(substr($image->value, 9));
        }
        $image->delete();
      }
    }

    if (!$sliderImages)
      return;
    if (!empty($sliderImages)) {
      foreach ($sliderImages as $image) {
        $file = Storage::disk('public')->put('image', $image);
        if (!$file)
          redirect()->back()->with('error', 'Gagal upload file');

        if (!isset($image->id)) {
          PortfolioImage::create([
            'user_id' => auth()->id(),
            'portfolio_project_id' => $portfolioProject->id,
            'type' => 'slider',
            'label' => $image->getClientOriginalName(),
            'value' => "/storage/$file"
          ]);
        }
      }
    }
  }
}
