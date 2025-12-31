<?php

use App\Enums\CourseLevelType;
use App\Enums\CoursePaymentType;
use App\Enums\PublishStatusType;
use App\Enums\CourseTimeLimitType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('courses', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');

      $table->string('title')->fulltext();
      $table->string('slug')->unique();
      $table->string('payment_type')->default(CoursePaymentType::Free)->index();
      $table->bigInteger('price')->default(0);
      $table->string('participant_start_number')->default("0001");
      $table->string('participant_format_number')->default("{NNNN}");
      $table->text('description')->nullable();
      $table->longText('thumbnail')->nullable();

      $table->timestamp('start_at')->nullable();
      $table->timestamp('close_at')->nullable();
      $table->timestamp('registration_start_at')->nullable();
      $table->timestamp('registration_close_at')->nullable();

      $table->string('time_limit')->default(CourseTimeLimitType::Unlimited)->index();
      $table->string('level')->default(CourseLevelType::Beginner)->index();
      $table->string('status')->default(PublishStatusType::Draft)->index();
      $table->boolean('is_featured')->nullable()->default(false)->index();
      $table->unsignedInteger('order')->default(0)->index();

      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('courses');
  }
};
