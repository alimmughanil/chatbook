<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Spatie\Sitemap\Tags\Url;
use Spatie\Sitemap\Sitemap;
use App\Http\Controllers\Controller;

class SitemapController extends Controller
{
  public function __invoke()
  {
    return Sitemap::create()
      ->add(Url::create('/')
        ->setLastModificationDate(Carbon::now())
        ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
        ->setPriority(0.8));
  }
}
