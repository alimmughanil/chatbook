<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CertificateType extends Enum
{
  const Name = 'nama';
  const Institute = 'instansi';
  const Branch = 'cabang';
  const Participant_number = 'Nomor';
  const Job_title = 'Jabatan';
}
