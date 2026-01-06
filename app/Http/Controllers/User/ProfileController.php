<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderStatusType;
use App\Enums\ProductStatusType;
use App\Http\Controllers\Core\BaseResourceController;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends BaseResourceController
{
  protected $model = User::class;

  protected array $page = [
    "label" => "Freelancer Profile",
    "name" => "PublicProfile",
    "inertia" => "User/Profile",
    "url" => "/u",
  ];

  public function show($username, Request $request)
  {
    $user = User::with([
      'productRating.user:id,name',
      'profile.details',
      'product' => function ($query) {
        $query->where('status', ProductStatusType::Publish);
      },
    ])
      ->withAvg('productRating as avg_rating', 'rating')
      ->withCount('productRating as count_rating')
      ->withCount("successOrder as success_order")
      ->withCount("incomingOrder as incoming_order")
      ->where('username', $username)
      ->first();

    $user->success_order_rate = null;
    if ($user->incoming_order > 0) {
      $user->success_order_rate = round($user->success_order / $user->incoming_order * 100);
    }

    // Transform profile details into a structured array
    $details = $user->profile ? $user->profile->details->groupBy('type.value') : collect([]);

    $data = [
      "title" => "$user->name | Profil Freelancer",
      "user" => $user,
      "profile" => $user->profile,
      "details" => $details,
      "products" => $user->product,
      "reviews" => $user->productRating,
      "page" => $this->page,
    ];

    return $this->inertiaRender("Show", $data, "");
  }

  protected function getPage(Request $request, $id = null): array
  {
    return $this->page;
  }

  protected function validation(Request $request, $id = null): array
  {
    return [];
  }
}
