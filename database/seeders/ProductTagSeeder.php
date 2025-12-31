<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductTag;

class ProductTagSeeder extends Seeder
{
    public function run(): void
    {
        ProductTag::factory()->count(10)->create();
    }
}
