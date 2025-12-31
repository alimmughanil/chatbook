<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ActionType extends Enum
{
  const Create = 'create';
  const Read = 'read';
  const Edit = 'edit';
  const Update = 'update';
  const Delete = 'delete';
}
