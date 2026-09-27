<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'minimum_capacity_pax',
        'maximum_capacity_pax',
        'rate',
        'rate_duration',
        'inclusions',
        'note',
        'image',
        'available',
    ];

    protected function casts(): array
    {
        return [
            'minimum_capacity_pax' => 'integer',
            'maximum_capacity_pax' => 'integer',
            'rate' => 'decimal:2',
            'inclusions' => 'array',
            'available' => 'boolean',
        ];
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
