<?php

namespace App\Http\Middleware;

use Closure;
use App\Enums\LanguageType;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLanguange
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle($request, Closure $next)
  {
    if ($request->filled('lang') && in_array($request->get('lang'), LanguageType::getValues())) {
      $lang = $request->get('lang');
      $response = $next($request);
      
      return $response->withCookie(cookie('language', $lang, 60 * 24 * 30 * 12, '/', null, false, false));
    }

    return $next($request);
  }
}
