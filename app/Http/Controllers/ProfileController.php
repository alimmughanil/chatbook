<?php

namespace App\Http\Controllers;

use App\Enums\LanguageLevelType;
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
use Illuminate\Support\Facades\DB;
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
    $user = auth()->user()->load('profile.details');

    $data = [
      'title' => 'Profil',
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'languageLevelType' => LanguageLevelType::getValues(),
      'user' => $user
    ];
    return Inertia::render('Profile/Index', $data);
  }

  /**
   * Update the user's profile information.
   */
  public function store(Request $request): RedirectResponse
  {
    if ($request->has('partner'))
      return $this->updatePartner($request);
    if ($request->has('update-password')) {
      $passwordController = new PasswordController();
      return $passwordController->update($request);
    }

    $validated = $request->validate([
      'name' => ['string', 'max:255'],
      'username' => ['string', 'max:255', Rule::unique(User::class, 'username')->ignore($request->user()->id)],
      'email' => ['email', 'max:255', Rule::unique(User::class, 'email')->ignore($request->user()->id)],
      'phone' => ['nullable', 'numeric', 'digits_between:10,13', 'starts_with:08,02'],
      'picture' => ['required', ...[is_file($request->picture) ? ['image', 'mimes:jpeg,png,jpg,gif,svg,webp,avif', 'max:2048'] : []]],
    ]);
    $profileData = $request->validate([
      'short_bio' => [
        'string',
        'max:255',
        Rule::requiredIf(function () {
          return auth()->user()->role == UserType::Partner;
        })
      ],
      'about' => [
        'string',
        'max:255',
        Rule::requiredIf(function () {
          return auth()->user()->role == UserType::Partner;
        })
      ],
    ]);
    $user = auth()->user()->load(['profile']);

    DB::beginTransaction();
    try {
      if ($request->file('picture')) {
        $file = Storage::disk('public')->put('picture', $request->file('picture'));

        if (!$file) {
          throw new \Exception("Gagal mengupload foto profil.");
        }

        $validated['picture'] = "/storage/$file";
        if (Storage::disk('public')->exists(substr($user->picture, 9))) {
          Storage::disk('public')->delete(substr($user->picture, 9));
        }
      } else {
        unset($validated['picture']);
      }

      $user->update($validated);

      if ($user->profile) {
        $user->profile->update($profileData);
      } else {
        $profileData['user_id'] = $user->id;
        Profile::create($profileData);
      }

      DB::commit();

      if ($request->has('product'))
        return redirect("/service/$request->product");

      return Redirect::route('auth.profile.index', ['tab' => 'detail'])->with('success', 'Profil berhasil diperbarui.');
    } catch (\Exception $e) {
      DB::rollBack();
      return Redirect::route('auth.profile.index', ['tab' => 'detail'])->with('error', 'Gagal memperbarui profil: ' . $e->getMessage());
    }
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

  public function updatePartner(Request $request)
  {
    $validatedData = $request->validate([
      'education' => 'nullable|array',
      'experience' => 'nullable|array',
      'skills' => 'nullable|array',
      'languages' => 'nullable|array',
      'certificates' => 'nullable|array',
      'banner' => 'nullable|image|max:2048',
    ]);

    DB::beginTransaction();
    try {
      $user = auth()->user()->load('profile');
      $profile = $user->profile;
      if (!$profile) {
        $profile = Profile::create([
          'user_id' => $user->id,
        ]);
      }

      $this->saveProfileDetails($profile, $request);

      DB::commit();
      return Redirect::route('auth.profile.index', ['tab' => 'detail'])->with('success', 'Detail Profil berhasil diperbarui.');
    } catch (\Exception $e) {
      DB::rollBack();
      return Redirect::route('auth.profile.index', ['tab' => 'detail'])->with('error', 'Gagal memperbarui profil: ' . $e->getMessage());
    }
  }

  protected function saveProfileDetails(Profile $profile, Request $request)
  {
    $details = [
      'education' => \App\Enums\ProfileDetailType::Education,
      'experience' => \App\Enums\ProfileDetailType::Experience,
      'skills' => \App\Enums\ProfileDetailType::Skill,
      'languages' => \App\Enums\ProfileDetailType::Language,
      'certificates' => \App\Enums\ProfileDetailType::Certificate,
    ];

    foreach ($details as $key => $type) {
      if ($request->has($key)) {
        // Delete existing details of this type
        $profile->details()->where('type', $type)->delete();

        $items = $request->input($key, []);
        foreach ($items as $item) {
          $profile->details()->create([
            'type' => $type,
            'value' => $item
          ]);
        }
      }
    }

    if ($request->hasFile('banner')) {
      $file = Storage::disk('public')->put('banner', $request->file('banner'));

      if (!$file) {
        throw new \Exception("Gagal mengupload banner.");
      }

      $path = "/storage/$file";

      // Delete existing banner if exists
      $existingBanner = $profile->details()->where('type', \App\Enums\ProfileDetailType::Banner)->first();
      if ($existingBanner && isset($existingBanner->value['path'])) {
        $oldPath = substr($existingBanner->value['path'], 9); // Remove /storage/ prefix
        if (Storage::disk('public')->exists($oldPath)) {
          Storage::disk('public')->delete($oldPath);
        }
      }
      $profile->details()->where('type', \App\Enums\ProfileDetailType::Banner)->delete();

      $profile->details()->create([
        'type' => \App\Enums\ProfileDetailType::Banner,
        'value' => ['path' => $path]
      ]);
    }
  }
}
