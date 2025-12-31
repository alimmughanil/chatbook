<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class QuestionScoreMethodType extends Enum
{
  const Exact = "exact";
  const PartialProportional = "partial_proportional";
  const PartialWeighted = "partial_weighted";
  const Manual = "manual";

  public static function description(): array
  {
    return [
      self::Exact => 'Dinilai benar hanya jika semua jawaban sesuai dengan kunci jawaban',
      self::PartialProportional => 'Nilai dihitung secara proporsional berdasarkan jumlah jawaban yang benar',
      self::PartialWeighted => 'Nilai dihitung berdasarkan bobot pada tiap jawaban yang benar',
      self::Manual => 'Penilaian dilakukan secara manual',
    ];
  }
}








