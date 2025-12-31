<?php

namespace App\Models;

use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Image extends Model
{
  use HasFactory;
  protected $guarded = ['id'];

  public function product()
  {
    return $this->belongsTo(Product::class, 'product_id', 'id');
  }
}
