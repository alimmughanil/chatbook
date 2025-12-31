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
    Schema::create('transactions', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
      $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete(); // Assuming categories table exists
      $table->date('date');
      $table->bigInteger('amount');
      $table->string('type'); // Storing enum value as string
      $table->text('description')->nullable();
      $table->string('shop_name')->nullable();
      $table->json('items')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('transactions');
  }
};
