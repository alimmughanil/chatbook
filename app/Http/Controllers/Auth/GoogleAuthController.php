<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
  public function getAuthenticationPage(Request $request)
  {
    $redirectUrl = request()->session()->pull('redirect_auth_url', route('auth.dashboard.app'));
    $roles = [
      'partner' => UserType::Partner,
      'user' => UserType::User
    ];
    
    $role = null;
    if ($request->role && isset($roles[$request->role])) {
      $role = $roles[$request->role];
    }

    return Socialite::driver('google')->with(['state' => 'role=' . $role, 'redirect_url' => $redirectUrl])->redirect();
  }
  public function getCallback()
  {
    try {
      $user = Socialite::driver('google')->stateless()->user();
      $existUser = User::where('email', $user->email)->first();

      $state = request()->input('state');
      parse_str($state, $result);
      $role = UserType::User;
      if (!empty($result['role'])) {
        $role = $result['role'];
      }

      $isRegistration = null;

      if (!$existUser) {
        $userData = [
          'name' => $user->name,
          'email' => $user->email,
          'role' => $role,
          'email_verified_at' => now(),
          'picture' => $user->avatar
        ];

        $email = explode('@', $user->email);
        $username = $email[0] . rand(1111, 9999);
        $username = preg_replace('/[^A-Za-z0-9]/', '-', $username);

        $userData['username'] = $username;
        $existUser = User::create($userData);
        $isRegistration = true;
      }

      auth()->login($existUser, true);

      if ($isRegistration && $role == UserType::Partner) {
        return redirect(route('auth.profile.index'))->with("success","Pembuatan akun anda berhasil, silahkan lengkapi data profil anda.");
      }

      $redirectUrl = request()->session()->pull('redirect_auth_url', route('auth.dashboard.app'));
      if (!empty($result['redirect_url'])) {
        $redirectUrl = $result['redirect_url'];
      }

      return redirect()->intended($redirectUrl);
    } catch (\Throwable $th) {
      return redirect()->route('login');
    }
  }
}