<?php

use App\Enums\TimeUnitType;
use App\Enums\PortfolioStatusType;
use Illuminate\Support\Facades\Schema;
use App\Enums\PublishStatusType;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('portfolio_projects', function (Blueprint $table) {
      $table->id();
			$table->foreignId('user_id')->nullable();
			$table->foreignId('client_id')->nullable();
      $table->foreignId('category_id')->nullable();
      $table->string('name', 500);
      $table->string('slug', 500);
      $table->bigInteger('price_min')->nullable()->default(0);
      $table->bigInteger('price_max')->nullable();
      $table->integer('duration')->nullable();
      $table->string('duration_unit')->default(TimeUnitType::Day);
      $table->longText('thumbnail')->nullable();
      $table->longText('description')->nullable();
      $table->text('site_url')->nullable();
			$table->boolean('is_show_client')->default(true);
      $table->date('project_date')->nullable();
      $table->string('project_status')->default(PortfolioStatusType::Active);
      $table->string('status')->default(PublishStatusType::Draft);
      $table->timestamp('published_at')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('portfolio_projects');
  }
};
