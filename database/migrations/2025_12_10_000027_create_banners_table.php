<?php

use App\Enums\BannerType;
use App\Enums\LanguageType;
use App\Enums\OriginStatusType;
use App\Enums\PublishStatusType;
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
    Schema::create('banners', function (Blueprint $table) {
      $table->id();
      $table->string('type')->default(BannerType::Image)->index();
      $table->text('file')->nullable();
      $table->longText('title')->nullable();
      $table->longText('description')->nullable();
      $table->boolean('is_action_button')->default(false)->index();
      $table->text('action_url')->nullable();
      $table->string('status')->default(PublishStatusType::Draft)->index();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('banners');
  }
};
