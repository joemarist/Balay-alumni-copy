import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { CafeItemFormModal } from '@/components/add-cafe';
import type { AdminMenuItem, CafeItemFormValues } from '@/components/add-cafe';
import { DeleteCafeItemModal } from '@/components/delete-cafe';

import { Toast } from '@/components/toast';
import type { ToastData } from '@/components/toast';

import AppLayout from '@/layouts/app-layout';
import { cafe as adminCafe } from '@/routes/admin';

// TODO
const initialMenuItems: AdminMenuItem[] = [
    {
        id: 1,
        name: 'Balay Signature Espresso',
        category: 'Coffee',
        description: 'Rich double shot with house-roasted beans.',
        price: 95,
        image: '/images/cafe/espresso.jpg',
        available: true,
    },
    {
        id: 2,
        name: 'Creamy Cappuccino',
        category: 'Coffee',
        description: 'Velvety microfoam with a bold espresso base.',
        price: 120,
        image: '/images/cafe/cappuccino.jpg',
        available: true,
    },
    {
        id: 3,
        name: 'Classic Café Latte',
        category: 'Coffee',
        description: 'Smooth steamed milk and espresso harmony.',
        price: 130,
        image: '/images/cafe/cafe-latte.webp',
        available: true,
    },
    {
        id: 4,
        name: 'Cold Brew Delight',
        category: 'Coffee',
        description: '18-hour steeped cold brew, bold and smooth.',
        price: 150,
        image: '/images/cafe/cold-brew-delight.jpg',
        available: true,
    },
];

type FormModalState = { mode: 'add' } | { mode: 'edit'; item: AdminMenuItem };

export default function AdminCafe() {
    const [menuItems, setMenuItems] = useState<AdminMenuItem[]>(initialMenuItems);
    const [formModal, setFormModal] = useState<FormModalState | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminMenuItem | null>(null);
    const [toast, setToast] = useState<ToastData | null>(null);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
return menuItems;
}

        const q = searchQuery.toLowerCase();

        return menuItems.filter((item) => 
            item.name.toLowerCase().includes(q) || 
            item.description.toLowerCase().includes(q) || 
            item.category.toLowerCase().includes(q)
        );
    }, [menuItems, searchQuery]);

    const availableCount = useMemo(
        () => filteredItems.filter((item) => item.available).length,
        [filteredItems],
    );

    function handleToggleAvailability(id: number) {
        setMenuItems((current) =>
            current.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
        );
    }

    function handleAddItem(values: CafeItemFormValues) {
        const newItem: AdminMenuItem = {
            ...values,
            id: Math.max(0, ...menuItems.map((item) => item.id)) + 1,
        };
        setMenuItems((current) => [...current, newItem]);
        setFormModal(null);
        setToast({ message: `"${newItem.name}" was added successfully.` });
    }

    function handleEditItem(id: number, values: CafeItemFormValues) {
        setMenuItems((current) =>
            current.map((item) => (item.id === id ? { ...item, ...values } : item)),
        );
        setFormModal(null);
        setToast({ message: `"${values.name}" was updated successfully.` });
    }

    function handleDeleteItem() {
        if (!deleteTarget) {
            return;
        }

        const deletedName = deleteTarget.name;
        setMenuItems((current) => current.filter((item) => item.id !== deleteTarget.id));
        setDeleteTarget(null);
        setToast({ message: `"${deletedName}" was deleted successfully.` });
    }

    return (
        <>
            <Head title="Cafe Management" />
            <div className="flex flex-1 flex-col gap-5 bg-white dark:bg-neutral-950 p-6">
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                        >
                            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                                        No image
                                    </div>
                                )}
                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                                        item.available
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                                    }`}
                                >
                                    {item.available ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 p-4">
                                <span className="w-fit rounded-full bg-[#F7E3E0] dark:bg-[#3A1A1F] px-3 py-1 text-xs font-medium text-[#6B1E28] dark:text-[#F7E3E0]">
                                    {item.category}
                                </span>
                                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>

                                <div className="mt-1 flex items-end justify-between">
                                    <p className="text-lg font-semibold text-[#3A1A1F] dark:text-neutral-100">
                                        ₱{item.price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleToggleAvailability(item.id);
                                            }}
                                            aria-label="Toggle availability"
                                            className={`relative h-5 w-9 rounded-full transition-colors ${
                                                item.available ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
                                            }`}
                                        >
                                            <span
                                                className={`absolute left-0 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
                                                    item.available ? 'translate-x-[18px]' : 'translate-x-0.5'
                                                }`}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormModal({ mode: 'edit', item })}
                                            aria-label="Edit item"
                                            className="flex size-7 items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(item)}
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
                    {filteredItems.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white/50 py-12 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">No menu items found.</p>
                        </div>
                    )}
                </div>
            </div>

            {formModal?.mode === 'add' && (
                <CafeItemFormModal mode="add" onClose={() => setFormModal(null)} onSubmit={handleAddItem} />
            )}

            {formModal?.mode === 'edit' && (
                <CafeItemFormModal
                    mode="edit"
                    initialItem={formModal.item}
                    onClose={() => setFormModal(null)}
                    onSubmit={(values) => handleEditItem(formModal.item.id, values)}
                />
            )}

            {deleteTarget && (
                <DeleteCafeItemModal
                    title="Delete Menu Item?"
                    description={
                        <>
                            Delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
                        </>
                    }
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteItem}
                />
            )}
            {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
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
