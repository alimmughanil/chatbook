<?php

use App\Enums\HistoryType;
use App\Enums\WorkStatusType;
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
    Schema::create('work_histories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_id')->constrained('orders');
      $table->foreignId('user_id')->nullable();
      $table->longText('message')->nullable();
      $table->string('type')->default(HistoryType::Request);
      $table->string('status')->default(WorkStatusType::Progress);
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('work_histories');
  }
};