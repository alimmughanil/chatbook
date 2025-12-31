<?php

use App\Enums\ImageType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('images', function (Blueprint $table) {
      $table->id();
      $table->foreignId('product_id')->nullable();
      $table->string('type')->default(ImageType::File);
      $table->longText('link')->nullable();
      $table->longText('file')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('images');
  }
};
