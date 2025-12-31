<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class LessonProgressStatusType extends Enum
{
  const Lock = 'lock';
  const Current = 'current';
  const Completed = 'completed';
  const Incompleted = 'incompleted';
}
