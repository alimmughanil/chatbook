<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Utils\Helper;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Http\Request;
use App\Enums\ChatStatusType;
use App\Enums\VisibilityType;
use App\Models\Configuration;
use App\Enums\LessonContentType;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Controller;

class CourseController extends Controller
{
  public $baseSelectedColumn = ['id', 'title', 'slug', 'start_at', 'close_at', 'registration_start_at', 'registration_close_at', 'price', 'status', 'user_id', 'thumbnail', 'level', 'payment_type','time_limit'];
  public function index(Request $request, $filterData = [])
  {

    $category = null;
    $company = null;
    $course = Course::select($this->baseSelectedColumn)
      ->withCount('modules')
      ->when($request->has('q'), function ($query) use ($request): void {
        $searchQuery = urldecode($request->q);
        Helper::getSearch($query, 'title', $searchQuery);
      })
      ->when(isset($filterData['type']), function ($query) use ($filterData) {
        if ($filterData['type'] == 'category' && isset($filterData['data']['id'])) {
          $query->whereRelation('category', 'category_id', '=', $filterData['data']['id']);
        }

        if ($filterData['type'] == 'company' && isset($filterData['data']['id'])) {
          $query->where('user_id', $filterData['data']['id']);
        }
      })
      ->where('status', PublishStatusType::Publish)
      ->orderByDesc('start_at')
      ->paginate(20);

    $course = collect($course);
    if (isset($filterData['type']) && $filterData['type'] == 'category' && isset($filterData['data']['id'])) {
      $category = $filterData['data'];
    }

    if (isset($filterData['type']) && $filterData['type'] == 'company' && isset($filterData['data']['id'])) {
      $company = $filterData['data'];
    }

    $data = [
      'title' => "Kursus Pilihan",
      'course' => $course,
      'category' => $category,
      'company' => $company,
    ];

    return Inertia::render('User/Course/Index', $data);
  }

  public function show($slug, Request $request)
  {
    $course = Course::where('slug', $slug)
      ->select([...$this->baseSelectedColumn, 'description'])
      ->with('modules.lessons:id,module_id,title,content_type,visibility,duration')
      ->withCount('ratings')
      ->withAvg('ratings', 'rating')
      ->with([
        'ratings' => function ($subQuery) {
          $subQuery->with('user')->whereNot('status', ChatStatusType::Hidden);
        }
      ])
      ->withCount('modules as total_modules')
      ->withSum(['lessons as total_duration_seconds' => fn($q) => $q->whereNotNull('duration_seconds')], 'duration_seconds')
      ->withCount(['lessons as total_video_lessons' => fn($query) => $query->where('content_type', LessonContentType::Video)])
      ->withCount(['lessons as total_exam_lessons' => fn($query) => $query->where('content_type', LessonContentType::Exam)])
      ->withCount(['lessons as total_quiz_lessons' => fn($query) => $query->withCount('quizzes')])
      ->when($request->mode != 'preview', function ($query) {
        $query->where('status', PublishStatusType::Publish);
      })
      ->first();

    if (!$course)
      return redirect()->back()->with('error', 'Kursus tidak ditemukan');

    $affiliate = Configuration::where('type', 'LINK_AFFILIATE')->where('status', 'active')->inRandomOrder()->first();

    $phoneNumber = null;
    if ($course->chat_active == 1) {
      $phoneNumber = $course->user?->phone;
    }

    $lesson = null;
    if ($request->lesson) {
      $lessonId = base64_decode($request->lesson);
      $lessonId = intval($lessonId);

      $lesson = Lesson::where('id', $lessonId)
        ->where('visibility', VisibilityType::Public)
        ->first();
    }

    $meta = [
      'title' => $course->title,
      'description' => $course->description ? strip_tags($course->description) : null,
      'image' => $course->thumbnail ?? null,
    ];

    $data = [
      'title' => $course?->title ?? "Acara",
      'course' => $course,
      'lesson' => $lesson,
      'affiliate' => $affiliate,
      'schema' => \App\Utils\SchemaJson::getSchema($course->id, 'course'),
      'phoneNumber' => $phoneNumber ?? null,
      'meta' => $meta,
    ];

    return Inertia::render('User/Course/Show', $data);
  }
}
