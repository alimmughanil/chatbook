<?php

namespace Database\Factories;

use App\Enums\LessonProgressStatusType;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonProgressFactory extends Factory
{
    protected $model = LessonProgress::class;

    public function definition(): array
    {
        // Logika untuk mengambil user_id dan lesson_id yang valid
        // Sebaiknya dilakukan di Seeder untuk memastikan user terdaftar di course lesson tsb
        return [
            'user_id' => User::factory(), // Placeholder, override di seeder
            'lesson_id' => Lesson::factory(), // Placeholder, override di seeder
            'completed_at' => now(),
            'status' => LessonProgressStatusType::Completed,
        ];
    }
}
