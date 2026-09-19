import { Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function DeleteCafeItemModal({
    title,
    description,
    onCancel,
    onConfirm,
}: {
    title: string;
    description: ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-white p-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-red-50">
                    <Trash2 className="size-6 text-red-500" />
                </span>
                <div>
                    <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">{title}</h2>
                    <p className="mt-1 text-sm text-neutral-500">{description}</p>
                </div>
                <div className="flex w-full gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
