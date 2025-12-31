<?php

use App\Enums\VisibilityType;
use App\Enums\LessonContentType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('lessons', function (Blueprint $table) {
      $table->id();
      $table->foreignId('module_id')->constrained()->onDelete('cascade');
      $table->string('title')->nullable();
      $table->string('content_type')->default(LessonContentType::Video)->index();
      $table->longText('description')->nullable();
      $table->longText('thumbnail')->nullable();

      $table->string('video_url')->nullable();
      $table->longText('content')->nullable();

      $table->string('duration')->nullable();
      $table->unsignedBigInteger('duration_seconds')->nullable();
      $table->unsignedInteger('order')->default(0)->index();
      $table->string("visibility")->default(VisibilityType::Private)->index();
      $table->boolean('is_active')->default(true)->index();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('lessons');
  }
};
