<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'ip_address' => fake()->ipv4(),
            'menu' => fake()->randomElement(['Courses', 'Users', 'Settings', 'Profile']), // GANTI DENGAN MENU SEBENARNYA
            'type' => fake()->randomElement(['Create', 'Update', 'Delete', 'Login', 'View']), // GANTI DENGAN TIPE SEBENARNYA
        ];
    }
}
