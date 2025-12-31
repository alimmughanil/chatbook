<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class QuestionType extends Enum
{
  const SingleChoice = 'single_choice';
  const MultipleChoice = 'multiple_choice';
  const Essay = 'essay';
  const FileUpload = 'file_upload';

  public static function description(): array
  {
    return [
      self::SingleChoice => 'Pilihan ganda dengan satu jawaban benar',
      self::MultipleChoice => 'Pilihan ganda dengan lebih dari satu jawaban benar',
      self::Essay => 'Pertanyaan dengan jawaban dalam bentuk teks',
      self::FileUpload => 'Pertanyaan yang dijawab dengan mengunggah file',
    ];
  }
}

