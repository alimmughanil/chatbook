<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Discussion;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscussionFactory extends Factory
{
    protected $model = Discussion::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'course_id' => Course::inRandomOrder()->first()->id ?? Course::factory(),
            'lesson_id' => fake()->optional()->randomElement(Lesson::pluck('id')->toArray()), // Opsional terkait lesson
            'title' => fake()->sentence(5) . '?',
            'body' => fake()->paragraph(3),
        ];
    }
}
