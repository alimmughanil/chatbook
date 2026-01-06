<?php

namespace App\Http\Controllers\User;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\User\ProductController;

class CategoryController extends Controller
{
  public function index(Request $request)
  {
    $category = Category::when($request->has('q'), function ($query) use ($request) {
      $query->where('title', 'LIKE', "%$request->q%");
    })->paginate(25);

    $data = [
      'title' => "Kategori",
      'category' => collect($category),
    ];
    return Inertia::render('User/Category/Index', $data);
  }

  public function show($slug, Request $request)
  {
    $category = Category::where('slug', $slug)->first();
    if (!$category) return redirect('/');

    $data = [
      'type' => 'category',
      'data' => $category
    ];
    $productController = new ProductController();
    return $productController->index($request, $data);
  }
}
