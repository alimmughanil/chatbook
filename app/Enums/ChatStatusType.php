<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ChatStatusType extends Enum
{
  const Sent = 'sent';
  const Delivery = 'delivery';
  const Read = 'read';
  const Hidden = 'hidden';
}
