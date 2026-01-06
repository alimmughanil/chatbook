<?php

namespace App\Http\Controllers\User\Dashboard;

use Inertia\Inertia;
use App\Models\Order;
use App\Enums\OrderStatusType;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
  public function index(Request $request)
  {
    $query = Order::query()
      ->with([
        'product:id,name,thumbnail',
        'payment'
      ])
      ->where('user_id', auth()->id())
      ->orderBy('id', 'desc');

    $validStatus = OrderStatusType::getValues();

    if ($request->filled('status') && in_array($request->status, $validStatus)) {
      $query->where('status', $request->status);
    }

    $orders = $query->paginate(20);

    $orders->getCollection()->transform(function ($item) {
      return [
        'id' => $item->id,
        'order_number' => $item->order_number,
        'status' => $item->status,
        'product_name' => $item->product->name,
        'thumbnail' => $item->product->thumbnail,
        'price_total' => $item->price_total,
      ];
    });

    return Inertia::render('User/Dashboard/Order/Index', [
      'title' => 'Pesanan Saya',
      'orders' => $orders,
      'status' => $validStatus,
    ]);
  }
}
