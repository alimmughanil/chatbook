<?php

namespace App\Models;

use App\Models\User;
use App\Models\Withdraw;
use App\Models\SupportedBank;
use App\Models\Traits\Filterable;
use App\Models\Traits\FilterRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bank extends Model
{
  use HasFactory, SoftDeletes, Filterable, FilterRole;
  protected $guarded = ['id'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function withdraw()
  {
    return $this->belongsTo(Withdraw::class);
  }
  public function supportedBank()
  {
    return $this->belongsTo(SupportedBank::class);
  }
}
