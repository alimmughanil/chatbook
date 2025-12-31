<?php

namespace App\Http\Middleware;

use App\Enums\UserType;
use Closure;
use App\Models\Product;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProductPermission
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $user = auth()->user();
    if (in_array($user->role, [UserType::Admin]))
      return $next($request);

    $productId = $request->route()->parameter('product_id');
    $productExist = Product::filterRole()->where('id', $productId)->exists();
    if (!$productExist) {
      return redirect()->route("admin.products.index")->with('error', 'Anda tidak dapat mengakses kursus ini');
    }
    return $next($request);
  }
}
