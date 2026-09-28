import { X } from 'lucide-react';
import { useState } from 'react';

export type PackageType = 'Basic' | 'Standard' | 'Premium';

export type PackageAddon = {
    name: string;
    price: number;
};

export type AvailableVenue = {
    id: number;
    name: string;
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
};

export type PackageVenue = {
    id: number;
    name: string;
    minimum_capacity_pax: number;
    maximum_capacity_pax: number;
    pivot: {
        extension_rate_per_hour: number | string;
    };
};

export type AdminPackage = {
    id: number;
    name: string;
    type: PackageType;
    description: string | null;
    price: number | string;
    included_duration_hours: number;
    features: string[];
    addons: PackageAddon[];
    popular: boolean;
    available: boolean;
    venues: PackageVenue[];
};

export type PackageFormValues = {
    name: string;
    type: PackageType;
    description: string;
    price: number;
    included_duration_hours: number;
    features: string[];
    addons: PackageAddon[];
    venue_ids: number[];
    venue_extension_rates: Record<number, number>;
    popular: boolean;
    available: boolean;
};

const packageTypes: PackageType[] = ['Basic', 'Standard', 'Premium'];

function emptyFormState() {
    return {
        name: '',
        type: '' as PackageType | '',
        description: '',
        price: '',
        includedDurationHours: '',
        featuresText: '',
        addons: [] as PackageAddon[],
        venueIds: [] as number[],
        venueExtensionRates: {} as Record<number, string>,
        popular: false,
        available: true,
    };
}

function packageToFormState(pkg: AdminPackage) {
    return {
        name: pkg.name,
        type: pkg.type,
        description: pkg.description ?? '',
        price: String(pkg.price),
        includedDurationHours: String(pkg.included_duration_hours),

        featuresText: pkg.features.join('\n'),

        addons: pkg.addons.map((addon) => ({
            name: addon.name,
            price: Number(addon.price),
        })),

        venueIds: pkg.venues.map((venue) => venue.id),

        venueExtensionRates: Object.fromEntries(
            pkg.venues.map((venue) => [
                venue.id,
                String(venue.pivot.extension_rate_per_hour),
            ]),
        ),

        popular: pkg.popular,
        available: pkg.available,
    };
}

function getMissingFields(
    form: ReturnType<typeof emptyFormState>,
): string[] {
    const missing: string[] = [];

    if (!form.name.trim()) {
        missing.push('Package Name');
    }

    if (!form.type) {
        missing.push('Package Type');
    }

    if (!form.price || Number(form.price) <= 0) {
        missing.push('Price');
    }

    if (
        !form.includedDurationHours ||
        Number(form.includedDurationHours) <= 0
    ) {
        missing.push('Included Duration');
    }

    if (!form.featuresText.trim()) {
        missing.push('Features & Inclusions');
    }

    if (form.venueIds.length === 0) {
        missing.push('Included Venue');
    }

    const hasInvalidAddon = form.addons.some(
        (addon) =>
            !addon.name.trim() ||
            Number(addon.price) <= 0,
    );

    if (hasInvalidAddon) {
        missing.push('Valid Add-on Name and Price');
    }

    return missing;
}

function formsAreEqual(
    a: ReturnType<typeof emptyFormState>,
    b: ReturnType<typeof emptyFormState>,
): boolean {
    return (
        a.name === b.name &&
        a.type === b.type &&
        a.description === b.description &&
        a.price === b.price &&
        a.includedDurationHours === b.includedDurationHours &&
        a.featuresText === b.featuresText &&
        JSON.stringify(a.addons) === JSON.stringify(b.addons) &&
        JSON.stringify(a.venueIds) === JSON.stringify(b.venueIds) &&
        JSON.stringify(a.venueExtensionRates) ===
            JSON.stringify(b.venueExtensionRates) &&
        a.popular === b.popular &&
        a.available === b.available
    );
}

export function PackageFormModal({
    mode,
    initialPackage,
    venues,
    onClose,
    onSubmit,
}: {
    mode: 'add' | 'edit';
    initialPackage?: AdminPackage;
    venues: AvailableVenue[];
    onClose: () => void;
    onSubmit: (values: PackageFormValues) => void;
}) {
    const [form, setForm] = useState(() =>
        initialPackage ? packageToFormState(initialPackage) : emptyFormState(),
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

    const values: PackageFormValues = {
        name: form.name.trim(),
        type: (form.type || 'Basic') as PackageType,
        description: form.description.trim(),
        price: Number(form.price) || 0,
        included_duration_hours:
            Number(form.includedDurationHours) || 0,

        features: form.featuresText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),

        addons: form.addons,

        venue_ids: form.venueIds,

        venue_extension_rates: Object.fromEntries(
            Object.entries(form.venueExtensionRates).map(
                ([venueId, rate]) => [
                    Number(venueId),
                    Number(rate) || 0,
                ],
            ),
        ),

        popular: form.popular,
        available: form.available,
    };

        onSubmit(values);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white">
                <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                    <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                        {mode === 'add' ? 'Add Event Package' : 'Edit Event Package'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Package Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                placeholder="e.g. Halo Package"
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Type
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => updateField('type', e.target.value as PackageType)}
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                >
                                    <option value="" disabled>Select type</option>
                                    {packageTypes.map((pt) => (
                                        <option key={pt} value={pt}>{pt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.price}
                                    onChange={(e) => updateField('price', e.target.value)}
                                    placeholder="25000"
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Description
                        </label>

                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                updateField('description', e.target.value)
                            }
                            placeholder="Describe what this package is intended for..."
                            rows={3}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            Features & Inclusions
                        </label>

                        <textarea
                            value={form.featuresText}
                            onChange={(e) =>
                                updateField('featuresText', e.target.value)
                            }
                            placeholder={
                                'Tables & chairs\nBasic sound system\n1 event coordinator'
                            }
                            rows={5}
                            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                        />

                        <p className="mt-1 text-xs text-neutral-400">
                            Enter one inclusion per line.
                        </p>
                    </div>

                    <div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-neutral-700">
                                Included Venues
                            </label>

                            <p className="mt-1 text-xs text-neutral-400">
                                Select which venues customers can use with this package.
                                Capacity comes from the venue.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {venues.map((venue) => {
                                const selected = form.venueIds.includes(venue.id);

                                return (
                                    <div
                                        key={venue.id}
                                        className={`rounded-lg border p-4 ${
                                            selected
                                                ? 'border-[#941b3b] bg-[#fff8f9]'
                                                : 'border-neutral-200 bg-white'
                                        }`}
                                    >
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        updateField('venueIds', [
                                                            ...form.venueIds,
                                                            venue.id,
                                                        ]);

                                                        updateField(
                                                            'venueExtensionRates',
                                                            {
                                                                ...form.venueExtensionRates,
                                                                [venue.id]: '',
                                                            },
                                                        );
                                                    } else {
                                                        updateField(
                                                            'venueIds',
                                                            form.venueIds.filter(
                                                                (id) =>
                                                                    id !== venue.id,
                                                            ),
                                                        );

                                                        const rates = {
                                                            ...form.venueExtensionRates,
                                                        };

                                                        delete rates[venue.id];

                                                        updateField(
                                                            'venueExtensionRates',
                                                            rates,
                                                        );
                                                    }
                                                }}
                                                className="mt-1 size-4 accent-[#941b3b]"
                                            />

                                            <div className="flex-1">
                                                <p className="font-medium text-neutral-800">
                                                    {venue.name}
                                                </p>

                                                <p className="mt-1 text-xs text-neutral-500">
                                                    Capacity:{' '}
                                                    {venue.minimum_capacity_pax}–
                                                    {venue.maximum_capacity_pax} pax
                                                </p>
                                            </div>
                                        </label>

                                        {selected && (
                                            <div className="mt-3 ml-7">
                                                <label className="mb-1 block text-xs font-medium text-neutral-600">
                                                    Extension Rate per Hour (₱)
                                                </label>

                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={
                                                        form.venueExtensionRates[
                                                            venue.id
                                                        ] ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        updateField(
                                                            'venueExtensionRates',
                                                            {
                                                                ...form.venueExtensionRates,
                                                                [venue.id]:
                                                                    e.target.value,
                                                            },
                                                        )
                                                    }
                                                    placeholder="2500"
                                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Included Venue Duration (hours)
                    </label>

                    <input
                        type="number"
                        min={1}
                        value={form.includedDurationHours}
                        onChange={(e) =>
                            updateField(
                                'includedDurationHours',
                                e.target.value,
                            )
                        }
                        placeholder="4"
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                    />

                    <p className="mt-1 text-xs text-neutral-400">
                        The venue usage already included in the package price.
                    </p>
                </div>

                <div>
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700">
                                    Add-ons
                                </label>

                                <p className="mt-1 text-xs text-neutral-400">
                                    Optional services customers can add to this package.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    updateField('addons', [
                                        ...form.addons,
                                        {
                                            name: '',
                                            price: 0,
                                        },
                                    ])
                                }
                                className="text-xs font-semibold text-[#941b3b]"
                            >
                                + Add Add-on
                            </button>
                        </div>

                        <div className="space-y-2">
                            {form.addons.length === 0 && (
                                <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-xs text-neutral-400">
                                    No add-ons added yet.
                                </div>
                            )}

                            {form.addons.map((addon, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                    type="text"
                                    value={addon.name}
                                    onChange={(e) => {
                                        const addons = [...form.addons];

                                        addons[index] = {
                                            ...addons[index],
                                            name: e.target.value,
                                        };

                                        updateField('addons', addons);
                                    }}
                                    placeholder="Photo booth"
                                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                />

                                <input
                                    type="number"
                                    min={1}
                                    value={addon.price}
                                    onChange={(e) => {
                                        const addons = [...form.addons];

                                        addons[index] = {
                                            ...addons[index],
                                            price: Number(e.target.value) || 0,
                                        };

                                        updateField('addons', addons);
                                    }}
                                    placeholder="3000"
                                    className="w-28 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            updateField(
                                                'addons',
                                                form.addons.filter(
                                                    (_, addonIndex) =>
                                                        addonIndex !== index,
                                                ),
                                            )
                                        }
                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                        <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                            <span>
                                <span className="block text-sm font-medium text-neutral-700">
                                    Most Popular Badge
                                </span>
                                <span className="block text-xs text-neutral-400">Highlight this package as popular</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => updateField('popular', !form.popular)}
                                aria-label="Toggle popular"
                                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                    form.popular ? 'bg-[#941b3b]' : 'bg-neutral-300'
                                }`}
                            >
                                <span
                                    className={`absolute left-0 top-0.5 size-5 rounded-full bg-white transition-transform ${
                                        form.popular ? 'translate-x-[22px]' : 'translate-x-0.5'
                                    }`}
                                />
                            </button>
                        </label>

                        <label className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                        <span>
                            <span className="block text-sm font-medium text-neutral-700">
                                Package Available
                            </span>

                            <span className="block text-xs text-neutral-400">
                                Allow customers to select this package
                            </span>
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                updateField('available', !form.available)
                            }
                            aria-label="Toggle package availability"
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                                form.available
                                    ? 'bg-[#941b3b]'
                                    : 'bg-neutral-300'
                            }`}
                        >
                            <span
                                className={`absolute left-0 top-0.5 size-5 rounded-full bg-white transition-transform ${
                                    form.available
                                        ? 'translate-x-[22px]'
                                        : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </label>
                    </div>
                </div>

                {missingFields.length > 0 && (
                <p className="border-t border-neutral-100 px-5 py-2 text-xs text-red-500">
                    Required: {missingFields.join(', ')}
                </p>
            )}

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
                        {mode === 'add' ? 'Add Package' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
