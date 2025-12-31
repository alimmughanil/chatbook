<?php

use App\Enums\ParticipantType;
use App\Enums\PublishStatusType;
use Illuminate\Support\Facades\Schema;
use App\Enums\CertificateApprovalMethod;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('certificates', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('course_id')->nullable()->constrained('courses')->restrictOnDelete();
      $table->string('type')->default(ParticipantType::Participant)->index();
      $table->string('approval_method')->default(CertificateApprovalMethod::Automatic)->index();

      $table->double('paper_width')->nullable()->default('29.7');
      $table->double('paper_height')->nullable()->default('21');
      $table->longText('template')->nullable();
      $table->longText('description')->nullable();
      $table->boolean('is_default')->default(false)->index();
      $table->string('status')->default(PublishStatusType::Draft)->index();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('certificates');
  }
};
