<?php

use App\Enums\LanguageType;
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
    Schema::create('blogs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('category_id')->nullable()->constrained('blog_categories');
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->string('title', 255);
      $table->string('slug', 255);
      $table->longText('thumbnail')->nullable();
      $table->text('keyword');
      $table->boolean('is_slider')->nullable()->default(false);
      $table->longText('description')->nullable();
      $table->text('short_description')->nullable();
      $table->string('status')->default(PublishStatusType::Draft)->index();
      $table->timestamp('published_at')->nullable();
      $table->timestamps();

      $table->fulltext(['title', 'description', 'short_description']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('blogs');
  }
};
