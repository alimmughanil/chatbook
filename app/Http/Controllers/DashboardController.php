<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Wallet;
use App\Enums\UserType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
  /**
   * Handle the incoming request.
   */
  public function __invoke(Request $request)
  {

    $user = auth()->user();
    $balance = null;
    $wallet = [];

    $data = [
      'title' => 'Dashboard',
      'balance' => $balance,
      'wallet' => $wallet,
      'isAdmin' => $user->role === UserType::Admin,
    ];

    if (in_array($user->role, [UserType::Admin, UserType::Partner])) {
      return Inertia::render('Admin/Dashboard/Index', $data);
    }

    return redirect('/');
  }
}
