<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
  use Filterable, SoftDeletes;
  protected $guarded = ['id'];

  public function medicalRecord()
  {
    return $this->hasMany(\App\Models\MedicalRecord::class, 'patient_id', 'id');
  }
}
