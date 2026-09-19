import { X } from 'lucide-react';
import { useState } from 'react';

export type PackageType = 'Basic' | 'Standard' | 'Premium';

export type AdminPackage = {
    id: number;
    name: string;
    type: PackageType;
    price: number;
    popular?: boolean;
    description: string[];
    addons: string[];
};

export type PackageFormValues = Omit<AdminPackage, 'id'>;

const packageTypes: PackageType[] = ['Basic', 'Standard', 'Premium'];

function emptyFormState() {
    return {
        name: '',
        type: '' as PackageType | '',
        price: '',
        popular: false,
        descriptionText: '',
        addonsText: '',
    };
}

function packageToFormState(pkg: AdminPackage) {
    return {
        name: pkg.name,
        type: pkg.type,
        price: String(pkg.price),
        popular: pkg.popular ?? false,
        descriptionText: pkg.description.join('\n'),
        addonsText: pkg.addons.join('\n'),
    };
}

function getMissingFields(form: ReturnType<typeof emptyFormState>): string[] {
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

    if (!form.descriptionText.trim()) {
missing.push('Features');
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
        a.price === b.price &&
        a.popular === b.popular &&
        a.descriptionText === b.descriptionText &&
        a.addonsText === b.addonsText
    );
}

export function PackageFormModal({
    mode,
    initialPackage,
    onClose,
    onSubmit,
}: {
    mode: 'add' | 'edit';
    initialPackage?: AdminPackage;
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
            name: form.name,
            type: (form.type || 'Basic') as PackageType,
            price: Number(form.price) || 0,
            popular: form.popular,
            description: form.descriptionText
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
            addons: form.addonsText
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean),
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
                                    min={0}
                                    value={form.price}
                                    onChange={(e) => updateField('price', e.target.value)}
                                    placeholder="25000"
                                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Features & Inclusions
                            </label>
                            <textarea
                                value={form.descriptionText}
                                onChange={(e) => updateField('descriptionText', e.target.value)}
                                placeholder="Venue rental (4 hrs)\nTables & chairs for 50 pax"
                                rows={4}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-neutral-400">Enter one feature per line.</p>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                                Add-ons <span className="text-neutral-400">(optional)</span>
                            </label>
                            <textarea
                                value={form.addonsText}
                                onChange={(e) => updateField('addonsText', e.target.value)}
                                placeholder="Photo booth +₱3,000\nCatering +₱8,000"
                                rows={3}
                                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-neutral-400">Enter one add-on per line.</p>
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
                    </div>
                </div>

                {mode === 'add' && missingFields.length > 0 && (
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
