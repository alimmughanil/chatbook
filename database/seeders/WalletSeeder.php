<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      for ($i=1; $i <= 5; $i++) {
        $order = Order::whereRelation('product', 'assigned_user_id', '=', 5)->inRandomOrder()->where('status', 'success')->first();
        if ($order) {
          \App\Models\Wallet::create([
            'user_id' => 5,
            'order_id' => $order->id,
            'credit' => $order->price_total,
          ]);
        }
      }
    }
}
