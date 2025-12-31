<?php

use App\Enums\ParticipantType;
use App\Enums\ParticipantStatusType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('participants', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('course_id')->nullable()->constrained('courses');
      $table->string('type')->default(ParticipantType::Participant)->index();
      $table->string('participant_number')->nullable();
      $table->string('name', 500);
      $table->string('email')->nullable();
      $table->string('phone')->nullable();
      $table->string('institute')->nullable();
      $table->string('branch')->nullable();
      $table->string('job_title')->nullable();
      $table->string('status')->default(ParticipantStatusType::Active)->index();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('participants');
  }
};
