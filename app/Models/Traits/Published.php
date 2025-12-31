<?php

namespace App\Models\Traits;

use App\Enums\PublishStatusType;
use Illuminate\Database\Eloquent\Builder;

trait Published
{
  public function scopePublished(Builder $query): Builder
  {
    $query->where('status', PublishStatusType::Publish);
    return $query;
  }
}
