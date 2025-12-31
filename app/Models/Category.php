<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use App\Models\Traits\SelectOptions;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, Filterable, SelectOptions, SoftDeletes;
    protected $guarded = [];

    public function product(): HasMany
    {
        return $this->hasMany(\App\Models\Product::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Category::class, 'parent_id')->withTrashed();
    }

    public function children(): HasMany
    {
        return $this->hasMany(\App\Models\Category::class, 'parent_id')->withTrashed();
    }
}
