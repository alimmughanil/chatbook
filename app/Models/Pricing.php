<?php

namespace App\Models;

use App\Models\Tag;
use App\Models\PricingTag;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pricing extends Model
{
  use HasFactory, SoftDeletes, Filterable;
  protected $guarded = ['id'];

  public function pricingTag()
  {
    return $this->hasMany(PricingTag::class, 'pricing_id', 'id');
  }

  public function tags()
  {
    return $this->hasManyThrough(Tag::class, PricingTag::class, 'pricing_id', 'id', 'id', 'tag_id');
  }
}
