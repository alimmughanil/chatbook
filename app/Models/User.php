<?php

namespace App\Models;

use App\Enums\FeedbackType;
use App\Enums\OrderStatusType;
use App\Enums\PaymentStatusType;
use App\Models\Traits\Filterable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;
use App\Models\Traits\SelectOptions;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable, SoftDeletes, Filterable, SelectOptions;

  protected $fillable = [
    'name',
    'username',
    'email',
    'phone',
    'password',
    'role',
    'picture',
    'status'
  ];
  protected $hidden = [
    'password',
    'remember_token',
  ];

  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  public function profile(): HasOne
  {
    return $this->hasOne(\App\Models\Profile::class);
  }

  public function feedbacks(): HasMany
  {
    return $this->hasMany(\App\Models\Feedback::class);
  }
  public function comments()
  {
    return $this->feedbacks()->where('type', FeedbackType::Comment);
  }
  public function ratings()
  {
    return $this->feedbacks()->where('type', FeedbackType::Rating);
  }
  public function balance()
  {
    $select = [
      'wallets.user_id',
      DB::raw('SUM(wallets.debit) as debit_total'),
      DB::raw('SUM(wallets.credit) as credit_total'),
    ];

    return $this->hasMany(\App\Models\Wallet::class, 'user_id', 'id')->select($select);
  }

  public function wallet()
  {
    return $this->hasMany(\App\Models\Wallet::class, 'user_id', 'id');
  }

  public function withdraw()
  {
    return $this->hasMany(\App\Models\Withdraw::class, 'user_id', 'id');
  }
  public function product()
  {
    return $this->hasMany(Product::class, 'user_id', 'id');
  }
  public function productAssigned()
  {
    return $this->hasMany(Product::class, 'assigned_user_id', 'id');
  }
  public function order()
  {
    return $this->hasMany(Order::class, 'user_id', 'id');
  }
  public function workHistory()
  {
    return $this->belongsTo(WorkHistory::class);
  }

  public function portfolioProject()
  {
    return $this->hasMany(PortfolioProject::class, 'client_id', 'id');
  }

  public function scopePartner($query)
  {
    return $query->where('role', 'partner');
  }

  public function scopeAdminPartner($query)
  {
    return $query->whereIn('role', ['admin', 'partner']);
  }
  public function productRating()
  {
    $feedbackTable = (new \App\Models\Feedback)->getTable();

    return $this->hasManyThrough(
      \App\Models\Feedback::class,
      \App\Models\Product::class,
      'user_id',
      'product_id',
      'id',
      'id'
    )->where($feedbackTable . '.type', FeedbackType::Rating);
  }
  public function successOrder()
  {
    return $this->hasManyThrough(
      \App\Models\Order::class,
      \App\Models\Product::class,
      'user_id',
      'product_id',
      'id',
      'id'
    )->where('orders.status', OrderStatusType::Success);
  }
  public function incomingOrder()
  {
    return $this->hasManyThrough(
      \App\Models\Order::class,
      \App\Models\Product::class,
      'user_id',
      'product_id',
      'id',
      'id'
    )->where(function ($query) {
      $query->whereIn('orders.status', [OrderStatusType::Processing, OrderStatusType::Success])
        ->orWhere(function ($subQuery) {
          $subQuery->where('orders.status', OrderStatusType::Cancel)
            ->whereHas('payment', function ($p) {
              $p->whereIn('payments.status', [
                PaymentStatusType::Paid,
                PaymentStatusType::Refund
              ]);
            });
        });
    });
  }
}
