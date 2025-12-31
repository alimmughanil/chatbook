<?php

namespace App\Http\Middleware;

use App\Models\Product;
use App\Models\Blog;
use Inertia\Inertia;
use App\Utils\Helper;
use Inertia\Middleware;
use App\Models\Category;
use Tightenco\Ziggy\Ziggy;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Configuration;
use App\Enums\OriginStatusType;
use App\Enums\ConfigurationType;
use App\Models\Notification;

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

    $user = $request->user();
    $notif = null;
    $notif_count = null;
    if ($user) {
      $notif = Notification::where('user_id', $request->user()->id)
        ->with('order')
        ->orderBy('created_at', 'desc')
        ->limit(20)
        ->get();
      $notif_count = Notification::where('user_id', $request->user()->id)
        ->whereNull('read_at')->count();
    }
    $has_password = isset($user?->password);
    return array_merge(parent::share($request), [
      'appName' => config('app.name'),
      'appUrl' => config('app.url'),
      'auth' => [
        'user' => $user,
        'has_password' => $has_password,
      ],
      'notification' => $notif,
      'notification_count' => $notif_count,
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
        'error' => fn() => $request->session()->get('error')
      ],
      'location' => $request->fullUrl(),
      'footer' => $this->getFooter($request),
    ]);
  }

  public function getFooter($request)
  {
    $disabled = collect(['/api', '/admin']);
    $disabled = $disabled->filter(function ($endpoint) use ($request) {
      return Str::startsWith($request->getPathInfo(), $endpoint);
    });
    $footer = [];

    $maintainConfig = Configuration::whereType(ConfigurationType::UNDER_CONSTRUCTION)->whereStatus('active')->first();
    if ($maintainConfig) {
      $enableEndPoint = ['/login', '/logout'];
      if (auth()->check() && auth()->user()->role == 'admin') {
        array_push($enableEndPoint, '/admin');
        array_push($enableEndPoint, '/dashboard');
      }
      $enableEndPoint = array_filter($enableEndPoint, function ($endpoint) use ($request) {
        return Str::startsWith($request->getPathInfo(), $endpoint);
      });

      if (count($enableEndPoint) == 0)
        return abort(503);
    }

    if (count($disabled) == 0 || $request->getPathInfo() == '/') {
      $categories = Category::select('id', 'name', 'slug')->inRandomOrder()->limit(10)->get();
      $products = Product::select('id', 'name', 'slug')->inRandomOrder()->limit(10)->get();
      $blogs = Blog::select('id', 'title', 'slug')->where('status', 'publish')->inRandomOrder()->limit(10)->get();
      $networks = [
        // ['title' => 'Qerja', 'url' => 'https://qerja.id'],
        // ['title' => 'Qursus', 'url' => 'https://qursus.id'],
        // ['title' => 'RisetPedia', 'url' => 'https://risetpedia.com'],
      ];

      $footer = [
        'categories' => $categories,
        'products' => $products,
        'blogs' => $blogs,
        'networks' => $networks,
      ];
    }

    $toggles = [];

    $configs = [
      // ConfigurationType::TELEGRAM_GROUP => Helper::getCache("config." . ConfigurationType::TELEGRAM_GROUP),
    ];

    $emptyConfigs = collect($configs)->filter(function ($config) {
      return empty($config);
    })->toArray();
    $configurations = [];

    if (count($emptyConfigs) > 0) {
      $configurations = Configuration::whereIn('type', array_keys($configs))
        ->where(['status' => OriginStatusType::Active])
        ->select(['type', 'value'])
        ->get()
        ->groupBy('type');

      foreach ($configurations as $configuration) {
        $configuration = $configuration->first();
        Helper::saveCache("config.$configuration->type", $configuration);
      }
    }

    $configs = collect($configs)->map(function ($config, $key) use ($configurations, $toggles) {
      $configuration = $config;
      if (!empty($configurations[$key])) {
        $configuration = $configurations[$key]->first();
      }

      if (empty($configuration))
        return null;
      if ($configuration->status != OriginStatusType::Active)
        return null;

      if (in_array($configuration->type, $toggles)) {
        return $configuration->status == OriginStatusType::Active;
      }
      return $configuration?->value;
    });

    $configs = $configs->mapWithKeys(function ($value, $key) {
      return [strtolower($key) => $value];
    });

    $data = [
      ...$footer,
      ...$configs,
    ];
    return $data;
  }
}
