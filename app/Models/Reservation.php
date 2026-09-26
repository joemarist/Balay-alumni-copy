<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Reservation extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'venue_id',
        'event_type',
        'guest_count',
        'event_date',
        'start_time',
        'end_time',
        'special_requests',
        'payment_method',
        'venue_rental',
        'service_fee',
        'total_amount',
        'payment_amount',
        'payment_reference',
        'payment_proof',
        'payment_status',
        'payment_remarks',
        'payment_submitted_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'venue_rental' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'payment_amount' => 'decimal:2',
            'payment_submitted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('reservations')
            ->logFillable()
            ->logOnlyDirty();
    }
}
