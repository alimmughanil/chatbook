<?php

namespace Database\Factories;

use App\Enums\ImageType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Image;

class ImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => rand(1, 5),
            'type' => ImageType::File,
            'link' => null,
            'file' => 'https://placehold.co/600x400?text=Lampiran',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
