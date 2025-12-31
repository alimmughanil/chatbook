<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ParticipantCertificateStatusType extends Enum
{
  const Pending = 'pending';
  const Active = 'active';
  const Inactive = 'inactive';
}
