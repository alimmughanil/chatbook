<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CoursePaymentType extends Enum
{
  const Free = 'free';
  const Paid = 'paid';
}
