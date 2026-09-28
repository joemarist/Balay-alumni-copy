<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'price',
        'included_duration_hours',
        'features',
        'addons',
        'popular',
        'available',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'included_duration_hours' => 'integer',
            'features' => 'array',
            'addons' => 'array',
            'popular' => 'boolean',
            'available' => 'boolean',
        ];
    }

    public function venues(): BelongsToMany
    {
        return $this->belongsToMany(Venue::class)
            ->withPivot('extension_rate_per_hour')
            ->withTimestamps();
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
