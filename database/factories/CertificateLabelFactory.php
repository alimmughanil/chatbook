<?php

namespace Database\Factories;

use App\Enums\CertificateType;
use App\Models\Certificate;
use App\Models\CertificateLabel;
use Illuminate\Database\Eloquent\Factories\Factory;

class CertificateLabelFactory extends Factory
{
    protected $model = CertificateLabel::class;

    public function definition(): array
    {
        return [
            // 'certificate_id' diatur saat create via CertificateSeeder
            'type' => fake()->randomElement(CertificateType::getValues()), // GANTI DENGAN TIPE SEBENARNYA
            'x_coordinate' => fake()->numberBetween(10, 180) . 'mm',
            'y_coordinate' => fake()->numberBetween(10, 130) . 'mm',
            'box_height' => fake()->numberBetween(10, 30) . 'mm',
            'box_width' => fake()->numberBetween(50, 150) . 'mm',
            'font_size' => fake()->optional()->randomFloat(1, 10, 24), // misal dalam pt
        ];
    }
}
