<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;

/*
|--------------------------------------------------------------------------
| Backoffice Routes
|--------------------------------------------------------------------------
|
*/

Route::middleware(['auth', 'role:admin'])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () {
    Route::resource('/users', Admin\UsersController::class)->only('index', 'create', 'edit', 'store', 'update', 'destroy');
    Route::resource('/configuration', Admin\ConfigurationController::class)->only('index', 'store', 'destroy');
    Route::resource('/doctors', Admin\DoctorController::class)->only('index', 'create', 'edit', 'store', 'update', 'destroy');
  });
  Route::middleware(['auth', 'role:admin', 'activeDoctor'])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () {
    Route::resource('/patients', Admin\PatientController::class)->only('index', 'create', 'edit', 'store', 'update', 'destroy');
    Route::resource('/medical_records', Admin\MedicalRecordController::class)->only('create', 'store');
  });
