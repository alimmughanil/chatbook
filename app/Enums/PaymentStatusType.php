<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PaymentStatusType extends Enum
{
  const Pending = 'pending';
  const Cancel = 'cancel';
  const Refund = 'refund';
  const Paid = 'paid';
}