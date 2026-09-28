import { Head, router, usePage } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { PackageFormModal } from '@/components/add-package';
import type {
    AdminPackage,
    AvailableVenue,
    PackageFormValues,
} from '@/components/add-package';
import { DeletePackageModal } from '@/components/delete-package';
import { Toast } from '@/components/toast';
import type { ToastData } from '@/components/toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { packages as adminPackagesRoute } from '@/routes'; // fallback if wayfinder isn't ready

type FormModalState = { mode: 'add' } | { mode: 'edit'; item: AdminPackage };

function getCardClasses(type: string) {
    switch (type) {
        case 'Basic':
            return {
                card: 'border-yellow-300 bg-[#fffbed]',
                badge: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
                button: 'border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
            };
        case 'Standard':
            return {
                card: 'border-[#941b3b] bg-[#fffafa]',
                badge: 'bg-[#941b3b] text-white hover:bg-[#941b3b]',
                button: 'bg-[#941b3b] text-white hover:bg-[#76152f]',
            };
        case 'Premium':
            return {
                card: 'border-green-200 bg-[#f1fff6]',
                badge: 'bg-green-700 text-white hover:bg-green-700',
                button: 'border-[#941b3b] text-[#941b3b] hover:bg-[#941b3b] hover:text-white',
            };
        default:
            return {
                card: 'border-neutral-200 bg-white',
                badge: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                button: 'border-neutral-300 text-neutral-700 hover:bg-neutral-100',
            };
    }
}

export default function AdminPackages() {
    const { packages: packagesList, venues } = usePage<{
        packages: AdminPackage[];
        venues: AvailableVenue[];
    }>().props;
    const [formModal, setFormModal] = useState<FormModalState | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminPackage | null>(null);
    const [toast, setToast] = useState<ToastData | null>(null);

    function handleAddPackage(values: PackageFormValues) {
        router.post('/admin-packages', values, {
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);

                setToast({
                    message: `"${values.name}" was added successfully.`,
                });
            },
        });
    }

    function handleEditPackage(
        id: number,
        values: PackageFormValues,
    ) {
        router.put(`/admin-packages/${id}`, values, {
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);

                setToast({
                    message: `"${values.name}" was updated successfully.`,
                });
            },
        });
    }

    function handleDeletePackage() {
        if (!deleteTarget) {
            return;
        }

        const deletedName = deleteTarget.name;

        router.delete(
            `/admin-packages/${deleteTarget.id}`,
            {
                preserveScroll: true,

                onSuccess: () => {
                    setDeleteTarget(null);

                    setToast({
                        message: `"${deletedName}" was deleted successfully.`,
                    });
                },
            },
        );
    }

    return (
        <>
            <Head title="Event Packages Management" />

            <div className="flex flex-1 flex-col gap-5 bg-white p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-semibold text-[#3A1A1F]">
                            Event Packages Management
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            {packagesList.length} packages available
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormModal({ mode: 'add' })}
                        className="flex items-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                    >
                        <Plus className="size-4" />
                        Add Package
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
                    {packagesList.map((pkg) => {
                        const styles = getCardClasses(pkg.type);

                        return (
                            <Card
                                key={pkg.id}
                                className={`relative overflow-visible rounded-[18px] border-2 shadow-none flex flex-col justify-between ${styles.card}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                        <Badge className="rounded-full bg-[#8f1735] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#8f1735]">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardContent className="flex flex-1 flex-col p-7">
                                    <Badge
                                        className={`mb-5 w-fit rounded-full px-3.5 py-1.5 text-xs font-bold ${styles.badge}`}
                                    >
                                        {pkg.type}
                                    </Badge>

                                    <h2 className="font-serif text-2xl font-bold text-[#161622]">
                                        {pkg.name}
                                    </h2>

                                    <div className="mb-6 mt-1 font-serif text-3xl font-bold text-[#941b3b]">
                                        ₱{pkg.price.toLocaleString()}
                                    </div>

                                    <div className="space-y-2.5 flex-1">
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

                                    {pkg.venues.length > 0 && (
                                    <div className="mt-6 border-t border-[#dedede] pt-4">
                                        <h3 className="mb-2 text-xs font-bold tracking-[1px] text-[#89515c]">
                                            INCLUDED VENUES
                                        </h3>

                                        <div className="space-y-2">
                                            {pkg.venues.map((venue) => (
                                                <div
                                                    key={venue.id}
                                                    className="text-sm text-[#9b5965]"
                                                >
                                                    <div className="font-medium text-[#5f353d]">
                                                        {venue.name}
                                                    </div>

                                                    <div className="text-xs text-neutral-500">
                                                        {venue.minimum_capacity_pax}–
                                                        {venue.maximum_capacity_pax} pax
                                                        {' · '}
                                                        ₱
                                                        {Number(
                                                            venue.pivot
                                                                .extension_rate_per_hour,
                                                        ).toLocaleString()}
                                                        /hour extension
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                    {pkg.addons && pkg.addons.length > 0 && (
                                        <div className="mt-6 border-t border-[#dedede] pt-4">
                                            <h3 className="mb-2 text-xs font-bold tracking-[1px] text-[#89515c]">
                                                AVAILABLE ADD-ONS
                                            </h3>
                                            <div className="space-y-1">
                                            {pkg.addons.map((addon) => (
                                                <div
                                                    key={addon.name}
                                                    className="text-sm text-[#9b5965]"
                                                >
                                                    + {addon.name} — ₱
                                                    {Number(addon.price).toLocaleString()}
                                                    <p className="mb-4 text-sm text-neutral-500">
                                                        {pkg.included_duration_hours} hours of venue use included
                                                    </p>
                                                </div>

                                            ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex items-center justify-end gap-2 border-t border-[#dedede] pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormModal({ mode: 'edit', item: pkg })}
                                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                                        >
                                            <Pencil className="size-4" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(pkg)}
                                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="size-4" />
                                            Delete
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {formModal?.mode === 'add' && (
                <PackageFormModal
                mode="add"
                venues={venues}
                onClose={() => setFormModal(null)}
                onSubmit={handleAddPackage}
            />
            )}

            {formModal?.mode === 'edit' && (
                <PackageFormModal
                mode="edit"
                initialPackage={formModal.item}
                venues={venues}
                onClose={() => setFormModal(null)}
                onSubmit={(values) =>
                    handleEditPackage(
                        formModal.item.id,
                        values,
                    )
                }
            />
            )}

            {deleteTarget && (
                <DeletePackageModal
                    title="Delete Event Package?"
                    description={
                        <>
                            Delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                        </>
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDeletePackage}
                />
            )}

            {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
        </>
    );
}

AdminPackages.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Event Packages Management',
                href: adminPackagesRoute ? (typeof adminPackagesRoute() === 'string' ? adminPackagesRoute() : (adminPackagesRoute() as any).url) : '/admin-packages',
            },
        ]}
    >
        {page}
    </AppLayout>
);
