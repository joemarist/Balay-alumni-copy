import { X, ImagePlus } from 'lucide-react';
import { useState } from 'react';

export type MenuCategory = 'Coffee' | 'Non-Coffee' | 'Snacks' | 'Meals' | 'Desserts';

export type AdminMenuItem = {
    id: number;
    name: string;
    description: string;
    category: MenuCategory;
    price: number;
    image?: string;
    available: boolean;
};

export type CafeItemFormValues = Omit<AdminMenuItem, 'id'>;

const categories: MenuCategory[] = ['Coffee', 'Non-Coffee', 'Snacks', 'Meals', 'Desserts'];

function emptyFormState() {
    return {
        name: '',
        description: '',
        category: '' as MenuCategory | '',
        price: '',
        image: '',
        available: true,
    };
}

function itemToFormState(item: AdminMenuItem) {
    return {
        name: item.name,
        description: item.description,
        category: item.category,
        price: String(item.price),
        image: item.image ?? '',
        available: item.available,
    };
}

function getMissingFields(form: ReturnType<typeof emptyFormState>): string[] {
    const missing: string[] = [];

    if (!form.name.trim()) {
        missing.push('Item Name');
    }

    if (!form.description.trim()) {
        missing.push('Description');
    }

    if (!form.category) {
        missing.push('Category')
    }

    if (!form.price || Number(form.price) <= 0) {
        missing.push('Price');
    }

    return missing;
}

function formsAreEqual(
    a: ReturnType<typeof emptyFormState>,
    b: ReturnType<typeof emptyFormState>,
): boolean {
    return (
        a.name === b.name &&
        a.description === b.description &&
        a.category === b.category &&
        a.price === b.price &&
        a.image === b.image &&
        a.available === b.available
    );
}

export function CafeItemFormModal({
    mode,
    initialItem,
    onClose,
    onSubmit,
}: {
    mode: 'add' | 'edit';
    initialItem?: AdminMenuItem;
    onClose: () => void;
    onSubmit: (values: CafeItemFormValues) => void;
}) {
    const [form, setForm] = useState(() =>
        initialItem ? itemToFormState(initialItem) : emptyFormState(),
    );
    const [originalForm] = useState(form);

    const missingFields = getMissingFields(form);
    const isValid = missingFields.length === 0;
    const isDirty = mode === 'add' ? true : !formsAreEqual(form, originalForm);
    const canSubmit = isValid && isDirty;

    function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function handleSubmit() {
        if (!canSubmit) {
            return;
        }

        const values: CafeItemFormValues = {
            name: form.name,
            description: form.description,
            category: (form.category || 'Coffee') as MenuCategory,
            price: Number(form.price) || 0,
            image: form.image || undefined,
            available: form.available,
        };

        onSubmit(values);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                    <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                        {mode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
                    </h2>
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
                    <div className="flex flex-col gap-4">
                        {mode === 'edit' && (
                            <div className="aspect-square w-32 overflow-hidden rounded-lg bg-neutral-100">
                                {form.image ? (
                                    <img
                                        src={form.image}
                                        alt={form.name}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-xs text-neutral-400">
                                        No image
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Item Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(event) => updateField('name', event.target.value)}
                                placeholder="e.g. Balay Signature Espresso"
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Description
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(event) => updateField('description', event.target.value)}
                                placeholder="Short description of the item..."
                                rows={2}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(event) =>
                                        updateField('category', event.target.value as MenuCategory)
                                    }
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.price}
                                    onChange={(event) => updateField('price', event.target.value)}
                                    placeholder="95"
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Image
                            </label>
                            <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-white px-6 py-8 hover:bg-neutral-50">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (file) {
                                            // Prototype: Use a local object URL to preview the image
                                            const objectUrl = URL.createObjectURL(file);
                                            updateField('image', objectUrl);
                                        }
                                    }}
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                />
                                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                    <div className="rounded-full bg-white p-3 shadow-sm">
                                        <ImagePlus className="size-6 text-[#6B1E28]" />
                                    </div>
                                    <div className="text-sm font-medium text-neutral-700">
                                        Click to upload image
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        SVG, PNG, JPG or GIF (max. 5MB)
                                    </p>
                                </div>
                            </div>
                            {form.image && form.image.startsWith('blob:') && (
                                <p className="mt-2 text-xs text-green-600">Image selected for upload.</p>
                            )}
                        </div>

                        <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                            <span>
                                <span className="block text-sm font-medium text-neutral-700">
                                    Availability
                                </span>
                                <span className="block text-xs text-neutral-400">
                                    Visible on the customer menu
                                </span>
                            </span>
                            <button
                                type="button"
                                onClick={() => updateField('available', !form.available)}
                                aria-label="Toggle availability"
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                    form.available ? 'bg-emerald-500' : 'bg-neutral-300'
                                }`}
                            >
                                <span
                                    className={`absolute left-0 top-0.5 size-5 rounded-full bg-white transition-transform ${
                                        form.available ? 'translate-x-[22px]' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </label>
                    </div>
                </div>

                {mode === 'add' && missingFields.length > 0 && (
                    <p className="border-t border-neutral-100 px-5 py-2 text-xs text-red-500">
                        Required: {missingFields.join(', ')}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-neutral-100 p-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="rounded-full bg-[#6B1E28] px-6 py-2 text-sm font-medium text-white hover:bg-[#5A1821] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:hover:bg-neutral-300"
                    >
                        {mode === 'add' ? 'Add Item' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
