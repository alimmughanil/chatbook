<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkHistory;

class WorkHistorySeeder extends Seeder
{
    public function run(): void
    {
        WorkHistory::factory()->count(10)->create();
    }
}
