import { Head } from '@inertiajs/react';
import { Clock, Search, Users } from 'lucide-react';
import { useState } from 'react';

import { BookVenueModal } from '@/components/book-venue';
import { venues } from '@/routes';
import type { Venue } from '@/types';


const venueList: Venue[] = [
    {
        id: 1,
        name: 'Balay Alumni Function Hall',
        category: 'Function Hall',
        description:
            'Fully air-conditioned function hall perfect for events, gatherings, and celebrations.',
        capacity: '80-100 pax',
        duration: '4 hours use',
        amenities: ['Tables & Chairs', 'Basic Sound System', 'Fully Air-Conditioned', '+1 more'],
        inclusions: ['Tables & Chairs', 'Basic Sound System', 'Fully Air-Conditioned', 'Big Parking Area'],
        corkageFee: '₱500 for lechon.',
        rate: '₱15,000',
        available: true,
        image: '/images/venue/venue-functionhall.png',
    },
    {
        id: 2,
        name: 'Balay Cafe Conference Room',
        category: 'Conference',
        description:
            'Intimate air-conditioned conference room ideal for meetings and small group sessions.',
        capacity: '10-20 persons',
        duration: '4 hours use',
        amenities: ['Long Table & Office Chairs', 'Basic Sound System', 'Flat Screen TV', '+3 more'],
        inclusions: ['Long Table & Office Chairs', 'Basic Sound System', 'Flat Screen TV', 'Air-Conditioned'],
        rate: '₱3,000',
        available: true,
        image: '/images/venue/venue-conference.png',
    },
    {
        id: 3,
        name: 'Whole Area of Balay Alumni',
        category: 'Whole Venue',
        description:
            'The entire Balay Alumni venue — perfect for company occasions and large events.',
        capacity: '150-200 persons',
        duration: '4 hours use',
        amenities: ['Function Hall', 'Cafe Mini Hall', 'Open Place at Balay Alumni', '+3 more'],
        inclusions: ['Function Hall', 'Cafe Mini Hall', 'Open Place at Balay Alumni', 'Big Parking Area'],
        rate: '₱30,000',
        available: true,
        image: '/images/venue/venue-wholearea.png',
    },
];

const filters = ['All', 'Function Hall', 'Conference', 'Whole Venue'] as const;

export default function Venues() {
    const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
    const [query, setQuery] = useState('');
    const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);

    const filteredVenues = venueList.filter((venue) => {
        const matchesFilter = activeFilter === 'All' || venue.category === activeFilter;
        const matchesQuery = venue.name.toLowerCase().includes(query.toLowerCase());

        return matchesFilter && matchesQuery;
    });

    return (
        <>
            <Head title="Venues" />
            <div className="flex flex-1 flex-col gap-5 bg-white p-6">
                {/* Search + filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search venues..."
                            className="w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-[#6B1E28] text-white'
                                        : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Venue grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredVenues.map((venue) => (
                        <div
                            key={venue.id}
                            className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                        >
                            <div className="relative aspect-video bg-neutral-100">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="size-full object-cover"
                                />
                                <span className="absolute left-3 top-3 rounded-full bg-[#6B1E28] px-3 py-1 text-xs font-medium text-white">
                                    {venue.category}
                                </span>
                                {venue.available && (
                                    <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                        Available
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 p-5">
                                <h3 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                                    {venue.name}
                                </h3>
                                <p className="text-sm text-neutral-500">{venue.description}</p>

                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4" />
                                        {venue.capacity}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4" />
                                        {venue.duration}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {venue.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="rounded-full bg-[#F7E3E0] px-3 py-1 text-xs font-medium text-[#6B1E28]"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-2 flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-neutral-400">
                                            Rate ({venue.duration})
                                        </p>
                                        <p className="text-xl font-semibold text-[#3A1A1F]">{venue.rate}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setBookingVenue(venue)}
                                        className="rounded-lg bg-[#6B1E28] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {bookingVenue && (
                <BookVenueModal venue={bookingVenue} onClose={() => setBookingVenue(null)} />
            )}
        </>
    );
}

Venues.layout = {
    breadcrumbs: [
        {
            title: 'Venues',
            href: venues(),
        },
    ],
};
