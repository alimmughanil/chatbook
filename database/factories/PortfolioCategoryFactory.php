<?php
namespace Database\Factories;
use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PortfolioCategoryFactory extends Factory {
    protected $model = PortfolioCategory::class;
    public function definition(): array {
        $t = fake()->unique()->word();
        return ['name'=>$t, 'slug'=>Str::slug($t), 'description'=>'Kategori portfolio.'];
    }
}
