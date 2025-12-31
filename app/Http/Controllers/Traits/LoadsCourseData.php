<?php

namespace App\Http\Controllers\Traits;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;

trait LoadsCourseData
{
  protected $courseSlug;
  protected $course;
  protected $enrollment;

  protected function loadCourseData(Request $request)
  {
    $selectCourseColumn = (new \App\Http\Controllers\User\CourseController())->baseSelectedColumn;

    $this->courseSlug = $request->route()->parameter('course_slug');

    $this->course = Course::where('slug', $this->courseSlug)
      ->select([...$selectCourseColumn, 'description'])
      ->withCount('modules')
      ->where('status', PublishStatusType::Publish)
      ->first();

    if (!$this->course) {
      return redirect()
        ->route("app.course.index")
        ->with('error', 'Kursus tidak ditemukan');
    }

    $this->enrollment = Enrollment::where([
      'user_id' => auth()->id(),
      "course_id" => $this->course->id
    ])->first();

    if (!$this->enrollment) {
      return redirect()
        ->route("app.registration.index", $this->course->slug)
        ->with('error', 'Silahkan daftar terlebih dahulu untuk mengakses kursus ini');
    }

    return null;
  }
}
