<?php

namespace Database\Factories;

use App\Enums\ImageType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PortfolioImage;

class PortfolioImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => rand(1, 5),
            'portfolio_project_id' => rand(1, 5),
            'type' => ImageType::File,
            'label' => 'Data Dummy',
            'value' => rand(10, 200) * 10000,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
