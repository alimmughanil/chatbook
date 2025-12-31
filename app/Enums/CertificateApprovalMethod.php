<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class CertificateApprovalMethod extends Enum
{
  const Automatic = 'automatic';
  const Review = 'review';
  const Manual = 'manual';
}
