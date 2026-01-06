<?php

namespace App\Models;

use App\Enums\FeedbackType;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
  use HasFactory, Filterable, SoftDeletes;
  protected $guarded = [];

  protected $casts = [
    'detail' => 'json',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(\App\Models\User::class);
  }
  public function payment()
  {
    return $this->hasOne(Payment::class, 'order_id', 'id');
  }
  public function refund()
  {
    return $this->hasOne(Refund::class, 'order_id', 'id');
  }
  public function product()
  {
    return $this->hasOne(Product::class, 'id', 'product_id')->withTrashed();
  }
  // productDetail removed
  // workHistory removed
  // lastWork removed
  // wallet removed
  // feedbacks removed
  // comments removed
  // ratings removed
}
