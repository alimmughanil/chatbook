<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class DisbursementMethodType extends Enum
{
  const RTOL = 'RTOL' ;
  const BIFAST = 'BIFAST' ;
  const MANUAL = 'MANUAL' ;
  // const LLG = 'LLG' ;
  // const RTGS = 'RTGS' ;
  // const H2H = 'H2H' ;
}
