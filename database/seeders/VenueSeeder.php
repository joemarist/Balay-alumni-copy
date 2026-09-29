<?php

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        Venue::create([
            'name' => 'Balay Alumni Function Hall',
            'description' => 'Fully air-conditioned function hall perfect for events, gatherings, and celebrations.',
            'category' => 'Function Hall',

            // Capacity range: 80–100 pax
            'minimum_capacity_pax' => 80,
            'maximum_capacity_pax' => 100,

            // Automatic rental pricing:
            // ₱15,000 covers the first 4 hours.
            // Every additional hour costs ₱2,500.
            'rate' => 15000,
            'rate_duration' => '4 hours use',
            'minimum_booking_hours' => 4,
            'extension_rate_per_hour' => 2500,

            'inclusions' => [
                'Tables & Chairs',
                'Basic Sound System',
                'Fully Air-Conditioned',
                'Big Parking Area',
            ],
            'note' => 'Corkage Fee: ₱500 for lechon.',
            'image' => '/images/venue/venue-functionhall.png',
            'available' => true,
        ]);

        Venue::create([
            'name' => 'Balay Cafe Conference Room',
            'description' => 'Intimate air-conditioned conference room ideal for meetings and small group sessions.',
            'category' => 'Conference',

            // Capacity range: 10–20 pax
            'minimum_capacity_pax' => 10,
            'maximum_capacity_pax' => 20,

            // Automatic rental pricing:
            // ₱3,000 covers the first 4 hours.
            // Every additional hour costs ₱2,500.
            'rate' => 3000,
            'rate_duration' => '4 hours use',
            'minimum_booking_hours' => 4,
            'extension_rate_per_hour' => 2500,

            'inclusions' => [
                'Long Table & Office Chairs',
                'Basic Sound System',
                'Flat Screen TV',
                'Air-Conditioned',
            ],
            'note' => null,
            'image' => '/images/venue/venue-conference.png',
            'available' => true,
        ]);

        Venue::create([
            'name' => 'Whole Area of Balay Alumni',
            'description' => 'The entire Balay Alumni venue — perfect for company occasions and large events.',
            'category' => 'Whole Venue',

            // Capacity range: 150–200 pax
            'minimum_capacity_pax' => 150,
            'maximum_capacity_pax' => 200,

            // Automatic rental pricing:
            // ₱30,000 covers the first 4 hours.
            // Every additional hour costs ₱2,500.
            'rate' => 30000,
            'rate_duration' => '4 hours use',
            'minimum_booking_hours' => 4,
            'extension_rate_per_hour' => 2500,

            'inclusions' => [
                'Function Hall',
                'Cafe Mini Hall',
                'Open Place at Balay Alumni',
                'Big Parking Area',
            ],
            'note' => null,
            'image' => '/images/venue/venue-wholearea.png',
            'available' => true,
        ]);
    }
}
