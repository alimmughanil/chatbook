<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Utils\Helper;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Models\LessonProgress;
use App\Enums\LessonProgressStatusType;
use App\Enums\SubmissionGradeResultType;
use App\Http\Controllers\Traits\LoadsCourseData;
use App\Http\Controllers\Core\BaseResourceController;

class ModuleController extends BaseResourceController
{
  use LoadsCourseData;
  protected $model = Module::class;

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

  public function index(Request $request)
  {
    $course = $this->course;
    $course->load('modules.lessons');
    $lesson_id = $request->query('lesson') ? base64_decode($request->query('lesson')) : null;

    if (!$lesson_id)
      return $this->redirectActivedLesson($course);

    $lesson = Lesson::with([
      'module',
      'attachment',
      'attachmentLink',
      'quizzes.submissions' => function ($query) {
        $query->select('grade_status', 'status', 'user_id', 'id', 'quiz_id')
          ->where('grade_status', SubmissionGradeResultType::Passed)
          ->where('user_id', auth()->id());
      }
    ])->where('id', $lesson_id)->first();

    if (!$lesson)
      return $this->redirectActivedLesson($course);

    $lessonProgress = LessonProgress::select("lesson_id", "status")
      ->where('user_id', auth()->id())
      ->where('course_id', $course->id)
      ->get()
      ->keyBy('lesson_id');

    $lesson->status = isset($lessonProgress[$lesson->id]) ? $lessonProgress[$lesson->id]->status : LessonProgressStatusType::Lock;

    if ($lesson->status == LessonProgressStatusType::Lock) {
      return $this->redirectActivedLesson($course, url()->current(), 'error', "Selesaikan materi ini terlebih dahulu untuk membuka materi selanjutnya");
    }

    $description = $lesson->description;
    if (!$description) {
      $description = $course->description ? strip_tags($course->description) : null;
    }

    $meta = [
      'title' => "$lesson?->title - $course?->title - " . config('app.name'),
      'description' => $description,
      'image' => $course->thumbnail ?? null,
    ];

    $participant = Participant::where('user_id', auth()->id())->latest()->first();

    $data = [
      'title' => $meta['title'],
      'course' => $course,
      'lesson' => $lesson,
      'schema' => \App\Utils\SchemaJson::getSchema($course->id, 'course'),
      'phoneNumber' => $phoneNumber ?? null,
      'meta' => $meta,
      'participant' => $participant,
      'lessonProgress' => $lessonProgress,
      'page' => $this->getPage($request)
    ];

    return Inertia::render('User/Course/Module/Index', $data);
  }

  public function redirectActivedLesson($course, $redirectUrl = null, $flashKey = '', $message = '')
  {
    if (!$redirectUrl) {
      $redirectUrl = url()->current();
    }

    $baseFieldValues = [
      "course_id" => $course->id,
      "user_id" => auth()->id(),
    ];
    $lastProgress = LessonProgress::where([
      ...$baseFieldValues,
      "status" => LessonProgressStatusType::Current
    ])->orderByDesc('id')->first();

    if (!$lastProgress) {
      $lastProgress = LessonProgress::where([
        ...$baseFieldValues,
        "status" => LessonProgressStatusType::Completed
      ])->orderByDesc('id')->first();
    }

    if (!$lastProgress) {
      $firstLesson = $course->lessons()->orderBy('order', 'asc')->first();
      LessonProgress::create(
        [
          ...$baseFieldValues,
          "lesson_id" => $firstLesson->id,
          "status" => LessonProgressStatusType::Current
        ]
      );
      return redirect($redirectUrl . "?lesson=" . base64_encode($firstLesson->id))->with($flashKey, $message);
    }

    return redirect($redirectUrl . "?lesson=" . base64_encode($lastProgress?->lesson_id))->with($flashKey, $message);
  }

  protected function getPage(Request $request, $id = null): array
  {
    $courseSlug = $this->courseSlug;

    $page = [
      "name" => "module",
      "inertia" => "User/Course/Module",
      "label" => "Modul",
      "url" => "/course/{$courseSlug}/modules",
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
