import { CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastData = {
    message: string;
};

export function Toast({
    toast,
    onDismiss,
    duration = 3000,
}: {
    toast: ToastData;
    onDismiss: () => void;
    duration?: number;
}) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, duration);

        return () => clearTimeout(timer);
    }, [onDismiss, duration]);

    return (
        <div className="fixed right-6 top-6 z-[60] w-full max-w-sm">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-lg">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
                <p className="flex-1 text-sm font-medium text-emerald-800">{toast.message}</p>
                <button
                    type="button"
                    onClick={onDismiss}
                    className="text-emerald-600 hover:text-emerald-800"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
