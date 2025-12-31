<?php

namespace App\Models;

use App\Models\Traits\Published;
use App\Models\Traits\Filterable;
use App\Models\Traits\FilterRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Certificate extends Model
{
    use HasFactory, Filterable, Published, FilterRole;
    protected $guarded = [];

    public function course(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Course::class);
    }

    public function label(): HasMany
    {
        return $this->hasMany(\App\Models\CertificateLabel::class);
    }
    public function participantCertificates()
    {
        return $this->hasMany(\App\Models\ParticipantCertificate::class);
    }
}
