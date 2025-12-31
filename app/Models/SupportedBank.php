<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SupportedBank extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = ['id'];

  public function bank()
  {
    return $this->hasMany(Bank::class, 'supported_bank_id', 'id');
  }
}
