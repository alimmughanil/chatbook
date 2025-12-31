<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ResultType extends Enum
{
  const Pending = 'pending';
  const Accept = 'accept';
  const Revision = 'revision';
  const Reject = 'reject';
}
