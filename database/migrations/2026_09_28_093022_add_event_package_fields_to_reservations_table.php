<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('event_package_id')
                ->nullable()
                ->after('venue_id')
                ->constrained('event_packages')
                ->nullOnDelete();

            $table->decimal('package_amount', 10, 2)
                ->default(0)
                ->after('venue_rental');

            $table->decimal('addon_amount', 10, 2)
                ->default(0)
                ->after('package_amount');

            $table->unsignedInteger('venue_extension_hours')
                ->default(0)
                ->after('addon_amount');

            $table->decimal('venue_extension_amount', 10, 2)
                ->default(0)
                ->after('venue_extension_hours');

            $table->json('selected_addons')
                ->nullable()
                ->after('venue_extension_amount');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropForeign(['event_package_id']);

            $table->dropColumn([
                'event_package_id',
                'package_amount',
                'addon_amount',
                'venue_extension_hours',
                'venue_extension_amount',
                'selected_addons',
            ]);
        });
    }
};
