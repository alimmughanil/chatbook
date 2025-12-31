<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
  public function run(): void
  {
    $counter = fake()->numberBetween(3, 7);
    $counter = fake()->numberBetween(1, 2);

    Course::factory()
      ->count(10)
      ->has(
        Module::factory()
          ->count($counter) // Setiap course punya 3-7 module
          ->has(
            Lesson::factory()
              ->count($counter),
            'lessons'
          ),
        'modules' // Nama relasi di model Course
      )
      ->create();
  }
}
