<?php

use App\Enums\OriginStatusType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('supported_banks', function (Blueprint $table) {
            $table->id();
            $table->string('bank_code')->unique();
            $table->string('bank_name');
            $table->string(column: 'limit_transfer_amount')->nullable();
            $table->boolean('bi_fast')->default(false)->index();
            $table->string('status')->default(OriginStatusType::Active)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supported_banks');
    }
};
