<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PricingUnitType extends Enum
{
    const Percentage = 'percentage';
    const Integer = 'integer';
}
