<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\ProductDetail;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ProductDetailController extends Controller
{
  public function store($productId, Request $request)
  {
    // if (!ProductController::partnerCheck($productId)) return redirect("/admin/product/$productId?show=packet")->with('error', "Anda tidak diperbolehkan mengedit paket ini");

    $validatedData = $request->validate([
      'name' => 'required',
      'slug' => 'required|unique:' . ProductDetail::class . ',slug',
      'price' => 'required',
      'description' => 'nullable',
      'thumbnail' => 'nullable',
      'status' => 'nullable',
      'is_custom' => 'nullable',
    ]);
    try {
      $product = Product::whereId($productId)->first();
      $validatedData['product_id'] = $product->id;

      $validatedData['slug'] = str_replace(' ', '-', strtolower($validatedData['slug']));
      $validatedData['slug'] = preg_replace('/[^A-Za-z0-9-]/', '', $validatedData['slug']);

      if ($request->file('thumbnail')) {
        $fileExt = $request->file('thumbnail')->getClientOriginalExtension();
        $fileName = "$productId - " . $validatedData['slug'] . '.' . $fileExt;
        $file = Storage::disk('public')->putFileAs('thumbnail', $request->file('thumbnail'), $fileName);
        $validatedData['thumbnail'] = '/storage/' . $file;
      }

      $store = ProductDetail::create($validatedData);
      if ($request->ref) return redirect($request->ref);
      return redirect()->back()->with('success', 'Tambah paket berhasil');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Kesalahan Server. Tambah paket gagal');
    }
  }

  public function update($productId, $id, Request $request)
  {
    // if (!ProductController::partnerCheck($id)) return redirect("/admin/product/$productId?show=packet")->with('error', "Anda tidak diperbolehkan mengedit paket ini");

    $validatedData = $request->validate([
      'name' => 'required',
      'slug' => 'required|unique:' . ProductDetail::class . ',slug,' . $id,
      'price' => 'required',
      'description' => 'nullable',
      'thumbnail' => 'nullable',
      'status' => 'nullable',
      'is_custom' => 'nullable',
    ]);

    DB::beginTransaction();
    try {
      $productDetail = ProductDetail::where('id', $id)->first();

      $validatedData['slug'] = str_replace(' ', '-', strtolower($validatedData['slug']));
      $validatedData['slug'] = preg_replace('/[^A-Za-z0-9-]/', '', $validatedData['slug']);

      if ($request->file('thumbnail')) {
        $fileExt = $request->file('thumbnail')->getClientOriginalExtension();
        $fileName = rand(111111, 999999) . "$productId-" . $validatedData['slug'] . '.' . $fileExt;
        $file = Storage::disk('public')->putFileAs('thumbnail', $request->file('thumbnail'), $fileName);
        $validatedData['thumbnail'] = '/storage/' . $file;
        if (Storage::disk('public')->exists(substr($productDetail->thumbnail, 9))) {
          Storage::disk('public')->delete(substr($productDetail->thumbnail, 9));
        }
      } else {
        unset($validatedData['thumbnail']);
      }

      $productDetail->update($validatedData);

      DB::commit();
      return redirect()->back()->with('success', 'Update paket berhasil');
    } catch (\Throwable $th) {
      DB::rollBack();
      return redirect()->back()->with('error', 'Kesalahan Server. Update paket gagal');
    }
  }

  public function destroy($productId, $id, Request $request)
  {
    // if (!ProductController::partnerCheck($id)) return redirect("/admin/product/$productId?show=packet")->with('error', "Anda tidak diperbolehkan menghapus paket ini");

    try {
      $productDetail = ProductDetail::where('id', $id)->first();

      if ($request->has('type') && $request->type == 'thumbnail') {
        if (Storage::disk('public')->exists(substr($productDetail->thumbnail, 9))) {
          Storage::disk('public')->delete(substr($productDetail->thumbnail, 9));
        }
        $productDetail->thumbnail = null;
        $productDetail->save();
      } else {
        $productDetail->delete();
      }
      return redirect()->back()->with('success', 'Hapus paket berhasil');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Hapus paket gagal. Paket ini masih digunakan oleh fitur lain');
    }
  }
}
