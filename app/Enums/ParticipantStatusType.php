<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ParticipantStatusType extends Enum
{
  const Pending = 'pending';
  const Active = 'active';
  const Completed = 'completed';
  const Dropped = 'dropped';
}
