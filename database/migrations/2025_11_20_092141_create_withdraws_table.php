<?php

use App\Enums\WithdrawStatusType;
use App\Enums\DisbursementMethodType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('withdraws', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained('users');
      $table->foreignId('submited_user_id')->nullable()->constrained('users');
      $table->foreignId('bank_id')->constrained('banks');
      $table->string('transaction_number')->nullable()->index();
      $table->bigInteger('gross_amount');
      $table->bigInteger('net_amount');
      $table->bigInteger('fee')->default(value: 0);
      $table->longText('attachment')->nullable();

      $table->string('method')->nullable()->default(DisbursementMethodType::MANUAL)->index();
      $table->string('account_name')->nullable();
      $table->string('disburse_id')->nullable();
      $table->string('reff_number')->nullable();

      $table->string('status')->default(WithdrawStatusType::Pending)->index();
      $table->longText('detail')->nullable();
      $table->string('status_message')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('withdraws');
  }
};
