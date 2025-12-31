<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\Answer;
use App\Models\Question;
use App\Enums\QuestionType;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
  protected $model = Question::class;

  public function definition(): array
  {
    return [
      // 'quiz_id' diatur saat create via QuizSeeder
      'question_text' => fake()->sentence() . '?',
      'type' => fake()->randomElement(QuestionType::getValues()), // GANTI DENGAN TIPE SEBENARNYA
    ];
  }
  public function configure()
  {
    return $this->afterCreating(function (Question $question) {

      if ($question->type === QuestionType::Essay) {
        return;
      }

      if ($question->type === QuestionType::SingleChoice) {
        $correctIndex = fake()->numberBetween(0, 3);

        foreach (range(0, 3) as $i) {
          Answer::factory()->create([
            'question_id' => $question->id,
            'is_correct' => $i === $correctIndex,
          ]);
        }

        return;
      }

      if ($question->type === QuestionType::MultipleChoice) {
        $indices = collect(range(0, 3))
          ->shuffle()
          ->take(fake()->numberBetween(2, 3));

        foreach (range(0, 3) as $i) {
          Answer::factory()->create([
            'question_id' => $question->id,
            'is_correct' => $indices->contains($i),
          ]);
        }

        return;
      }

    });
  }

}
