<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class LanguageLevelType extends Enum
{
	const Basic = 'basic';
	const Intermediate = 'intermediate';
	const Advanced = 'advanced';
	const Native = 'native';

	public function label(): string
	{
		return match ($this) {
			self::Basic => 'Dasar',
			self::Intermediate => 'Menengah',
			self::Advanced => 'Ahli',
			self::Native => 'Penutur Asli',
		};
	}
}
