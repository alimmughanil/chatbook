<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\WorkHistorie;

class WorkHistorieFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_id' => rand(1, 5),
            'user_id' => rand(1, 5),
            'message' => 'Jasa ini cocok untuk UMKM yang ingin meningkatkan branding. Pengerjaan cepat, hasil original, dan file master (AI/EPS) akan diberikan.',
            'type' => 'service',
            'status' => 'verified',
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => now(),
        ];
    }
}
