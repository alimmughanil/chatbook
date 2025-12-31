<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TransactionType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends BaseResourceController
{
  protected $model = Transaction::class;

  protected array $page = [
    "label" => "Transaksi",
    "name" => "transaction",
    "url" => "/admin/transactions",
    "inertia" => "Transaction"
  ];

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "date" => "required|date",
        "type" => "required|in:" . implode(',', TransactionType::getValues()),
        "category_id" => "required|exists:categories,id",
        "amount" => "required|numeric",
        "description" => "nullable|string",
        "shop_name" => "nullable|string",
        "items" => "nullable|array"
      ]
    ];
  }

  protected function getPage(Request $request, $id = null): array
  {
    return $this->page;
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [
      "page" => $this->page,
      "isAdmin" => $this->isAdmin,
      "typeOptions" => TransactionType::asSelectArray(),
      "categoryOptions" => Category::all()->map(function ($category) {
        return [
          "label" => $category->name,
          "value" => $category->id
        ];
      }),
    ];
  }
}
