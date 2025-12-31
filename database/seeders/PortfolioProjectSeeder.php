<?php
namespace Database\Seeders;
use App\Models\PortfolioProject;
use Illuminate\Database\Seeder;

class PortfolioProjectSeeder extends Seeder {
    public function run(): void {
        PortfolioProject::factory()->count(20)->create();
    }
}
