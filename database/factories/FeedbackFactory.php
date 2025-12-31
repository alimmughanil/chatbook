<?php
namespace Database\Factories;
use App\Models\Feedback;
use App\Models\User;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory {
    protected $model = Feedback::class;
    public function definition(): array {
        return [
            'user_id' => User::where('role','user')->inRandomOrder()->first()->id,
            'order_id' => Order::inRandomOrder()->first()->id,
            'message' => 'Sangat puas dengan hasilnya!',
            'rating' => 5,
            'type' => 'review',
            'status' => 'active',
        ];
    }
}
