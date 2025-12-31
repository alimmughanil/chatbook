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
    Schema::create('blog_categories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->nullable()->constrained('users');
      $table->string('name');
      $table->string('slug');
      $table->longText('thumbnail')->nullable();
      $table->longText('description')->nullable();
      $table->text('seo_keyword')->nullable();
      $table->text('seo_description')->nullable();
      $table->boolean('is_featured')->nullable()->default(false);
      $table->string('status')->default(PublishStatusType::Draft)->index();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('blog_categories');
  }
};
