<?php

namespace App\Http\Controllers;

use App\Http\Controllers\User\ProductController;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\ConfigurationType;
use App\Enums\PublishStatusType;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
  public function index(Request $request)
  {
    $categories = Category::select('id', 'name', 'slug')
      ->where('is_featured', true)
      ->orWhereHas('product', fn($q) => ($q->where('status', PublishStatusType::Publish)))
      ->orderBy('is_featured', 'DESC')
      ->orderBy('created_at', 'DESC')
      ->take(15)
      ->get();

    $selectProductColumn = (new ProductController())->baseSelectedColumn;
    $featuredProducts = Product::select($selectProductColumn)
      ->with([
        'user',
        'assignedUser',
        'productDetail' => function ($query) {
          $query->where('is_custom', 0)->orderBy('price')->take(1);
        }
      ])
      ->where('is_featured', true)
      ->where('status', PublishStatusType::Publish)
      ->orderBy('is_featured', 'DESC')
      ->orderBy('sort_number', 'ASC')
      ->take(15);
    if ($request->filled('category')) {
      $featuredProducts = $featuredProducts->whereRelation('category', 'slug', '=', $request->category);
    }
    $featuredProducts = $featuredProducts->get()->toArray();

    $featuredProducts = collect($featuredProducts)->map(function ($product) {
      if (!empty($product['product_detail'])) {
        $product['price'] = $product['product_detail'][0]['price'];
      }
      return $product;
    });

    $data = [
      'title' => config('app.name'),
      'categories' => $categories,
      'featuredProducts' => $featuredProducts,
    ];
    return Inertia::render('Home/Index', $data);
  }

  public function about()
  {
    $config = Configuration::where('type', ConfigurationType::CONTENT_ABOUT)->where('status', 'active')->first();

    $data = [
      'title' => 'Tentang Kami',
      'aboutText' => $config?->description,
    ];
    return Inertia::render('Home/About', $data);
  }

  public function contact()
  {
    $whatsappConfig = Configuration::where('type', 'WHATSAPP_NUMBER')->where('status', 'active')->first();
    $emailConfig = Configuration::where('type', 'EMAIL')->where('status', 'active')->first();
    $addressConfig = Configuration::where('type', 'ADDRESS')->where('status', 'active')->first();

    $whatsappNumber = $whatsappConfig?->value;
    if ($whatsappNumber && Str::startsWith($whatsappNumber, '0')) {
      $whatsappNumber = Helper::whatsappNumber($whatsappNumber);
    }
    $data = [
      'title' => 'Kontak Kami',
      'email' => $emailConfig?->value,
      'address' => $addressConfig?->value,
      'whatsapp_number' => $whatsappNumber,
    ];
    return Inertia::render('Home/Contact', $data);
  }

  public function disclaimer()
  {
    $config = Configuration::where('type', ConfigurationType::CONTENT_DISCLAIMER)->where('status', 'active')->first();

    $data = [
      'title' => 'Disclaimer',
      'config' => $config
    ];
    return Inertia::render('Home/Disclaimer', $data);
  }

  public function privacy()
  {
    $config = Configuration::where('type', ConfigurationType::CONTENT_PRIVACY_POLICY)->where('status', 'active')->first();

    $data = [
      'title' => 'Privacy Policy',
      'config' => $config
    ];
    return Inertia::render('Home/Privacy', $data);
  }
}
