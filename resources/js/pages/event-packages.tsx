import { Head } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

import { BookVenueModal } from '@/components/book-venue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { packages } from '@/routes';
import type { Venue } from '@/types';

type PackageAddon = {
    name: string;
    price: number | string;
};

type PackageVenue = Venue & {
    pivot: {
        extension_rate_per_hour: number | string;
    };
};

type EventPackage = {
    id: number;
    type: 'Basic' | 'Standard' | 'Premium';
    name: string;
    price: number | string;
    description: string | null;
    included_duration_hours: number;
    features: string[];
    addons: PackageAddon[];
    popular: boolean;
    available: boolean;
    venues: PackageVenue[];
};

type EventPackagesProps = {
    packages: EventPackage[];
};

const packageStyles = {
    Basic: {
        card: 'border-yellow-300 bg-[#fffbed]',
        badge: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
        button:
            'bg-transparent border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
    },

    Standard: {
        card: 'border-[#941b3b] bg-[#fffafa]',
        badge:
            'bg-[#941b3b] text-white hover:bg-[#941b3b]',
        button:
            'bg-[#941b3b] text-white hover:bg-[#76152f]',
    },

    Premium: {
        card: 'border-green-200 bg-[#f1fff6]',
        badge:
            'bg-green-700 text-white hover:bg-green-700',
        button:
            'bg-transparent border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
    },
} as const;

export default function EventPackages({
    packages,
}: EventPackagesProps) {
    const [open, setOpen] = useState(false);

    const [selectedPackage, setSelectedPackage] =
        useState<EventPackage | null>(null);

    const [bookingVenue, setBookingVenue] =
        useState<PackageVenue | null>(null);

    const handleChoosePackage = (pkg: EventPackage) => {
        setSelectedPackage(pkg);
        setOpen(true);
    };

    return (
        <>
            <Head title="Event Packages" />

            {/* Main Content */}
            <div className="w-full bg-[#fffafa] px-7 pb-12 pt-8">

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-bold text-[#161622]">
                        Event Packages
                    </h1>

                    <p className="mt-2 text-base text-[#744b55]">
                        Everything you need for the perfect event, bundled and ready.
                    </p>
                </div>

                {/* Package Cards */}
                <div className="mx-auto grid max-w-[1550px] grid-cols-1 gap-7 lg:grid-cols-3">

                    {packages.map((pkg) => (
                        <Card
                        key={pkg.id}
                        className={`relative overflow-visible rounded-[18px] border-2 shadow-none ${packageStyles[pkg.type].card}`}
                    >

                            {/* Most Popular Badge */}
                            {pkg.popular && (
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                    <Badge className="rounded-full bg-[#8f1735] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#8f1735]">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardContent className="flex h-full min-h-[600px] flex-col p-7">

                                {/* Package Type */}
                                <Badge
                                className={`mb-5 w-fit rounded-full px-3.5 py-1.5 text-xs font-bold ${packageStyles[pkg.type].badge}`}
                            >
                                {pkg.type}
                            </Badge>

                                {/* Package Name */}
                                <h2 className="font-serif text-2xl font-bold text-[#161622]">
                                    {pkg.name}
                                </h2>

                                {/* Price */}
                                <div className="mb-6 mt-1 font-serif text-3xl font-bold text-[#941b3b]">
                                    ₱{Number(pkg.price).toLocaleString()}
                                </div>

                                {/* Description */}
                                {pkg.description && (
                                    <p className="mb-4 text-sm leading-6 text-[#744b55]">
                                        {pkg.description}
                                    </p>
                                )}

                                {/* Features */}
                                <div className="space-y-2.5">
                                    {pkg.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className="flex items-start gap-2.5 text-sm leading-6 text-[#191921]"
                                        >
                                            <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-green-600">
                                                <Check
                                                    className="h-2.5 w-2.5 text-green-600"
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Included Duration */}
                                <div className="mt-5 text-sm font-medium text-[#744b55]">
                                    Includes {pkg.included_duration_hours} hours
                                </div>

                                {/* Available Venues */}
                                <div className="mt-5 border-t border-[#dedede] pt-4">
                                    <h3 className="mb-2 text-xs font-bold tracking-[1px] text-[#89515c]">
                                        AVAILABLE VENUES
                                    </h3>

                                    <div className="space-y-1">
                                        {pkg.venues.map((venue) => (
                                            <div
                                                key={venue.id}
                                                className="text-sm text-[#9b5965]"
                                            >
                                                • {venue.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add-ons */}
                                {pkg.addons.length > 0 && (
                                    <div className="mt-6 border-t border-[#dedede] pt-4">
                                        <h3 className="mb-2 text-xs font-bold tracking-[1px] text-[#89515c]">
                                            AVAILABLE ADD-ONS
                                        </h3>

                                        <div className="space-y-1">
                                            {pkg.addons.map((addon) => (
                                                <div
                                                    key={addon.name}
                                                    className="flex justify-between gap-3 text-sm text-[#9b5965]"
                                                >
                                                    <span>
                                                        + {addon.name}
                                                    </span>

                                                    <span className="font-medium">
                                                        ₱
                                                        {Number(
                                                            addon.price,
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Choose Package */}
                                <Button
                                disabled={!pkg.available}
                                className={`mt-auto h-11 w-full rounded-[16px] border text-sm font-semibold shadow-none ${packageStyles[pkg.type].button} disabled:cursor-not-allowed disabled:opacity-50`}
                                    onClick={() =>
                                        handleChoosePackage(pkg)
                                    }
                                >
                                    {pkg.available
                                        ? 'Choose Package'
                                        : 'Unavailable'}
                                </Button>

                            </CardContent>
                        </Card>
                    ))}

                </div>
            </div>

            {/* Package Selection Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">

                    <DialogHeader>
                        <DialogTitle>
                            {selectedPackage?.name}
                        </DialogTitle>

                        <DialogDescription>
                            Review the selected event package before
                            continuing.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedPackage && (
                        <div className="space-y-4">

                            {/* Package Price */}
                            <div>
                                <p className="text-sm text-[#744b55]">
                                    Package Price
                                </p>

                                <p className="text-2xl font-bold text-[#941b3b]">
                                    ₱
                                    {Number(
                                        selectedPackage.price,
                                    ).toLocaleString()}
                                </p>
                            </div>

                            {/* Duration */}
                            <div>
                                <p className="text-sm text-[#744b55]">
                                    Included Duration
                                </p>

                                <p className="font-medium text-[#161622]">
                                    {
                                        selectedPackage.included_duration_hours
                                    }{' '}
                                    hours
                                </p>
                            </div>

                            {/* Venues */}
                            <div>
                                <p className="mb-2 text-sm text-[#744b55]">
                                    Available Venues
                                </p>

                                <div className="space-y-2">
                                    {selectedPackage.venues.map(
                                        (venue) => (
                                            <div
                                            key={venue.id}
                                            className="rounded-lg border border-[#eadfe1] bg-white p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-medium text-[#161622]">
                                                        {venue.name}
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#744b55]">
                                                        Capacity:{' '}
                                                        {venue.minimum_capacity_pax}
                                                        -
                                                        {venue.maximum_capacity_pax} pax
                                                    </p>

                                                    <p className="text-sm text-[#744b55]">
                                                        Extension:{' '}
                                                        {Number(
                                                            venue.pivot.extension_rate_per_hour,
                                                        ) > 0
                                                            ? `₱${Number(
                                                                venue.pivot.extension_rate_per_hour,
                                                            ).toLocaleString()}/hour`
                                                            : 'Not available'}
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setBookingVenue(venue);
                                                        setOpen(false);
                                                    }}
                                                    className="shrink-0 rounded-lg bg-[#941b3b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#76152f]"
                                                >
                                                    Book This Venue
                                                </Button>
                                            </div>
                                        </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Close */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setOpen(false)}
                                    className="bg-[#941b3b] text-white hover:bg-[#76152f]"
                                >
                                    Close
                                </Button>
                            </div>

                        </div>
                    )}

                </DialogContent>
            </Dialog>

            {bookingVenue && selectedPackage && (
                <BookVenueModal
                    venue={bookingVenue}
                    package={selectedPackage}
                    onClose={() => setBookingVenue(null)}
                />
            )}
        </>
    );
}

EventPackages.layout = {
    breadcrumbs: [
        {
            title: 'Event Packages',
            href: packages(),
        },
    ],
};
