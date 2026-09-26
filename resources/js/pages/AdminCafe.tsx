
import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { CafeItemFormModal } from '@/components/add-cafe';
import type { AdminMenuItem, CafeItemFormValues } from '@/components/add-cafe';
import { DeleteCafeItemModal } from '@/components/delete-cafe';

import { Toast } from '@/components/toast';
import type { ToastData } from '@/components/toast';

import AppLayout from '@/layouts/app-layout';
import { cafe as adminCafe } from '@/routes/admin';

type AdminCafeProps = {
    menuItems: AdminMenuItem[];
};

type FormModalState =
    | { mode: 'add' }
    | { mode: 'edit'; item: AdminMenuItem };

export default function AdminCafe({ menuItems }: AdminCafeProps) {
    const [formModal, setFormModal] = useState<FormModalState | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminMenuItem | null>(null);
    const [toast, setToast] = useState<ToastData | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return menuItems;
        }

        const q = searchQuery.toLowerCase();

        return menuItems.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q),
        );
    }, [menuItems, searchQuery]);

    const availableCount = useMemo(
        () => filteredItems.filter((item) => item.available).length,
        [filteredItems],
    );

    /*
     * Add menu item
     */
    function handleAddItem(values: CafeItemFormValues) {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('price', String(values.price));
        formData.append('available', values.available ? '1' : '0');

        if (values.image) {
            formData.append('image', values.image);
        }

        router.post('/admin-cafe', formData, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);
                setToast({
                    message: `"${values.name}" was added successfully.`,
                });
            },

            onError: (errors) => {
                console.log('UPLOAD ERRORS:', errors);

                setToast({
                    message: Object.values(errors)[0] as string || 'Failed to add menu item.',
                });
            },
        });
    }

    /*
     * Edit menu item
     */
    function handleEditItem(id: number, values: CafeItemFormValues) {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('price', String(values.price));
        formData.append('available', values.available ? '1' : '0');

        if (values.image) {
            formData.append('image', values.image);
        }

        // Laravel method spoofing for multipart/form-data
        formData.append('_method', 'PUT');

        router.post(`/admin-cafe/${id}`, formData, {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                setFormModal(null);
                setToast({
                    message: `"${values.name}" was updated successfully.`,
                });
            },

            onError: (errors) => {
                console.log('Laravel validation errors:', errors);

                const firstError = Object.values(errors)[0];

                setToast({
                    message:
                        typeof firstError === 'string'
                            ? firstError
                            : 'Failed to upload image.',
                });
            },

        });
    }

    /*
     * Delete menu item
     */
    function handleDeleteItem() {
        if (!deleteTarget) {
            return;
        }

        const deletedName = deleteTarget.name;

        router.delete(`/admin-cafe/${deleteTarget.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setDeleteTarget(null);
                setToast({
                    message: `"${deletedName}" was deleted successfully.`,
                });
            },

            onError: () => {
                setToast({
                    message: 'Failed to delete menu item.',
                });
            },
        });
    }

    /*
     * Toggle availability
     */
    function handleToggleAvailability(item: AdminMenuItem) {
        router.patch(`/admin-cafe/${item.id}/availability`, {}, {
            preserveScroll: true,

            onSuccess: () => {
                setToast({
                    message: `"${item.name}" is now ${item.available ? 'unavailable' : 'available'
                        }.`,
                });
            },

            onError: () => {
                setToast({
                    message: 'Failed to update availability.',
                });
            },
        });
    }

    return (
        <>
            <Head title="Cafe Management" />

            <div className="flex flex-1 flex-col gap-5 bg-white p-6 dark:bg-neutral-950">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-semibold text-[#3A1A1F] dark:text-neutral-100">
                            Cafe Management
                        </h1>

                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {filteredItems.length} items · {availableCount} available
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />

                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:outline-none focus:ring-1 focus:ring-[#6B1E28] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 sm:w-64"
                            />
                        </div>

                        {/* Add Item */}
                        <button
                            type="button"
                            onClick={() => setFormModal({ mode: 'add' })}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                        >
                            <Plus className="size-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
                        >

                            {/* Image */}
                            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">

                                {item.image ? (
                                    <img
                                        src={
                                            item.image.startsWith('/')
                                                ? item.image
                                                : `/storage/${item.image}`
                                        }
                                        alt={item.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                                        No image
                                    </div>
                                )}

                                {/* Availability Badge */}
                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${item.available
                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                        : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                                        }`}
                                >
                                    {item.available
                                        ? 'Available'
                                        : 'Unavailable'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2 p-4">

                                {/* Category */}
                                <span className="w-fit rounded-full bg-[#F7E3E0] px-3 py-1 text-xs font-medium text-[#6B1E28] dark:bg-[#3A1A1F] dark:text-[#F7E3E0]">
                                    {item.category}
                                </span>

                                {/* Name */}
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {item.name}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {item.description}
                                </p>

                                {/* Bottom Row */}
                                <div className="mt-1 flex items-end justify-between">

                                    {/* Price */}
                                    <p className="text-lg font-semibold text-[#3A1A1F] dark:text-neutral-100">
                                        ₱{Number(item.price).toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-1.5">

                                        {/* Availability Toggle */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleToggleAvailability(item);
                                            }}
                                            aria-label="Toggle availability"
                                            className={`relative h-5 w-9 rounded-full transition-colors ${item.available
                                                ? 'bg-emerald-500'
                                                : 'bg-neutral-300 dark:bg-neutral-600'
                                                }`}
                                        >
                                            <span
                                                className={`absolute left-0 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${item.available
                                                    ? 'translate-x-[18px]'
                                                    : 'translate-x-0.5'
                                                    }`}
                                            />
                                        </button>

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormModal({
                                                    mode: 'edit',
                                                    item,
                                                })
                                            }
                                            aria-label="Edit item"
                                            className="flex size-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteTarget(item)
                                            }
                                            aria-label="Delete item"
                                            className="flex size-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                                        >
                                            <Trash2 className="size-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white/50 py-12 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                No menu items found.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            {formModal?.mode === 'add' && (
                <CafeItemFormModal
                    mode="add"
                    onClose={() => setFormModal(null)}
                    onSubmit={handleAddItem}
                />
            )}

            {/* Edit Modal */}
            {formModal?.mode === 'edit' && (
                <CafeItemFormModal
                    mode="edit"
                    initialItem={formModal.item}
                    onClose={() => setFormModal(null)}
                    onSubmit={(values) =>
                        handleEditItem(formModal.item.id, values)
                    }
                />
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <DeleteCafeItemModal
                    title="Delete Menu Item?"
                    description={
                        <>
                            Delete <strong>{deleteTarget.name}</strong>? This
                            action cannot be undone.
                        </>
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteItem}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    toast={toast}
                    onDismiss={() => setToast(null)}
                />
            )}
        </>
    );
}

AdminCafe.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Cafe Management',
                href: adminCafe(),
            },
        ]}
    >
        {page}
    </AppLayout>
);

