<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, Filterable, SoftDeletes;
    protected $guarded = [];

    public function order(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Order::class);
    }
}
