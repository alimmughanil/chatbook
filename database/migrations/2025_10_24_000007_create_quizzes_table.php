<?php

use App\Enums\GradingType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('quizzes', function (Blueprint $table) {
      $table->id();
      $table->foreignId('lesson_id')->nullable()->constrained()->onDelete('cascade');
      $table->string('grading_type')->default(GradingType::Auto)->index();
      $table->string('title')->nullable();
      $table->longText('description')->nullable();

      $table->string('duration')->nullable();
      $table->unsignedBigInteger('duration_seconds')->nullable();
      $table->float('min_score')->default(0);
      $table->unsignedInteger('order')->default(0)->index();
      $table->boolean('is_active')->default(true)->index();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('quizzes');
  }
};
