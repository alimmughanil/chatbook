<?php

namespace Database\Factories;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnswerFactory extends Factory
{
    protected $model = Answer::class;

    public function definition(): array
    {
        return [
            // 'question_id' diatur saat create via QuizSeeder
            'answer_text' => fake()->words(fake()->numberBetween(1, 5), true),
            'is_correct' => false, // Default false, diatur di state QuizSeeder
        ];
    }
}
