<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class FeedbackType extends Enum
{
  const Comment = 'comment';
  const Rating = 'rating';
}
