import { Head, usePage } from '@inertiajs/react';
import {
    CalendarCheck,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Ban,
    Eye,
    Search,
    Download,
    X,
    Calendar,
    Check,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { reservations } from '@/routes';
import { router } from '@inertiajs/react';

type ResStatus = 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';

interface ReservationRecord {
    id: number;
    customer: string;
    email: string;
    phone: string;
    venue: string;
    venueId: number;
    eventType: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
    amount: number;
    paymentStatus: 'Unpaid' | 'Pending' | 'Confirmed' | 'Rejected';
    notes: string;
}


const STATUS_TABS: ResStatus[] = ['All', 'Pending', 'Approved', 'Completed', 'Cancelled', 'Rejected'];

type BackendReservation = {
    id: number;
    event_type: string;
    guest_count: number;
    event_date: string;
    start_time: string;
    end_time: string;
    special_requests: string | null;
    total_amount: string;
    payment_status: 'unpaid' | 'pending' | 'confirmed' | 'rejected';
    payment_amount: string | null;
    payment_reference: string | null;
    payment_proof: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
    user: {
        id: number;
        name: string;
        email: string;
    };
    venue: {
        id: number;
        name: string;
    };
};

export default function Reservations() {
    const { reservations = [] } = usePage<{
        reservations?: BackendReservation[];
    }>().props;

    const databaseReservations = useMemo<ReservationRecord[]>(
        () =>
            reservations.map((reservation) => ({
                id: reservation.id,
                customer: reservation.user?.name ?? 'Unknown Customer',
                email: reservation.user?.email ?? '',
                phone: '',
                venue: reservation.venue?.name ?? 'Unknown Venue',
                venueId: reservation.venue?.id ?? 0,
                eventType: reservation.event_type,
                date: reservation.event_date,
                startTime: reservation.start_time,
                endTime: reservation.end_time,
                guests: reservation.guest_count,
                status: (
                    reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)
                ) as ReservationRecord['status'],
                amount: Number(reservation.total_amount),

                paymentStatus:
                    reservation.payment_status === 'confirmed'
                        ? 'Confirmed'
                        : reservation.payment_status === 'rejected'
                        ? 'Rejected'
                        : reservation.payment_status === 'pending'
                        ? 'Pending'
                        : 'Unpaid',

                notes: reservation.special_requests ?? '',
            })),
        [reservations],
    );

    const [reservationsList, setReservationsList] = useState<
        ReservationRecord[]
    >(databaseReservations);

    useEffect(() => {
        setReservationsList(databaseReservations);
    }, [databaseReservations]);

    const [activeTab, setActiveTab] = useState<ResStatus>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedRes, setSelectedRes] = useState<ReservationRecord | null>(null);
    const [staffNote, setStaffNote] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Calculate metrics
    const stats = useMemo(() => {
        const total = reservationsList.length;
        const pending = reservationsList.filter((r) => r.status === 'Pending').length;
        const approved = reservationsList.filter((r) => r.status === 'Approved').length;
        const completed = reservationsList.filter((r) => r.status === 'Completed').length;
        const cancelledOrRejected = reservationsList.filter(
            (r) => r.status === 'Cancelled' || r.status === 'Rejected',
        ).length;

        return { total, pending, approved, completed, cancelledOrRejected };
    }, [reservationsList]);

    // Tab counts
    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { All: reservationsList.length };
        STATUS_TABS.slice(1).forEach((tab) => {
            counts[tab] = reservationsList.filter((r) => r.status === tab).length;
        });

        return counts;
    }, [reservationsList]);

    // Filter logic
    const filteredReservations = useMemo(() => {
        return reservationsList.filter((r) => {
            const matchesTab = activeTab === 'All' || r.status === activeTab;
            const matchesDate = !dateFilter || r.date === dateFilter;
            const query = searchQuery.toLowerCase();
            const matchesQuery =
            !query ||
            r.id.toString().toLowerCase().includes(query) ||
            r.customer.toLowerCase().includes(query) ||
            r.email.toLowerCase().includes(query) ||
            r.venue.toLowerCase().includes(query) ||
            r.eventType.toLowerCase().includes(query);

            return matchesTab && matchesDate && matchesQuery;
        });
    }, [reservationsList, activeTab, dateFilter, searchQuery]);

    // Actions
    const handleStatusChange = (id: number, newStatus: ReservationRecord['status']) => {
        const mappedStatus = newStatus.toLowerCase() as
            | 'pending'
            | 'approved'
            | 'rejected'
            | 'cancelled'
            | 'completed';

        router.patch(`/admin/reservations/${id}/status`, {
            status: mappedStatus,
        }, {
            onSuccess: () => {
                setReservationsList((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
                );

                if (selectedRes && selectedRes.id === id) {
                    setSelectedRes((prev) => (prev ? { ...prev, status: newStatus } : null));
                }

                showToast(`Reservation #${id} updated to ${newStatus}`);
            },
        });
    };

    const handleSaveNote = () => {
        if (!selectedRes) {
return;
}

        setReservationsList((prev) =>
            prev.map((r) => (r.id === selectedRes.id ? { ...r, notes: staffNote } : r)),
        );
        setSelectedRes((prev) => (prev ? { ...prev, notes: staffNote } : null));
        showToast('Internal note saved successfully.');
    };

    const handleExportCSV = () => {
        const headers = [
            'Booking ID,Customer,Email,Phone,Venue,Event Type,Date,Time,Guests,Amount,Payment Status,Reservation Status\n',
        ];

        const rows = filteredReservations.map(
            (r) =>
                `"${r.id}","${r.customer}","${r.email}","${r.phone}","${r.venue}","${r.eventType}","${r.date}","${r.startTime} - ${r.endTime}",${r.guests},${r.amount},"${r.paymentStatus}","${r.status}"\n`,
        );

        const blob = new Blob([headers.concat(rows).join('')], {
            type: 'text/csv',
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `balay_reservations_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        window.URL.revokeObjectURL(url);

        showToast('Exported reservations to CSV.');
    };

    const getStatusBadge = (status: ReservationRecord['status']) => {
        switch (status) {
            case 'Approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
            case 'Completed':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
            case 'Rejected':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
            case 'Cancelled':
                return 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
        }
    };

    const getPaymentStatusBadge = (
        status: ReservationRecord['paymentStatus'],
    ) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';

            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';

            case 'Rejected':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';

            case 'Unpaid':
                return 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
        }
    };

    return (
        <>
            <Head title="Reservations (Admin)" />

            <div className="flex flex-1 flex-col gap-6 bg-white p-4 sm:p-6 dark:bg-neutral-950">
                {/* Notification toast */}
                {toastMessage && (
                    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#6B1E28] px-4 py-3 text-sm font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 dark:bg-[#881337]">
                        <Check className="size-4 shrink-0 text-white" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#3A1A1F] sm:text-3xl dark:text-neutral-100">
                            Reservation Management
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Review, approve, and track all venue bookings and event schedules.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            <Download className="size-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stat KPI Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E3E0] text-[#6B1E28] dark:bg-[#6B1E28]/20 dark:text-[#F7E3E0]">
                            <CalendarCheck className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Bookings</p>
                            <p className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100">
                                {stats.total}
                            </p>
                            <p className="truncate text-xs text-neutral-400">All registered</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Pending Review</p>
                            <p className="text-xl font-bold text-amber-600 sm:text-2xl dark:text-amber-400">
                                {stats.pending}
                            </p>
                            <p className="truncate text-xs text-amber-600/80 dark:text-amber-400/80">Requires action</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Approved</p>
                            <p className="text-xl font-bold text-emerald-600 sm:text-2xl dark:text-emerald-400">
                                {stats.approved}
                            </p>
                            <p className="truncate text-xs text-neutral-400">Confirmed & active</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <Ban className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Cancelled / Rejected</p>
                            <p className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100">
                                {stats.cancelledOrRejected}
                            </p>
                            <p className="truncate text-xs text-neutral-400">Archived status</p>
                        </div>
                    </div>
                </div>

                {/* Filters, Status Tabs & Search */}
                <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        {/* Status Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {STATUS_TABS.map((tab) => {
                                const isActive = activeTab === tab;
                                const count = tabCounts[tab] ?? 0;

                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                            isActive
                                                ? 'bg-[#6B1E28] text-white shadow-sm dark:bg-[#881337]'
                                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        <span>{tab}</span>
                                        <span
                                            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                                isActive
                                                    ? 'bg-white/25 text-white'
                                                    : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Search & Date */}
                        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                            <div className="relative min-w-[220px] flex-1 sm:w-64">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search customer, ID, venue..."
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-3.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-[#881337]"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                )}
                            </div>

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            />
                            {dateFilter && (
                                <button
                                    type="button"
                                    onClick={() => setDateFilter('')}
                                    className="rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    Clear Date
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reservations Table */}
                    <div className="overflow-x-auto rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                        <table className="w-full min-w-[760px] text-left text-xs">
                            <thead className="bg-neutral-50 font-semibold uppercase tracking-wider text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3.5">Booking ID</th>
                                    <th className="px-4 py-3.5">Customer</th>
                                    <th className="px-4 py-3.5">Venue & Event</th>
                                    <th className="px-4 py-3.5">Schedule</th>
                                    <th className="px-4 py-3.5">Guests</th>
                                    <th className="px-4 py-3.5">Amount</th>
                                    <th className="px-4 py-3.5">Status</th>
                                    <th className="px-4 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/70 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {filteredReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-neutral-400 dark:text-neutral-500">
                                            <Calendar className="mx-auto mb-2 size-8 text-neutral-300 dark:text-neutral-600" />
                                            <p className="font-medium">No reservations match the filter criteria.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservations.map((res) => (
                                        <tr
                                            key={res.id}
                                            className="transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                                {res.id}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F7E3E0] font-serif text-xs font-bold text-[#6B1E28] dark:bg-[#6B1E28]/40 dark:text-[#F7E3E0]">
                                                        {res.customer.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-neutral-900 dark:text-neutral-100">
                                                            {res.customer}
                                                        </p>
                                                        <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                                                            {res.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium text-neutral-900 dark:text-neutral-200">
                                                    {res.venue}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    {res.eventType}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium text-neutral-900 dark:text-neutral-200">
                                                    {res.date}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    {res.startTime} - {res.endTime}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-neutral-700 dark:text-neutral-300">
                                                {res.guests} pax
                                            </td>
                                            <td className="px-4 py-3.5">
                                            <div className="flex flex-col items-start gap-1.5">
                                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                    ₱{res.amount.toLocaleString()}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${getPaymentStatusBadge(
                                                        res.paymentStatus,
                                                    )}`}
                                                >
                                                    {res.paymentStatus === 'Confirmed' && (
                                                        <CheckCircle className="size-3" />
                                                    )}

                                                    {res.paymentStatus === 'Pending' && (
                                                        <Clock className="size-3" />
                                                    )}

                                                    {res.paymentStatus === 'Rejected' && (
                                                        <XCircle className="size-3" />
                                                    )}

                                                    {res.paymentStatus === 'Unpaid' && (
                                                        <AlertCircle className="size-3" />
                                                    )}

                                                    Payment: {res.paymentStatus}
                                                </span>
                                            </div>
                                        </td>
                                            <td className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                                                        res.status,
                                                    )}`}
                                                >
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedRes(res);
                                                            setStaffNote(res.notes);
                                                        }}
                                                        className="rounded-lg p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                                        title="View Details"
                                                    >
                                                        <Eye className="size-4" />
                                                    </button>

                                                    {res.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                disabled={res.paymentStatus !== 'Confirmed'}
                                                                onClick={() => handleStatusChange(res.id, 'Approved')}
                                                                className={`rounded-lg p-1.5 transition-colors ${
                                                                    res.paymentStatus === 'Confirmed'
                                                                        ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/50'
                                                                        : 'cursor-not-allowed text-neutral-300 dark:text-neutral-700'
                                                                }`}
                                                                title={
                                                                    res.paymentStatus === 'Confirmed'
                                                                        ? 'Approve Reservation'
                                                                        : 'Payment must be confirmed before approval'
                                                                }
                                                            >
                                                                <CheckCircle className="size-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStatusChange(res.id, 'Rejected')}
                                                                className="rounded-lg p-1.5 text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
                                                                title="Reject Reservation"
                                                            >
                                                                <XCircle className="size-4" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {res.status === 'Approved' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStatusChange(res.id, 'Cancelled')}
                                                            className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                                                            title="Cancel Booking"
                                                        >
                                                            <Ban className="size-4" />
                                                        </button>
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

            {/* View Reservation Details Modal */}
            {selectedRes && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setSelectedRes(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                            <div>
                                <span className="font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                    {selectedRes.id}
                                </span>
                                <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    Reservation Details
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedRes(null)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-4 space-y-5 text-sm">
                            {/* Customer Info Card */}
                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Customer Information
                                </h3>
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-neutral-400">Full Name</p>
                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {selectedRes.customer}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Phone</p>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {selectedRes.phone}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-neutral-400">Email Address</p>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {selectedRes.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Information */}
                            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Venue & Event Overview
                                </h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-neutral-400">Venue</p>
                                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                                            {selectedRes.venue}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Event Type</p>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {selectedRes.eventType}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Date & Time</p>
                                        <p className="font-medium text-neutral-800 dark:text-neutral-200">
                                            {selectedRes.date} ({selectedRes.startTime} - {selectedRes.endTime})
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-400">Expected Guests</p>
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                            {selectedRes.guests} pax
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                <div>
                                    <p className="text-xs text-neutral-400">Total Booking Rate</p>
                                    <p className="text-lg font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                        ₱{selectedRes.amount.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                <p className="text-xs text-neutral-400">
                                    Payment Status
                                </p>

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getPaymentStatusBadge(
                                        selectedRes.paymentStatus,
                                    )}`}
                                >
                                    {selectedRes.paymentStatus === 'Confirmed' && (
                                        <CheckCircle className="size-3.5" />
                                    )}

                                    {selectedRes.paymentStatus === 'Pending' && (
                                        <Clock className="size-3.5" />
                                    )}

                                    {selectedRes.paymentStatus === 'Rejected' && (
                                        <XCircle className="size-3.5" />
                                    )}

                                    {selectedRes.paymentStatus === 'Unpaid' && (
                                        <AlertCircle className="size-3.5" />
                                    )}

                                    {selectedRes.paymentStatus}
                                </span>
                            </div>
                            </div>

                            {/* Internal Staff Notes */}
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Internal Coordination & Staff Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={staffNote}
                                    onChange={(e) => setStaffNote(e.target.value)}
                                    placeholder="Add notes about sound system, catering requests, or special arrangements..."
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                />
                                <div className="mt-1.5 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleSaveNote}
                                        className="rounded-lg bg-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        Update Note
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-400">Current Status:</span>
                                <span
                                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                                        selectedRes.status,
                                    )}`}
                                >
                                    {selectedRes.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {selectedRes.status === 'Pending' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedRes.id, 'Approved')}
                                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95"
                                        >
                                            Approve Booking
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedRes.id, 'Rejected')}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 active:scale-95 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {selectedRes.status === 'Approved' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedRes.id, 'Completed')}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
                                        >
                                            Mark Completed
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange(selectedRes.id, 'Cancelled')}
                                            className="rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-200 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                        >
                                            Cancel Booking
                                        </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setSelectedRes(null)}
                                    className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

Reservations.layout = {
    breadcrumbs: [
        {
            title: 'Reservations',
            href: reservations(),
        },
    ],
};
