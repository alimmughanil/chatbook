<?php

use App\Enums\BankStatusType;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('banks', function (Blueprint $table) {
      $table->id();
      $table->foreignId('supported_bank_id')->nullable()->constrained();
      $table->foreignId(column: 'user_id')->constrained('users');
      $table->string('bank_name')->nullable();
      $table->string('bank_account')->nullable();
      $table->string('bank_alias')->nullable();
      $table->longText('attachment')->nullable();
      $table->boolean('is_primary')->default(false)->index();
      $table->string('status_message')->nullable();
      $table->string('status')->default(BankStatusType::Pending)->index();
      $table->timestamps();
      $table->softDeletes();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('banks');
  }
};
