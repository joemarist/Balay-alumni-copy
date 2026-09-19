import { Head, usePage } from '@inertiajs/react';
import {
    CreditCard,
    CheckCircle,
    Clock,
    AlertCircle,
    Upload,
    Download,
    Search,
    X,
    Check,
    Eye,
    Receipt,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { payments } from '@/routes';

interface PaymentRecord {
    id: string;
    bookingRef: string;
    customer: string;
    email: string;
    description: string;
    date: string;
    method: 'GCash' | 'Bank Transfer' | 'Cash';
    amount: number;
    status: 'Confirmed' | 'Pending' | 'Rejected';
    proofImage?: string;
    remarks?: string;
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
    {
        id: 'TXN-2024-091',
        bookingRef: 'B-2024-091',
        customer: 'Maria Santos',
        email: 'm.santos@email.ph',
        description: 'Garden Terrace — 50% Down Payment',
        date: '2024-07-10',
        method: 'GCash',
        amount: 3250,
        status: 'Confirmed',
        remarks: 'Verified via GCash Ref #981249812',
    },
    {
        id: 'TXN-2024-090',
        bookingRef: 'B-2024-090',
        customer: 'Juan Dela Cruz',
        email: 'juan.dc@email.ph',
        description: 'Alumni Function Hall — Down Payment Proof',
        date: '2024-07-15',
        method: 'GCash',
        amount: 7500,
        status: 'Pending',
        proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop',
        remarks: 'Screenshot uploaded by customer. GCash Reference: 009283411',
    },
    {
        id: 'TXN-2024-089',
        bookingRef: 'B-2024-089',
        customer: 'Ana Reyes',
        email: 'ana.r@email.ph',
        description: 'Balay Function Hall — Full Payment',
        date: '2024-07-08',
        method: 'Bank Transfer',
        amount: 15000,
        status: 'Confirmed',
        remarks: 'BDO Online Transfer Ref #BDO-99218274',
    },
    {
        id: 'TXN-2024-088',
        bookingRef: 'B-2024-088',
        customer: 'Marco Lim',
        email: 'marco.lim@email.ph',
        description: 'Conference Room — Full Payment',
        date: '2024-06-28',
        method: 'Cash',
        amount: 3000,
        status: 'Confirmed',
        remarks: 'Paid at Balay Alumni admin front desk.',
    },
    {
        id: 'TXN-2024-087',
        bookingRef: 'B-2024-085',
        customer: 'Lucia Mendoza',
        email: 'l.mendoza@email.ph',
        description: 'Alumni Function Hall — Down Payment',
        date: '2024-07-12',
        method: 'GCash',
        amount: 7500,
        status: 'Confirmed',
        remarks: 'GCash Ref #88219034',
    },
    {
        id: 'TXN-2024-086',
        bookingRef: 'B-2024-084',
        customer: 'Carlos Santos',
        email: 'c.santos@email.ph',
        description: 'Whole Area — Initial Down Payment',
        date: '2024-07-16',
        method: 'Bank Transfer',
        amount: 15000,
        status: 'Pending',
        proofImage: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop',
        remarks: 'BPI Bank confirmation receipt attached.',
    },
    {
        id: 'TXN-2024-084',
        bookingRef: 'B-2024-082',
        customer: 'Ben Cruz',
        email: 'ben.c@email.ph',
        description: 'Conference Room — Deposit',
        date: '2024-07-02',
        method: 'GCash',
        amount: 1500,
        status: 'Rejected',
        remarks: 'Invalid reference number provided / mismatch with bank logs.',
    },
];

export default function Payments() {
    // Determine user role from auth props
    const { auth } = usePage<{ auth: { user: { name: string; email: string; roles?: string[] } } }>().props;
    const userRoles = auth?.user?.roles ?? [];
    const isStaffOrAdmin = ['admin', 'staff', 'superadmin'].some((role) => userRoles.includes(role));

    // View mode: default to admin if admin, user if user
    const [viewMode, setViewMode] = useState<'admin' | 'user'>(isStaffOrAdmin ? 'admin' : 'user');

    const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Rejected'>('All');
    const [methodFilter, setMethodFilter] = useState<'All' | 'GCash' | 'Bank Transfer' | 'Cash'>('All');

    // Modals
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [viewProofModal, setViewProofModal] = useState<PaymentRecord | null>(null);

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        bookingRef: 'B-2024-090',
        amount: '',
        method: 'GCash' as 'GCash' | 'Bank Transfer' | 'Cash',
        referenceNumber: '',
        remarks: '',
        proofFile: null as File | null,
    });

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Metrics
    const stats = useMemo(() => {
        const confirmed = paymentsList.filter((p) => p.status === 'Confirmed');
        const pending = paymentsList.filter((p) => p.status === 'Pending');
        const totalPaid = confirmed.reduce((acc, p) => acc + p.amount, 0);
        const totalPending = pending.reduce((acc, p) => acc + p.amount, 0);
        const count = paymentsList.length;

        return { totalPaid, totalPending, count, pendingCount: pending.length };
    }, [paymentsList]);

    // Filtered payments
    const filteredPayments = useMemo(() => {
        return paymentsList.filter((p) => {
            const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
            const matchesMethod = methodFilter === 'All' || p.method === methodFilter;
            const query = searchQuery.toLowerCase();
            const matchesQuery =
                !query ||
                p.id.toLowerCase().includes(query) ||
                p.bookingRef.toLowerCase().includes(query) ||
                p.customer.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query);

            return matchesStatus && matchesMethod && matchesQuery;
        });
    }, [paymentsList, statusFilter, methodFilter, searchQuery]);

    // Admin verify action
    const handleVerify = (id: string, newStatus: 'Confirmed' | 'Rejected') => {
        setPaymentsList((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );

        if (viewProofModal && viewProofModal.id === id) {
            setViewProofModal((prev) => (prev ? { ...prev, status: newStatus } : null));
        }

        showToast(`Payment ${id} marked as ${newStatus}`);
    };

    // Submit proof of payment (User action)
    const handleSubmitProof = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = `TXN-2024-${String(paymentsList.length + 95).padStart(3, '0')}`;
        const newPayment: PaymentRecord = {
            id: newId,
            bookingRef: uploadForm.bookingRef,
            customer: auth?.user?.name || 'Customer User',
            email: auth?.user?.email || 'customer@example.com',
            description: `${uploadForm.bookingRef} — Payment Proof`,
            date: new Date().toISOString().split('T')[0],
            method: uploadForm.method,
            amount: Number(uploadForm.amount) || 0,
            status: 'Pending',
            proofImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop',
            remarks: `Ref: ${uploadForm.referenceNumber || 'N/A'}. ${uploadForm.remarks}`,
        };

        setPaymentsList([newPayment, ...paymentsList]);
        setShowUploadModal(false);
        setUploadForm({
            bookingRef: 'B-2024-090',
            amount: '',
            method: 'GCash',
            referenceNumber: '',
            remarks: '',
            proofFile: null,
        });
        showToast('Payment proof submitted successfully! Verification takes 1-2 hours.');
    };

    const handleExportCSV = () => {
        const headers = ['Transaction ID,Booking Ref,Customer,Email,Description,Date,Method,Amount,Status\n'];
        const rows = filteredPayments.map(
            (p) =>
                `"${p.id}","${p.bookingRef}","${p.customer}","${p.email}","${p.description}","${p.date}","${p.method}",${p.amount},"${p.status}"\n`,
        );
        const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `balay_payments_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('Exported payment history to CSV.');
    };

    const getStatusBadge = (status: PaymentRecord['status']) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
            case 'Rejected':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
        }
    };

    return (
        <>
            <Head title="Payments (Admin & Users)" />

            <div className="flex flex-1 flex-col gap-6 bg-white p-4 sm:p-6 dark:bg-neutral-950">
                {/* Toast feedback */}
                {toastMessage && (
                    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#6B1E28] px-4 py-3 text-sm font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 dark:bg-[#881337]">
                        <Check className="size-4 shrink-0 text-white" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header with Perspective Switcher for Admins */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#3A1A1F] sm:text-3xl dark:text-neutral-100">
                            {viewMode === 'admin' ? 'Payment Ledger & Verification' : 'My Payments & Transactions'}
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {viewMode === 'admin'
                                ? 'Verify customer proof of payments, monitor revenue, and track cashflow.'
                                : 'Manage venue reservation payments, upload receipts, and check verification status.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Perspective Toggle (Only visible to admin/staff or for preview) */}
                        {isStaffOrAdmin && (
                            <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('admin')}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === 'admin'
                                        ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                                        }`}
                                >
                                    Admin View
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('user')}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${viewMode === 'user'
                                        ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400'
                                        }`}
                                >
                                    Customer View
                                </button>
                            </div>
                        )}

                        {viewMode === 'user' ? (
                            <button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#6B1E28] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#581821] active:scale-95 dark:bg-[#881337] dark:hover:bg-[#70102e]"
                            >
                                <Upload className="size-4" />
                                <span>Upload Proof</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleExportCSV}
                                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            >
                                <Download className="size-4 text-neutral-500 dark:text-neutral-400" />
                                <span>Export Ledger</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {viewMode === 'admin' ? 'Total Confirmed Revenue' : 'Total Confirmed Payments'}
                            </p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ₱{stats.totalPaid.toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-400">Cleared & deposited</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                Pending Verification
                            </p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                ₱{stats.totalPending.toLocaleString()}
                            </p>
                            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                                {stats.pendingCount} transaction{stats.pendingCount !== 1 ? 's' : ''} awaiting review
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E3E0] text-[#6B1E28] dark:bg-[#6B1E28]/20 dark:text-[#F7E3E0]">
                            <CreditCard className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                Total Transactions
                            </p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                {stats.count}
                            </p>
                            <p className="text-xs text-neutral-400">GCash, Bank, Cash</p>
                        </div>
                    </div>
                </div>

                {/* Admin Quick Verification Queue */}
                {viewMode === 'admin' && stats.pendingCount > 0 && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                                <h3 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-300">
                                    Action Required: Pending Verification Queue ({stats.pendingCount})
                                </h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {paymentsList
                                .filter((p) => p.status === 'Pending')
                                .map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                                    {payment.id}
                                                </span>
                                                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                                    {payment.method}
                                                </span>
                                            </div>
                                            <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">
                                                {payment.customer}
                                            </p>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {payment.description}
                                            </p>
                                            <p className="mt-2 text-base font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                                ₱{payment.amount.toLocaleString()}
                                            </p>
                                            {payment.remarks && (
                                                <p className="mt-1 text-[11px] italic text-neutral-400 dark:text-neutral-500">
                                                    {payment.remarks}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            {payment.proofImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => setViewProofModal(payment)}
                                                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                                >
                                                    <Eye className="size-3.5" />
                                                    <span>Slip</span>
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleVerify(payment.id, 'Confirmed')}
                                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95"
                                            >
                                                <Check className="size-3.5" />
                                                <span>Confirm</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleVerify(payment.id, 'Rejected')}
                                                className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                                            >
                                                <X className="size-3.5" />
                                                <span>Reject</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Main Table Card */}
                <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        {/* Status Filter Buttons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {(['All', 'Confirmed', 'Pending', 'Rejected'] as const).map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${statusFilter === status
                                        ? 'bg-[#6B1E28] text-white shadow-sm dark:bg-[#881337]'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Search & Method dropdown */}
                        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                            <div className="relative min-w-[200px] flex-1 sm:w-60">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search reference, customer..."
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-3.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            <select
                                value={methodFilter}
                                onChange={(e) => setMethodFilter(e.target.value as any)}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            >
                                <option value="All">All Methods</option>
                                <option value="GCash">GCash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                        <table className="w-full min-w-[700px] text-left text-xs">
                            <thead className="bg-neutral-50 font-semibold uppercase tracking-wider text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3.5">Transaction ID</th>
                                    <th className="px-4 py-3.5">Booking Ref</th>
                                    {viewMode === 'admin' && <th className="px-4 py-3.5">Customer</th>}
                                    <th className="px-4 py-3.5">Description</th>
                                    <th className="px-4 py-3.5">Date</th>
                                    <th className="px-4 py-3.5">Method</th>
                                    <th className="px-4 py-3.5">Amount</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/70 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={viewMode === 'admin' ? 9 : 8}
                                            className="py-12 text-center text-neutral-400 dark:text-neutral-500"
                                        >
                                            <Receipt className="mx-auto mb-2 size-8 text-neutral-300 dark:text-neutral-600" />
                                            <p className="font-medium">No transactions match your search filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                                {p.id}
                                            </td>
                                            <td className="px-4 py-3.5 font-mono text-neutral-600 dark:text-neutral-400">
                                                {p.bookingRef}
                                            </td>
                                            {viewMode === 'admin' && (
                                                <td className="px-4 py-3.5">
                                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {p.customer}
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                        {p.email}
                                                    </p>
                                                </td>
                                            )}
                                            <td className="px-4 py-3.5 font-medium text-neutral-800 dark:text-neutral-200">
                                                {p.description}
                                            </td>
                                            <td className="px-4 py-3.5 text-neutral-500 dark:text-neutral-400">
                                                {p.date}
                                            </td>
                                            <td className="px-4 py-3.5 text-neutral-700 dark:text-neutral-300">
                                                {p.method}
                                            </td>
                                            <td className="px-4 py-3.5 font-bold text-neutral-900 dark:text-neutral-100">
                                                ₱{p.amount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                                                        p.status,
                                                    )}`}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {p.proofImage && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setViewProofModal(p)}
                                                            className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                                            title="View Receipt / Proof"
                                                        >
                                                            <Eye className="size-4" />
                                                        </button>
                                                    )}

                                                    {viewMode === 'admin' && p.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleVerify(p.id, 'Confirmed')}
                                                                className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                                                                title="Verify and Approve"
                                                            >
                                                                <CheckCircle className="size-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleVerify(p.id, 'Rejected')}
                                                                className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                                                                title="Reject Payment"
                                                            >
                                                                <X className="size-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Upload Proof of Payment (Customer Action) */}
            {showUploadModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setShowUploadModal(false)}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 dark:border-neutral-800">
                            <div>
                                <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    Upload Proof of Payment
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Submit your GCash or bank deposit transaction receipt.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowUploadModal(false)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProof} className="mt-4 space-y-4 text-xs">
                            <div>
                                <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                    Booking Reference
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.bookingRef}
                                    onChange={(e) =>
                                        setUploadForm({ ...uploadForm, bookingRef: e.target.value })
                                    }
                                    placeholder="e.g. B-2024-090"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                        Amount Paid (₱)
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={uploadForm.amount}
                                        onChange={(e) =>
                                            setUploadForm({ ...uploadForm, amount: e.target.value })
                                        }
                                        placeholder="e.g. 7500"
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                        Payment Method
                                    </label>
                                    <select
                                        value={uploadForm.method}
                                        onChange={(e) =>
                                            setUploadForm({
                                                ...uploadForm,
                                                method: e.target.value as any,
                                            })
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                    >
                                        <option value="GCash">GCash</option>
                                        <option value="Bank Transfer">Bank Transfer (BDO/BPI)</option>
                                        <option value="Cash">Cash at Counter</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                    Reference / Transaction ID
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={uploadForm.referenceNumber}
                                    onChange={(e) =>
                                        setUploadForm({ ...uploadForm, referenceNumber: e.target.value })
                                    }
                                    placeholder="e.g. GCash Ref No. or Bank Ref"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                />
                            </div>

                            {/* Drop area */}
                            <div>
                                <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                    Receipt Screenshot / Attachment
                                </label>
                                <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition-colors hover:border-[#6B1E28] dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-[#881337]">
                                    <Upload className="size-6 text-neutral-400" />
                                    <p className="mt-2 font-medium text-neutral-700 dark:text-neutral-300">
                                        Click to browse or drag receipt screenshot
                                    </p>
                                    <p className="text-[10px] text-neutral-400">PNG, JPG, or PDF up to 10MB</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-semibold text-neutral-700 dark:text-neutral-300">
                                    Additional Remarks (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.remarks}
                                    onChange={(e) =>
                                        setUploadForm({ ...uploadForm, remarks: e.target.value })
                                    }
                                    placeholder="e.g. Paid via Maria's personal account"
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                />
                            </div>

                            <div className="mt-5 flex justify-end gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-[#6B1E28] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#581821] active:scale-95 dark:bg-[#881337]"
                                >
                                    Submit for Verification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Proof of Payment Slip (Admin & User) */}
            {viewProofModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setViewProofModal(null)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-3 dark:border-neutral-800">
                            <div>
                                <span className="font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                    {viewProofModal.id}
                                </span>
                                <h3 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Payment Verification Slip
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setViewProofModal(null)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3.5 text-xs">
                            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800">
                                <div>
                                    <p className="text-neutral-400">Customer</p>
                                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                        {viewProofModal.customer}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-neutral-400">Amount</p>
                                    <p className="text-base font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                        ₱{viewProofModal.amount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {viewProofModal.proofImage && (
                                <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                                    <img
                                        src={viewProofModal.proofImage}
                                        alt="Proof of payment"
                                        className="h-48 w-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
                                <p className="text-neutral-400">Transaction Remarks</p>
                                <p className="mt-0.5 font-medium text-neutral-700 dark:text-neutral-300">
                                    {viewProofModal.remarks || 'No remarks provided.'}
                                </p>
                            </div>
                        </div>

                        {viewMode === 'admin' && viewProofModal.status === 'Pending' && (
                            <div className="mt-5 flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => handleVerify(viewProofModal.id, 'Confirmed')}
                                    className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 active:scale-95"
                                >
                                    Confirm Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleVerify(viewProofModal.id, 'Rejected')}
                                    className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 active:scale-95 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                                >
                                    Reject Slip
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

Payments.layout = {
    breadcrumbs: [
        {
            title: 'Payments',
            href: payments(),
        },
    ],
};
