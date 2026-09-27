<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->unsignedInteger('minimum_capacity_pax')
                ->nullable()
                ->after('capacity_pax');

            $table->unsignedInteger('maximum_capacity_pax')
                ->nullable()
                ->after('minimum_capacity_pax');
        });

        /*
         * Migrate existing venue data.
         *
         * If the old capacity label contains something like
         * "20-100 pax", use those numbers.
         *
         * Otherwise:
         * minimum = 1
         * maximum = old capacity_pax
         */
        $venues = DB::table('venues')->get();

        foreach ($venues as $venue) {
            $minimum = 1;
            $maximum = (int) $venue->capacity_pax;

            if (! empty($venue->capacity_label)) {
                if (
                    preg_match(
                        '/^\s*(\d+)\s*-\s*(\d+)\s*(?:pax)?\s*$/i',
                        $venue->capacity_label,
                        $matches
                    )
                ) {
                    $minimum = (int) $matches[1];
                    $maximum = (int) $matches[2];
                }
            }

            DB::table('venues')
                ->where('id', $venue->id)
                ->update([
                    'minimum_capacity_pax' => $minimum,
                    'maximum_capacity_pax' => $maximum,
                ]);
        }

        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn([
                'capacity_pax',
                'capacity_label',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            $table->unsignedInteger('capacity_pax')
                ->nullable()
                ->after('category');

            $table->string('capacity_label')
                ->nullable()
                ->after('capacity_pax');
        });

        $venues = DB::table('venues')->get();

        foreach ($venues as $venue) {
            DB::table('venues')
                ->where('id', $venue->id)
                ->update([
                    'capacity_pax' => $venue->maximum_capacity_pax,
                    'capacity_label' =>
                        $venue->minimum_capacity_pax .
                        '-' .
                        $venue->maximum_capacity_pax .
                        ' pax',
                ]);
        }

        Schema::table('venues', function (Blueprint $table) {
            $table->dropColumn([
                'minimum_capacity_pax',
                'maximum_capacity_pax',
            ]);
        });
    }
};
