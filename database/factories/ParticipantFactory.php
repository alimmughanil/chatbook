<?php

namespace Database\Factories;

use App\Enums\ParticipantStatusType;
use App\Models\Course;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipantFactory extends Factory
{
    protected $model = Participant::class;
    private static $participantCounter = []; // Untuk nomor peserta unik per course

    public function definition(): array
    {
        $user = User::factory()->create(['role'=>'user']); // Buat user baru atau gunakan yg ada
        $course = Course::inRandomOrder()->first() ?? Course::factory();

        // Generate nomor peserta unik per course
        $courseId = $course->id;
        if (!isset(self::$participantCounter[$courseId])) {
            self::$participantCounter[$courseId] = $course->participant_start_number ?? 1;
        }
        $number = self::$participantCounter[$courseId]++;
        $format = $course->participant_format_number ?? 'PART-{NNNN}';
        $participantNumber = str_replace('{NNNN}', str_pad($number, 4, '0', STR_PAD_LEFT), $format);


        return [
            'user_id' => $user->id,
            'course_id' => $courseId,
            'type' => 'Individual', // GANTI DENGAN TIPE SEBENARNYA (misal: Corporate)
            'participant_number' => $participantNumber,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone ?? fake()->phoneNumber(),
            'institute' => fake()->optional()->company(),
            'branch' => fake()->optional()->city(),
            'status' => fake()->randomElement(ParticipantStatusType::getValues()), // GANTI DENGAN STATUS SEBENARNYA
        ];
    }
}
