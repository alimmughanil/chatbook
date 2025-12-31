<?php

use App\Enums\PaymentType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('payments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_id')->constrained('orders')->restrictOnDelete();
      $table->string('method')->nullable();
      $table->bigInteger('gross_amount');
      $table->bigInteger('net_amount')->nullable()->default(0);
      $table->bigInteger('fee')->nullable()->default(0);
      $table->bigInteger('unix_timestamp');
      $table->string('status_code')->nullable();
      $table->string('publisher_order_id')->nullable();
      $table->string('sp_user_hash')->nullable();
      $table->string('issuer_code')->nullable();
      $table->string('settlement_date')->nullable();
      $table->string('payment_link')->nullable();
      $table->string('status')->default(PaymentType::Pending);
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('payments');
  }
};
