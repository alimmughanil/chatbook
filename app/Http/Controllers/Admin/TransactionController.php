<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TransactionType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TransactionController extends BaseResourceController
{
  protected $model = Transaction::class;

  protected array $page = [
    "label" => "Transaksi",
    "name" => "transaction",
    "url" => "/admin/transactions",
    "inertia" => "Transaction"
  ];

  public function webhook(Request $request, $phone)
  {
    $user = User::where('phone', $phone)->first();
    if (!$user) {
      return response()->json(['message' => 'User not found'], 404);
    }

    $data = $request->all();
    if (!is_array($data)) {
      return response()->json(['message' => 'Invalid data format'], 400);
    }

    DB::beginTransaction();
    try {
      foreach ($data as $item) {
        $amount = isset($item['Total']) ? (int) preg_replace('/[^0-9]/', '', $item['Total']) : 0;
        $items = isset($item['Items']) ? explode(',', $item['Items']) : [];

        // convert "8:47:43" and "2025-12-30" to date handling if needed, 
        // but for now relying on "Tanggal Struk" or "Tanggal Input" if struk is empty
        $date = $item['Tanggal Struk'] ?? $item['Tanggal Input'] ?? date('Y-m-d');

        Transaction::create([
          'user_id' => $user->id,
          'category_id' => null, // Needs manual categorization later
          'type' => TransactionType::Expense,
          'amount' => $amount,
          'date' => $date,
          'shop_name' => $item['Toko'] ?? null,
          'items' => $items,
          'description' => 'Imported via webhook',
        ]);
      }
      DB::commit();
      return response()->json(['message' => 'Data imported successfully']);
    } catch (\Throwable $th) {
      DB::rollBack();
      Log::error("Webhook Error: " . $th->getMessage());
      return response()->json(['message' => 'Failed to import data', 'error' => $th->getMessage()], 500);
    }
  }

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
