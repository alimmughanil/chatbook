<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ConfigNotificationType extends Enum
{
  const DISBURSEMENT_REQUEST = 'DISBURSEMENT_REQUEST';
  const PRODUCT_REQUEST = 'PRODUCT_REQUEST';
}
