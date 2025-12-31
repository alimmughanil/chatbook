<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProfileFormType extends Enum
{
  const CompanyName = 'input:text';
  const Tagline = 'input:text';
  const Email = 'input:email';
  const Phone = 'input:tel';
  const Whatsapp = 'input:tel';
  const Facebook = 'input:text';
  const Instagram = 'input:text';
  const Youtube = 'input:text';
  const OfficeAddress = 'textarea:texteditor';
  const WarehouseAddress = 'textarea:texteditor';
  const AddressMap = 'input:text';
  const About = 'textarea:texteditor';
  const Location = 'input:text';
}
