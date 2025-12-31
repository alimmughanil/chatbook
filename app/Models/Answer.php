<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];

    public function question(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Question::class);
    }
}
