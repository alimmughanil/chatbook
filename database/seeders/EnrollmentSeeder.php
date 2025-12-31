<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\User;
use App\Models\Course;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();
        $courses = Course::all();

        if($students->isEmpty() || $courses->isEmpty()){
            $this->command->warn('No students or courses found, skipping enrollment seeding.');
            return;
        }

        // Setiap siswa mendaftar di 1-3 kursus acak
        foreach ($students as $student) {
             $enrollCount = fake()->numberBetween(1, min(3, $courses->count()));
             $enrolledCourses = $courses->random($enrollCount);

             foreach($enrolledCourses as $course){
                // Pastikan tidak duplikat enrollment
                 Enrollment::factory()->create([
                     'user_id' => $student->id,
                     'course_id' => $course->id,
                 ]);
             }
        }
    }
}
