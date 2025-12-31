<?php

namespace App\Models;

use App\Models\Bank;
use App\Models\User;
use App\Models\Wallet;
use App\Models\Traits\Filterable;
use App\Models\Traits\FilterRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Withdraw extends Model
{
  use HasFactory, SoftDeletes, Filterable, FilterRole;
  protected $guarded = ['id'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
  public function bank()
  {
    return $this->hasOne(Bank::class, 'id', 'bank_id');
  }
  public function wallet()
  {
    return $this->belongsTo(Wallet::class);
  }
}
