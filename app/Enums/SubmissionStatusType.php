<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class SubmissionStatusType extends Enum
{
  const Submitted = 'submitted';
  const Graded = 'graded';
  const Cancelled = 'cancelled';
}
