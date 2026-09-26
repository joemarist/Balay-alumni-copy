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
    capacity_pax: number;
    capacity_label: string | null;
    rate: string | number;
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
        capacityPax: venue.capacity_pax,
        capacityLabel: venue.capacity_label ?? undefined,
        rate: Number(venue.rate),
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
        router.post(
            '/venues',
            {
                name: values.name,
                description: values.description,
                category: values.category,
                capacity_pax: values.capacityPax,
                capacity_label: values.capacityLabel ?? null,
                rate: values.rate,
                rate_duration: values.rateDuration,
                inclusions: values.inclusions,
                note: values.note ?? null,
                image: values.image ?? null,
                available: values.available,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormModal(null);
                    setToast({
                        message: `"${values.name}" was added successfully.`,
                    });
                },
            },
        );
    }

    function handleEditVenue(id: number, values: VenueFormValues) {
        router.put(
            `/venues/${id}`,
            {
                name: values.name,
                description: values.description,
                category: values.category,
                capacity_pax: values.capacityPax,
                capacity_label: values.capacityLabel ?? null,
                rate: values.rate,
                rate_duration: values.rateDuration,
                inclusions: values.inclusions,
                note: values.note ?? null,
                image: values.image ?? null,
                available: values.available,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormModal(null);
                    setToast({
                        message: `"${values.name}" was updated successfully.`,
                    });
                },
            },
        );
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

                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4" />
                                        {venue.capacityLabel || `${venue.capacityPax} pax`}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4" />
                                        {venue.rateDuration}
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
                                            Rate ({venue.rateDuration})
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
