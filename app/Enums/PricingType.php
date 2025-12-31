<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PricingType extends Enum
{
    const Addition = 'addition';
    const Substraction = 'substraction';
}
