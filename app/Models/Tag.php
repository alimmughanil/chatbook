<?php

namespace App\Models;

use App\Models\ProductTag;
use App\Models\Traits\SelectOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
  use HasFactory, SoftDeletes, SelectOptions;
  protected $guarded = ['id'];

  public function productTag()
  {
    return $this->hasMany(ProductTag::class, 'tag_id', 'id');
  }
}
