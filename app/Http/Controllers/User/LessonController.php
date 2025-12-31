<?php

namespace App\Http\Controllers\User;

use App\Enums\SubmissionGradeResultType;
use App\Enums\UserType;
use App\Models\User;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\Certificate;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\LessonProgress;
use Illuminate\Support\Facades\DB;
use App\Enums\ParticipantStatusType;
use App\Models\ParticipantCertificate;
use App\Enums\LessonProgressStatusType;
use App\Enums\ParticipantCertificateStatusType;
use App\Http\Controllers\Traits\LoadsCourseData;
use App\Http\Controllers\Core\BaseResourceController;

class LessonController extends BaseResourceController
{
  use LoadsCourseData;
  protected $model = Lesson::class;

  public function __construct()
  {
    $this->middleware(function (Request $request, $next) {
      if ($redirect = $this->loadCourseData($request)) {
        return $redirect;
      }

      $this->page = $this->getPage($request);
      return $next($request);
    });
  }

  public function update($id, Request $request)
  {
    $id = $request->route()->parameter('lesson');
    $id = base64_decode($id);

    $lesson = Lesson::with([
      'module',
      'quizzes.submissions' => function ($query) {
        $query->select('grade_status', 'status', 'user_id', 'id', 'quiz_id')
          ->where('grade_status', SubmissionGradeResultType::Passed)
          ->where('user_id', auth()->id());
      }
    ])->where('id', $id)->first();

    if (!$lesson) {
      return Helper::redirectBack("error", "Data {$this->page["label"]} tidak ditemukan");
    }

    DB::beginTransaction();
    try {
      $quizzes = $lesson->quizzes;
      if ($quizzes->isNotEmpty()) {
        $allSubmitted = $quizzes->every(function ($quiz) {
          return $quiz->submissions->isNotEmpty();
        });

        if (!$allSubmitted) {
          return back()->with('error', 'Anda belum menyelesaikan semua kuis pada materi ini atau belum dinilai');
        }
      }

      $baseFieldValues = [
        "user_id" => auth()->id(),
        "course_id" => $this->course->id,
      ];

      LessonProgress::where([...$baseFieldValues, "lesson_id" => $lesson->id])->update(
        [
          "status" => LessonProgressStatusType::Completed,
        ]
      );

      $lessons = $this->course->lessons()->get();

      $lessonProgress = LessonProgress::select("lesson_id", "status")
        ->where('user_id', auth()->id())
        ->whereIn('status', [LessonProgressStatusType::Completed, LessonProgressStatusType::Current])
        ->get()
        ->keyBy('lesson_id');

      $lessons->each(function ($lesson) use ($lessonProgress) {
        $lesson->status = isset($lessonProgress[$lesson->id]) ? $lessonProgress[$lesson->id]->status : LessonProgressStatusType::Lock;
      });

      $nextLesson = $lessons->firstWhere('status', LessonProgressStatusType::Lock);
      if ($nextLesson) {
        $currentProgress = LessonProgress::where([...$baseFieldValues, "lesson_id" => $nextLesson->id])->first();
        if ($currentProgress) {
          $currentProgress->status = LessonProgressStatusType::Current;
          $currentProgress->save();
        } else {
          LessonProgress::create(
            [
              ...$baseFieldValues,
              "lesson_id" => $nextLesson->id,
              "status" => LessonProgressStatusType::Current
            ]
          );
        }
      }

      $completedLessons = $lessons->where('status', LessonProgressStatusType::Completed);
      $isCompleted = $completedLessons->count() == $lessons->count();
      $isCertificateCourse = false;

      if ($isCompleted) {
        $participant = Participant::where('user_id', auth()->id())->where('course_id', $this->course->id)->first();
        $participant->status = ParticipantStatusType::Completed;
        $participant->save();

        $coursePublisher = User::where('id', $this->course->user_id)->first();
        $certificate = Certificate::published()
          ->when(in_array($coursePublisher->role, [UserType::Partner]), function ($query) {
            $query->where('user_id', $this->course->user_id);
          })
          ->where('course_id', $this->course->id)
          ->first();

        if (!$certificate) {
          $certificate = Certificate::published()
            ->when(in_array($coursePublisher->role, [UserType::Partner]), function ($query) {
              $query->where('user_id', $this->course->user_id);
            })
            ->where('is_default', 1)
            ->first();
        }

        $isCertificateCourse = $certificate ? true : false;
        ParticipantCertificate::create([
          'user_id' => auth()->id(),
          'participant_id' => $participant->id,
          'course_id' => $this->course->id,
          'certificate_id' => $certificate?->id ?? null,
          'status' => $isCertificateCourse ? ParticipantCertificateStatusType::Active : ParticipantCertificateStatusType::Pending,
        ]);

        $enrollment = Enrollment::where(['user_id' => auth()->id(), 'course_id' => $this->course->id])->first();
        $enrollment->completed_at = now();
        $enrollment->save();
      }

      $redirectUrl = route("app.module.index", $this->course->slug);
      $message = "Selamat! Anda melanjutkan ke pelajaran berikutnya.";

      if ($isCompleted) {
        $message = "Selamat! Anda telah menyelesaikan semua pelajaran dalam kursus ini.";

        if ($isCertificateCourse) {
          $message .= " Anda dapat melihat sertifikat di menu Sertifikat Saya.";
        }
      }

      DB::commit();
      return (new ModuleController())->redirectActivedLesson($this->course, $redirectUrl, "success", $message);
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }

      return back()->with("error", "Pelajaran gagal diselesaikan, silahkan hubungi Admin untuk informasi lebih lanjut.");
    }
  }

  protected function getPage(Request $request, $id = null): array
  {
    $courseSlug = $this->courseSlug;

    $page = [
      "name" => "lesson",
      "inertia" => "User/Course/Lesson",
      "label" => "Pelajaran",
      "url" => "/course/{$courseSlug}/lesson",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [],
      "default" => [],
    ];
  }
}
