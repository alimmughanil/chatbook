<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CourseTimeLimitType extends Enum
{
  const Unlimited = 'unlimited';
  const Limited = 'limited';
}
