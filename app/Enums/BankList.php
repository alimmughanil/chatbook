<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class BankList extends Enum
{
    const BCA = 'BCA';
    const BNI = 'BNI';
    const MANDIRI = 'MANDIRI';
    const BRI = 'BRI';
}
