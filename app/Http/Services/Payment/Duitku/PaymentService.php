<?php

namespace App\Http\Services\Payment\Duitku;

use Error;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Wallet;
use GuzzleHttp\Client;
use App\Enums\UserType;
use App\Models\Payment;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Enums\OrderStatusType;
use App\Enums\PaymentStatusType;
use App\Constants\NotifConstants;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\User\ProductRegistrationController;

class PaymentService
{
  private $client;
  private $merchantCode;
  private $merchantApiKey;
  public function __construct()
  {
    $baseUrl = env('PAYMENT_BASE_URL');
    $this->client = new Client(['base_uri' => $baseUrl]);
    $this->merchantCode = env('MERCHANT_CODE');
    $this->merchantApiKey = env('MERCHANT_API_KEY');
  }

  public function create(Order $order)
  {
    try {
      Payment::create([
        "order_id" => $order->id,
        "gross_amount" => $order->price_total,
        "unix_timestamp" => round(microtime(true) * 1000),
      ]);
      return $this->createInvoice($order?->id);
    } catch (\Throwable $th) {
      Log::error("Payment create failed", [
        'order_number' => $order->order_number,
        'user_id' => auth()->id(),
        'error' => $th->getMessage(),
      ]);


      return false;
    }
  }

  public function createInvoice($orderId)
  {
    if (!$orderId)
      throw new Error('Order ID tidak valid');

    $order = Order::where('id', $orderId)->with('payment', 'product', 'user:id,name,email')->first();
    if (!$order)
      throw new Error('Pesanan tidak ditemukan');

    $timestamp = $order->payment->unix_timestamp; //in milisecond
    $paymentAmount = intval($order->payment->gross_amount);
    $merchantOrderId = $order->order_number; // dari merchant, unique
    $callbackUrl = env('APP_URL') . '/api/payment/duitku/callback'; // url untuk callback
    $returnUrl = env('APP_URL') . '/app/order/' . $merchantOrderId;  // url untuk redirect
    $expiryPeriod = 60; // untuk menentukan waktu kedaluarsa dalam menit
    $signature = hash('sha256', $this->merchantCode . $timestamp . $this->merchantApiKey);

    // Detail pelanggan
    $customerDetail = [
      'firstName' => '',
      'email' => '',
    ];

    if (isset($order->user)) {
      $customerDetail = [
        'firstName' => $order->user?->name,
        'email' => $order->user?->email,
      ];
    }

    if (isset($order->product)) {
      $productDetails = substr($order->product->name, 0, 100);
    }

    try {
      $req = $this->client->post('/api/merchant/createinvoice', [
        'headers' => [
          'Accept' => 'application/json',
          'Content-Type' => 'application/json',
          'x-duitku-signature' => $signature,
          'x-duitku-timestamp' => $timestamp,
          'x-duitku-merchantcode' => $this->merchantCode
        ],
        'json' => [
          'paymentAmount' => $paymentAmount,
          'merchantOrderId' => $merchantOrderId,
          'productDetails' => $productDetails,
          'customerVaName' => $customerDetail['firstName'],
          'email' => $customerDetail['email'],
          'customerDetail' => $customerDetail,
          'callbackUrl' => $callbackUrl,
          'returnUrl' => $returnUrl,
          'expiryPeriod' => $expiryPeriod
        ]
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response);
      if ($response->statusMessage != "SUCCESS" && auth()->check() && auth()->user()?->role == Usertype::Partner) {
        return redirect("/app/order/$order->order_number");
      }

      if ($response->statusMessage != "SUCCESS")
        return redirect("/app/order/$order->order_number");
      $order->payment->payment_link = $response->paymentUrl;
      $order->payment->save();
      return $order->payment;
    } catch (\Throwable $th) {
      $paymentStatus = $this->status($order->order_number);
      $this->update($order->order_number, $paymentStatus);

      Log::error("Payment create invoice failed", [
        'order_number' => $order->order_number,
        'user_id' => auth()->id(),
        'payment_status' => $paymentStatus,
        'error' => $th->getMessage(),
      ]);

      return $th;
    }
  }

  public function update($orderNumber, $paymentStatus)
  {
    DB::beginTransaction();
    try {
      $order = Order::with('payment', 'product')
        ->where('order_number', $orderNumber)
        ->first();

      if (!$order) {
        throw new \Exception("Order not found.");
      }

      if (!$order->payment) {
        throw new \Exception("Payment not found for order.");
      }

      // === Normalize status code to string
      $code = (string) ($paymentStatus->statusCode ?? '01');

      // === Status mapping
      $statusMap = [
        "00" => PaymentStatusType::Paid,
        "01" => PaymentStatusType::Pending,
        "02" => PaymentStatusType::Cancel,
      ];

      $statusMessage = $statusMap[$code] ?? PaymentStatusType::Pending;
      $isOrderCancel = false;

      // === Special Case: Cancel but "transaction not found"
      if ($statusMessage === PaymentStatusType::Cancel && !empty($paymentStatus->statusMessage)) {

        $lower = strtolower($paymentStatus->statusMessage);

        if (str_contains($lower, 'transaction not found')) {
          $statusMessage = PaymentStatusType::Pending;
        } else {
          $order->status_message = $paymentStatus->statusMessage;
          $isOrderCancel = true;
        }
      }

      // === Expired order
      if ($order->created_at->lt(now()->subDay())) {
        $isOrderCancel = true;
        $order->status_message = "Pembayaran telah kadaluarsa";
        $statusMessage = PaymentStatusType::Cancel;
      }

      // === Update payment model
      $payment = $order->payment;
      $payment->status_code = $code;
      $payment->status = $statusMessage;

      // === Fee & net amount
      if (isset($paymentStatus->fee)) {
        $payment->fee = (int) $paymentStatus->fee;
        $payment->net_amount = ((int) $payment->gross_amount) + ((int) $payment->fee);
      }

      // === Additional fields from gateway callback
      $map = [
        'method' => 'paymentCode',
        'publisher_order_id' => 'publisherOrderId',
        'sp_user_hash' => 'spUserHash',
        'settlement_date' => 'settlementDate',
        'issuer_code' => 'issuerCode',
      ];

      foreach ($map as $field => $source) {
        if (isset($paymentStatus->{$source}) && $paymentStatus->{$source} !== null) {
          $payment->{$field} = $paymentStatus->{$source};
        }
      }

      $payment->save();

      // === Update order status
      if ($isOrderCancel) {
        $order->status = OrderStatusType::Cancel;
      }

      if ($statusMessage === PaymentStatusType::Paid) {
        $order->status = OrderStatusType::Success;
      }

      $order->save();
      DB::commit();


      // === Trigger setOrder() only on Paid
      if ($statusMessage === PaymentStatusType::Paid) {
        $this->setOrder($order);
      }

      return $order;

    } catch (\Throwable $th) {

      Log::error("Payment update failed", [
        'order_number' => $orderNumber ?? null,
        'payment_status' => $paymentStatus,
        'error' => $th->getMessage(),
        'trace' => $th->getTraceAsString(),
      ]);

      DB::rollBack();
      return $order ?? null;
    }
  }

  public function callback(Request $request)
  {
    try {
      if (!$request->merchantCode || !$request->amount || !$request->merchantOrderId || !$request->signature) {
        throw new \Exception("Bad parameter", 400);
      }

      // --- Validasi signature
      $raw = $request->merchantCode . $request->amount . $request->merchantOrderId . $this->merchantApiKey;
      $validSignature = md5($raw);

      if (!hash_equals($validSignature, $request->signature)) {
        throw new \Exception("Bad signature", 400);
      }

      $orderNumber = $request->merchantOrderId;

      $order = Order::where('order_number', $orderNumber)
        ->with('payment', 'product')
        ->first();

      if (!$order) {
        throw new \Exception("Order not found", 404);
      }

      // --- Jika sudah success, hiraukan callback retry
      if ($order->status === OrderStatusType::Success) {
        return response()->json(['message' => 'Already processed'], 200);
      }

      // --- Bentuk object paymentStatus agar cocok dengan update()
      $paymentStatus = (object) [
        'statusCode' => $request->resultCode,
        'statusMessage' => $request->statusMessage ?? null,
        'fee' => $request->fee ?? null,
        'paymentCode' => $request->paymentCode ?? null,
        'publisherOrderId' => $request->publisherOrderId ?? null,
        'spUserHash' => $request->spUserHash ?? null,
        'settlementDate' => $request->settlementDate ?? null,
        'issuerCode' => $request->issuerCode ?? null,
      ];

      // --- Panggil fungsi update() yang sudah standar
      $updated = $this->update($orderNumber, $paymentStatus);

      return response()->json(['message' => 'Payment updated'], 200);

    } catch (\Throwable $th) {

      Log::error("Payment callback failed", [
        'error' => $th->getMessage(),
        'code' => $th->getCode(),
        'request' => $request->all()
      ]);

      $code = $th->getCode();
      if ($code < 100 || $code > 599)
        $code = 400;

      return response()->json(['error' => $th->getMessage()], $code);
    }
  }

  public function status($orderNumber): mixed
  {
    $signature = md5($this->merchantCode . $orderNumber . $this->merchantApiKey);

    try {
      $req = $this->client->post('/api/merchant/transactionStatus', [
        'headers' => [
          'Accept' => 'application/json',
          'Content-Type' => 'application/json',
        ],
        'json' => [
          'merchantCode' => $this->merchantCode,
          'merchantOrderId' => $orderNumber,
          'signature' => $signature
        ]
      ]);
      $response = $req->getBody()->getContents();
      return json_decode($response);
    } catch (\Throwable $th) {
      $response = explode(':', $th->getMessage());
      $data = [
        'statusCode' => 02,
        'statusMessage' => $response[count($response) - 1],
      ];
      return json_decode(collect($data)->toJson());
    }
  }

  public function setOrder($order)
  {
    DB::beginTransaction();
    try {
      $order = Order::where('id', $order->id)->with('payment', 'product')->first();
      if ($order->payment->status != PaymentStatusType::Paid)
        return;

      $order->status = OrderStatusType::Processing;
      $order->save();

      $clientBody = str_replace('{order_id}', $order->order_number, NotifConstants::$CLIENT['PAYMENT_SUCCESS']);
      $freelancerBody = str_replace('{order_id}', $order->order_number, NotifConstants::$FREELANCER['PAYMENT_SUCCESS']);

      $freelancerUserId = $order?->product?->assigned_user_id ?? $order?->product?->user_id;
      $notifData = [
        [
          'user_id' => $order->user_id,
          'order_id' => $order->id,
          'body' => $clientBody,
          'created_at' => now(),
          'updated_at' => now(),
          'type' => 'PAYMENT_SUCCESS',
        ],
        [
          'user_id' => $freelancerUserId,
          'order_id' => $order->id,
          'body' => $freelancerBody,
          'created_at' => now(),
          'updated_at' => now(),
          'type' => 'PAYMENT_SUCCESS',
        ],
      ];
      Notification::insert($notifData);

      DB::commit();
    } catch (\Throwable $th) {
      DB::rollBack();
      $order->status = OrderStatusType::Pending;
      $order->save();
    }
  }
}
