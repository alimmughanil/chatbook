<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Lesson::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(\App\Models\Question::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(\App\Models\QuizSubmission::class);
    }
}
