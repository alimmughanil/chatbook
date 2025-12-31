<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class TimeUnitType extends Enum
{
  const Hour = 'hour';
  const Day = 'day';
  const Week = 'week';
  const Month = 'month';
}
