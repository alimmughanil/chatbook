<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogImage;

class BlogImageSeeder extends Seeder
{
    public function run(): void
    {
        BlogImage::factory()->count(10)->create();
    }
}
