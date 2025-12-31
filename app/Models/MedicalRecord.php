<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
  use Filterable;
  protected $guarded = ['id'];

  public function patient()
  {
    return $this->belongsTo(\App\Models\Patient::class, 'patient_id', 'id')->withTrashed();
  }
  public function doctor()
  {
    return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id', 'id')->withTrashed();
  }
  public function user()
  {
    return $this->belongsTo(\App\Models\User::class, 'user_id', 'id')->withTrashed();
  }
}
