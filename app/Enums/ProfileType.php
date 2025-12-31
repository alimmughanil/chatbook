<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProfileType extends Enum
{
  const CompanyName = 'companyName';
  const Tagline = 'tagline';
  const Email = 'email';
  const Phone = 'phone';
  const Whatsapp = 'whatsapp';
  const Facebook = 'facebook';
  const Instagram = 'instagram';
  const Youtube = 'youtube';
  const OfficeAddress = 'officeAddress';
  const WarehouseAddress = 'warehouseAddress';
  const AddressMap = 'addressMap';
  const About = 'about';
  const Location = 'location';
}
