<?php

namespace App\Models;

use App\Enums\ProfileDetailType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfileDetail extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'type' => ProfileDetailType::class,
        'value' => 'array',
    ];

    public static function allowedFields(ProfileDetailType $type): array
    {
        return match ($type->value) {
            ProfileDetailType::Education => [
                'school' => 'string',
                'degree' => 'string',
                'start_year' => 'string',
                'end_year' => 'string'
            ],
            ProfileDetailType::Experience => [
                'company' => 'string',
                'position' => 'string',
                'start_date' => 'string',
                'end_date' => 'string',
                'description' => 'string'
            ],
            ProfileDetailType::Skill => [
                'name' => 'string'
            ],
            ProfileDetailType::Language => [
                'language' => 'string',
                'level' => 'string'
            ],
            ProfileDetailType::Certificate => [
                'title' => 'string'
            ],
            ProfileDetailType::Banner => [
                'path' => 'string'
            ],
        };
    }

    protected static function booted()
    {
        static::saving(function (ProfileDetail $detail) {
            if ($detail->value && $detail->type) {
                $allowed = array_keys(self::allowedFields($detail->type));
                $detail->value = collect($detail->value)
                    ->only($allowed)
                    ->toArray();
            }
        });
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
