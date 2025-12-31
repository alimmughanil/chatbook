<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class UserType extends Enum
{
  const Admin = 'admin';
  const Editor = 'editor';
  const User = 'user';
}
