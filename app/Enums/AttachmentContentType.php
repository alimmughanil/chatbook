<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AttachmentContentType extends Enum
{
  const Image = 'image';
  const Pdf = 'pdf';
  const Word = 'word';
  const Other = 'other';
  const Link = 'link';

  public static function extensions(): array
  {
    return [
      self::Image => ['jpg', 'jpeg', 'png', 'webp', 'avif'],
      self::Pdf => ['pdf'],
      self::Word => ['doc', 'docx'],
      self::Other => [],
      self::Link => [],
    ];
  }

  public static function mimeTypes(): array
  {
    return [
      self::Image => ['image/jpeg', 'image/png', 'image/webp'],
      self::Pdf => ['application/pdf'],
      self::Word => [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      self::Other => [],
      self::Link => [],
    ];
  }
  public static function fromExtension(string $ext): string
  {
    $ext = strtolower($ext);
    $map = self::extensions();

    foreach ($map as $type => $extList) {
      if (in_array($ext, $extList, true)) {
        return $type;
      }
    }

    return self::Other;
  }
}
