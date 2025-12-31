<?php

namespace Database\Factories;

use App\Enums\OrderStatusType;
use App\Enums\PaymentStatusType;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
  protected $model = Payment::class;

  public function definition(): array
  {
    $order = $this->for(Order::class)->create();

    return [
      'method' => fake()->randomElement(["VABCA","VABRI","VAMANDIRI"]),
      'gross_amount' => $order->price_total,
      'net_amount' => $order->price_total - fake()->numberBetween(1000, 5000),
      'fee' => fake()->numberBetween(1000, 5000),
      'unix_timestamp' => fake()->unixTime(),
      'status_code' => fake()->randomElement(['00']), 
      'publisher_order_id' => 'PG-' . fake()->uuid(), 
      'sp_user_hash' => fake()->optional()->sha256(),
      'issuer_code' => fake()->optional()->bankAccountNumber(),
      'settlement_date' => ($order->status == OrderStatusType::Processing) ? fake()->dateTimeThisMonth()->format('Y-m-d H:i:s') : null,
      'payment_link' => ($order->status == OrderStatusType::Pending) ? fake()->url() : null,
      'status' => $order->status == OrderStatusType::Processing ? PaymentStatusType::Paid : fake()->randomElement([PaymentStatusType::Pending]), 
    ];
  }
}
