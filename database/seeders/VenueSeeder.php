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
            'capacity_pax' => 100,
            'capacity_label' => '80-100 pax',
            'rate' => 15000,
            'rate_duration' => '4 hours use',
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
            'capacity_pax' => 20,
            'capacity_label' => '10-20 persons',
            'rate' => 3000,
            'rate_duration' => '4 hours use',
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
            'capacity_pax' => 200,
            'capacity_label' => '150-200 persons',
            'rate' => 30000,
            'rate_duration' => '4 hours use',
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
