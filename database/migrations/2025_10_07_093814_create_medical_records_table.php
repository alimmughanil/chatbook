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
    Schema::create('medical_records', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->foreignId('doctor_id')->nullable()->constrained('doctors');
      $table->foreignId('patient_id')->nullable()->constrained('patients');
      $table->date('date')->nullable();
      $table->longText('complaint')->nullable()->fulltext();
      $table->longText('note')->nullable()->fulltext();
      $table->longText('treatment')->nullable()->fulltext(); 
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('medical_records');
  }
};