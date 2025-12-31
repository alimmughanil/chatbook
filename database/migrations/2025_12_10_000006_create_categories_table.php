<?php

use App\Enums\CategoryType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('categories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
      $table->string('name');
      $table->string('slug')->nullable()->index();
      $table->string('type')->default(CategoryType::Product)->index();
      $table->longText('thumbnail')->nullable();
      $table->longText('description')->nullable();
      $table->boolean('is_thumbnail_icon')->default(false);
      $table->boolean('is_active')->default(true);
      $table->boolean('is_featured')->default(false);
      $table->timestamps();
      $table->softDeletes();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('categories');
  }
};
