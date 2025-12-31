<?php

use App\Enums\ProductStatusType;
use App\Enums\ProductType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('products', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users');
      $table->foreignId('category_id')->constrained('categories');
      $table->foreignId('assigned_user_id')->nullable()->constrained('users');

      $table->string('name');
      $table->string('type')->default(ProductType::Service)->index();
      $table->bigInteger('price')->nullable();
      $table->string('slug')->unique();
      $table->longText('instruction')->nullable();
      $table->longText('description')->nullable();
      $table->longText('keywords')->nullable();
      $table->longText('meta_description')->nullable();

      $table->longText('thumbnail')->nullable();
      $table->integer('sort_number')->nullable()->index();
      $table->string('status')->default(ProductStatusType::Draft)->index();
      $table->boolean('is_featured')->default(false)->index();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('products');
  }
};
