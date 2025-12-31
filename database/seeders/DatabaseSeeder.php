<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    ini_set('memory_limit', '8G');
    ini_set('max_execution_time ', '600');
    app()->singleton(\Faker\Generator::class, function () {
      return \Faker\Factory::create('id_ID');
    });

    $this->call(UserSeeder::class);
    $this->call(\Database\Seeders\SupportedBankSeeder::class);
    if (env('APP_ENV') == 'local') {
      $this->call([
        // ProfileSeeder::class,
        ProfileDetailSeeder::class,
        CategorySeeder::class,
        BlogCategorySeeder::class,
        TagSeeder::class,
        BlogSeeder::class,
        PortfolioCategorySeeder::class,
        PortfolioProjectSeeder::class,
        ProductSeeder::class,
        ProductDetailSeeder::class,
        // OrderSeeder::class,
        // WalletSeeder::class,
        // FeedbackSeeder::class,
        // ContactSeeder::class,
      ]);
    }
  }
}
