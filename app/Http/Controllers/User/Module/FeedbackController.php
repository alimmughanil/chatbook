<?php

namespace App\Http\Controllers\User\Module;

use App\Models\Order;
use App\Enums\UserType;
use App\Models\Product;
use App\Models\Feedback;
use App\Enums\FeedbackType;
use Illuminate\Http\Request;
use App\Enums\ChatStatusType;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class FeedbackController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate($this->validation($request)["validation"]);

    $productId = $request->product_id;
    if ($request->filled('order_id')) {
      $order = Order::where('id', $request->order_id)->first();

      if (!$order)
        return redirect()->back()->with('error', "Order tidak ditemukan");

      $productId = $order->product_id;
    }

    $product = Product::firstWhere('id', $productId);
    if (!$product)
      return redirect()->back()->with('error', "Produk ini tidak ditemukan");

    $validatedData['product_id'] = $product->id;
    $validatedData['user_id'] = auth()->user()->id;

    if ($validatedData['type'] == FeedbackType::Comment)
      return $this->chat($validatedData, $product, $request);
    if ($validatedData['type'] == FeedbackType::Rating)
      return $this->rating($validatedData, $product, $request);

    return redirect()->back()->with('error', 'Aksi yang dipilih tidak ditemukan');
  }

  public function chat($validatedData, $product, $request)
  {
    DB::beginTransaction();
    try {
      Feedback::create($validatedData);

      DB::commit();
      return redirect()->back()->with("success", "Pesan Berhasil Dikirim");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with("error", "Pesan Gagal Dikirim. Cobalah beberapa saat lagi");
    }
  }

  public function rating($validatedData, $product, $request)
  {
    DB::beginTransaction();
    try {
      $feedback = Feedback::where(['type' => FeedbackType::Rating, 'product_id' => $validatedData['product_id']])->first();

      if (!empty($feedback)) {
        $feedback->update($validatedData);
      } else {
        Feedback::create($validatedData);
      }

      DB::commit();
      return redirect()->back()->with("success", "Penilaian Berhasil Dikirim. Terima kasih telah menggunakan layanan kami");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with("error", "Penilaian Gagal Dikirim. Cobalah beberapa saat lagi");
    }
  }

  public function updateChatDelivery($fromStatus, $toStatus)
  {
    try {
      Feedback::where('status', $fromStatus)->update([
        'status' => $toStatus,
        'updated_at' => now()
      ]);

      return true;
    } catch (\Throwable $th) {
      return false;
    }
  }

  public function update($productId, $id, Request $request)
  {
    $user = auth()->user();
    $isAdmin = $user->role == UserType::Admin;
    if ($request->filled('status') && $isAdmin)
      return $this->updateStatus($id, $request);
    return redirect()->back()->with('error', 'Aksi yang dipilih tidak ditemukan');
  }

  protected function updateStatus($id, $request)
  {
    DB::beginTransaction();
    try {
      $feedback = Feedback::where(['id' => $id])->first();
      $status = in_array($request->status, ChatStatusType::getValues()) ? $request->status : $feedback->status;

      if (!empty($feedback)) {
        $feedback->update([
          'status' => $status
        ]);
      }

      DB::commit();
      return redirect()->back()->with("success", "Update Status Penilaian Berhasil");
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with("error", "Status Penilaian Gagal Di Update. Cobalah beberapa saat lagi");
    }
  }

  protected function validation($request, $id = null)
  {
    return [
      "validation" => [
        "message" => "required_if:type," . FeedbackType::Comment . "|max:500",
        "rating" => "required_if:type," . FeedbackType::Rating . "|integer|between:1,5",
        "type" => "nullable",
        "status" => "nullable",
        "product_id" => "nullable",
        "order_id" => "nullable",
      ],
      "default" => [
        "type" => FeedbackType::Comment,
        "status" => ChatStatusType::Sent,
      ]
    ];
  }
}
