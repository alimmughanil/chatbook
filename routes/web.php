<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\User\BlogController;
use App\Http\Controllers\User\ProductController;
use App\Http\Controllers\User\CategoryController;
use App\Http\Controllers\User\Dashboard;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::name('home.')->group(function () {
  Route::get('/', [HomeController::class, 'index'])->name('index');
  Route::resource('contact', ContactController::class)->only('show', 'store');
});

Route::name('app.')->group(function () {
  Route::get('/blog/category/{category}', [BlogController::class, 'categoryIndex'])->name('blog.category.index');
  Route::get('/blog/{blog}', [BlogController::class, 'show'])->name('blog.show');

  Route::resource('/service', ProductController::class)->only('show');
});

Route::prefix('app')->name('app.')->group(function () {
  Route::resource('/blog', BlogController::class)->only('index');
  Route::resource('/service', ProductController::class)->only('index');
  Route::resource('/category', CategoryController::class)->only('index', 'show');
  Route::resource('/contact', ContactController::class)->only('show', 'store');

  Route::get('contact', [HomeController::class, 'contact'])->name('contact');
  Route::get('about', [HomeController::class, 'about'])->name('about');
  Route::get('disclaimer', [HomeController::class, 'disclaimer'])->name('disclaimer');
  Route::get('privacy', [HomeController::class, 'privacy'])->name('privacy');
});

Route::prefix("/me")->name('user.')->middleware(['auth', 'role:user'])->group(callback: function () {
  Route::resource('/orders', Dashboard\OrderController::class)->only('index');
  Route::resource('/transactions', Dashboard\TransactionController::class);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/backoffice.php';
