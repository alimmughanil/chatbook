<?php

namespace App\Http\Controllers\Admin;

use App\Models\PortfolioCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Core\BaseResourceController;
use App\Utils\Helper;

class PortfolioCategoryController extends BaseResourceController
{
  protected $model = PortfolioCategory::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "portfolio_category",
      "inertia" => "Admin/PortfolioCategory",
      "label" => "Kategori Portofolio",
      "url" => "/admin/portfolio/category",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    return $query->orderBy('created_at', 'DESC');
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'name' => 'required',
        'slug' => 'required|unique:' . PortfolioCategory::class . ',slug,' . $id,
        'icon' => 'nullable',
        'description' => 'nullable',
      ],
      "default" => []
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData['slug'] = str_replace(' ', '-', strtolower($validatedData['slug']));
    $validatedData['slug'] = preg_replace('/[^A-Za-z0-9-]/', '', $validatedData['slug']);

    return $validatedData;
  }
}
