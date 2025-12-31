<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PortfolioImage;

class PortfolioImageSeeder extends Seeder
{
    public function run(): void
    {
        PortfolioImage::factory()->count(10)->create();
    }
}
