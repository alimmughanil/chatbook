<?php

namespace App\Http\Controllers\Admin;

use Error;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Utils\Helper;
use App\Models\Wallet;
use App\Enums\UserType;
use App\Models\Product;
use App\Enums\OrderType;
use App\Enums\HistoryType;
use App\Enums\PaymentType;
use App\Models\Attachment;
use App\Models\WorkHistory;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Enums\AttachmentType;
use App\Enums\WorkStatusType;
use App\Models\ProductDetail;
use App\Enums\OrderStatusType;
use App\Enums\OriginStatusType;
use App\Constants\NotifConstants;
use Illuminate\Support\Facades\DB;
use App\Enums\AttachmentContentType;
use Illuminate\Support\Facades\Storage;
use App\Http\Services\Payment\Duitku\OrderService;
use App\Http\Controllers\Core\BaseResourceController;

class OrderController extends BaseResourceController
{
  protected $model = Order::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "order",
      "inertia" => "Admin/Order",
      "label" => "Pesanan",
      "url" => "/" . $request->path(),
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    if ($this->routeType != 'show') {
      $pageUrl = explode("/{$page['name']}", $page['url']);
      $page['url'] = "{$pageUrl[0]}/{$page['name']}";
    }

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    return $query->with('product', 'payment', 'user', 'productDetail', 'workHistory.user', 'workHistory.attachment', 'lastWork')
      ->when(auth()->user()->role == UserType::Partner, function ($query) use ($request) {
        $user = auth()->user();
        $query->whereRelation('product', 'user_id', '=', $user->id)->orWhereRelation('product', 'assigned_user_id', '=', $user->id);
      })
      ->when($request->has('filter'), function ($query) use ($request) {
        $query->where('status', $request->filter);
      })
      ->orderBy('updated_at', 'DESC');
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $indexData = parent::indexData($request, $isFormData);

    return [
      ...$indexData,
      'status' => array_values(OrderStatusType::asArray()),
      'sendStatus' => session('sendStatus'),
    ];
  }

  protected function instanceData($orders)
  {
    $orders->map((function ($order) {
      $order['work_status'] = null;

      if (!empty($order['work_history'])) {
        $latestHistory = collect($order['work_history'])->last();
        $order['work_status'] = "work.{$latestHistory['status']}.{$latestHistory['type']}";
        $order['updated_at'] = $latestHistory['created_at'];
      }
      return $order;
    }));

    return $orders;
  }

  protected function validation(Request $request, $id = null): array
  {
    if ($request->cancel) {
      return [
        "validation" => [
          'cancel_message' => 'required|string',
        ],
        "default" => []
      ];
    }

    if ($request->refund) {
      return [
        "validation" => [
          'bank_name' => 'required',
          'bank_account' => 'required',
          'bank_alias' => 'required',
          'attachment' => 'required|file|mimes:png,jpg,jpeg',
        ],
        "default" => []
      ];
    }

    if ($request->submit) {
      return [
        "validation" => [
          'message' => 'required',
          'attachment_link' => 'nullable',
          'attachment' => 'nullable',
        ],
        "default" => []
      ];
    }

    return [
      "validation" => [
        'user_id' => 'required',
        'product_id' => 'required',
        'product_detail_id' => 'required',
        'is_custom' => 'required',
        'price_total' => 'nullable',
        'item_total' => 'nullable',
      ],
      "default" => []
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $packages = null;
    $customs = null;
    $users = User::select('id', 'name', 'email', 'phone')->where('status', OriginStatusType::Active)->where('role', UserType::User)->get();
    $products = Product::select('id', 'name')
      ->when(auth()->user()->role == UserType::Partner, function ($query) use ($request) {
        $user = auth()->user();
        $query->where('user_id', $user->id)->orWhere('assigned_user_id', $user->id);
      })
      // ->where('status', PublishStatusType::Publish)
      ->get();

    $users = $users->map(fn($user) => ([
      'value' => $user->id,
      'label' => "$user->name - ($user->email - $user->phone)",
    ]))->toArray();

    $products = $products->map(fn($product) => ([
      'value' => $product->id,
      'label' => "$product?->name",
    ]))->toArray();

    array_unshift($users, [
      'value' => 'other',
      'label' => 'Belum Terdaftar'
    ]);

    if ($request->product_id) {
      $packages = ProductDetail::select('id', 'name', 'price')
        ->when($request->has('is_custom'), function ($query) use ($request) {
          $query->where('is_custom', $request->is_custom);
        })
        ->where('product_id', $request->product_id)
        ->get();

      $packages = $packages->map(fn($package) => ([
        'value' => $package->id,
        'label' => "$package->name - Rp " . number_format($package->price, 0, ",", "."),
      ]))->toArray();

      $customs = [
        [
          'value' => 1,
          'label' => 'Ya',
        ],
        [
          'value' => 0,
          'label' => 'Tidak',
        ],
      ];
    }

    return [
      ...parent::getFormData($request, $model),
      'users' => $users,
      'products' => $products,
      'packages' => $packages,
      'customs' => $customs,
    ];
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    if ($validatedData['user_id'] == 'other') {
      $userData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:' . User::class,
        'phone' => 'nullable',
      ]);
      $user = User::create($userData);
      $validatedData['user_id'] = $user->id;
    }

    $package = ProductDetail::where('id', $validatedData['product_detail_id'])->first();
    $validatedData['price_total'] = $package->price;

    unset($validatedData['is_custom']);

    return $validatedData;
  }

  public function store(Request $request)
  {
    $validation = $this->validation($request)["validation"];
    $detailValidation = isset($this->validation($request)["detail_validation"]) ? $this->validation($request)["detail_validation"] : [];
    $validation = array_merge($validation, $detailValidation);

    $validated = $request->validate($validation);

    DB::beginTransaction();
    try {
      $validated = $this->beforeSave($validated, $request);

      $product = Product::find($validated['product_id']);
      $package = ProductDetail::find($validated['product_detail_id']);
      $user = User::find($validated['user_id']);
      $orderResponse = (new OrderService())->createOrder($product, OrderType::Product, $package, $validated, $user);

      DB::commit();
      return redirect('/admin/order')->with('success', "Tambah {$this->page["label"]} Berhasil. Silahkan hubungi client untuk melakukan pembayaran.");
    } catch (\Throwable $th) {
      DB::rollBack();
      if ($th->getCode() < 500) {
        return back()->with("error", $th->getMessage());
      }

      if ($orderResponse && $orderResponse instanceof \Illuminate\Http\RedirectResponse) {
        return $orderResponse;
      }
      return back()->with("error", "Tambah {$this->page["label"]} Gagal: {$th->getMessage()}");
    }
  }

  protected function actionUpdate($id, Request $request)
  {
    if ($request->cancel)
      return $this->cancelOrder($id, $request);
    if ($request->refund)
      return $this->refundOrder($id, $request);
    if ($request->submit)
      return $this->submitOrder($id, $request);

    return null;
  }

  private function cancelOrder($id, Request $request)
  {
    $validate = $request->validate([
      'cancel_message' => 'required|string',
    ]);

    DB::beginTransaction();
    try {
      $order = Order::where('id', $id)->first();
      $order->status = OrderStatusType::Cancel;
      $order->status_message = $validate['cancel_message'];
      $order->save();

      $history['order_id'] = $id;
      $history['user_id'] = auth()->user()->id;
      $history['type'] = HistoryType::Request;
      $history['status'] = WorkStatusType::Cancel;
      $history['message'] = $validate['cancel_message'];
      WorkHistory::create($history);

      $client = User::where('id', $order->user_id)->first();

      // Notification
      $clientBody = str_replace(['{order_id}', '{username/email}'], [$order->order_number, auth()->user()->name . '/' . auth()->user()->email], NotifConstants::$CLIENT['WORK_CANCELLED']);
      $freelancerBody = str_replace('{order_id}', $order->order_number, NotifConstants::$FREELANCER['WORK_CANCELLED']);
      $adminBody = str_replace(['{order_id}', '{partner_name/email}', '{client_name/email}'], [$order->order_number, auth()->user()->name . '/' . auth()->user()->email, $client->name . '/' . $client->email], NotifConstants::$ADMIN['WORK_CANCELLED']);
      $notifData = [
        [
          'user_id' => $order->user_id,
          'order_id' => $order->id,
          'body' => $clientBody,
          'created_at' => now(),
          'updated_at' => now(),
          'type' => 'WORK_CANCELLED',
        ],
        [
          'user_id' => auth()->user()->id,
          'order_id' => $order->id,
          'body' => $freelancerBody,
          'created_at' => now(),
          'updated_at' => now(),
          'type' => 'WORK_CANCELLED',
        ],
        [
          'user_id' => User::where('role', 'admin')->first()->id,
          'order_id' => $order->id,
          'body' => $adminBody,
          'created_at' => now(),
          'updated_at' => now(),
          'type' => 'WORK_CANCELLED',
        ],
      ];
      Notification::insert($notifData);

      DB::commit();
      return redirect('/admin/order')->with('success', 'Update pesanan berhasil');
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Update pesanan gagal');
    }
  }

  private function refundOrder($id, Request $request)
  {
    $validate = $request->validate([
      'bank_name' => 'required',
      'bank_account' => 'required',
      'bank_alias' => 'required',
      'attachment' => 'required|file|mimes:png,jpg,jpeg',
    ]);
    DB::beginTransaction();
    $order = Order::where('id', $id)->with('refund')->first();
    if (!$order)
      return redirect()->back()->with('error', 'Pesanan ini tidak ditemukan. Harap hubungi customer service');

    try {
      if ($request->file('attachment')) {
        $fileExt = $request->file('attachment')->getClientOriginalExtension();
        $fileName = "attachment_{$order->order_number}.{$fileExt}";
        $file = Storage::disk('public')->putFileAs('document', $request->file('attachment'), $fileName);
        $validate['attachment'] = '/storage/' . $file;
      }
      $validate['status'] = PaymentType::Success;
      $order->refund?->update($validate);
      DB::commit();
      return redirect('/admin/order')->with('success', 'Update pesanan berhasil');
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Update pesanan gagal');
    }
  }

  public function sendInvoice($orderNumber, Request $request)
  {
    try {
      $baseUrl = env('API_URL');
      $client = new \GuzzleHttp\Client(['base_uri' => $baseUrl]);
      $req = $client->get("/api/order/$orderNumber/invoice", [
        'headers' => [
          'x-ref-cors-backoffice' => env('APP_URL')
        ],
      ]);
      $response = $req->getBody()->getContents();
      $response = json_decode($response, true);
      if ($response['status'] != 200)
        throw new Error($response['message'], $response['status']);

      if ($request->order_id) {
        return redirect('/admin/order?order_id=' . $request->order_id)->with('sendStatus', $response['message']);
      }
      return redirect()->back()->with('sendStatus', $response['message']);
    } catch (\Throwable $th) {
      return redirect()->back()->with('sendStatus', $th->getMessage());
    }
  }

  public function finishOrder($orderNumber, $body)
  {
    try {
      $validate = $body;
      $order = Order::where('order_number', $orderNumber)->with('payment')->first();

      $history['order_id'] = $order->id;
      $history['status'] = $validate['status'];
      $history['type'] = $validate['type'];
      $history['message'] = $validate['message'];
      WorkHistory::create($history);

      if ($validate['status'] == WorkStatusType::Finish && $validate['type'] == HistoryType::Response) {
        $order->status = OrderStatusType::Success;
        $order->save();

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

      return response()->json(['status' => 200, 'message' => 'Pekerjaan berhasil diselesaikan']);
    } catch (\Throwable $th) {
      return response()->json(['status' => 500, 'message' => $th->getMessage()]);
    }
  }
}
