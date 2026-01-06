<?php

namespace App\Http\Controllers\User\Dashboard;

use App\Enums\TransactionType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends BaseResourceController
{
  protected $model = Transaction::class;

  protected function indexQuery($query, $request)
  {
    $query->where('user_id', auth()->id())->with(['category']);
    return $query;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "date" => "required|date",
        "type" => "required|in:" . implode(',', TransactionType::getValues()),
        "category_id" => "nullable",
        "amount" => "required|numeric",
        "description" => "nullable|string",
        "shop_name" => "nullable|string",
        "items" => "nullable|array"
      ],
      "default" => [
        "type" => TransactionType::Expense
      ],
    ];
  }

  protected function getPage($request, $id = null): array
  {
    return [
      "label" => "Transaksi Saya",
      "name" => "transactions",
      "url" => "/app/transactions",
      "inertia" => "User/Transaction", // This points to resources/js/Pages/User/Transaction
      "fields" => \App\Utils\Helper::getFormFields($this->validation($request)),
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    return [
      "page" => $this->page,
      "typeOptions" => TransactionType::getValues(),
      "categoryOptions" => Category::all()->map(function ($category) {
        return [
          "label" => $category->name,
          "value" => $category->id
        ];
      }),
    ];
  }

  public function index(Request $request)
  {
    // Calculate Summary
    $summaryQuery = $this->model::where('user_id', auth()->id());

    // Apply filters if needed, or keep it global? usually reports on index are global or based on filter.
    // Let's make it based on current filter for better UX (if user filters by month, show stats for that month).
    // The current indexQuery applies filters from specific columns via `selectParams` in BaseResourceController,
    // but `indexQuery` in TransactionController only adds user_id scope.
    // To match the list, we should probably apply same filters.
    // However, BaseResourceController::index logic separates pagination from query building.

    $summaryQuery = $this->indexQuery($summaryQuery, $request);
    $useFilterable = in_array(\App\Models\Traits\Filterable::class, class_uses_recursive($this->model));
    if ($useFilterable) {
      $summaryQuery = $summaryQuery->filter($request);
    }

    $transactions = $summaryQuery->get();

    $totalIncome = $transactions->where('type.value', TransactionType::Income)->sum('amount');
    $totalExpense = $transactions->where('type.value', TransactionType::Expense)->sum('amount');

    // Averages (using all data in view scope)
    $firstDate = $transactions->min('date');
    $days = $firstDate ? max(1, now()->diffInDays($firstDate)) : 1;
    $weeks = max(1, $days / 7);
    $months = max(1, $days / 30);

    $avgDailyExpense = $totalExpense > 0 ? $totalExpense / $days : 0;
    $avgWeeklyExpense = $totalExpense > 0 ? $totalExpense / $weeks : 0;
    $avgMonthlyExpense = $totalExpense > 0 ? $totalExpense / $months : 0;

    // Max Values
    $maxExpense = $transactions->where('type.value', TransactionType::Expense)->sortByDesc('amount')->first();
    $maxIncome = $transactions->where('type.value', TransactionType::Income)->sortByDesc('amount')->first();

    // Category with most expense
    $favoriteCategory = $transactions->where('type.value', TransactionType::Expense)
      ->groupBy('category_id')
      ->map(fn($row) => ['sum' => $row->sum('amount'), 'category' => $row->first()->category])
      ->sortByDesc('sum')
      ->first();

    $summary = [
      'total_income' => $totalIncome,
      'total_expense' => $totalExpense,
      'avg_daily_expense' => $avgDailyExpense,
      'avg_weekly_expense' => $avgWeeklyExpense,
      'avg_monthly_expense' => $avgMonthlyExpense,
      'max_expense' => $maxExpense,
      'max_income' => $maxIncome,
      'max_expense_category' => $favoriteCategory ? $favoriteCategory['category'] : null,
      'max_expense_category_amount' => $favoriteCategory ? $favoriteCategory['sum'] : 0,
    ];

    // Pagination for List
    $query = $this->model::query();
    $query = $this->indexQuery($query, $request);
    if ($useFilterable) {
      $query = $query->filter($request);
    }
    $query->orderBy('date', 'desc')->orderBy('created_at', 'desc');
    $data = $query->paginate(10)->onEachSide(1);

    return Inertia::render($this->page['inertia'] . '/Index', [
      'transactions' => $data,
      'summary' => $summary,
      'filters' => $request->all(['search', 'type', 'category_id']),
      'page' => $this->page,
      ...$this->getFormData($request),
    ]);
  }

  public function show($id, Request $request)
  {
    $data = $this->model::where('user_id', auth()->id())->findOrFail($id);

    return Inertia::render($this->page['inertia'] . '/Show', [
      'transaction' => $data,
      'page' => $this->page,
    ]);
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData['user_id'] = auth()->id();
    return $validatedData;
  }
}
