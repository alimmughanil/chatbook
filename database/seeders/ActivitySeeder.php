<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        Activity::factory()->count(50)->create(); // Buat lebih banyak log aktivitas
    }
}
