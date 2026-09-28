<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Order extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'user_id',
        'status',
        'payment_status',
        'payment_method',
        'payment_proof',
        'pickup_time',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'pickup_time' => 'datetime',
            'total_amount' => 'decimal:2',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->useLogName('cafe-orders')
            ->logFillable()
            ->logOnlyDirty();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}