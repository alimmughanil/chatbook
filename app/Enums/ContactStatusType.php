<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ContactStatusType extends Enum
{
  const New = 'new';
  const Process = 'process';
  const Finish = 'finish';
  const Cancel = 'cancel';
}
