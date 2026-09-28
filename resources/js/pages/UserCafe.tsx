import { Head, router } from '@inertiajs/react';
import { Coffee, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CartDrawer } from '@/components/cart';
import { cafe } from '@/routes';
import type { MenuItem } from '@/types';


const filters = ['All', 'Coffee', 'Non-Coffee', 'Snacks', 'Meals', 'Desserts'] as const;

interface CafeOrdersProps {
    menuItems: MenuItem[];
}

export default function CafeOrders({
    menuItems,
} : CafeOrdersProps) {
    const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('All');
    const [cart, setCart] = useState<Record<number, number>>({});
    const [cartOpen, setCartOpen] = useState(false);
    const [pickupTime, setPickupTime] = useState('ASAP (~10 min)');

    const filteredItems = useMemo(() => {
        if (activeFilter === 'All') {
            return menuItems;
        }

        return menuItems.filter((item) => item.category === activeFilter);
    }, [activeFilter]);

    const cartCount = useMemo(
        () => Object.values(cart).reduce((total, qty) => total + qty, 0),
        [cart],
    );

    const cartLines = useMemo(
        () =>
            Object.entries(cart)
                .map(([id, quantity]) => {
                    const item = menuItems.find((menuItem) => menuItem.id === Number(id));

                    return item ? { item, quantity } : null;
                })
                .filter((line): line is { item: MenuItem; quantity: number } => line !== null),
        [cart],
    );

    function addToCart(itemId: number) {
        setCart((current) => ({
            ...current,
            [itemId]: (current[itemId] ?? 0) + 1,
        }));
    }

    function incrementItem(itemId: number) {
        setCart((current) => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }));
    }

    function decrementItem(itemId: number) {
        setCart((current) => {
            const next = { ...current };
            const newQty = (next[itemId] ?? 0) - 1;

            if (newQty <= 0) {
                delete next[itemId];
            } else {
                next[itemId] = newQty;
            }

            return next;
        });
    }
    function getPickupDateTime(option: string): string | null {
        const now = new Date();

        const minutes = {
            'ASAP (~10 min)': 10,
            'In 15 minutes': 15,
            'In 30 minutes': 30,
            'In 1 hour': 60,
        }[option];

        if (!minutes) {
            return null;
        }

        now.setMinutes(now.getMinutes() + minutes);

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutesValue = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutesValue}:${seconds}`;
    }

    function handlePlaceOrder() {
        const items = Object.entries(cart).map(([menuItemId, quantity]) => ({
            menu_item_id: Number(menuItemId),
            quantity,
        }));

        if (items.length === 0) {
            return;
        }

        router.post(
            '/cafe/orders',
            {
                items,
                pickup_time: getPickupDateTime(pickupTime),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCart({});
                    setCartOpen(false);
                },
            },
        );
    }

    return (
        <>
            <Head title="Cafe & Orders" />
            <div className="flex flex-1 flex-col gap-5 bg-white p-6">
                {/* Filters + cart */}
                <div className="flex items-center justify-between gap-3">
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

                    <button
                        type="button"
                        onClick={() => setCartOpen(true)}
                        className="relative flex shrink-0 items-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                    >
                        <ShoppingCart className="size-4" />
                        Cart
                        {cartCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-medium text-white">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Menu grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredItems.map((item) => {
                        const isUnavailable = item.available === false;

                        return (
                            <div
                                key={item.id}
                                className={`overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all ${
                                    isUnavailable ? 'opacity-70 grayscale-[0.5]' : ''
                                }`}
                            >
                                <div className="relative aspect-square bg-neutral-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="size-full object-cover"
                                    />
                                    {isUnavailable && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                                            <span className="rounded-full bg-neutral-900/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-sm backdrop-blur-md">
                                                Unavailable
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 p-4">
                                    <span className="w-fit rounded-full bg-[#F7E3E0] px-3 py-1 text-xs font-medium text-[#6B1E28]">
                                        {item.category}
                                    </span>
                                    <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                                    <p className="text-sm text-neutral-500">{item.description}</p>

                                    <div className="mt-1 flex items-center justify-between">
                                        <p className="text-lg font-semibold text-[#3A1A1F]">
                                            ₱{item.price}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => !isUnavailable && addToCart(item.id)}
                                            disabled={isUnavailable}
                                            className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                                isUnavailable
                                                    ? 'cursor-not-allowed bg-neutral-200 text-neutral-500'
                                                    : 'bg-[#6B1E28] text-white hover:bg-[#5A1821]'
                                            }`}
                                        >
                                            {!isUnavailable && <Plus className="size-3.5" />}
                                            {isUnavailable ? 'Sold Out' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-white py-16 text-center">
                        <Coffee className="size-6 text-neutral-300" />
                        <p className="text-sm text-neutral-500">No items in this category yet.</p>
                    </div>
                )}
            </div>

            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                lines={cartLines}
                onIncrement={incrementItem}
                onDecrement={decrementItem}
                pickupTime={pickupTime}
                onPickupTimeChange={setPickupTime}
                onPlaceOrder={handlePlaceOrder}
            />
        </>
    );
}

CafeOrders.layout = {
    breadcrumbs: [
        {
            title: 'Cafe & Orders',
            href: cafe(),
        },
    ],
};
