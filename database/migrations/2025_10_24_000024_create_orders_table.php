<?php

use App\Enums\OrderType;
use App\Enums\OrderStatusType;
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
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users');
      $table->foreignId('course_id')->nullable()->constrained('courses');
      $table->foreignId('participant_id')->nullable()->constrained('participants');
      
      $table->string('type')->default(OrderType::CourseRegistration)->index();
      $table->string('order_number')->index();
      $table->bigInteger('quantity')->default(1);
      $table->bigInteger('product_price')->default(0);
      $table->bigInteger('price_total')->default(0);
      $table->string('status')->default(OrderStatusType::Pending)->index();
      $table->string('status_message')->nullable();
      $table->longText('note')->nullable();
      $table->json('detail')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('orders');
  }
};
