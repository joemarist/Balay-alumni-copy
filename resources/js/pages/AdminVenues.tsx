import { Head, router, usePage } from '@inertiajs/react';
import { Clock, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { VenueFormModal } from '@/components/add-venue';
import type { AdminVenue, VenueFormValues } from '@/components/add-venue';
import { DeleteConfirmModal } from '@/components/delete-venue';

import { Toast } from '@/components/toast';
import type { ToastData } from '@/components/toast';

import { venues as adminVenues } from '@/routes/admin';

type FormModalState = { mode: 'add' } | { mode: 'edit'; venue: AdminVenue };

type BackendVenue = {
    id: number;
    name: string;
    description: string;
    category: 'Function Hall' | 'Conference' | 'Whole Venue';
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    rate: string | number;
    minimum_booking_hours: number;
    extension_rate_per_hour: string | number;
    rate_duration: string;
    inclusions: string[];
    note: string | null;
    image: string | null;
    available: boolean;
};

export default function AdminVenues() {
    const { venues = [] } = usePage<{
        venues?: BackendVenue[];
    }>().props;

    const databaseVenues: AdminVenue[] = venues.map((venue) => ({
        id: venue.id,
        name: venue.name,
        description: venue.description,
        category: venue.category,
        minimumCapacityPax: venue.minimum_capacity_pax,
        maximumCapacityPax: venue.maximum_capacity_pax,
        rate: Number(venue.rate),
        minimumBookingHours: Number(venue.minimum_booking_hours),
        extensionRatePerHour: Number(venue.extension_rate_per_hour),
        rateDuration: venue.rate_duration,
        inclusions: venue.inclusions ?? [],
        note: venue.note ?? undefined,
        image: venue.image ?? undefined,
        available: venue.available,
    }));

    const [venueList, setVenueList] =
        useState<AdminVenue[]>(databaseVenues);

    const [formModal, setFormModal] =
        useState<FormModalState | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<AdminVenue | null>(null);

    const [toast, setToast] = useState<ToastData | null>(null);

    useEffect(() => {
        setVenueList(databaseVenues);
    }, [databaseVenues]);


    const availableCount = useMemo(
        () => venueList.filter((venue) => venue.available).length,
        [venueList],
    );

    function handleToggleAvailability(id: number) {
        router.patch(
            `/venues/${id}/availability`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setToast({
                        message: 'Venue availability updated successfully.',
                    });
                },
            },
        );
    }

    function handleAddVenue(values: VenueFormValues) {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append(
            'minimum_capacity_pax',
            String(values.minimumCapacityPax),
        );

        formData.append(
            'maximum_capacity_pax',
            String(values.maximumCapacityPax),
        );

        formData.append('rate', String(values.rate));

        formData.append(
            'minimum_booking_hours',
            String(values.minimumBookingHours),
        );

        formData.append(
            'extension_rate_per_hour',
            String(values.extensionRatePerHour),
        );

        values.inclusions.forEach((inclusion, index) => {
            formData.append(`inclusions[${index}]`, inclusion);
        });

        if (values.note) {
            formData.append('note', values.note);
        }

        if (values.imageFile) {
            formData.append('image', values.imageFile);
        }

        formData.append('available', values.available ? '1' : '0');

        router.post('/venues', formData, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);
                setToast({
                    message: `"${values.name}" was added successfully.`,
                });
            },
        });
    }

    function handleEditVenue(id: number, values: VenueFormValues) {
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append(
            'minimum_capacity_pax',
            String(values.minimumCapacityPax),
        );

        formData.append(
            'maximum_capacity_pax',
            String(values.maximumCapacityPax),
        );

        formData.append('rate', String(values.rate));

        formData.append(
            'minimum_booking_hours',
            String(values.minimumBookingHours),
        );

        formData.append(
            'extension_rate_per_hour',
            String(values.extensionRatePerHour),
        );

        values.inclusions.forEach((inclusion, index) => {
            formData.append(`inclusions[${index}]`, inclusion);
        });

        if (values.note) {
            formData.append('note', values.note);
        }

        /*
         * Only send an image when the admin selected
         * a NEW image.
         *
         * If no new image was selected, Laravel will
         * keep the existing image.
         */
        if (values.imageFile) {
            formData.append('image', values.imageFile);
        }

        formData.append('available', values.available ? '1' : '0');

        router.post(`/venues/${id}`, formData, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);
                setToast({
                    message: `"${values.name}" was updated successfully.`,
                });
            },
        });
    }

    function handleDeleteVenue() {
        if (!deleteTarget) {
            return;
        }

        const deletedName = deleteTarget.name;

        router.delete(`/venues/${deleteTarget.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteTarget(null);
                setToast({
                    message: `"${deletedName}" was deleted successfully.`,
                });
            },
        });
    }

    return (
        <>
            <Head title="Venue Management" />
            <div className="flex flex-1 flex-col gap-5 bg-white p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-semibold text-[#3A1A1F]">
                            Venue Management
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {venueList.length} venues · {availableCount} available
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormModal({ mode: 'add' })}
                        className="flex items-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                    >
                        <Plus className="size-4" />
                        Add Venue
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {venueList.map((venue) => (
                        <div
                            key={venue.id}
                            className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
                        >
                            <div className="relative aspect-video bg-neutral-100">
                                {venue.image ? (
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-sm text-neutral-400">
                                        No image
                                    </div>
                                )}
                                <span className="absolute left-3 top-3 rounded-full bg-[#6B1E28] px-3 py-1 text-xs font-medium text-white">
                                    {venue.category}
                                </span>
                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                                        venue.available
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-neutral-100 text-neutral-500'
                                    }`}
                                >
                                    {venue.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 p-5">
                                <h3 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                                    {venue.name}
                                </h3>
                                <p className="text-sm text-neutral-500">{venue.description}</p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4" />
                                        {venue.minimumCapacityPax}-{venue.maximumCapacityPax} pax
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4" />
                                        Minimum {venue.minimumBookingHours} hrs
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {venue.inclusions.slice(0, 3).map((inclusion) => (
                                        <span
                                            key={inclusion}
                                            className="rounded-full bg-[#F7E3E0] px-3 py-1 text-xs font-medium text-[#6B1E28]"
                                        >
                                            {inclusion}
                                        </span>
                                    ))}
                                    {venue.inclusions.length > 3 && (
                                        <span className="rounded-full bg-[#F7E3E0] px-3 py-1 text-xs font-medium text-[#6B1E28]">
                                            +{venue.inclusions.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-neutral-400">
                                        Base Rate
                                    </p>
                                    <p className="text-xl font-semibold text-[#3A1A1F]">
                                        ₱{venue.rate.toLocaleString()}
                                    </p>
                                </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleAvailability(venue.id)}
                                            aria-label="Toggle availability"
                                            className={`relative h-6 w-11 rounded-full transition-colors ${
                                                venue.available ? 'bg-emerald-500' : 'bg-neutral-300'
                                            }`}
                                        >
                                            <span
                                                className={`absolute left-0 top-0.5 size-5 rounded-full bg-white transition-transform ${
                                                    venue.available ? 'translate-x-[22px]' : 'translate-x-0.5'
                                                }`}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormModal({ mode: 'edit', venue })}
                                            aria-label="Edit venue"
                                            className="flex size-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
                                        >
                                            <Pencil className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(venue)}
                                            aria-label="Delete venue"
                                            className="flex size-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {formModal?.mode === 'add' && (
                <VenueFormModal mode="add" onClose={() => setFormModal(null)} onSubmit={handleAddVenue} />
            )}

            {formModal?.mode === 'edit' && (
                <VenueFormModal
                    mode="edit"
                    initialVenue={formModal.venue}
                    onClose={() => setFormModal(null)}
                    onSubmit={(values) => handleEditVenue(formModal.venue.id, values)}
                />
            )}

            {deleteTarget && (
                <DeleteConfirmModal
                    title="Delete Venue?"
                    description={
                        <>
                            Delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                        </>
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteVenue}
                />
            )}

            {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
        </>
    );
}

AdminVenues.layout = {
    breadcrumbs: [
        {
            title: 'Venue Management',
            href: adminVenues(),
        },
    ],
};
