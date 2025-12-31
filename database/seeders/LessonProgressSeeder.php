<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Database\Seeder;

class LessonProgressSeeder extends Seeder
{
    public function run(): void
    {
        $enrollments = Enrollment::with('course.modules.lessons')->get();

        if($enrollments->isEmpty()){
            $this->command->warn('No enrollments found, skipping lesson progress seeding.');
            return;
        }

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            $lessons = $enrollment->course->modules->flatMap->lessons;
            if($lessons->isEmpty()) continue;

            // Tandai beberapa lesson (acak) sebagai selesai
            $completedCount = fake()->numberBetween(0, $lessons->count());
            $completedLessons = $lessons->random($completedCount);

            foreach ($completedLessons as $lesson) {
                 // Pastikan tidak duplikat progress
                 LessonProgress::factory()->create([
                     'user_id' => $enrollment->user_id,
                     'lesson_id' => $lesson->id,
                     'course_id' => $course->id,
                     'completed_at' => fake()->dateTimeBetween($enrollment->enrolled_at, 'now'),
                 ]);
            }
        }
    }
}
