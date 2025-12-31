<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProfileActionType extends Enum
{
  const CompanyName = ['update'];
  const Tagline = ['update'];
  const Email = ['update'];
  const Phone = ['update'];
  const Whatsapp = ['update'];
  const Facebook = ['update'];
  const Instagram = ['update'];
  const Youtube = ['update'];
  const OfficeAddress = ['update'];
  const AddressMap = ['update'];
  const About = ['update'];
  const Location = ['update'];
}
