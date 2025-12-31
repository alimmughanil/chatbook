<?php
namespace Database\Factories;
use App\Enums\PublishStatusType;
use App\Models\Blog;
use App\Models\User;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory {
    protected $model = Blog::class;
    public function definition(): array {
        $title = fake()->sentence();
        return [
            'category_id' => BlogCategory::inRandomOrder()->first()->id ?? BlogCategory::factory(),
            'user_id' => User::where('role','admin')->first()->id ?? User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'thumbnail' => 'https://placehold.co/600x400?text=Blog',
            'keyword' => 'tips, freelance, tutorial',
            'description' => fake()->paragraphs(3, true),
            'status' => PublishStatusType::Publish,
            'published_at' => now(),
        ];
    }
}
