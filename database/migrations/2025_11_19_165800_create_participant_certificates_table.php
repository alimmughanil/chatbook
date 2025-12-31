<?php

use App\Enums\ParticipantCertificateStatusType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('participant_certificates', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('course_id')->nullable()->constrained('courses');
      $table->foreignId('certificate_id')->nullable()->constrained('certificates');
      $table->foreignId('participant_id')->nullable()->constrained('participants');
      $table->string('status')->default(ParticipantCertificateStatusType::Pending)->index();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('participant_certificates');
  }
};
