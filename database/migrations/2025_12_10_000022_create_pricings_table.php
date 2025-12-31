<?php

use App\Enums\OriginStatusType;
use App\Enums\PricingAppliedType;
use App\Enums\PricingType;
use App\Enums\PricingUnitType;
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
        Schema::create('pricings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default(PricingType::Addition)->index();
            $table->string('unit')->default(PricingUnitType::Percentage)->index();
            $table->bigInteger('value');
            $table->string('applied_to')->default(PricingAppliedType::Platform)->index();
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
        Schema::dropIfExists('pricings');
    }
};
