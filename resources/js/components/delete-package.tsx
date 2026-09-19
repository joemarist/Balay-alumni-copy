import { X } from 'lucide-react';

export function DeletePackageModal({
    title,
    description,
    onCancel,
    onConfirm,
}: {
    title: string;
    description: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-100 p-5">
                    <h2 className="font-serif text-lg font-semibold text-red-600">{title}</h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-neutral-400 hover:text-neutral-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="p-5">
                    <p className="text-sm text-neutral-600">{description}</p>
                </div>
                <div className="flex items-center justify-end gap-3 rounded-b-xl bg-neutral-50 px-5 py-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Delete Package
                    </button>
                </div>
            </div>
        </div>
    );
}
