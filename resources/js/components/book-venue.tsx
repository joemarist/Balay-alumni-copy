import { Check, X } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import type { Venue } from '@/types';

type BookingPackageAddon = {
    name: string;
    price: number | string;
};

type BookingPackage = {
    id: number;
    name: string;
    type: 'Basic' | 'Standard' | 'Premium';
    price: number | string;
    included_duration_hours: number;
    addons: BookingPackageAddon[];
};

type BookingForm = {
    eventType: string;
    guestCount: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    specialRequests: string;
    paymentMethod: string;
    selectedAddonNames: string[];
    extensionHours: string;
};

const eventTypes = [
    'Reunion / Alumni Event',
    'Wedding',
    'Birthday Party',
    'Corporate Event',
    'Conference / Seminar',
    'Other',
];

const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM',
];

const paymentMethods = ['GCash', 'Bank Transfer', 'Cash at Venue'];

const SERVICE_FEE_RATE = 0.05;

function parseRate(rate: string): number {
    return Number(rate.replace(/[^\d.]/g, ''));
}

function convertTo24Hour(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    }

    if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
    const steps = [
        { number: 1 as const, label: 'Details' },
        { number: 2 as const, label: 'Date & Time' },
        { number: 3 as const, label: 'Confirm' },
    ];

    return (
        <div className="flex items-center gap-2 text-sm">
            {steps.map((s, index) => (
                <div key={s.number} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`flex size-5 items-center justify-center rounded-full text-xs font-semibold ${
                                step > s.number
                                    ? 'bg-emerald-500 text-white'
                                    : step === s.number
                                      ? 'bg-[#6B1E28] text-white'
                                      : 'bg-neutral-100 text-neutral-400'
                            }`}
                        >
                            {step > s.number ? <Check className="size-3" /> : s.number}
                        </span>
                        <span
                            className={
                                step === s.number
                                    ? 'font-medium text-[#3A1A1F]'
                                    : 'text-neutral-400'
                            }
                        >
                            {s.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && <span className="h-px w-6 bg-neutral-200" />}
                </div>
            ))}
        </div>
    );
}


export function BookVenueModal({
    venue,
    package: selectedPackage = null,
    onClose,
}: {
    venue: Venue;
    package?: BookingPackage | null;
    onClose: () => void;
}) {
    const { errors } = usePage<{
        errors: Record<string, string>;
    }>().props;

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [form, setForm] = useState<BookingForm>({
        eventType: eventTypes[0],
        guestCount: '',
        eventDate: '',
        startTime: '2:00 PM',
        endTime: '8:00 PM',
        specialRequests: '',
        paymentMethod: paymentMethods[0],
        selectedAddonNames: [],
        extensionHours: '0',
    });

    const packageAmount = selectedPackage
    ? Number(selectedPackage.price)
    : 0;

const venueRental = selectedPackage
    ? 0
    : parseRate(String(venue.rate));

const addonAmount = selectedPackage
    ? selectedPackage.addons
        .filter((addon) =>
            form.selectedAddonNames.includes(addon.name),
        )
        .reduce(
            (sum, addon) => sum + Number(addon.price),
            0,
        )
    : 0;

const extensionHours = selectedPackage
    ? Number(form.extensionHours) || 0
    : 0;

const extensionRate = selectedPackage
    ? Number(
          // This should eventually come from the
          // selected package + venue pivot.
          0,
      )
    : 0;

const extensionAmount =
    extensionHours * extensionRate;

const subtotal =
    packageAmount +
    venueRental +
    addonAmount +
    extensionAmount;

const serviceFee =
    Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;

const total =
    subtotal + serviceFee;

    function updateForm<K extends keyof BookingForm>(key: K, value: BookingForm[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function handleConfirm() {
        if (!form.eventDate) {
            alert('Please select an event date.');
            setStep(2);
            return;
        }

        const guestCount = Number(form.guestCount);

        if (
            !form.guestCount ||
            guestCount < venue.minimum_capacity_pax ||
            guestCount > venue.maximum_capacity_pax
        ) {
            alert(
                `This venue accepts between ${venue.minimum_capacity_pax} and ${venue.maximum_capacity_pax} guests.`,
            );
            setStep(1);
            return;
        }

        router.post(
            '/reservations',
            {
                venue_id: venue.id,

                event_package_id: selectedPackage?.id ?? null,

                event_type: form.eventType,

                guest_count: Number(form.guestCount),

                event_date: form.eventDate,

                start_time: convertTo24Hour(form.startTime),

                end_time: convertTo24Hour(form.endTime),

                special_requests: form.specialRequests || null,

                payment_method: form.paymentMethod,

                selected_addons: selectedPackage
                    ? selectedPackage.addons
                        .filter((addon) =>
                            form.selectedAddonNames.includes(addon.name),
                        )
                        .map((addon) => ({
                            name: addon.name,
                            price: Number(addon.price),
                        }))
                    : [],

                venue_extension_hours:
                    selectedPackage
                        ? Number(form.extensionHours) || 0
                        : 0,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    onClose();
                },

                onError: (errors) => {
                    if (
                        errors.event_date ||
                        errors.start_time ||
                        errors.end_time
                    ) {
                        setStep(2);
                    }

                    if (errors.guest_count || errors.venue_id) {
                        setStep(1);
                    }
                },
            },
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-100 p-5">
                    <div>
                        <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                            Book {venue.name}
                        </h2>
                        <div className="mt-2">
                            <Stepper step={step} />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {Object.keys(errors ?? {}).length > 0 && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {Object.values(errors ?? {}).map((error, index) => (
                                <p key={index}>{String(error)}</p>
                            ))}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <div className="aspect-video overflow-hidden rounded-lg bg-neutral-100">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="size-full object-cover"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-white p-3">
                                    <p className="text-xs text-neutral-500">Capacity</p>
                                    <p className="font-semibold text-[#3A1A1F]">
                                    {venue.minimum_capacity_pax}-{venue.maximum_capacity_pax} pax</p>
                                </div>
                                <div className="rounded-lg bg-white p-3">
                                <p className="text-xs text-neutral-500">Rate ({venue.rate_duration})</p>
                                <p className="font-semibold text-[#3A1A1F]">
                                    ₱{Number(venue.rate).toLocaleString('en-PH', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-4">
                                <p className="mb-2 text-sm font-medium text-[#6B1E28]">Inclusions</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-neutral-700">
                                    {venue.inclusions.map((inclusion) => (
                                        <span key={inclusion} className="flex items-center gap-1.5">
                                            <Check className="size-3.5 shrink-0 text-emerald-600" />
                                            {inclusion}
                                        </span>
                                    ))}
                                </div>
                                {venue.note && (
                                <p className="mt-3 border-t border-neutral-200 pt-2 text-xs text-[#6B1E28]">
                                    {venue.note}
                                </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Event Type
                                </label>
                                <select
                                    value={form.eventType}
                                    onChange={(event) => updateForm('eventType', event.target.value)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                                >
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Guest Count
                                </label>
                                <input
                                type="number"
                                min={venue.minimum_capacity_pax}
                                max={venue.maximum_capacity_pax}
                                value={form.guestCount}
                                onChange={(event) =>
                                    updateForm('guestCount', event.target.value)
                                }
                                placeholder={`${venue.minimum_capacity_pax}-${venue.maximum_capacity_pax} guests`}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:outline-none"
                            />
                            <p className="mt-1.5 text-xs text-neutral-500">
                                This venue accepts bookings for {venue.minimum_capacity_pax}-
                                {venue.maximum_capacity_pax} guests.
                            </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Event Date
                                </label>
                                <input
                                    type="date"
                                    value={form.eventDate}
                                    onChange={(event) => updateForm('eventDate', event.target.value)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        Start Time
                                    </label>
                                    <select
                                        value={form.startTime}
                                        onChange={(event) => updateForm('startTime', event.target.value)}
                                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                                    >
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                        End Time
                                    </label>
                                    <select
                                        value={form.endTime}
                                        onChange={(event) => updateForm('endTime', event.target.value)}
                                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                                    >
                                        {timeSlots.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Special Requests
                                </label>
                                <textarea
                                    value={form.specialRequests}
                                    onChange={(event) => updateForm('specialRequests', event.target.value)}
                                    placeholder="Any special arrangements, setup preferences, or accessibility needs..."
                                    rows={4}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <div className="rounded-lg bg-white p-4">
                                <p className="mb-3 font-medium text-[#6B1E28]">Reservation Summary</p>
                                <dl className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">Venue</dt>
                                        <dd className="font-medium text-neutral-900">{venue.name}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">Date</dt>
                                        <dd className="font-medium text-neutral-900">
                                            {form.eventDate || 'To be decided'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">Time</dt>
                                        <dd className="font-medium text-neutral-900">
                                            {form.startTime} – {form.endTime}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">Guests</dt>
                                        <dd className="font-medium text-neutral-900">
                                            {form.guestCount ? `${form.guestCount} pax` : '— pax'}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-neutral-500">Event Type</dt>
                                        <dd className="font-medium text-neutral-900">{form.eventType}</dd>
                                    </div>
                                </dl>
                            </div>

                            <div className="rounded-lg border border-neutral-200 p-4">
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Venue Rental</span>
                                    <span>
                                        ₱
                                        {venueRental.toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className="mt-1.5 flex justify-between text-sm text-neutral-600">
                                    <span>Service Fee (5%)</span>
                                    <span>
                                        ₱
                                        {serviceFee.toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                                <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold text-[#3A1A1F]">
                                    <span>Total</span>
                                    <span>
                                        ₱
                                        {total.toLocaleString('en-PH', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Payment Method
                                </label>
                                <select
                                    value={form.paymentMethod}
                                    onChange={(event) => updateForm('paymentMethod', event.target.value)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                                >
                                    {paymentMethods.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-neutral-100 p-5">
                    <button
                        type="button"
                        onClick={
                            step === 1 ? onClose : () => setStep((current) => (current - 1) as 1 | 2)
                        }
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        type="button"
                        onClick={
                            step === 3
                                ? handleConfirm
                                : () => setStep((current) => (current + 1) as 2 | 3)
                        }
                        className="rounded-full bg-[#6B1E28] px-6 py-2 text-sm font-medium text-white hover:bg-[#5A1821]"
                    >
                        {step === 3 ? 'Confirm Booking' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
