<?php
namespace Database\Factories;
use App\Enums\PublishStatusType;
use App\Models\BlogCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogCategoryFactory extends Factory {
    protected $model = BlogCategory::class;
    public function definition(): array {
        $name = fake()->unique()->word();
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'status' => PublishStatusType::Publish,
        ];
    }
}
