<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class OrderStatusType extends Enum
{
  const Pending = 'pending';
  const Processing = 'processing';
  const Success = 'success';
  const Cancel = 'cancel';
}
