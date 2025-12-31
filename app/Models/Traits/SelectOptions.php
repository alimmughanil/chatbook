<?php

namespace App\Models\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait SelectOptions
{
  public function scopeSelectOptions(Builder $query, $id = "id", $label = "name"): Builder
  {
    $query->select("$id as value", "$label as label");
    return $query;
  }
}
