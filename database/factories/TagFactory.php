<?php
namespace Database\Factories;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory {
    protected $model = Tag::class;
    public function definition(): array {
        $t = fake()->unique()->word();
        return [
            'title' => $t,
            'slug' => Str::slug($t),
            'is_active' => true,
            'is_featured' => false,
        ];
    }
}
