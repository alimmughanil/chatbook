<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PortfolioStatusType extends Enum
{
  const Active = 'active';
  const Progress = 'progress';
  const Cancel = 'cancel';
}
