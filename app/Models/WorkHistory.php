<?php

namespace App\Models;

use App\Models\User;
use App\Models\Order;
use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class WorkHistory extends Model
{
  use HasFactory, SoftDeletes;
  protected $guarded = ['id'];

  public function order()
  {
    return $this->belongsTo(Order::class);
  }
  public function attachment()
  {
    return $this->hasMany(Attachment::class, 'work_history_id', 'id');
  }
  public function user()
  {
    return $this->hasOne(User::class, 'id', 'user_id');
  }
}
