<?php

use App\Enums\OriginStatusType;
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
    Schema::create('product_details', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->constrained('products');
      $table->string('name')->nullable();
      $table->string('slug')->nullable();
      $table->bigInteger('price');
      $table->longText('description')->nullable();
      $table->longText('thumbnail')->nullable();
      $table->string('status')->default(OriginStatusType::Active)->index();
      $table->boolean('is_custom')->default(false);
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('product_details');
  }
};
