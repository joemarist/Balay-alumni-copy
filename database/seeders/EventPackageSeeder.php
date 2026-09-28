<?php

namespace Database\Seeders;

use App\Models\EventPackage;
use App\Models\Venue;
use Illuminate\Database\Seeder;

class EventPackageSeeder extends Seeder
{
    public function run(): void
    {
        $functionHall = Venue::where(
            'name',
            'Balay Alumni Function Hall'
        )->first();

        $conferenceRoom = Venue::where(
            'name',
            'Balay Cafe Conference Room'
        )->first();

        $wholeArea = Venue::where(
            'name',
            'Whole Area of Balay Alumni'
        )->first();

        $halo = EventPackage::updateOrCreate(
            ['name' => 'Halo Package'],
            [
                'type' => 'Basic',
                'price' => 25000,
                'included_duration_hours' => 4,
                'description' =>
                    'A simple and practical package for intimate gatherings and celebrations.',
                'features' => [
                    'Tables and chairs',
                    'Basic sound system',
                    '1 event coordinator',
                    'Welcome signage',
                    'Basic floral centerpieces',
                ],
                'addons' => [
                    [
                        'name' => 'Photo booth',
                        'price' => 3000,
                    ],
                    [
                        'name' => 'Catering',
                        'price' => 8000,
                    ],
                    [
                        'name' => 'Live music',
                        'price' => 5000,
                    ],
                ],
                'popular' => false,
                'available' => true,
            ]
        );

        $dungan = EventPackage::updateOrCreate(
            ['name' => 'Dungan Package'],
            [
                'type' => 'Standard',
                'price' => 55000,
                'included_duration_hours' => 8,
                'description' =>
                    'A complete package for larger celebrations with enhanced event services.',
                'features' => [
                    'Tables and chairs',
                    'Full sound and lighting',
                    '2 event coordinators',
                    'Custom backdrop and signage',
                    'Premium floral arrangements',
                    'Café orders for 50 pax',
                    'Dedicated parking slots',
                ],
                'addons' => [
                    [
                        'name' => 'Drone coverage',
                        'price' => 6000,
                    ],
                    [
                        'name' => 'Photo & video',
                        'price' => 12000,
                    ],
                    [
                        'name' => 'Catering upgrade',
                        'price' => 15000,
                    ],
                ],
                'popular' => true,
                'available' => true,
            ]
        );

        $balay = EventPackage::updateOrCreate(
            ['name' => 'Balay Package'],
            [
                'type' => 'Premium',
                'price' => 95000,
                'included_duration_hours' => 12,
                'description' =>
                    'A premium full-service package for large-scale celebrations and special occasions.',
                'features' => [
                    'Premium AV and lighting system',
                    '3 senior coordinators',
                    'Full décor and theming',
                    'Gourmet catering',
                    'Open café bar for 4 hours',
                    'Photo and video coverage',
                    'Dedicated valet parking',
                    'Post-event cleanup',
                ],
                'addons' => [
                    [
                        'name' => 'International DJ',
                        'price' => 20000,
                    ],
                    [
                        'name' => 'Fireworks',
                        'price' => 15000,
                    ],
                    [
                        'name' => 'Honeymoon suite',
                        'price' => 8000,
                    ],
                ],
                'popular' => false,
                'available' => true,
            ]
        );

        $halo->venues()->sync([
            $functionHall?->id => [
                'extension_rate_per_hour' => 2500,
            ],
            $conferenceRoom?->id => [
                'extension_rate_per_hour' => 1500,
            ],
        ]);

        $dungan->venues()->sync([
            $functionHall?->id => [
                'extension_rate_per_hour' => 2500,
            ],
            $wholeArea?->id => [
                'extension_rate_per_hour' => 5000,
            ],
        ]);

        $balay->venues()->sync([
            $functionHall?->id => [
                'extension_rate_per_hour' => 2500,
            ],
            $wholeArea?->id => [
                'extension_rate_per_hour' => 5000,
            ],
        ]);
    }
}
