<?php

namespace App\Http\Middleware;

use Inertia\Inertia;
use App\Utils\Helper;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Http\Request;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): string|null
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */
  public function share(Request $request): array
  {
    if (str(env('APP_URL'))->startsWith('https://')) {
      Inertia::encryptHistory(true);
    }
    $lang = Helper::getLangActive($request);

    return array_merge(parent::share($request), [
      'appName' => config('app.name'),
      'appUrl' => config('app.url'),
      'auth' => [
        'user' => $request->user(),
        'has_password' => isset($request->user()?->password),
      ],
      'ziggy' => function () use ($request) {
        $ziggy = (new Ziggy)->toArray();
        unset($ziggy['routes']);
        return array_merge($ziggy, [
          'location' => $request->url(),
          'query' => count($request->query()) == 0 ? null : $request->query()
        ]);
      },
      'flash' => [
        'message' => fn() => $request->session()->get('message'),
        'success' => fn() => $request->session()->get('success'),
        'error' => fn() => $request->session()->get('error'),
      ],
      'location' => $request->fullUrl(),
      'locale' => $lang,
    ]);
  }
}
