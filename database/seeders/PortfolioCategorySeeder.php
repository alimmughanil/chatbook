<?php
namespace Database\Seeders;
use App\Models\PortfolioCategory;
use Illuminate\Database\Seeder;

class PortfolioCategorySeeder extends Seeder {
    public function run(): void {
        PortfolioCategory::factory()->count(5)->create();
    }
}
