<?php

namespace Database\Factories;

use App\Enums\ConfigNotificationType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Notification;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => rand(1, 5),
            'order_id' => rand(1, 5),
            'title' => 'Pembuatan Aplikasi Android dengan Flutter',
            'body' => 'Saya akan mengerjakan proyek ini dengan detail dan profesional. Harga sudah termasuk revisi 3x minor. File yang dikirimkan berupa source code lengkap.',
            'type' => ConfigNotificationType::PRODUCT_REQUEST,
            'read_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => now(),
        ];
    }
}
