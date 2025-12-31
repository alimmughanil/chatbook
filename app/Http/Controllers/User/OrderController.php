<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderType;
use Error;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\Product;
use App\Enums\OrderStatusType;
use App\Enums\HistoryType;
use App\Enums\PaymentType;
use App\Models\WorkHistory;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Enums\WorkStatusType;
use App\Models\Configuration;
use App\Models\ProductDetail;
use App\Enums\PaymentStatusType;
use App\Constants\NotifConstants;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Services\Payment\Duitku\OrderService;
use App\Http\Services\Payment\Duitku\PaymentService;

class OrderController extends Controller
{
  public function create(Request $request)
  {
    $product = Product::with('user')->find($request->product_id);
    $package = ProductDetail::find($request->product_detail_id);

    if (!$product || !$package || $package->product_id !== $product->id) {
      return to_route('app.service.index')->with('error', 'Produk atau paket tidak valid.');
    }

    return Inertia::render('User/Order/Create', [
      'product' => $product,
      'package' => $package,
      'user' => $request->user(),
    ]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'product_id' => 'required|exists:products,id',
      'product_detail_id' => 'nullable|exists:product_details,id',
      'note' => 'nullable|string|max:500',
    ]);

    DB::beginTransaction();
    try {
      $product = Product::find($validated['product_id']);
      if (!$product) {
        throw new Error("Produk tidak ditemukan");
      }

      $package = null;
      if ($request->filled('product_detail_id')) {
        $package = ProductDetail::find($validated['product_detail_id']);
        if (!$package) {
          throw new Error("Paket tidak ditemukan");
        }
      }


      $orderResponse = (new OrderService())->createOrder($product, OrderType::Product, $package, $validated);

      DB::commit();

      if (is_string($orderResponse) && !empty($orderResponse) && filter_var($orderResponse, FILTER_VALIDATE_URL)) {
        return Inertia::location($orderResponse);
      }

      if ($orderResponse && $orderResponse instanceof \Illuminate\Http\RedirectResponse) {
        return $orderResponse;
      }

    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }

      if ($orderResponse && $orderResponse instanceof \Illuminate\Http\RedirectResponse) {
        return $orderResponse;
      }

      return back()->with("error", "Checkout pesanan gagal diproses, silahkan hubungi Admin untuk informasi lebih lanjut.");
    }
  }

  public function show($orderNumber)
  {
    if (request()->type === "refund-attachment") {
      return $this->refundAttachment($orderNumber);
    }

    $relation = [
      'payment',
      'user',
      'product.assignedUser',
      'productDetail',
      'ratings',
      'comments',
      'lastWork' => ['user', 'attachment'],
      'workHistory' => ['user', 'attachment'],
    ];

    $orderQuery = Order::where('order_number', $orderNumber)
      ->where('user_id', auth()->id())
      ->with($relation);

    $order = $orderQuery->first();

    if (!$order) {
      return redirect()->route('user.orders.index')->with('error', 'Pesanan ini tidak ditemukan');
    }

    $banks = Configuration::where('type', 'SUPPORTED_BANK')
      ->where('status', 'active')
      ->get();

    $data = [
      'title' => "Pesanan #{$order->order_number}",
      'order' => $order,
      'banks' => $banks,
    ];

    if ($order->payment->status == PaymentStatusType::Pending && $order->status == OrderStatusType::Pending) {
      $paymentStatus = null;
      try {
        $paymentStatus = (new PaymentService())->status($orderNumber);
      } catch (\Throwable $th) {
        Log::error("Payment status check failed", [
          'order_number' => $orderNumber,
          'user_id' => auth()->id(),
          'error' => $th->getMessage(),
        ]);
      }

      if ($paymentStatus) {
        try {
          (new PaymentService())->update($order->order_number, $paymentStatus);
          $data['order'] = $orderQuery->first();
        } catch (\Throwable $th) {
          Log::error("Payment update failed", [
            'order_number' => $orderNumber,
            'user_id' => auth()->id(),
            'payment_status' => $paymentStatus,
            'error' => $th->getMessage(),
          ]);
        }
      }
    }

    return Inertia::render('User/Dashboard/Order/Show', $data);
  }

  public function refundAttachment($orderNumber)
  {
    $order = Order::where('order_number', $orderNumber)->with('refund')->first();

    $path = $order->refund?->attachment;
    if ($path && str($path)->startsWith('/storage/')) {
      $path = str_replace('/storage/', '', $path);
    }

    if (!$path || !Storage::disk('public')->exists($path)) {
      return back()->with('error', 'Bukti pengembalian dana tidak ditemukan');
    }

    $fullPath = Storage::disk('public')->path($path);
    return response()->download($fullPath);
  }
  public function update($orderNumber, Request $request)
  {
    $validate = $request->validate([
      'message' => 'nullable',
      'type' => 'required',
      'status' => 'required',
    ]);

    DB::beginTransaction();
    try {
      $user = auth()->user();
      $order = Order::where('order_number', $orderNumber)->with('payment')->where('user_id', $user->id)->first();
      if (!$order)
        throw new Error('Pesanan ini tidak ditemukan', 404);

      $history['order_id'] = $order->id;
      $history['user_id'] = $user->id;
      $history['status'] = $validate['status'];
      $history['type'] = $validate['type'];
      $history['message'] = $validate['message'];
      WorkHistory::create($history);

      if ($validate['status'] == WorkStatusType::Revision && $validate['type'] == HistoryType::Request) {
        // Notification
        $clientBody = str_replace('{order_id}', $order->order_number, NotifConstants::$CLIENT['REQUEST_REVISION']);
        $freelancerBody = str_replace('{order_id}', $order->order_number, NotifConstants::$FREELANCER['REQUEST_REVISION']);
        $notifData = [
          [
            'user_id' => $order->user->id,
            'order_id' => $order->id,
            'body' => $clientBody,
            'created_at' => now(),
            'updated_at' => now(),
            'type' => 'REQUEST_REVISION',
          ],
          [
            'user_id' => $order->product->user_id,
            'order_id' => $order->id,
            'body' => $freelancerBody,
            'created_at' => now(),
            'updated_at' => now(),
            'type' => 'REQUEST_REVISION',
          ],
        ];
        Notification::insert($notifData);
      }

      if ($validate['status'] == WorkStatusType::Finish && $validate['type'] == HistoryType::Response) {
        $order->status = OrderStatusType::Success;
        $freelancerBody = str_replace('{order_id}', $order->order_number, NotifConstants::$FREELANCER['WORK_APPROVED']);

        $notifData = [
          [
            'user_id' => $order->product->user_id,
            'order_id' => $order->id,
            'body' => $freelancerBody,
            'created_at' => now(),
            'updated_at' => now(),
            'type' => 'WORK_APPROVED',
          ],
        ];
        Notification::insert($notifData);

        $wallet['order_id'] = $order->id;
        $wallet['user_id'] = $order->product?->assigned_user_id ?: $order->product?->user_id;
        $wallet['credit'] = $order->price_total;
        Wallet::create($wallet);
      }

      if ($validate['status'] == WorkStatusType::Cancel && $validate['type'] == HistoryType::Response) {
        $order->status = OrderStatusType::Cancel;
        $order->payment->status = PaymentType::Refund;
      }

      $order->updated_at = now();
      $order->save();
      
      DB::commit();
      return redirect()->back()->with('success', 'Perubahan status pekerjaan telah dikirimkan.');
    } catch (\Throwable $th) {
      Log::error(request()->fullUrl() . "_" . $th->getMessage());

      DB::rollback();
      return redirect()->back()->with('error', 'Perubahan status pekerjaan gagal dikirimkan. Silahkan coba lagi.');
    };
  }
}
