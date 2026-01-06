<?php

namespace App\Http\Services\Payment\Duitku;

use App\Enums\OrderStatusType;
use Error;
use App\Models\Order;
use App\Models\Product;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Services\Payment\Duitku\PaymentService;

class OrderService
{
  public function createOrder(Product $product, $type, $validationData = [], $user = null)
  {
    DB::beginTransaction();
    try {
      if (!$user) {
        $user = auth()->user();
      }

      $data = [
        ...$validationData,
        'user_id' => $user->id,
        'product_id' => $product->id,
        'order_number' => $user->id . $product->id . time(),
        'price_total' => 0,
        'product_price' => intval($product->price),
        'detail' => json_encode($product), // Keeping detail for now, assuming it's a valid column or will be ignored if not fillable
      ];

      // ProductDetail logic removed

      $data['price_total'] = intval($data['product_price']);

      if (in_array($type, OrderStatusType::getValues())) {
        $data['type'] = $type;
      }

      if (empty($data))
        return new Error('Kesalahan sistem. Gagal membuat pesanan, harap coba lagi', 500);

      $order = Order::create($data);
      if (!$order)
        return new Error('Kesalahan sistem. Gagal membuat pesanan, harap coba lagi', 500);

      Payment::create([
        "order_id" => $order->id,
        "gross_amount" => $order->price_total,
        "unix_timestamp" => round(microtime(true) * 1000),
      ]);

      $payment = (new PaymentService())->createInvoice($order->id);
      DB::commit();

      return $payment->payment_link;
    } catch (\Throwable $th) {
      DB::rollBack();
      Log::error("Order create failed", [
        'user_id' => auth()->id(),
        'url' => request()->url(),
        'error' => $th->getMessage(),
      ]);
      return new Error($th->getMessage(), 500);
    }
  }
}
