<?php

namespace Database\Factories;

use App\Enums\ConfigurationType;
use App\Enums\OriginStatusType;
use App\Models\Configuration;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConfigurationFactory extends Factory
{
    protected $model = Configuration::class;

    public function definition(): array
    {
        $type = fake()->randomElement(ConfigurationType::getValues()); // GANTI DENGAN TIPE SEBENARNYA
        return [
            'type' => $type . '_' . fake()->word(),
            'value' => fake()->sentence(),
            'status' => fake()->randomElement(OriginStatusType::getValues()), // GANTI DENGAN STATUS SEBENARNYA
            'description' => null,
        ];
    }
}
