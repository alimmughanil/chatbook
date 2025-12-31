<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class SubmissionGradeResultType extends Enum
{
    const Passed = 'passed';
    const Failed = 'failed';
    const Pending = 'pending';
}

