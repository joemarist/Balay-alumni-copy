import { Minus, Plus, X } from 'lucide-react';

import type { MenuItem } from '@/types';

type CartLine = {
    item: MenuItem;
    quantity: number;
};


const pickupOptions = ['ASAP (~10 min)', 'In 15 minutes', 'In 30 minutes', 'In 1 hour'];

export function CartDrawer({
    open,
    onClose,
    lines,
    onIncrement,
    onDecrement,
    pickupTime,
    onPickupTimeChange,
    onPlaceOrder,
}: {
    open: boolean;
    onClose: () => void;
    lines: CartLine[];
    onIncrement: (itemId: number) => void;
    onDecrement: (itemId: number) => void;
    pickupTime: string;
    onPickupTimeChange: (value: string) => void;
    onPlaceOrder: () => void;
}) {
    if (!open) {
        return null;
    }

    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
            <div
                className="flex h-full w-full max-w-sm flex-col bg-white"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                    <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">Your Cart</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-5">
                    {lines.length === 0 ? (
                        <p className="text-sm text-neutral-400">Your cart is empty.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {lines.map(({ item, quantity }) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-neutral-900">
                                            {item.name}
                                        </p>
                                        <p className="text-sm font-semibold text-[#6B1E28]">
                                            ₱{item.price}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onDecrement(item.id)}
                                            className="flex size-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                        >
                                            <Minus className="size-3" />
                                        </button>
                                        <span className="w-4 text-center text-sm font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onIncrement(item.id)}
                                            className="flex size-6 items-center justify-center rounded-full bg-[#6B1E28] text-white hover:bg-[#5A1821]"
                                        >
                                            <Plus className="size-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {lines.length > 0 && (
                    <div className="flex flex-col gap-3 border-t border-neutral-100 p-5">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Pickup Time
                            </label>
                            <select
                                value={pickupTime}
                                onChange={(event) => onPickupTimeChange(event.target.value)}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:outline-none"
                            >
                                {pickupOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-400">Subtotal ({itemCount} items)</span>
                            <span className="font-semibold text-[#3A1A1F]">₱{subtotal}</span>
                        </div>

                        <button
                            type="button"
                            onClick={onPlaceOrder}
                            className="rounded-lg bg-[#6B1E28] py-3 text-sm font-semibold text-white hover:bg-[#5A1821]"
                        >
                            Place Order · ₱{subtotal}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
