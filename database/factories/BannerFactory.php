<?php

namespace Database\Factories;

use App\Enums\BannerType;
use App\Models\Banner;
use App\Enums\PublishStatusType;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory
{
    protected $model = Banner::class;

    public function definition(): array
    {
         $hasButton = fake()->boolean(60); // 60% punya tombol
        return [
            'type' => fake()->randomElement(BannerType::getValues()), // GANTI DENGAN TIPE SEBENARNYA
            'file' => fake()->imageUrl(1200, 400, 'business', true), // URL gambar banner
            'title' => fake()->optional()->sentence(4),
            'description' => fake()->optional()->paragraph(1),
            'is_action_button' => $hasButton,
            'action_url' => $hasButton ? fake()->url() : null,
            'status' => fake()->randomElement(PublishStatusType::getValues())
        ];
    }
}
