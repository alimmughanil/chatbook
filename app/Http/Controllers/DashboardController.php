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
    $balance = Wallet::getUserBalance($user);

    $wallet = [];
    if ($user->role == UserType::Partner) {
      $user = $user->load(['wallet' => ['order', 'withdraw']]);
      $wallet = $user->wallet;
    }

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
