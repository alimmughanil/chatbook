<?php

namespace App\Http\Controllers\User;

use App\Enums\CoursePaymentType;
use App\Enums\CourseTimeLimitType;
use App\Enums\LessonProgressStatusType;
use App\Enums\OrderType;
use App\Http\Services\Payment\Duitku\OrderService;
use App\Models\LessonProgress;
use App\Models\Payment;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Models\Course;
use App\Utils\SchemaJson;
use App\Models\Enrollment;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Enums\LessonContentType;
use App\Enums\PublishStatusType;
use Illuminate\Support\Facades\DB;
use App\Enums\ParticipantStatusType;
use App\Http\Controllers\User\CourseController;
use App\Http\Controllers\Core\BaseResourceController;

class CourseRegistrationController extends BaseResourceController
{
  protected $model = Participant::class;
  protected $courseSlug = null;
  protected $course = null;
  protected $enrollment = null;

  public function __construct()
  {
    $this->middleware(function (Request $request, $next) {
      $selectCourseColumn = (new CourseController())->baseSelectedColumn;
      $this->courseSlug = $request->route()->parameter('course_slug');
      $this->course = Course::where('slug', $this->courseSlug)
        ->select([...$selectCourseColumn, 'description', 'participant_start_number', 'participant_format_number'])
        ->withSum(['lessons as total_duration_seconds' => fn($q) => $q->whereNotNull('duration_seconds')], 'duration_seconds')
        ->withSum(['lessons as total_duration_seconds' => fn($q) => $q->whereNotNull('duration_seconds')], 'duration_seconds')
        ->withCount(['lessons as total_video_lessons' => fn($query) => $query->where('content_type', LessonContentType::Video)])
        ->withCount(['lessons as total_exam_lessons' => fn($query) => $query->where('content_type', LessonContentType::Exam)])
        ->withCount(['lessons as total_quiz_lessons' => fn($query) => $query->withCount('quizzes')])
        ->where('status', PublishStatusType::Publish)
        ->first();

      if (!$this->course)
        return redirect(route("app.course.index"))->with('error', 'Kursus tidak ditemukan');

      $this->enrollment = Enrollment::where(['user_id' => auth()->id(), "course_id" => $this->course->id])->first();
      if ($this->enrollment) {
        $moduleUrl = route("app.module.index", $this->course->slug);
        return redirect($moduleUrl)->with('success', 'Anda sudah terdaftar untuk kursus ini');
      }

      $this->page = $this->getPage($request);
      return $next($request);
    });
  }

  public function index(Request $request)
  {
    $course = $this->course;
    $course->registration_countdown = null;
    if (!$course->isRegistrationOpen()) {
      $course->registration_countdown = $course->registrationCountdown()?->totalSeconds ?? null;
    }

    $meta = [
      'title' => $course->title,
      'description' => $course->description ? strip_tags($course->description) : null,
      'image' => $course->cover ?? null,
    ];

    $participant = Participant::where('user_id', auth()->id())->latest()->first();

    $data = [
      'title' => $course?->title ?? "Acara",
      'course' => $course,
      'schema' => SchemaJson::getSchema($course->id, 'course'),
      'phoneNumber' => $phoneNumber ?? null,
      'meta' => $meta,
      'participant' => $participant,
      'page' => $this->getPage($request)
    ];

    return Inertia::render('User/Course/Registration/Index', $data);
  }

  public function store(Request $request)
  {
    $course = $this->course;
    if (!$course)
      return redirect()->back()->with('error', 'Kursus tidak ditemukan');

    if ($course->isRegistrationOpen()) {
      $remaining = $course->registrationCountdown();
      if ($remaining && $remaining->totalSeconds > 0) {
        return back()->with('error', "Pendaftaran dibuka dalam: \n {$remaining->forHumans()}");
      }

      return back()->with('error', 'Pendaftaran kursus tidak tersedia.');
    }

    $validation = $this->validation($request)["validation"];
    $validated = $request->validate($validation);

    $orderResponse = null;

    DB::beginTransaction();
    try {
      $validated = $this->beforeSave($validated, $request);
      $modelClass = $this->model;
      $participant = $modelClass::create($validated);

      $redirectUrl = route("app.module.index", $this->course->slug);
      $lesson = $this->course->lessons()->first();
      $redirectUrl .= "?lesson=" . base64_encode($lesson->id);


      $isFree = $this->course->price == 0 || $this->course->payment_type == CoursePaymentType::Free;
      if ($isFree) {
        $this->setActivationRegister($participant);
      }

      if (!$isFree) {
        $orderResponse = (new OrderService())->createOrder($course, OrderType::CourseRegistration, $participant);
      }

      DB::commit();

      if (is_string($orderResponse) && !empty($orderResponse) && filter_var($orderResponse, FILTER_VALIDATE_URL)) {
        return Inertia::location($orderResponse);
      }

      if ($orderResponse && $orderResponse instanceof \Illuminate\Http\RedirectResponse) {
        return $orderResponse;
      }

      return redirect($redirectUrl)->with("success", "Pendaftaran kursus berhasil");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }

      if ($orderResponse && $orderResponse instanceof \Illuminate\Http\RedirectResponse) {
        return $orderResponse;
      }
      return back()->with("error", "Pendaftaran kursus gagal, silahkan hubungi Admin untuk informasi lebih lanjut.");
    }
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $course = $this->course;

    $validatedData['user_id'] = auth()->id();
    $validatedData['course_id'] = $course->id;
    $validatedData['status'] = ParticipantStatusType::Pending;

    return $validatedData;
  }

  public function setActivationRegister($participant)
  {
    $enrollmentData = [
      'user_id' => $participant->user_id,
      'course_id' => $participant->course_id,
      'enrolled_at' => now()
    ];

    Enrollment::create($enrollmentData);
    $course = Course::find($participant->course_id);

    $participant->status = ParticipantStatusType::Active;
    $participant->participant_number = Participant::getParticipantNumber($course);
    $participant->save();

    $lesson = $course->lessons()->first();

    LessonProgress::create([
      'user_id' => $participant->user_id,
      'lesson_id' => $lesson->id,
      'course_id' => $course->id,
      'status' => LessonProgressStatusType::Current
    ]);
  }

  protected function getPage(Request $request, $id = null): array
  {
    $courseSlug = $this->courseSlug;

    $page = [
      "name" => "participants",
      "inertia" => "User/Course/Registration",
      "label" => "Peserta",
      "url" => "/course/{$courseSlug}/registration",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        "name" => "required|string|max:255",
        "email" => "required|string|email|max:255",
        "phone" => "required|string|max:255",
        "institute" => "nullable|string|max:255",
        "job_title" => "nullable|string|max:255",
        "branch" => "nullable|string|max:255",
      ],
      "default" => [],
    ];
  }
}
