import { Head } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { useState } from 'react';

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

type PackageAddon = {
    name: string;
    price: number | string;
};

type PackageVenue = {
    id: number;
    name: string;
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
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

export default function EventPackages({
    packages,
}: EventPackagesProps) {
    const [open, setOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] =
        useState<EventPackage | null>(null);

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
                            className="relative overflow-visible rounded-[18px] border-2 border-[#eadfe1] shadow-none"
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
                                <Badge className="mb-5 w-fit rounded-full bg-[#f4e5e8] px-3.5 py-1.5 text-xs font-bold text-[#8f1735] hover:bg-[#f4e5e8]">
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
                                    className="mt-auto h-11 w-full rounded-[16px] border border-[#941b3b] bg-[#941b3b] text-sm font-semibold text-white shadow-none hover:bg-[#76152f] disabled:cursor-not-allowed disabled:opacity-50"
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
                                                className="rounded-lg border border-[#eadfe1] p-3"
                                            >
                                                <p className="font-medium text-[#161622]">
                                                    {venue.name}
                                                </p>

                                                <p className="text-sm text-[#744b55]">
                                                    Capacity:{' '}
                                                    {
                                                        venue.minimum_capacity_pax
                                                    }
                                                    -
                                                    {
                                                        venue.maximum_capacity_pax
                                                    }{' '}
                                                    pax
                                                </p>

                                                <p className="text-sm text-[#744b55]">
                                                    Extension: ₱
                                                    {Number(
                                                        venue.pivot
                                                            .extension_rate_per_hour,
                                                    ).toLocaleString()}
                                                    /hour
                                                </p>
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
