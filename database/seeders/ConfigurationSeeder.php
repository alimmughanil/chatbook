<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Enums\ConfigurationType;
use Illuminate\Support\Facades\DB;

class ConfigurationSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $data = [
      [
        'type' => ConfigurationType::EMAIL,
        'value' => 'eventalk.id@gmail.com',
      ],
      [
        'type' => ConfigurationType::WHATSAPP_NUMBER,
        'value' => '085726409619',
      ],
      [
        'type' => ConfigurationType::ADDRESS,
        'value' => 'Komplek Karonsih Baru Nomor 53 Kecamatan Ngaliyan, Semarang, Indonesia 50181',
      ],
    ];

    $data = collect($data)->map(function ($raw) {
      $raw['created_at'] = now();
      $raw['updated_at'] = now();
      return $raw;
    })->toArray();

    DB::table('configurations')->insert($data);
  }
}
