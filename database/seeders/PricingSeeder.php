<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pricing;

class PricingSeeder extends Seeder
{
    public function run(): void
    {
        Pricing::factory()->count(10)->create();
    }
}
