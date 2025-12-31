<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('profile_details', function (Blueprint $table) {
      $table->id();
      $table->foreignId('profile_id')->constrained('profiles')->cascadeOnDelete();
      $table->string('type')->index();
      $table->json('value');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('profile_details');
  }
};
