<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Sitemap\SitemapGenerator;

class GenerateSitemap extends Command
{
  /**
   * The console command name.
   *
   * @var string
   */
  protected $signature = 'sitemap:generate';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Generate the sitemap.';

  /**
   * Execute the console command.
   *
   * @return mixed
   */
  public function handle()
  {
    if (str_starts_with(config('app.url'), 'http://localhost')) return false;

    SitemapGenerator::create(config('app.url'))
      ->writeToFile(public_path('sitemap.xml'));
  }
}
