<?php

namespace App\Models;

use App\Models\User;
use App\Models\Order;
use App\Models\Withdraw;
use App\Models\Traits\FilterRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Wallet extends Model
{
  use HasFactory, FilterRole;
  protected $guarded = ['id'];

  public static function getUserBalance($user)
  {
    $user = $user->load(relations: 'balance');

    if ($user->balance->isEmpty()) return null;
    $balance = $user->balance?->first();
    $balance->debit_total = intval($balance->debit_total ?? 0);
    $balance->credit_total = intval($balance->credit_total ?? 0);
    $balance->credit_total -= $balance->debit_total;

    return $balance;
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function withdraw()   {
    return $this->hasOne(Withdraw::class, 'id', 'withdraw_id');
  }
  public function order()   {
    return $this->hasOne(Order::class, 'id', 'order_id');
  }
}
