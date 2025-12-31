<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Doctor;
use App\Enums\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
  /**
   * Handle the incoming request.
   */
  public function __invoke(Request $request)
  {
    $doctor = null;

    if ($request->cookie('doctor_id')) {
      $doctor = Doctor::active($request)->first();
    }

    $data = [
      'title' => 'Dashboard',
      'doctor' => $doctor,
    ];
    $allowedRole = [
      UserType::Admin,
      UserType::Editor,
    ];
    $user = auth()->user();
    $data['doctors'] = Doctor::select("id as value", DB::raw("CONCAT(name, ' - ', institute) AS label"))->get();

    if (in_array($user->role, $allowedRole)) {
      return Inertia::render('Admin/Dashboard/Index', $data);
    }
    return redirect('/');
  }
}
