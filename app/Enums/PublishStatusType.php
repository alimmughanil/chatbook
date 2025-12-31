<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PublishStatusType extends Enum
{
  const Draft = 'draft';
  const Publish = 'publish';
  const Archived = 'archived';
}
