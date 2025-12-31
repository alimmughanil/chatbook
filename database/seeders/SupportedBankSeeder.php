<?php

namespace Database\Seeders;

use App\Enums\OriginStatusType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Services\Payment\Duitku\DisbursementService;

class SupportedBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $jsonPath = resource_path('json/seeders/banks.json');
      $file = file_get_contents($jsonPath);
      $listBanks = (new DisbursementService)->getListBank();
      
      $data = json_decode($file, true);
      
      $data = collect($data)->map(function ($bank) use ($listBanks) {
        $data = [
          'bi_fast' => $bank['bi_fast'] ? 1 : 0,
          'created_at' => now(),
          'updated_at' => now(),
        ];
        
        if ($listBanks->responseCode == 00) {        
          $bankApi = collect($listBanks->Banks)->firstWhere('bankCode', $bank['bank_code']);
          if (!$bankApi) return [
            'bank_code' => $bank['bank_code'],
            'bank_name' => $bank['bank_name'],
            'limit_transfer_amount' => null,
            'status' => OriginStatusType::Nonactive,
            ...$data
          ];
        }

        return [
          'bank_code' => $bankApi->bankCode,
          'bank_name' => $bankApi->bankName,
          'limit_transfer_amount' => $bankApi->maxAmountTransfer ?? null,
          'status' => OriginStatusType::Active,
          ...$data
        ];
      })->toArray();

      DB::table('supported_banks')->upsert($data, 'bank_code');
    }
}