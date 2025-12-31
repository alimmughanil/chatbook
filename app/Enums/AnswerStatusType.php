<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AnswerStatusType extends Enum
{
  const Pending = 'pending';
  const Correct = 'correct';
  const Incorrect = 'incorrect';
}
