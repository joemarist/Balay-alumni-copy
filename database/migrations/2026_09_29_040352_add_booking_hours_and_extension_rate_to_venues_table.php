<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->unsignedInteger('minimum_booking_hours')
                ->default(1)
                ->after('rate');

            $table->decimal('extension_rate_per_hour', 10, 2)
                ->default(0)
                ->after('minimum_booking_hours');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn([
                'minimum_booking_hours',
                'extension_rate_per_hour',
            ]);
        });
    }
};
