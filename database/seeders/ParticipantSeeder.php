<?php

namespace Database\Seeders;

use App\Models\Participant;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Seeder;

class ParticipantSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();
        $students = User::where('role', 'user')->get();

        if ($courses->isEmpty() || $students->isEmpty()) {
            $this->command->warn('No courses or students found, skipping participant seeding.');
            return;
        }

        // Daftarkan setiap student ke 1-2 course sebagai participant
        foreach ($students as $student) {
            $courseCount = fake()->numberBetween(1, min(2, $courses->count()));
            $selectedCourses = $courses->random($courseCount);

            foreach ($selectedCourses as $course) {
                 // Cek jika sudah ada
                 if (!Participant::where('user_id', $student->id)->where('course_id', $course->id)->exists()) {
                     Participant::factory()->create([
                         'user_id' => $student->id,
                         'course_id' => $course->id,
                         'name' => $student->name, // Ambil dari user
                         'email' => $student->email, // Ambil dari user
                         'phone' => $student->phone ?? fake()->phoneNumber(), // Ambil dari user jika ada
                     ]);
                 }
            }
        }
    }
}
