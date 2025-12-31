<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class BankType extends Enum
{
  const Pending = 'pending';
  const Verified = 'verified';
  const Rejected = 'rejected';
}