<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PricingAppliedType extends Enum
{
    const Platform = 'platform';
    const All = 'all';
}
