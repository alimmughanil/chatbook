<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CourseLevelType extends Enum
{
  const Beginner = 'beginner';
  const Intermediate = 'intermediate';
  const Advanced = 'advanced';
}
