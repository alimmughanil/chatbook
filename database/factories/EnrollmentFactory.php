<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnrollmentFactory extends Factory
{
    protected $model = Enrollment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::where('role', 'user')->inRandomOrder()->first()->id ?? User::factory(['role' => 'user']),
            'course_id' => Course::inRandomOrder()->first()->id ?? Course::factory(),
            'enrolled_at' => fake()->dateTimeThisYear(),
            'completed_at' => fake()->optional(0.3)->dateTimeThisYear(), // 30% kemungkinan selesai
        ];
    }
}
