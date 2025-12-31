<?php

namespace App\Models;

use App\Enums\AttachmentContentType;
use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    public function module(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Module::class);
    }

    public function quiz(): HasOne
    {
        return $this->hasOne(\App\Models\Quiz::class);
    }
    public function quizzes(): HasMany
    {
        return $this->hasMany(\App\Models\Quiz::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(\App\Models\LessonProgress::class);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(\App\Models\Discussion::class);
    }
    public function attachment(): HasMany
    {
        return $this->hasMany(\App\Models\Attachment::class)->orderBy('order')->whereNot('content_type', AttachmentContentType::Link);
    }
    public function attachmentLink(): HasMany
    {
        return $this->hasMany(\App\Models\Attachment::class)->orderBy('order')->where('content_type', AttachmentContentType::Link);
    }
    public function course()
    {
        return $this->hasOneThrough(
          \App\Models\Course::class,   // model tujuan
          \App\Models\Module::class,   // model perantara
          'id',               // local key di tabel modules (id)
          'id',              // local key di tabel courses (id)
          'module_id',        // foreign key di tabel lessons
          'course_id'   // foreign key di tabel modules
        );
    }
}
