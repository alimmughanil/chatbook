<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PricingTag;

class PricingTagSeeder extends Seeder
{
    public function run(): void
    {
        PricingTag::factory()->count(10)->create();
    }
}
