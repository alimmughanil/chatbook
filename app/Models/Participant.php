<?php

namespace App\Models;

use App\Utils\Helper;
use App\Models\Traits\Filterable;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Participant extends Model
{
  use HasFactory, Filterable;
  protected $guarded = [];

  public function user(): BelongsTo
  {
    return $this->belongsTo(\App\Models\User::class);
  }

  public function course(): BelongsTo
  {
    return $this->belongsTo(\App\Models\Course::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(\App\Models\Order::class);
  }
  public function submissions(): HasMany
  {
      return $this->hasMany(\App\Models\QuizSubmission::class);
  }

  public static function getParticipantNumber($course)
  {
    $formatNumber = $course->participant_format_number;
    $lastParticipant = DB::table("participants")->select("participant_number")->where('course_id', $course->id)->latest("id")->whereNotNull('participant_number')->first();
    $participantNumber = $course->participant_start_number;

    $extractCode = Helper::extractParticipantFormatNumber($lastParticipant?->participant_number ?? $participantNumber, $formatNumber);

    $placeholder = $extractCode?->placeholder ?? '';
    $lastCode = $extractCode?->number ?? null;
    $lastCode = $extractCode?->number ?? null;
    $digits = $extractCode?->digits ?? 1;

    if ($lastParticipant) {
      if ($lastCode) {
        $lastCode = intval($lastCode);
        $participantNumber = $lastCode + 1;
      } else {
        $participantNumber = intval($participantNumber);
      }
    }

    $participantNumber = str_pad($participantNumber, $digits, '0', STR_PAD_LEFT);
    $participantNumber = str_replace($placeholder, $participantNumber, $formatNumber);

    return $participantNumber;
  }
  public function participantCertificates()
  {
      return $this->hasMany(\App\Models\ParticipantCertificate::class);
  }
}
