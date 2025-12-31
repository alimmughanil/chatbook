<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ConfigurationType extends Enum
{
  const EMAIL = 'EMAIL';
  const WHATSAPP_NUMBER = 'WHATSAPP_NUMBER';
  const ADDRESS = 'ADDRESS';
}
