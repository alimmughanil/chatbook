<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

Route::middleware(['auth'])
  ->name('auth.')
  ->group(function () {
    Route::resource('/app/profile', controller: ProfileController::class)->only('index', 'store');
    Route::get('/admin', DashboardController::class)->name('dashboard.admin');
    Route::get('/admin/dashboard', DashboardController::class)->name('dashboard.admin.main');
    Route::get('/app/dashboard', DashboardController::class)->name('dashboard.app');
    Route::get('/dashboard', DashboardController::class)->name('dashboard.default');
  });

Route::middleware('guest')->group(function () {
  Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
  Route::post('login', [AuthenticatedSessionController::class, 'store']);

  Route::get('/auth/google/redirect', [GoogleAuthController::class, 'getAuthenticationPage']);
  Route::get('/auth/google', [GoogleAuthController::class, 'getCallback']);
});

Route::middleware('auth')->group(function () {
  Route::put('password', [PasswordController::class, 'update'])->name('password.update');
  Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
