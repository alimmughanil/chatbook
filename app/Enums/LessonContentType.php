<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class LessonContentType extends Enum
{
  const Video = 'video';
  const Exam = 'exam';
}
