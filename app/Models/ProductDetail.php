<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductDetail extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = ['id'];

  public function product()
  {
    return $this->belongsTo(Product::class, 'product_id', 'id');
  }
  public function order()
  {
    return $this->belongsTo(Order::class, 'id', 'product_detail_id');
  }
}