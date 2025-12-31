<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizSubmission extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
    public function participant(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Participant::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Quiz::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(\App\Models\SubmissionAnswer::class, 'quiz_submission_id');
    }
}
