<?php

namespace Database\Factories;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscussionReplyFactory extends Factory
{
    protected $model = DiscussionReply::class;

    public function definition(): array
    {
        return [
            // 'discussion_id' diatur saat create via DiscussionSeeder
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'body' => fake()->paragraph(fake()->numberBetween(1, 4)),
        ];
    }
}
