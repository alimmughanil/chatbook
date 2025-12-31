<?php

namespace App\Http\Middleware;

use App\Enums\UserType;
use Closure;
use App\Models\Course;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CoursePermission
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $user = auth()->user();
    if (in_array($user->role, [UserType::Admin]))
      return $next($request);

    $courseId = $request->route()->parameter('course_id');
    $courseExist = Course::filterRole()->where('id', $courseId)->exists();
    if (!$courseExist) {
      return redirect()->route("admin.courses.index")->with('error', 'Anda tidak dapat mengakses kursus ini');
    }
    return $next($request);
  }
}
