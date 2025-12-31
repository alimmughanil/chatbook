<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Enums\OriginStatusType;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Controllers\Admin\ActivityController;

class AuthenticatedSessionController extends Controller
{
  /**
   * Display the login view.
   */
  public function create(): Response
  {
    return Inertia::render('Auth/Login', [
      'canResetPassword' => Route::has('password.request'),
      'status' => session('status'),
    ]);
  }

  /**
   * Handle an incoming authentication request.
   */
  public function store(LoginRequest $request): RedirectResponse
  {
    $request->authenticate();

    $request->session()->regenerate();

    if (auth()->check()) {
      if (auth()->user()->status != OriginStatusType::Active) {
        $this->destroy($request);
        return redirect('/login')->with('error', 'Akun ini telah di nonaktifkan');
      }
    }
    $activityController = new ActivityController();
    $activityController->store($request, 'session_login', 'creating');

    $redirectUrl = $request->session()->pull('redirect_auth_url', route('auth.dashboard.app'));
    return redirect()->intended($redirectUrl);
  }

  /**
   * Destroy an authenticated session.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $activityController = new ActivityController();
    $activityController->store($request, 'session_login', 'deleting');

    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return redirect('/');
  }
}
