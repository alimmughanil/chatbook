<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\UserType;
use App\Models\Product;
use App\Models\Category;
use App\Enums\ActionType;
use Illuminate\Http\Request;
use App\Enums\OriginStatusType;
use App\Enums\ProductStatusType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Core\BaseResourceController;

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
    $query->with('category', 'user')
      ->when(auth()->user()->role == UserType::Partner, function ($query) use ($request) {
        $user = auth()->user();
        $query->where('user_id', $user->id);
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

    // ProductTags logic removed
    // $productTags = ...


    return [
      ...parent::getFormData($request, $model),
      'status' => array_values(ProductStatusType::asArray()),
      'categories' => $categories,
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
      // Tags removed
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
    $product = Product::with('category', 'image')->whereId($id)->first();
    if (!$product)
      return redirect('/admin/product');

    $user = auth()->user();
    if ($user->role == UserType::Partner && $product->user_id != $user->id) {
      return redirect('/admin/product')->with('error', 'Anda tidak diperbolehkan mengedit produk ini');
    }

    $categories = Category::get();

    $images = [];

    if ($product->thumbnail) {
      $image = [
        'ref' => 'product',
        'id' => $product->id,
        'name' => $product?->name,
        'type' => 'file',
        'file' => $product->thumbnail,
      ];
      array_push($images, $image);
    }

            // Product detail images logic removed


    // Product images logic removed as Image table/model is not in migrations
    // $images = ...
    $images = [];

    $data = [
      'title' => $product?->name ?? "Produk",
      'product' => $product,
      'categories' => $categories,
      'status' => array_values(ProductStatusType::asArray()),
      // 'detail_status' => array_values(OriginStatusType::asArray()), // OriginStatusType might be missing too? No, used in Order form.
      // 'image_type' => ..., // Removed
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
      $product = Product::where('id', $productId)->first();
      if (!$product)
        return redirect("/admin/product")->with('error', 'Produk ini tidak ditemukan');

      $validate['status'] = $request->update_status;
      $message = 'Produk berhasil dipublikasi';

      // Notifications removed as table doesn't exist

      $product->update($validate);

      return redirect("/admin/product/$productId")->with('success', $message);
    } catch (\Throwable $th) {
      \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
      return redirect()->back()->with('error', 'Publikasi produk gagal. Kesalahan sistem internal');
    }
  }
}
