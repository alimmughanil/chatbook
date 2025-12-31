<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ImageType;
use App\Models\Image;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'product_id' => 'required',
      'type' => 'required',
      'link' => 'nullable',
      'file' => 'nullable',
    ]);

    if ($request->type != ImageType::File) {
      $linkData = $request->validate([
        'link' => 'required',
      ]);
      $validatedData['link'] = $linkData['link'];
    }

    if ($request->type != ImageType::Youtube) {
      $fileData = $request->validate([
        'file' => 'required',
      ]);
      $validatedData['file'] = $fileData['file'];
    }

    try {
      if ($request->file('file')) {
        $fileExt = $request->file('file')->getClientOriginalExtension();
        $file = Storage::disk('public')->put('file', $request->file('file'));
        $validatedData['file'] = '/storage/' . $file;
      }
      $store = Image::create($validatedData);
      return redirect()->back()->with('success', 'Tambah gambar berhasil');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Kesalahan Server. Tambah gambar gagal');
    }
  }

  public function destroy($serviceId, Image $image)
  {
    try {
      if ($image->file && Storage::disk('public')->exists(substr($image->file, 9))) {
        Storage::disk('public')->delete(substr($image->file, 9));
      }

      $delete = $image->delete();
      return redirect()->back()->with('success', 'Hapus gambar berhasil');
    } catch (\Throwable $th) {
      return redirect()->back()->with('error', 'Hapus gambar gagal. Gambar ini masih digunakan oleh fitur lain');
    }
  }
}
