<?php
namespace Database\Factories;
use App\Models\ProductDetail;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductDetailFactory extends Factory {
    protected $model = ProductDetail::class;
    public function definition(): array {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,
            'name' => 'Paket Basic',
            'price' => 100000,
            'is_custom' => false,
            'status' => 'active',
        ];
    }
}
