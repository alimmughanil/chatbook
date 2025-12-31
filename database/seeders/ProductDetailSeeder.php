<?php
namespace Database\Seeders;
use App\Models\ProductDetail;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductDetailSeeder extends Seeder {
    public function run(): void {
        $products = Product::all();
        foreach($products as $p) { ProductDetail::factory()->create(['product_id'=>$p->id]); }
    }
}
