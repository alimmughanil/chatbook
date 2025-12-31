<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    protected $casts = [
        'is_action_button' => 'boolean',
    ];
}
