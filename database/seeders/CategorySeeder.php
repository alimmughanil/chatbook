<?php

namespace Database\Seeders;

use App\Enums\CategoryType;
use App\Models\Category;
use Database\Factories\CategoryFactory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
  public function run(): void
  {
    $categories = (new CategoryFactory())->categories();

    $data = [];
    foreach ($categories as $category) {
      $data[] = [
        'name' => $category['name'],
        'slug' => str($category['name'])->slug()->value(),
        'description' => $category['description'],
        'type' => CategoryType::Product,
        'created_at' => now(),
        'updated_at' => now(),
      ];
    }

    Category::insert($data);
  }
}
