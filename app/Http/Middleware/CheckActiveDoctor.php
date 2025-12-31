<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Doctor;
use Illuminate\Http\Request;

class CheckActiveDoctor
{
  public function handle(Request $request, Closure $next)
  {
    $doctor = Doctor::active($request)->first();

    if (!$doctor) {
      return redirect('/admin/dashboard')->with('error', 'Silahkan pilih dokter yang aktif');
    }

    return $next($request);
  }
}
