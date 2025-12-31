<?php

namespace App\Http\Controllers\User\Dashboard;

use Inertia\Inertia;
use App\Models\Course;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Enums\LessonProgressStatusType;

class CourseController extends Controller
{
  public function index(Request $request)
  {
    $selectCourseColumn = (new \App\Http\Controllers\User\CourseController())->baseSelectedColumn;

    $filterStatus = [
      LessonProgressStatusType::Current,
      LessonProgressStatusType::Completed,
      LessonProgressStatusType::Incompleted,
    ];

    $course = Course::select([...$selectCourseColumn, 'description'])
      ->with('comments','ratings')
      ->withCount(['lessons as lesson_total'])
      ->withCount(['lessonProgress as completed_lesson_total' => fn($q) => $q->where('status', LessonProgressStatusType::Completed)])
      ->whereRelation('enrollments', 'user_id', auth()->id())
      ->when($request->filled("progress") && in_array($request->progress, $filterStatus), fn($q) => $q->whereRelation('lessonProgress', 'status', $request->progress))
      ->paginate(25);

    $course = collect($course);

    $course['data']  = collect($course['data'])->map(function ($course)  {
      $course['progress'] = intval($course['completed_lesson_total']) / intval($course['lesson_total']) * 100;
      return $course;
    });


    $data = [
      'title' => "Kursus Saya",
      'course' => $course,
      'status' => $filterStatus,
    ];
    return Inertia::render('User/Dashboard/Course/Index', $data);
  }
}
