<?php

namespace App\Models;

use Carbon\CarbonInterval;
use App\Enums\FeedbackType;
use App\Models\Traits\Filterable;
use App\Models\Traits\FilterRole;
use App\Enums\CourseTimeLimitType;
use App\Models\Traits\SelectOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    use HasFactory, Filterable, SelectOptions, FilterRole;
    protected $guarded = [];

    protected $appends = ['total_assessment'];

    public function getTotalAssessmentAttribute()
    {
        return ($this->total_exam_lessons ?? 0) + ($this->total_quiz_lessons ?? 0);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Category::class)->withTrashed();
    }

    public function modules(): HasMany
    {
        return $this->hasMany(\App\Models\Module::class)->orderBy('order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(\App\Models\Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\User::class, 'enrollments')
            ->withTimestamps()
            ->withPivot('completed_at');
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(\App\Models\Feedback::class);
    }
    public function comments()
    {
        return $this->feedbacks()->where('type', FeedbackType::Comment);
    }
    public function ratings()
    {
        return $this->feedbacks()->where('type', FeedbackType::Rating);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(\App\Models\Discussion::class);
    }

    public function certificate(): HasMany
    {
        return $this->hasMany(\App\Models\Certificate::class);
    }

    public function participants(): HasMany
    {
        return $this->hasMany(\App\Models\Participant::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(\App\Models\Order::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(\App\Models\LessonProgress::class);
    }

    public function lessons()
    {
      return $this->hasManyThrough(
        \App\Models\Lesson::class,   // model tujuan
        \App\Models\Module::class,   // model perantara
        'course_id',     // foreign key di tabel modules
        'module_id',    // foreign key di tabel lessons
        'id',            // local key di courses
        'id'       // local key di modules
      )->orderBy('modules.order', 'asc')->orderBy('lessons.order', 'asc');
    }
    public function participantCertificates()
    {
        return $this->hasMany(\App\Models\ParticipantCertificate::class);
    }

    public function isRegistrationOpen(): bool
    {
        // Jika tidak ada time limit → selalu terbuka
        if ($this->time_limit !== CourseTimeLimitType::Limited) {
            return true;
        }

        // Jika start_at tidak ada → tidak logis membuka
        if (!$this->registration_start_at) {
            return false;
        }

        // Jika sekarang melewati end_at → tertutup (jika end_at ada)
        if ($this->registration_end_at && now()->greaterThan($this->registration_end_at)) {
            return false;
        }

        // Jika sekarang sudah masuk window pendaftaran
        if (now()->greaterThanOrEqualTo($this->registration_start_at)) {
            return true;
        }

        return false;
    }
    public function registrationCountdown(): ?CarbonInterval
    {
        // Jika bukan kursus limited → tidak ada konsep waktu mulai
        if ($this->time_limit !== CourseTimeLimitType::Limited) {
            return null;
        }

        // Tidak bisa hitung jika start_at kosong
        if (!$this->registration_start_at) {
            return null;
        }

        // Jika sudah lewat, durasi = 0
        if (now()->greaterThanOrEqualTo($this->registration_start_at)) {
            return CarbonInterval::seconds(0);
        }

        // Hitung selisih
        return now()->diffAsCarbonInterval($this->registration_start_at);
    }
}
