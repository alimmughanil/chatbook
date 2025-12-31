<?php

namespace App\Http\Controllers\Traits;

use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use App\Enums\PublishStatusType;

trait LoadCoursePermission
{
  protected $courseSlug;
  protected $course;
  protected $enrollment;

  protected function loadCoursePermission(Request $request)
  {
    $this->courseId = $request->route()->parameter('course_id');

    $this->course = Course::where('id', $this->courseId)
      ->filterRole()
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
