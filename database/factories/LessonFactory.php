<?php

namespace Database\Factories;

use App\Utils\Helper;
use App\Models\Lesson;
use App\Models\Module;
use App\Enums\LessonContentType;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
  protected $model = Lesson::class;
  private static $order = 1;

  public function definition(): array
  {

    $jsonPath = resource_path('json/seeders/lessons.json');
    $data = json_decode(File::get($jsonPath), true);
    $video = fake()->randomElements($data)[0];

    return [
      'module_id' => Module::factory(),
      'title' => $video['title'],
      'content_type' => LessonContentType::Video,
      'description' => fake()->optional()->paragraph(),
      'thumbnail' => $video['thumbnail'],
      'video_url' => $video['video_url'],
      'duration' => $video['duration'],
      'duration_seconds' => Helper::timeToSeconds($video['duration']),
      'order' => self::$order++,
    ];
  }

  // Reset order counter for each new module
  public function configure()
  {
    return $this->afterCreating(function (Lesson $lesson) {
      if ($lesson->order >= 10) { // Assuming max 10 lessons, reset for next module
        self::$order = 1;
      }
    });
  }
}
