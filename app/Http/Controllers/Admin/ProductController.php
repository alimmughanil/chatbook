<?php

namespace App\Http\Controllers\Admin;

use App\Models\Tag;
use App\Models\User;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\UserType;
use App\Models\Product;
use App\Enums\ImageType;
use App\Models\Category;
use App\Enums\ActionType;
use App\Models\ProductTag;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Models\ProductDetail;
use App\Enums\OriginStatusType;
use App\Enums\ProductStatusType;
use App\Constants\NotifConstants;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Core\BaseResourceController;
use App\Http\Controllers\Api\NotificationApiController;

class ProductController extends BaseResourceController
{
  protected $model = Product::class;

  protected function getPage(Request $request, $id = null): array
  {
    $page = [
      "name" => "product",
      "inertia" => "Admin/Product",
      "label" => "Produk",
      "url" => "/admin/product",
      "fields" => Helper::getFormFields($this->validation($request)),
    ];

    return $page;
  }

  protected function indexQuery($query, Request $request)
  {
    $query->with('category', 'user', 'assignedUser')
      ->when(auth()->user()->role == UserType::Partner, function ($query) use ($request) {
        $user = auth()->user();
        $query->where('user_id', $user->id)->orWhere('assigned_user_id', $user->id);
      })
      ->when($request->filled('addedBy'), function ($query) use ($request) {
        $query->where('user_id', $request->addedBy);
      })
      ->when($request->filled('categories'), function ($query) use ($request) {
        $query->where('category_id', $request->categories);
      })
      ->orderBy('updated_at', 'DESC')
      ->orderBy('is_featured', 'DESC')
      ->orderBy('sort_number', 'ASC');

    if ($request->showProduct === 'featured') {
      $query->where('status', ProductStatusType::Publish)
        ->where('is_featured', 1)
        ->orderByRaw('CASE WHEN sort_number IS NULL THEN 1 ELSE 0 END')
        ->orderBy('sort_number', 'asc')
        ->orderByDesc('updated_at');
    }

    return $query;
  }

  protected function indexData(Request $request, $isFormData = true): array
  {
    $partner = User::adminPartner()->get();
    $partner = $partner->map(fn($ps) => ([
      'value' => $ps->id,
      'label' => $ps->name,
    ]))->toArray();
    $categories = Category::get();
    $categories = $categories->map(fn($cat) => ([
      'value' => $cat->id,
      'label' => $cat->name,
    ]))->toArray();

    return [
      ...parent::indexData($request, $isFormData),
      'partner' => $partner,
      'categories' => $categories,
      'isAdmin' => auth()->user()->role == UserType::Admin
    ];
  }

  protected function validation(Request $request, $id = null): array
  {
    return [
      "validation" => [
        'name' => 'required',
        'slug' => 'required|unique:' . Product::class . ',slug,' . $id,
        'category_id' => 'required',
        'assigned_user_id' => 'nullable',
        'price' => 'nullable',
        'description' => 'nullable',
        'thumbnail' => 'nullable',
        'status' => 'nullable',
        'is_featured' => 'nullable',
        'sort_number' => 'nullable',
        'tags' => 'nullable',
        'keywords' => 'nullable',
        'meta_description' => 'nullable',
      ],
      "default" => [
        "status" => ProductStatusType::Draft,
      ]
    ];
  }

  protected function getFormData(Request $request, $model = null): array
  {
    $categories = Category::selectOptions()->get();
    $partner = User::partner()->selectOptions()->get();
    $tags = Tag::selectOptions("id", "title")->get();

    $productTags = [];
    if ($model) {
      $productTags = ProductTag::where('product_id', $model->id)->with('tag')->get();
      $productTags = $productTags->map(fn($productTag) => ([
        'id' => $productTag->id,
        'value' => $productTag->tag->id,
        'label' => $productTag->tag->title,
      ]))->toArray();
    }

    return [
      ...parent::getFormData($request, $model),
      'status' => array_values(ProductStatusType::asArray()),
      'categories' => $categories,
      'partner' => $partner,
      'tags' => $tags,
      'productTags' => $productTags,
      'isAdmin' => auth()->user()->role == UserType::Admin
    ];
  }

  protected function beforeActionPage(Request $request, $action = ActionType::Read)
  {
    if (in_array($action, [ActionType::Create, ActionType::Edit])) {
      $user = auth()->user();
      if ($user->role == UserType::Partner && !$user->profile()->exists()) {
        return redirect("/app/profile")->with('error', 'Silahkan lengkapi profil mitra terlebih dahulu');
      }
    }
    return null;
  }

  protected function beforeSave(array $validatedData, Request $request): array
  {
    $validatedData['slug'] = str_replace(' ', '-', strtolower($validatedData['slug']));
    $validatedData['slug'] = preg_replace('/[^A-Za-z0-9-]/', '', $validatedData['slug']);

    if ($request->file('thumbnail')) {
      $fileExt = $request->file('thumbnail')->getClientOriginalExtension();
      $fileName = $validatedData['slug'] . '.' . $fileExt;
      $file = Storage::disk('public')->putFileAs('thumbnail', $request->file('thumbnail'), $fileName);
      $validatedData['thumbnail'] = '/storage/' . $file;
    }

    $user = auth()->user();
    $validatedData['user_id'] = $user->id;
    if ($user->role == UserType::Partner) {
      $validatedData['assigned_user_id'] = $user->id;
    }

    if ($this->modelInstance) {
      $validatedData['user_id'] = $this->modelInstance->user_id;
    }

    $validatedData['is_featured'] = $request->is_featured ?? 0;
    if ($validatedData['is_featured'] == 1) {
      $validatedData['sort_number'] = 1;
      $lastProduct = Product::whereNotNull('sort_number')->orderBy('sort_number', 'DESC')->first();

      if ($lastProduct) {
        $validatedData['sort_number'] = intval($lastProduct->sort_number) + 1;
      }
    }

    return $validatedData;
  }

  protected function afterSave($model, Request $request)
  {
    $tags = json_decode($request->tags, true);
    if (!empty($tags)) {
      $model->productTag()->delete();
      $tags = collect($tags)->map(function ($tag) use ($model) {
        return [
          'product_id' => $model->id,
          'tag_id' => $tag['value'],
          'created_at' => now(),
          'updated_at' => now(),
        ];
      })->toArray();
      ProductTag::insert($tags);
    }
  }

  protected function inertiaRedirect(Request $request, $type)
  {
    $pageUrl = $this->page["url"];
    $message = "$type {$this->page["label"]} Berhasil. ";
    if ($type == 'Tambah') {
      $pageUrl = "/admin/product/{$this->modelInstance->id}?show=packet";
      $message .= "Silahkan tambahkan paket untuk produk ini.";
    }

    return redirect(Helper::getRefurl($request) ?? $pageUrl)->with("success", $message);
  }

  public function show($id, Request $request)
  {
    $product = Product::with('category', 'image', 'productTag.tag')->whereId($id)->first();
    if (!$product)
      return redirect('/admin/product');

    $user = auth()->user();
    if ($user->role == UserType::Partner && $product->user_id != $user->id && $product->assigned_user_id != $user->id) {
      return redirect('/admin/product')->with('error', 'Anda tidak diperbolehkan mengedit produk ini');
    }

    $categories = Category::get();
    $partner = User::partner()->get();
    $productDetail = ProductDetail::where('product_id', $id)->get();
    $tags = $product->productTag->map(function ($productTag) {
      return [
        'product_tag_id' => $productTag->id,
        'title' => $productTag->tag->title,
      ];
    });

    $images = [];

    if ($product->thumbnail) {
      $image = [
        'ref' => 'product',
        'id' => $product->id,
        'name' => $product?->name,
        'type' => ImageType::File,
        'file' => $product->thumbnail,
      ];
      array_push($images, $image);
    }

    foreach ($product->productDetail as $detail) {
      if ($detail->thumbnail) {
        $image = [
          'ref' => 'detail',
          'id' => $detail->id,
          'name' => $detail->name,
          'type' => ImageType::File,
          'file' => $detail->thumbnail,
        ];
        array_push($images, $image);
      }
    }

    foreach ($product->image as $image) {
      if ($image->file || $image->link) {
        if ($image->type == ImageType::Youtube) {
          $url_component = parse_url($image->link);
          if (isset($url_component['query'])) {
            parse_str($url_component['query'], $params);
            $image->youtubeId = $params['v'];
            $image->file = "https://img.youtube.com/vi/" . $params['v'] . "/hqdefault.jpg";
          }
          ;
        }
        $image->ref = 'image';
        array_push($images, $image->toArray());
      }
    }
    $images = collect($images)->sortBy([
      ['type', 'desc'],
    ])->values();

    $data = [
      'title' => $product?->name ?? "Produk",
      'product' => $product,
      'categories' => $categories,
      'partner' => $partner,
      'productDetail' => $productDetail ?? [],
      'tags' => $tags,
      'status' => array_values(ProductStatusType::asArray()),
      'detail_status' => array_values(OriginStatusType::asArray()),
      'image_type' => array_values(ImageType::asArray()),
      'images' => $images,
      'isAdmin' => $product->user_id == auth()->user()->id || auth()->user()->role == UserType::Admin
    ];
    return Inertia::render('Admin/Product/Show', $data);
  }

  public function bulkUpdate(Request $request)
  {
    $request->validate([
      'products' => 'required|array',
      'products.*.id' => 'required|exists:products,id'
    ]);
    DB::beginTransaction();
    try {
      $productsData = $request->input('products');
      foreach ($productsData as $productData) {
        $productId = $productData['id'];
        $sortNumber = $productData['sort_number'];
        Product::where('id', $productId)->update(['sort_number' => $sortNumber]);
      }
      DB::commit();
      return redirect("/admin/product?showProduct=featured")->with('success', 'Update produk berhasil');
    } catch (\Throwable $th) {
      DB::rollBack();
      \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
      return redirect()->back()->with('error', 'Kesalahan Server. Update produk gagal');
    }
  }

  public function destroy($id, Request $request)
  {
    // if (!$this->partnerCheck($id)) return redirect("/admin/product/$id")->with('error', "Anda tidak diperbolehkan menghapus produk ini");

    try {
      $product = Product::whereId($id)->first();

      if ($request->has('type') && $request->type == 'thumbnail') {
        if (Storage::disk('public')->exists(substr($product->thumbnail, 9))) {
          Storage::disk('public')->delete(substr($product->thumbnail, 9));
        }
        $product->thumbnail = null;
        $product->save();
        return redirect()->back()->with('success', 'Hapus produk berhasil');
      }

      $delete = $product->delete();
      return redirect('/admin/product')->with('success', 'Hapus produk berhasil');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Hapus produk gagal. Produk ini masih digunakan oleh fitur lain');
    }
  }

  public static function partnerCheck($productId)
  {
    $user = auth()->user();
    if ($user->role == UserType::Partner) {
      $product = Product::whereId($productId)->where('user_id', $user->id)->first();
      if (!$product)
        return false;
    }
    return true;
  }

  protected function actionUpdate($id, Request $request)
  {
    if ($request->has('update_status'))
      return $this->updateStatus($id, $request);
    return null;
  }

  public function updateStatus($productId, $request)
  {
    try {
      $productDetail = ProductDetail::where('product_id', $productId)->first();
      // if (!$productDetail && $request->update_status == ProductStatusType::Publish) return redirect("/admin/product/$productId?show=packet")->with('error', 'Publikasi tidak dapat dilakukan. Harap tambahkan paket terlebih dahulu');

      $product = Product::where('id', $productId)->first();
      if (!$product)
        return redirect("/admin/product")->with('error', 'Produk ini tidak ditemukan');

      $validate['status'] = $request->update_status;
      $message = 'Produk berhasil dipublikasi';

      if ($request->update_status == ProductStatusType::Publish && auth()->user()->role == UserType::Partner) {
        // Notification
        $adminBody = str_replace('{partner_name/email}', auth()->user()->name . '/' . auth()->user()->email, NotifConstants::$ADMIN['REQUEST_PRODUCT']);
        $notifData = [
          'user_id' => User::where('role', 'admin')->first()->id,
          'body' => $adminBody,
          'type' => 'REQUEST_PRODUCT' . '=' . $productId,
        ];
        Notification::create($notifData);
        $validate['status'] = ProductStatusType::Review;
        $message = 'Pengajuan publikasi berhasil dikirim. Kami akan meninjau produk yang anda publikasikan';
        (new NotificationApiController())->sendProductReviewEmailNotification($product->id);
      } else {
        $freelancerBody = str_replace('{product_name}', $product?->name, NotifConstants::$FREELANCER['REQUEST_PRODUCT']);
        $notifData = [
          'user_id' => $product->user_id,
          'body' => $freelancerBody,
          'type' => 'REQUEST_PRODUCT' . '=' . $productId,
        ];
        Notification::create($notifData);
      }

      $product->update($validate);

      return redirect("/admin/product/$productId")->with('success', $message);
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
      return redirect()->back()->with('error', 'Publikasi produk gagal. Kesalahan sistem internal');
    }
  }
}
