<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonProgress extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    protected $table = 'lesson_progress';

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Lesson::class);
    }
    public function course(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Course::class);
    }
}
