<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\UserType;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Http\Controllers\Auth\PasswordController;

class ProfileController extends Controller
{
  /**
   * Display the user's profile form.
   */
  public function index(Request $request): Response
  {
    $user = auth()->user();

    $data = [
      'title' => 'Profil',
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
      'user' => $user
    ];
    return Inertia::render('Profile/Index', $data);
  }

  /**
   * Update the user's profile information.
   */
  public function store(Request $request): RedirectResponse
  {
    if ($request->has('update-password')) {
      $passwordController = new PasswordController();
      return $passwordController->update($request);
    }

    $validated = $request->validate([
      'name' => ['string', 'max:255'],
      'username' => ['string', 'max:255', Rule::unique(User::class, 'username')->ignore($request->user()->id)],
      'email' => ['email', 'max:255', Rule::unique(User::class)->ignore($request->user()->id)],
      'phone' => ['nullable','numeric', 'digits_between:10,13', 'starts_with:08,02'],
      'picture' => ['nullable', ...[is_file($request->picture) ? ['image', 'mimes:jpeg,png,jpg,gif,svg,webp,avif', 'max:2048'] : []]],
    ]);

    $user = auth()->user();

    if ($request->file('picture')) {
      $file = Storage::disk('public')->put('picture', $request->file('picture'));
      $validated['picture'] = $file ? "/storage/$file" : $user->picture;
      if ($file && Storage::disk('public')->exists(substr($user->picture, 9))) {
        Storage::disk('public')->delete(substr($user->picture, 9));
      }
    } else {
      unset($validated['picture']);
    }

    $user->update($validated);

    return Redirect::route('auth.profile.index')->with('status', 'Profil berhasil diperbarui.');
  }

  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }
}
