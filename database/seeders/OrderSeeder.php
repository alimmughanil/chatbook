<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
  public function run(): void
  {
    Order::factory()
      ->count(10)
      ->has(
        Payment::factory()->count(1),
        'payment'
      )
      ->create();
  }
}
