<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Utils\Helper;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
  protected $model = Quiz::class;
  private static $order = 1;

  public function definition(): array
  {
    $jsonPath = resource_path('json/seeders/lessons.json');
    $data = json_decode(File::get($jsonPath), true);
    $video = fake()->randomElements($data)[0];

    return [
      // 'lesson_id' diatur saat create di QuizSeeder
      'title' => "Kuis: " . $video['title'],
      'description' => fake()->optional()->paragraph(),
      'duration' => $video['duration'],
      'duration_seconds' => Helper::timeToSeconds($video['duration']),
      'order' => self::$order++,

    ];
  }

  public function configure()
  {
    return $this->afterCreating(function (Quiz $quiz) {
      if ($quiz->order >= 10) { 
        self::$order = 1;
      }
    });
  }
}
