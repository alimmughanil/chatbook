<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class WorkStatusType extends Enum
{
  const Progress = 'progress';
  const Revision = 'revision';
  const Finish = 'finish';
  const Cancel = 'cancel';
}
