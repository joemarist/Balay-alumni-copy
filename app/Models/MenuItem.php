<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'price',
        'image',
        'available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean',
    ];
}