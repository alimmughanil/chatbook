<?php

namespace App\Models\Traits;

use App\Utils\Helper;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

trait Filterable
{
  public function scopeFilter(Builder $query, Request $request, $defaultSearchBy = "name"): Builder
  {
    $tableName = $query->getModel()->getTable();

    $query->when($request->filled("q"), function ($q) use ($request, $defaultSearchBy) {
      $searchQuery = urldecode($request->q);
      $searchBy = $request->input("searchBy", $defaultSearchBy);
      Helper::getSearch($q, $searchBy, $searchQuery,);
    });

    $query->when($request->filled("startDate"), function ($q) use ($request, $tableName) {
      $searchBy = $request->input("searchBy", "created_at");
      Helper::getSearchDate($q, $searchBy, $request);
    });

    $query->when($request->filled("sort"), function ($q) use ($request) {
      $sortBy = $request->input("sort", "id");
      $sortDirection = $request->input("sortDirection", "asc");
      Helper::getSort($q, $sortBy, $sortDirection);
    });

    $query->when(!$request->filled("sort"), function ($q) use($query, $tableName) {
      $column = $query->getModel()->getUpdatedAtColumn() ?? $query->getModel()->getKeyName();
      $q->orderBy("$tableName.$column", 'DESC');
    });

    $usesSoftDeletes = in_array(
        SoftDeletes::class,
        class_uses_recursive($query->getModel())
    );

    $query->when($usesSoftDeletes && $request->input('deleted_at') === 'show', function ($q) {
        $q->onlyTrashed();
    });

    return $query;
  }
}
