<?php

namespace Database\Seeders;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use Illuminate\Database\Seeder;

class DiscussionSeeder extends Seeder
{
    public function run(): void
    {
        Discussion::factory()
            ->count(20) // Buat 20 diskusi
            ->has(
                DiscussionReply::factory()
                    ->count(fake()->numberBetween(0, 8)), // Setiap diskusi punya 0-8 balasan
                'replies'
            )
            ->create();
    }
}
