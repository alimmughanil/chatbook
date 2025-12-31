<?php

namespace App\Models\Traits;

use App\Enums\UserType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Builder;

trait FilterRole
{
  public function scopeFilterRole(Builder $query): Builder
  {
    $tableName = $query->getModel()->getTable();
    $isUserId = Schema::hasColumn($tableName, 'user_id');

    if (in_array(auth()->user()->role, [UserType::Editor]) && $isUserId) {
      $user = auth()->user();
      $query->where("$tableName.user_id", $user->id);
    }

    return $query;
  }
}
