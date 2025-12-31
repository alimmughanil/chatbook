<?php

namespace Database\Factories;

use App\Enums\OriginStatusType;
use App\Models\Certificate;
use App\Models\Participant;
use App\Models\ParticipantCertificate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParticipantCertificateFactory extends Factory
{
    protected $model = ParticipantCertificate::class;

    public function definition(): array
    {
        return [
            'certificate_id' => Certificate::factory(), // Placeholder
            'participant_id' => Participant::factory(), // Placeholder
            'document' => fake()->optional()->filePath(), // Path ke file PDF sertifikat
            'status' => fake()->randomElement(OriginStatusType::getValues()), // GANTI DENGAN STATUS SEBENARNYA
        ];
    }
}
