<?php

namespace App\Models;

use App\Models\Traits\HasCourse;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubmissionAnswer extends Model
{
    use HasFactory, Filterable, HasCourse;
    protected $guarded = [];

    public function quizSubmission(): BelongsTo
    {
        return $this->belongsTo(\App\Models\QuizSubmission::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Question::class);
    }

    public function answer(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Answer::class);
    }
}
