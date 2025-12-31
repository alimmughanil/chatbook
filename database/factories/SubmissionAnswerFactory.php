<?php

namespace Database\Factories;

use App\Enums\AnswerStatusType;
use App\Models\Answer;
use App\Models\Question;
use App\Models\QuizSubmission;
use App\Models\SubmissionAnswer;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubmissionAnswerFactory extends Factory
{
    protected $model = SubmissionAnswer::class;

    public function definition(): array
    {
        return [
            'quiz_submission_id' => QuizSubmission::factory(), // Placeholder
            'question_id' => Question::factory(), // Placeholder
            'answer_id' => null, // Placeholder
            'essay_answer' => null, // Placeholder
            'status' => fake()->randomElement(AnswerStatusType::getValues()), // GANTI DENGAN STATUS SEBENARNYA
        ];
    }
}
