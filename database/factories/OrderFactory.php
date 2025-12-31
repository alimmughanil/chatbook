<?php
namespace Database\Factories;
use App\Enums\OrderStatusType;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory {
    protected $model = Order::class;
    public function definition(): array {
        $prod = Product::inRandomOrder()->first();
        return [
            'user_id' => User::where('role','user')->inRandomOrder()->first()->id ?? User::factory(),
            'product_id' => $prod->id,
            'type' => 'service',
            'order_number' => 'ORD-' . strtoupper(fake()->bothify('??####')),
            'quantity' => 1,
            'product_price' => $prod->price,
            'price_total' => $prod->price,
            'status' => fake()->randomElement(OrderStatusType::getValues()),
            'note' => 'Mohon segera diproses.',
        ];
    }
}
