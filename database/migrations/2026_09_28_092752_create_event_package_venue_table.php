<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_package_venue', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_package_id')
                ->constrained('event_packages')
                ->cascadeOnDelete();

            $table->foreignId('venue_id')
                ->constrained('venues')
                ->cascadeOnDelete();

            $table->decimal('extension_rate_per_hour', 10, 2)
                ->default(0);

            $table->timestamps();

            $table->unique([
                'event_package_id',
                'venue_id',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_package_venue');
    }
};
