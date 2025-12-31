<?php

namespace App\Rules;
use Illuminate\Contracts\Validation\Rule;

class YoutubeUrl implements Rule
{
    public function passes($attribute, $value)
    {
        $parts = parse_url($value);

        if (!isset($parts['host']) || $parts['host'] !== 'www.youtube.com') {
            return false;
        }

        parse_str($parts['query'] ?? '', $query);

        return isset($query['v']) && strlen($query['v']) > 0;
    }

    public function message()
    {
        return 'URL video harus berupa tautan YouTube dengan parameter v yang valid.';
    }
}
