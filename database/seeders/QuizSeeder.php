<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
  public function run(): void
  {
    $quizLessons = Lesson::get();

    foreach ($quizLessons as $lesson) {
      Quiz::factory()
        ->has(
          Question::factory()
            ->count(fake()->numberBetween(1, 3)),
          'questions'
        )
        ->create(['lesson_id' => $lesson->id]);
    }
  }
}
