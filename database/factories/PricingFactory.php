<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Pricing;

class PricingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Kartika Putri',
            'type' => 'subscription',
            'unit' => 'Data Dummy',
            'value' => rand(10, 200) * 10000,
            'applied_to' => 'Data Dummy',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => now(),
        ];
    }
}
