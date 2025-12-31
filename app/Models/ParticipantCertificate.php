<?php

namespace App\Models;

use App\Models\Certificate;
use Illuminate\Support\Facades\DB;
use App\Enums\ParticipantStatusType;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ParticipantCertificateStatusType;

class ParticipantCertificate extends Model
{
  protected $guarded = [];
  public function user()
  {
    return $this->belongsTo(\App\Models\User::class);
  }

  public function course()
  {
    return $this->belongsTo(\App\Models\Course::class);
  }

  public function certificate()
  {
    return $this->belongsTo(Certificate::class);
  }

  public function participant()
  {
    return $this->belongsTo(\App\Models\Participant::class);
  }

  public function updateCertificate(Certificate $certificate)
  {
    $courses = Course::where('user_id', $certificate->user_id)
      ->when(!empty($certificate->course_id), fn($q) => ($q->where('id', $certificate->course_id)))
      ->when(empty($certificate->course_id), fn($q) => ($q->doesntHave('certificate')))
      ->whereRelation('participants', 'status', ParticipantStatusType::Completed)
      ->get();

    if ($courses->isEmpty())
      return;

    $status = $certificate->status == 'publish' ? ParticipantCertificateStatusType::Active : ParticipantCertificateStatusType::Inactive;
    $updateQuery = DB::table($this->getTable());
    
    $courseIds = $courses->pluck('id');
    $chunks = $courseIds->chunk(1000);
    foreach ($chunks as $chunk) {
      $updateQuery->whereIn('course_id', $chunk)->update([
        'certificate_id' => $certificate->id,
        'status' => $status
      ]);
    }
  }
}
