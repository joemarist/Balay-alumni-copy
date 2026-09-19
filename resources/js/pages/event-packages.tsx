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






const packageData = [
    {
        type: 'Basic',
        name: 'Halo Package',
        price: '₱25,000',
        description: [
            'Venue rental (4 hrs)',
            'Tables & chairs for 50 pax',
            'Basic sound system',
            '1 Event coordinator',
            'Welcome signage',
            'Basic floral centerpieces',
        ],
        addons: [
            'Photo booth +₱3,000',
            'Catering +₱8,000',
            'Live music +₱5,000',
        ],
        cardClass: 'border-yellow-300 bg-[#fffbed]',
        badgeClass:
            'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
        buttonClass:
            'bg-transparent border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
    },
    {
        type: 'Standard',
        name: 'Dungan Package',
        price: '₱55,000',
        popular: true,
        description: [
            'Venue rental (8 hrs)',
            'Tables & chairs for 150 pax',
            'Full sound & lighting',
            '2 Event coordinators',
            'Custom backdrop & signage',
            'Premium floral arrangements',
            'Café orders for 50 pax',
            'Dedicated parking slots',
        ],
        addons: [
            'Drone coverage +₱6,000',
            'Photo & video +₱12,000',
            'Catering upgrade +₱15,000',
        ],
        cardClass: 'border-[#941b3b] bg-[#fffafa]',
        badgeClass:
            'bg-[#941b3b] text-white hover:bg-[#941b3b]',
        buttonClass:
            'bg-[#941b3b] text-white hover:bg-[#76152f]',
    },
    {
        type: 'Premium',
        name: 'Balay Package',
        price: '₱95,000',
        description: [
            'Grand Ballroom (full day)',
            'Tables & chairs for 300 pax',
            'Premium AV & lighting system',
            '3 Senior coordinators',
            'Full décor & theming',
            'Gourmet catering (300 pax)',
            'Open café bar (4 hrs)',
            'Photo & video coverage',
            'Dedicated valet parking',
            'Post-event cleanup',
        ],
        addons: [
            'International DJ +₱20,000',
            'Fireworks +₱15,000',
            'Honeymoon suite +₱8,000',
        ],
        cardClass:
            'border-green-200 bg-[#f1fff6]',
        badgeClass:
            'bg-green-700 text-white hover:bg-green-700',
        buttonClass:
            'bg-transparent border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
    },
];

export default function EventPackages() {
    const [open, setOpen] = useState(false);

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

                    {packageData.map((pkg) => (
                        <Card
                            key={pkg.name}
                            className={`relative overflow-visible rounded-[18px] border-2 shadow-none ${pkg.cardClass}`}
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
                                    className={`mb-5 w-fit rounded-full px-3.5 py-1.5 text-xs font-bold ${pkg.badgeClass}`}
                                >
                                    {pkg.type}
                                </Badge>

                                {/* Package Name */}
                                <h2 className="font-serif text-2xl font-bold text-[#161622]">
                                    {pkg.name}
                                </h2>

                                {/* Price */}
                                <div className="mb-6 mt-1 font-serif text-3xl font-bold text-[#941b3b]">
                                    {pkg.price}
                                </div>

                                {/* Features */}
                                <div className="space-y-2.5">
                                    {pkg.description.map((feature) => (
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

                                {/* Add-ons */}
                                <div className="mt-6 border-t border-[#dedede] pt-4">
                                    <h3 className="mb-2 text-xs font-bold tracking-[1px] text-[#89515c]">
                                        AVAILABLE ADD-ONS
                                    </h3>

                                    <div className="space-y-1">
                                        {pkg.addons.map((addon) => (
                                            <div
                                                key={addon}
                                                className="text-sm text-[#9b5965]"
                                            >
                                                + {addon}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Choose Package */}
                                <Button
                                    className={`mt-6 h-11 w-full rounded-[16px] border text-sm font-semibold shadow-none ${pkg.buttonClass}`}
                                    onClick={() => setOpen(true)}
                                >
                                    Choose Package
                                </Button>

                            </CardContent>
                        </Card>
                    ))}

                </div>
            </div>

            {/* Test Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">

                    <DialogHeader>
                        <DialogTitle>
                            Test Modal
                        </DialogTitle>

                        <DialogDescription>
                            This is a test modal for the selected event package.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => setOpen(false)}
                            className="bg-[#941b3b] text-white hover:bg-[#76152f]"
                        >
                            Close
                        </Button>
                    </div>

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
