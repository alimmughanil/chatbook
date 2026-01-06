<?php

namespace App\Models;

use App\Models\User;
use App\Models\Image;
use App\Models\Order;
use App\Models\Category;
use App\Models\ProductTag;
use App\Enums\FeedbackType;
use App\Models\ProductDetail;
use App\Models\Traits\Filterable;
use App\Models\Traits\FilterRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
  use HasFactory, SoftDeletes, Filterable, FilterRole;
  protected $guarded = ['id'];

  public function user()
  {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }
  public function order()
  {
    return $this->belongsTo(Order::class, 'id', 'product_id');
  }
  public function category()
  {
    return $this->belongsTo(Category::class, 'category_id', 'id');
  }
  public function image()
  {
    return $this->hasMany(Image::class, 'product_id', 'id');
  }
  // feedbacks removed
  // comments removed
  // ratings removed
}
