<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PricingTag;

class PricingTagFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pricing_id' => rand(1, 5),
            'tag_id' => rand(1, 5),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
