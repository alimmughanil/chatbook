<?php

use App\Enums\UserType;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;
use App\Http\Controllers\NotificationController;
/*
|--------------------------------------------------------------------------
| Backoffice Routes
|--------------------------------------------------------------------------
|
*/

$resourceMethod = ['index', 'create', 'edit', 'store', 'update', 'destroy'];

Route::middleware(['auth', "role: " . implode("|", [UserType::Admin])])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () use ($resourceMethod) {
    Route::resource('users', Admin\UsersController::class)->only([...$resourceMethod]);
    Route::resource('categories', Admin\CategoryController::class)->only([...$resourceMethod]);
    Route::resource('tag', Admin\TagController::class)->only([...$resourceMethod]);
    Route::resource('contact', Admin\ContactController::class)->only('index', 'show', 'store');
    Route::resource('configuration', Admin\ConfigurationController::class)->only('index', 'store', 'destroy');
    Route::resource('config/notification', Admin\ConfigNotificationController::class)->only('index', 'store', 'destroy');
    Route::resource('pricing', Admin\PricingController::class)->only([...$resourceMethod]);
    Route::resource('supported-bank', Admin\SupportedBankController::class)->only([...$resourceMethod]);
    Route::resource('transactions', Admin\TransactionController::class)->only([...$resourceMethod]);

    Route::resource('portfolio/project', Admin\PortfolioProjectController::class)->only([...$resourceMethod, 'show']);
    Route::resource('portfolio/category', controller: Admin\PortfolioCategoryController::class)->only([...$resourceMethod]);

    Route::resource('/blog/blog_categories', Admin\BlogCategoryController::class)->only([...$resourceMethod]);
    Route::resource('/blog/blogs', Admin\BlogController::class)->only([...$resourceMethod]);
  });

Route::middleware(['auth', "role: " . implode("|", [UserType::Admin, UserType::Partner])])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () use ($resourceMethod) {
    Route::resource('order', Admin\OrderController::class)->only('index', 'create', 'store', 'update');
    Route::resource('product', Admin\ProductController::class)->only([...$resourceMethod, 'show']);
    Route::put('products', [Admin\ProductController::class, 'bulkUpdate']);
    Route::resource('product/{product}/detail', Admin\ProductDetailController::class)->only('store', 'update', 'destroy');
    Route::resource('product/{product}/image', Admin\ImageController::class)->only('store', 'destroy');
    Route::get('/order/{order}/invoice', [Admin\OrderController::class, 'sendInvoice'])->name('order.invoice');
    Route::resource('withdraw', Admin\WithdrawController::class)->only('index', 'create', 'store', 'update', 'show');
    Route::resource('bank', Admin\BankController::class)->only([...$resourceMethod, 'show']);
  });

Route::middleware(['auth'])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () use ($resourceMethod) {
    Route::put('notifications/readAll', action: [NotificationController::class, 'updateAllRead']);
    Route::resource('notifications', NotificationController::class)->only('update');
  });
