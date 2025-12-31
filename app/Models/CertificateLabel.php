<?php

namespace App\Models;

use App\Models\Traits\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CertificateLabel extends Model
{
    use HasFactory, Filterable;
    protected $guarded = [];
    protected $table = 'certificate_labels';

    public function certificate(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Certificate::class);
    }
}
