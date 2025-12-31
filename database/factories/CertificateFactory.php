<?php

namespace Database\Factories;

use App\Enums\CertificateType;
use App\Enums\ParticipantType;
use App\Models\Certificate;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        return [
            'course_id' => Course::inRandomOrder()->first()->id ?? Course::factory(),
            'type' => fake()->randomElement([ParticipantType::Participant]), // GANTI DENGAN TIPE SEBENARNYA
            'paper_width' => fake()->randomFloat(2, 200, 300), // misal dalam mm
            'paper_height' => fake()->randomFloat(2, 150, 250), // misal dalam mm
            'template' => null,
            'description' => null,
        ];
    }
}
