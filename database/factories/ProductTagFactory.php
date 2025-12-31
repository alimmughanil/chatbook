<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\ProductTag;

class ProductTagFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => rand(1, 5),
            'tag_id' => rand(1, 5),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
