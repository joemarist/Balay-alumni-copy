import { Head, router } from '@inertiajs/react';
import {
    Banknote,
    Building2,
    Calendar,
    Coffee,
    Download,
    Filter,
    Gift,
    Plus,
    UserRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { dashboard as adminDashboard, venues as adminVenues } from '@/routes/admin';

type ReservationStatus = 'Approved' | 'Pending' | 'Completed' | 'Cancelled';

interface AdminDashboardProps {
    totalReservations: number;
    totalRevenue: number;
    activeCustomers: number;
    upcomingEvents: number;
    availableVenues: number;
    totalVenues: number;

    monthlyReservations: {
        month: string;
        total: number;
        rejected: number;
        nonRejected: number;
    }[];

    revenueTrend: {
        month: string;
        revenue: number;
    }[];
}

const CustomReservationTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: {
        dataKey: string;
        value: number;
    }[];
    label?: string;
}) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const nonRejected =
        payload.find((item) => item.dataKey === 'nonRejected')?.value ?? 0;

    const rejected =
        payload.find((item) => item.dataKey === 'rejected')?.value ?? 0;

    const total = nonRejected + rejected;

    return (
        <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
            <p className="mb-2 font-semibold text-[#3A1A1F]">{label}</p>

            <p className="text-sm text-neutral-700">
                Total Reservations: <span className="font-semibold">{total}</span>
            </p>

            <p className="text-sm text-neutral-700">
                Non-Rejected: <span className="font-semibold">{nonRejected}</span>
            </p>

            <p className="text-sm text-neutral-700">
                Rejected: <span className="font-semibold">{rejected}</span>
            </p>
        </div>
    );
};

type Reservation = {
    bookingId: string;
    customer: string;
    venue: string;
    date: string;
    guests: number;
    amount: number;
    status: ReservationStatus;
};

// TODO



const bestSellingProducts = [
    { name: 'Classic Café Latte', count: 312 },
    { name: 'Cold Brew Delight', count: 278 },
    { name: 'Butter Croissant', count: 254 },
    { name: 'Creamy Cappuccino', count: 231 },
    { name: 'Cheesecake Slice', count: 198 },
];


const venueUtilization = [
    { name: 'Grand Ballroom', percent: 88 },
    { name: 'Garden Terrace', percent: 74 },
    { name: 'Alumni Courtyard', percent: 67 },
    { name: 'Conference Hall A', percent: 55 },
    { name: 'Rooftop Lounge', percent: 41 },
    { name: 'Narra Room', percent: 38 },
];

const initialReservations: Reservation[] = [
    { bookingId: 'B-2024-091', customer: 'Maria Santos', venue: 'Garden Terrace', date: 'Jul 22, 2024', guests: 65, amount: 6500, status: 'Approved' },
    { bookingId: 'B-2024-089', customer: 'Juan Dela Cruz', venue: 'Alumni Courtyard', date: 'Aug 5, 2024', guests: 180, amount: 10000, status: 'Pending' },
    { bookingId: 'B-2024-085', customer: 'Ana Reyes', venue: 'Grand Ballroom', date: 'Aug 18, 2024', guests: 250, amount: 15000, status: 'Approved' },
    { bookingId: 'B-2024-078', customer: 'Marco Lim', venue: 'Narra Room', date: 'Jun 30, 2024', guests: 30, amount: 3000, status: 'Completed' },
    { bookingId: 'B-2024-071', customer: 'Sofia Garcia', venue: 'Conference Hall A', date: 'Jun 15, 2024', guests: 90, amount: 8000, status: 'Cancelled' },
    { bookingId: 'B-2024-068', customer: 'Paolo Ramirez', venue: 'Rooftop Lounge', date: 'Jun 10, 2024', guests: 40, amount: 4500, status: 'Completed' },
    { bookingId: 'B-2024-064', customer: 'Liza Fernandez', venue: 'Garden Terrace', date: 'Jun 2, 2024', guests: 55, amount: 6500, status: 'Approved' },
    { bookingId: 'B-2024-059', customer: 'Carlo Mendoza', venue: 'Grand Ballroom', date: 'May 28, 2024', guests: 300, amount: 18000, status: 'Pending' },
    { bookingId: 'B-2024-055', customer: 'Diane Torres', venue: 'Alumni Courtyard', date: 'May 20, 2024', guests: 150, amount: 9500, status: 'Completed' },
    { bookingId: 'B-2024-050', customer: 'Ramon Castillo', venue: 'Narra Room', date: 'May 12, 2024', guests: 25, amount: 3000, status: 'Cancelled' },
    { bookingId: 'B-2024-046', customer: 'Ella Villanueva', venue: 'Conference Hall A', date: 'May 5, 2024', guests: 80, amount: 8000, status: 'Approved' },
    { bookingId: 'B-2024-041', customer: 'Nico Bautista', venue: 'Rooftop Lounge', date: 'Apr 28, 2024', guests: 45, amount: 4500, status: 'Completed' },
    { bookingId: 'B-2024-037', customer: 'Grace Aquino', venue: 'Garden Terrace', date: 'Apr 20, 2024', guests: 60, amount: 6500, status: 'Approved' },
    { bookingId: 'B-2024-033', customer: 'Victor Cruz', venue: 'Grand Ballroom', date: 'Apr 14, 2024', guests: 220, amount: 15000, status: 'Pending' },
    { bookingId: 'B-2024-029', customer: 'Isabel Reyes', venue: 'Alumni Courtyard', date: 'Apr 8, 2024', guests: 130, amount: 9500, status: 'Completed' },
];

// TODO
const totalReservationCount = 15;

const statusStyles: Record<ReservationStatus, string> = {
    Approved: 'bg-emerald-50 text-emerald-600',
    Pending: 'bg-amber-50 text-amber-600',
    Completed: 'bg-blue-50 text-blue-600',
    Cancelled: 'bg-red-50 text-red-600',
};

const statusOptions: ReservationStatus[] = ['Approved', 'Pending', 'Completed', 'Cancelled'];
const filterOptions: Array<ReservationStatus | 'All'> = ['All', ...statusOptions];

const PAGE_SIZE = 5;

function initialsOf(name: string) {
    return name.charAt(0).toUpperCase();
}

function reservationsToCsv(reservations: Reservation[]): string {
    const header = ['Booking ID', 'Customer', 'Venue', 'Date', 'Guests', 'Amount', 'Status'];
    const rows = reservations.map((reservation) => [
        reservation.bookingId,
        reservation.customer,
        reservation.venue,
        reservation.date,
        String(reservation.guests),
        String(reservation.amount),
        reservation.status,
    ]);

    return [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}

function downloadCsv(filename: string, csvContent: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function StatCard({
    icon,
    iconBg,
    label,
    value,
    note,
    noteColor = 'text-neutral-400',
}: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
    note: string;
    noteColor?: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                {icon}
            </span>
            <div>
                <p className="text-xs font-medium tracking-wide text-neutral-500">{label}</p>
                <p className="text-xl font-semibold text-neutral-900">{value}</p>
                <p className={`text-xs ${noteColor}`}>{note}</p>
            </div>
        </div>
    );
}

export default function AdminDashboard({
    totalReservations,
    totalRevenue,
    activeCustomers,
    upcomingEvents,
    availableVenues,
    totalVenues,
    monthlyReservations,
    revenueTrend,
}: AdminDashboardProps) {

    const [reservations] = useState<Reservation[]>(initialReservations);
    const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'All'>('All');
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [page, setPage] = useState(1);

    const filteredReservations = useMemo(
        () =>
            statusFilter === 'All'
                ? reservations
                : reservations.filter((reservation) => reservation.status === statusFilter),
        [reservations, statusFilter],
    );

    const totalPages = Math.max(1, Math.ceil(filteredReservations.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginatedReservations = filteredReservations.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    function handleExportReport() {
        downloadCsv('admin-report.csv', reservationsToCsv(reservations));
    }

    function handleExportTable() {
        downloadCsv('reservations.csv', reservationsToCsv(filteredReservations));
    }

    function handleNewVenue() {
        router.visit(adminVenues());
    }

    function handleSelectFilter(option: ReservationStatus | 'All') {
        setStatusFilter(option);
        setPage(1);
        setFilterMenuOpen(false);
    }

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-5 bg-white p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-semibold text-[#3A1A1F]">
                            Admin Overview
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            September 2026 · All systems operational
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleExportReport}
                            className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            <Download className="size-4" />
                            Export Report
                        </button>
                        <button
                            type="button"
                            onClick={handleNewVenue}
                            className="flex items-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]"
                        >
                            <Plus className="size-4" />
                            New Venue
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        icon={<Calendar className="size-5 text-[#6b103e]" />}
                        iconBg="bg-[#F7E3E0]"
                        label="Total Reservations"
                        value={totalReservations.toLocaleString()}
                        note="↗ +12 this month"
                        noteColor="text-emerald-600"
                    />
                    <StatCard
                        icon={<Banknote className="size-5 text-[#2c8042]" />}
                        iconBg="bg-emerald-50"
                        label="Total Revenue"
                        value={`₱${totalRevenue.toLocaleString()}`}
                        note="↗ +18% vs last month"
                        noteColor="text-emerald-600"
                    />
                    <StatCard
                        icon={<Coffee className="size-5 text-[#6b103e]" />}
                        iconBg="bg-[#F7E3E0]"
                        label="Cafe Orders"
                        value="2,840"
                        note="This month ↗ +23%"
                        noteColor="text-emerald-600"
                    />
                    <StatCard
                        icon={<UserRound className="size-5 text-amber-600" />}
                        iconBg="bg-amber-50"
                        label="Active Customers"
                        value={activeCustomers.toLocaleString()}
                        note="Registered users"
                    />
                    <StatCard
                        icon={<Gift className="size-5 text-violet-600" />}
                        iconBg="bg-violet-50"
                        label="Upcoming Events"
                        value={upcomingEvents.toLocaleString()}
                        note="Next 30 days"
                    />
                    <StatCard
                        icon={<Building2 className="size-5 text-sky-600" />}
                        iconBg="bg-sky-50"
                        label="Available Venues"
                        value={`${availableVenues} / ${totalVenues}`}
                        note="3 currently booked"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">Revenue Trend</h2>
                        <div className="mt-4 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#bcaca9" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12, fill: '#010101' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={(value: number) => `₱${value / 1000}k`}
                                        tick={{ fontSize: 12, fill: '#010101' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#16A34A"
                                        strokeWidth={2}
                                        dot={false}
                                    />
    
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                            Best-selling Products
                        </h2>
                        <div className="mt-4 flex flex-col gap-3">
                            {bestSellingProducts.map((product, index) => {
                                const maxCount = bestSellingProducts[0].count;
                                const widthPercent = (product.count / maxCount) * 100;

                                return (
                                    <div key={product.name} className="flex items-center gap-3">
                                        <span className="w-4 text-sm font-semibold text-neutral-400">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-neutral-800">
                                                    {product.name}
                                                </span>
                                                <span className="text-neutral-400">{product.count}</span>
                                            </div>
                                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                                                <div
                                                    className="h-full rounded-full bg-[#6B1E28]"
                                                    style={{ width: `${widthPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 border-t border-neutral-100 pt-3">
                            <p className="text-xs text-neutral-400">Total café orders this month</p>
                            <p className="text-2xl font-semibold text-[#3A1A1F]">2,840</p>
                        </div>
                    </div>



                    {/* Utilization + Best sellers */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                            Monthly Reservation Activity
                        </h2>
                        <p className="mt-1 text-xs text-neutral-500">
                            Reservation submissions by month, including rejected requests.
                        </p>
                        <div className="mt-4 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyReservations}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#F0E5E2"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip content={<CustomReservationTooltip />} />

                                    <Bar
                                        dataKey="nonRejected"
                                        stackId="reservations"
                                        fill="#6B1E28"
                                        radius={[0, 0, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="rejected"
                                        stackId="reservations"
                                        fill="#B45309"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                            <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                                Venue Utilization Rate
                            </h2>
                            <div className="mt-4 flex flex-col gap-4">
                                {venueUtilization.map((venue) => (
                                    <div key={venue.name}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-neutral-700">{venue.name}</span>
                                            <span
                                                className="font-semibold"
                                                style={{
                                                    color:
                                                        venue.percent >= 70
                                                            ? '#059669'
                                                            : venue.percent >= 50
                                                                ? '#D97706'
                                                                : '#6B1E28',
                                                }}
                                            >
                                                {venue.percent}%
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                                            <div
                                                className={`h-full rounded-full ${venue.percent >= 70
                                                    ? 'bg-emerald-500'
                                                    : venue.percent >= 50
                                                        ? 'bg-amber-500'
                                                        : ''
                                                    }`}
                                                style={{
                                                    width: `${venue.percent}%`,
                                                    backgroundColor: venue.percent < 50 ? '#6B1E28' : undefined,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Reservations table */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                            Recent Reservations
                        </h2>
                        <div className="relative flex gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterMenuOpen((open) => !open)}
                                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                            >
                                <Filter className="size-3.5" />
                                Filter{statusFilter !== 'All' ? `: ${statusFilter}` : ''}
                            </button>
                            {filterMenuOpen && (
                                <div className="absolute right-24 top-9 z-10 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                                    {filterOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => handleSelectFilter(option)}
                                            className={`block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 ${statusFilter === option
                                                ? 'font-medium text-[#6B1E28]'
                                                : 'text-neutral-600'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleExportTable}
                                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                            >
                                <Download className="size-3.5" />
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
                                    <th className="pb-3 pr-4 font-medium">Booking ID</th>
                                    <th className="pb-3 pr-4 font-medium">Customer</th>
                                    <th className="pb-3 pr-4 font-medium">Venue</th>
                                    <th className="pb-3 pr-4 font-medium">Date</th>
                                    <th className="pb-3 pr-4 font-medium">Guests</th>
                                    <th className="pb-3 pr-4 font-medium">Amount</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {paginatedReservations.map((reservation) => (
                                    <tr key={reservation.bookingId}>
                                        <td className="py-3 pr-4 font-medium text-[#6B1E28]">
                                            {reservation.bookingId}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="flex size-7 items-center justify-center rounded-full bg-[#6B1E28] text-xs font-semibold text-white">
                                                    {initialsOf(reservation.customer)}
                                                </span>
                                                <span className="text-neutral-800">{reservation.customer}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-neutral-600">{reservation.venue}</td>
                                        <td className="py-3 pr-4 text-neutral-600">{reservation.date}</td>
                                        <td className="py-3 pr-4 text-neutral-600">{reservation.guests}</td>
                                        <td className="py-3 pr-4 font-medium text-neutral-800">
                                            ₱{reservation.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[reservation.status]}`}
                                            >
                                                {reservation.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedReservations.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-neutral-400">
                                            No reservations match this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4 text-sm text-neutral-500">
                        <span>
                            Showing {paginatedReservations.length} of {totalReservationCount} reservations
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                disabled={currentPage === 1}
                                className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
                            >
                                ‹
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    className={`flex size-8 items-center justify-center rounded-full text-sm ${pageNumber === currentPage
                                        ? 'bg-[#6B1E28] text-white'
                                        : 'text-neutral-500 hover:bg-neutral-50'
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                disabled={currentPage === totalPages}
                                className="flex size-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-40"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: adminDashboard(),
        },
    ],
};
