<?php

namespace App\Models;

use Illuminate\Http\Request;
use App\Models\Traits\Filterable;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
  use Filterable, SoftDeletes;
  protected $guarded = ['id'];

  public function medicalRecord()
  {
    return $this->hasMany(\App\Models\MedicalRecord::class, 'doctor_id', 'id');
  }

  public function scopeActive(Builder $query, Request $request = null)
  {

    if (!$request) {
      $request = request();
    }
    $doctorId = $request->cookie('doctor_id');

    $query->where('id', $doctorId);
    return $query;
  }
}
