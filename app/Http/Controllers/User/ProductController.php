<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderStatusType;
use App\Models\User;
use Inertia\Inertia;
use App\Utils\Helper;
use App\Enums\UserType;
use App\Models\Pricing;
use App\Models\Product;
use App\Enums\ImageType;
use App\Utils\SchemaJson;
use App\Enums\PricingType;
use Illuminate\Http\Request;
use App\Enums\ChatStatusType;
use App\Models\Configuration;
use App\Enums\PricingUnitType;
use App\Enums\OriginStatusType;
use App\Enums\ProductStatusType;
use App\Enums\PricingAppliedType;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
  public $baseSelectedColumn = ["*"];
  public function index(Request $request, $filterData = [])
  {

    $category = null;
    $company = null;
    $product = Product::select($this->baseSelectedColumn)
      ->with([
        'user',
        'assignedUser',
        'productDetail' => function ($query) {
          $query->where('is_custom', 0)->orderBy('price')->take(1);
        }
      ])
      ->when($request->has('q'), function ($query) use ($request): void {
        $searchQuery = urldecode($request->q);
        Helper::getSearch($query, 'name', $searchQuery);
      })
      ->when(isset($filterData['type']), function ($query) use ($filterData) {
        if ($filterData['type'] == 'category' && isset($filterData['data']['id'])) {
          $query->whereRelation('category', 'category_id', '=', $filterData['data']['id']);
        }

        if ($filterData['type'] == 'company' && isset($filterData['data']['id'])) {
          $query->where('user_id', $filterData['data']['id']);
        }
      })
      ->where('status', ProductStatusType::Publish)
      ->orderByDesc('is_featured')
      ->paginate(20);

    $product = collect($product);

    $product['data'] = collect($product['data'])->map(function ($product) {
      if (!empty($product['product_detail'])) {
        $product['price'] = $product['product_detail'][0]['price'];
      }
      return $product;
    });

    if (isset($filterData['type']) && $filterData['type'] == 'category' && isset($filterData['data']['id'])) {
      $category = $filterData['data'];
    }

    if (isset($filterData['type']) && $filterData['type'] == 'company' && isset($filterData['data']['id'])) {
      $company = $filterData['data'];
    }


    $data = [
      'title' => "Jasa Pilihan",
      'product' => $product,
      'category' => $category,
      'company' => $company,
    ];

    return Inertia::render('User/Product/Index', $data);
  }

  public function show($slug, Request $request)
  {
    $product = Product::where('slug', $slug)
      ->with([
        'category',
        'image',
        'productTag.tag',
        'productDetail' => function ($query) {
          $query->where('status', OriginStatusType::Active)->where('is_custom', '0');
        }
      ])
      ->select([...$this->baseSelectedColumn, 'description'])
      ->withCount([
        'order' => function ($query) {
          $query->whereIn('status', [OrderStatusType::Success]);
        }
      ])
      ->withCount('ratings')
      ->withAvg('ratings', 'rating')
      ->with([
        'ratings' => function ($subQuery) {
          $subQuery->with('user')->whereNot('status', ChatStatusType::Hidden);
        }
      ])
      ->where('status', ProductStatusType::Publish)
      ->first();

    if (!$product)
      return redirect()->back()->with('error', 'Jasa tidak ditemukan');

    $partner = User::with('profile')->where('id', $product->assigned_user_id ?? $product->user_id)->first();
    $product->user = $partner;

    $otherProducts = Product::where('category_id', $product->category_id)
      ->where('id', '!=', $product->id)
      ->take(4)
      ->where('status', ProductStatusType::Publish)
      ->get();

    $phoneNumber = null;
    if ($product->chat_active == 1) {
      $phoneNumber = $product->user?->phone;
    }

    $adminId = User::where('role', UserType::Admin)->first()->id;
    // Pricing starts
    $isPlatformProduct = $product->user_id === $adminId && !$product->assigned_user_id;
    $pricings = Pricing::where('status', OriginStatusType::Active)
      ->where('applied_to', $isPlatformProduct ? PricingAppliedType::Platform : PricingAppliedType::All)
      ->orderBy('type')
      ->get();

    $product->productDetail->each(function ($prod) use ($pricings) {
      $total_price = $prod['price'];
      $pricings->each(function ($pricing) use (&$total_price) {
        // Calculate
        $adjustment = match ($pricing->unit) {
          PricingUnitType::Percentage => $total_price * ($pricing->value / 100),
          PricingUnitType::Integer => $pricing->value,
          default => 0,
        };
        $total_price += ($pricing->type === PricingType::Addition) ? $adjustment : -$adjustment;
      });
      $prod['total_price'] = $total_price;
      $prod['pricings'] = $pricings;
    });

    $images = [];

    if ($product->thumbnail) {
      $image = [
        'ref' => 'product',
        'id' => $product->id,
        'name' => $product->name,
        'type' => ImageType::File,
        'file' => $product->thumbnail,
      ];
      array_push($images, $image);
    }

    foreach ($product->productDetail as $detail) {
      if ($pricings->isEmpty())
        $detail['total_price'] = $detail->price;
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

    $productDescription = $product->meta_description;
    if (!$productDescription && !!$product->description) {
      $productDescription = Helper::htmlToString($product->description, 160);
    }

    $meta = [
      'title' => "$product?->name | " . config('app.name'),
      'description' => $productDescription,
      'image' => $product->thumbnail ?? null,
      'keywords' => $product->keywords ?? null,
    ];

    $data = [
      'title' => $meta['title'] ?? "Acara",
      'product' => $product,
      'images' => $images,
      'schema' => \App\Utils\SchemaJson::getSchema($product->id, 'product'),
      'phoneNumber' => $phoneNumber ?? null,
      'meta' => $meta,
      'otherProducts' => $otherProducts
    ];

    return Inertia::render('User/Product/Show', $data);
  }
}
