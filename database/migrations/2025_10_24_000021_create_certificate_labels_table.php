<?php

use App\Enums\CertificateType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('certificate_labels', function (Blueprint $table) {
      $table->id();
      $table->foreignId('certificate_id')->constrained('certificates')->cascadeOnDelete();
      $table->string('type')->default(CertificateType::Name)->index();
      $table->string('x_coordinate')->nullable();
      $table->string('y_coordinate')->nullable();
      $table->string('box_height')->default('4');
      $table->string('box_width')->default('56');
      $table->double('font_size')->nullable()->default('36');
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
