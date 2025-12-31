<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Quiz::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(\App\Models\Answer::class);
    }

    public function submissionAnswers(): HasMany
    {
        return $this->hasMany(\App\Models\SubmissionAnswer::class,'question_id','id');
    }
}
