<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProfileDetailType extends Enum
{
    const Education = 'education';
    const Experience = 'experience';
    const Skill = 'skill';
    const Language = 'language';
    const Certificate = 'certificate';
    const Banner = 'banner';

    public function label(): string
    {
        return match ($this) {
            self::Education => 'Pendidikan',
            self::Experience => 'Pengalaman Kerja',
            self::Skill => 'Keahlian',
            self::Language => 'Bahasa',
            self::Certificate => 'Sertifikat',
            self::Banner => 'Banner',
        };
    }
}
