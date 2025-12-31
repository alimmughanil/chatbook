<?php
namespace Database\Factories;
use App\Enums\ProductStatusType;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory {
    protected $model = Product::class;
    public function definition(): array {
        $titles = ['Jasa Desain Logo', 'Pembuatan Website', 'Artikel SEO', 'Video Editing', 'Admin Sosmed'];
        $t = fake()->randomElement($titles) . ' ' . fake()->word();
        return [
            'user_id' => User::where('role','partner')->inRandomOrder()->first()->id ?? User::factory(),
            'category_id' => Category::inRandomOrder()->first()->id ?? Category::factory(),
            'name' => $t,
            'slug' => Str::slug("$t-". rand(000,111)),
            'price' => fake()->numberBetween(5, 50) * 10000,
            'description' => 'Pengerjaan cepat dan profesional. Revisi sepuasnya.',
            'status' => fake()->randomElement(ProductStatusType::getValues()),
            'is_featured' => fake()->boolean(),
            'thumbnail' => 'https://placehold.co/600x400?text=Service',
        ];
    }
}
