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


  public function formType()
  {
    return [
      self::CompanyName => 'input:text',
      self::Tagline => 'input:text',
      self::Email => 'input:email',
      self::Phone => 'input:tel',
      self::Whatsapp => 'input:tel',
      self::Facebook => 'input:text',
      self::Instagram => 'input:text',
      self::Youtube => 'input:text',
      self::OfficeAddress => 'textarea:texteditor',
      self::WarehouseAddress => 'textarea:texteditor',
      self::AddressMap => 'input:text',
      self::About => 'textarea:texteditor',
      self::Location => 'input:text',
    ];
  }
  public function formAction()
  {
    return [
      self::CompanyName => ['update'],
      self::Tagline => ['update'],
      self::Email => ['update'],
      self::Phone => ['update'],
      self::Whatsapp => ['update'],
      self::Facebook => ['update'],
      self::Instagram => ['update'],
      self::Youtube => ['update'],
      self::OfficeAddress => ['update'],
      self::AddressMap => ['update'],
      self::About => ['update'],
      self::Location => ['update'],
    ];
  }
}
