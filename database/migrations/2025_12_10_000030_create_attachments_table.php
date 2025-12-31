<?php

use App\Enums\ImageType;
use App\Enums\AttachmentType;
use App\Enums\AttachmentContentType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('attachments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('work_history_id')->constrained('work_histories');
;
      $table->string('type')->default(AttachmentType::WorkHistory)->nullable();
      $table->string('content_type')->default(AttachmentContentType::Other)->nullable();
      $table->string('label')->nullable();
      $table->longText('value')->nullable();
      $table->longText('description')->nullable();
      $table->unsignedInteger('order')->default(0)->index();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('attachments');
  }
};
