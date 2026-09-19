import { Head } from '@inertiajs/react';
import {
    CalendarCheck,
    DollarSign,
    Building2,
    Coffee,
    Users,
    CreditCard,
    Download,
    TrendingUp,
    X,
    Eye,
    Calendar,
    Check,
} from 'lucide-react';
import { useState } from 'react';
import { reports } from '@/routes';

interface ReportCardItem {
    id: string;
    title: string;
    desc: string;
    icon: any;
    color: string;
    badgeText: string;
    previewData: {
        headers: string[];
        rows: (string | number)[][];
    };
}

const REPORT_CARDS: ReportCardItem[] = [
    {
        id: 'monthly-bookings',
        title: 'Monthly Bookings Report',
        desc: 'Total venue reservations, approved bookings, cancellations, and rescheduling rate.',
        icon: CalendarCheck,
        color: '#6B1E28',
        badgeText: '148 Total Bookings',
        previewData: {
            headers: ['Month', 'Venue', 'Bookings', 'Approved', 'Cancelled', 'Occupancy'],
            rows: [
                ['July 2024', 'Function Hall', 24, 20, 4, '82%'],
                ['July 2024', 'Conference Room', 32, 28, 4, '75%'],
                ['July 2024', 'Whole Venue', 8, 6, 2, '60%'],
                ['June 2024', 'Function Hall', 22, 19, 3, '78%'],
                ['June 2024', 'Conference Room', 29, 25, 4, '70%'],
            ],
        },
    },
    {
        id: 'revenue-collections',
        title: 'Revenue & Collections',
        desc: 'Comprehensive breakdown of venue rentals, café sales, and event packages cashflow.',
        icon: DollarSign,
        color: '#166534',
        badgeText: '₱1.59M Total Revenue',
        previewData: {
            headers: ['Revenue Stream', 'Transactions', 'Gross (₱)', 'Net Paid (₱)', 'Pending (₱)'],
            rows: [
                ['Venue Bookings', 48, '1,250,000', '1,120,000', '130,000'],
                ['Balay Café Orders', 2840, '348,200', '348,200', '0'],
                ['Event Add-ons & Corkage', 24, '48,000', '42,000', '6,000'],
            ],
        },
    },
    {
        id: 'venue-utilization',
        title: 'Venue Utilization & Occupancy',
        desc: 'Average hours occupied per day, peak days, and most requested time slots.',
        icon: Building2,
        color: '#881337',
        badgeText: '78% Avg. Utilization',
        previewData: {
            headers: ['Venue', 'Capacity', 'Hours Booked', 'Peak Slot', 'Turnover Rate'],
            rows: [
                ['Function Hall', '80-100 pax', '180 hrs', 'Fri-Sat 2:00 PM - 8:00 PM', '92%'],
                ['Conference Room', '10-20 pax', '140 hrs', 'Tue-Thu 9:00 AM - 1:00 PM', '84%'],
                ['Whole Area', '150-200 pax', '64 hrs', 'Weekends 4:00 PM - 11:00 PM', '65%'],
            ],
        },
    },
    {
        id: 'cafe-sales',
        title: 'Café Sales & Best Sellers',
        desc: 'Best-selling coffee and snacks, peak ordering hours, and café revenue trends.',
        icon: Coffee,
        color: '#D97706',
        badgeText: '2,840 Items Sold',
        previewData: {
            headers: ['Menu Item', 'Category', 'Units Sold', 'Unit Price', 'Total Sales (₱)'],
            rows: [
                ['Balay Signature Espresso', 'Coffee', 840, '₱95', '79,800'],
                ['Classic Café Latte', 'Coffee', 620, '₱130', '80,600'],
                ['Matcha Oat Latte', 'Non-Coffee', 410, '₱145', '59,450'],
                ['Club Sandwich', 'Meals', 320, '₱220', '70,400'],
                ['Butter Croissant', 'Snacks', 480, '₱80', '38,400'],
            ],
        },
    },
    {
        id: 'customer-stats',
        title: 'Customer Statistics & Retention',
        desc: 'Alumni engagement metrics, repeat reservations, and new account registrations.',
        icon: Users,
        color: '#6D28D9',
        badgeText: '420 Active Customers',
        previewData: {
            headers: ['Customer Tier', 'Active Users', 'Reservations', 'Total Spend (₱)', 'Retention'],
            rows: [
                ['Alumni Members', 280, 85, '820,000', '74%'],
                ['Faculty & Staff', 95, 42, '340,000', '81%'],
                ['External Guests', 45, 21, '430,000', '48%'],
            ],
        },
    },
    {
        id: 'payment-collections',
        title: 'Payment Collection & Receivables',
        desc: 'Audit of confirmed GCash, bank deposits, and pending verification proofs.',
        icon: CreditCard,
        color: '#0369A1',
        badgeText: '91% Collection Rate',
        previewData: {
            headers: ['Method', 'Transactions', 'Confirmed (₱)', 'Pending Verification (₱)'],
            rows: [
                ['GCash QR / Number', 68, '680,000', '24,500'],
                ['Bank Deposit / Online', 34, '740,000', '30,000'],
                ['Cash at Front Desk', 18, '170,000', '0'],
            ],
        },
    },
];

export default function Reports() {
    const [period, setPeriod] = useState('July 2024');
    const [venueFilter, setVenueFilter] = useState('All Venues');
    const [previewReport, setPreviewReport] = useState<ReportCardItem | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleDownload = (reportTitle: string, format: 'PDF' | 'Excel' | 'CSV') => {
        showToast(`Generating ${reportTitle} (${format})... Download started.`);
    };

    return (
        <>
            <Head title="Reports (Admin)" />

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
                            Executive Reports & Analytics
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Comprehensive financial statements, utilization metrics, and reservation analytics.
                        </p>
                    </div>

                    {/* Global Export Options */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-neutral-400">Export All:</span>
                        {(['PDF', 'Excel', 'CSV'] as const).map((format) => (
                            <button
                                key={format}
                                type="button"
                                onClick={() => handleDownload('Balay Alumni Full Audit Report', format)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            >
                                <Download className="size-3.5 text-neutral-400" />
                                <span>{format}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date and Venue Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-4 text-neutral-400" />
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Period:</span>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option>July 2024</option>
                                <option>June 2024</option>
                                <option>Q2 2024 (Apr - Jun)</option>
                                <option>Q1 2024 (Jan - Mar)</option>
                                <option>Fiscal Year 2024</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Building2 className="size-4 text-neutral-400" />
                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Venue:</span>
                            <select
                                value={venueFilter}
                                onChange={(e) => setVenueFilter(e.target.value)}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option>All Venues</option>
                                <option>Balay Alumni Function Hall</option>
                                <option>Balay Cafe Conference Room</option>
                                <option>Whole Area of Balay Alumni</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        Showing data for <span className="font-semibold text-neutral-900 dark:text-neutral-100">{period}</span>
                    </div>
                </div>

                {/* Primary KPI Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E3E0] text-[#6B1E28] dark:bg-[#6B1E28]/20 dark:text-[#F7E3E0]">
                            <CalendarCheck className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Bookings</p>
                            <p className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100">148</p>
                            <p className="truncate text-xs text-emerald-600 dark:text-emerald-400">+12% vs last month</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <DollarSign className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Venue Revenue</p>
                            <p className="text-xl font-bold text-emerald-600 sm:text-2xl dark:text-emerald-400">₱1.25M</p>
                            <p className="truncate text-xs text-neutral-400">From paid bookings</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Coffee className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Café Sales</p>
                            <p className="text-xl font-bold text-amber-600 sm:text-2xl dark:text-amber-400">₱348.2K</p>
                            <p className="truncate text-xs text-neutral-400">2,840 coffee & meals</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                            <TrendingUp className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Avg. Utilization</p>
                            <p className="text-xl font-bold text-purple-600 sm:text-2xl dark:text-purple-400">78%</p>
                            <p className="truncate text-xs text-neutral-400">Peak on weekends</p>
                        </div>
                    </div>
                </div>

                {/* Visual Revenue Stream Breakdown Progress */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                            Revenue Stream Distribution
                        </h2>
                        <span className="text-xs font-semibold text-neutral-500">₱1,598,200 Gross</span>
                    </div>

                    <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <div className="h-full bg-[#6B1E28]" style={{ width: '78%' }} title="Venues (78%)" />
                        <div className="h-full bg-amber-500" style={{ width: '18%' }} title="Café (18%)" />
                        <div className="h-full bg-emerald-500" style={{ width: '4%' }} title="Packages & Corkage (4%)" />
                    </div>

                    <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-[#6B1E28]" />
                            <span className="text-neutral-700 dark:text-neutral-300">Venue Rentals: ₱1,250,000 (78%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-amber-500" />
                            <span className="text-neutral-700 dark:text-neutral-300">Café Sales: ₱348,200 (18%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full bg-emerald-500" />
                            <span className="text-neutral-700 dark:text-neutral-300">Packages & Misc: ₱48,000 (4%)</span>
                        </div>
                    </div>
                </div>

                {/* 6 Modular Report Cards Grid */}
                <div>
                    <h2 className="mb-3 font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        Available Report Documents
                    </h2>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {REPORT_CARDS.map((report) => {
                            const IconComponent = report.icon;

                            return (
                                <div
                                    key={report.id}
                                    className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#6B1E28]/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-[#881337]/50"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3">
                                            <div
                                                className="flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                                                style={{ backgroundColor: `${report.color}15`, color: report.color }}
                                            >
                                                <IconComponent className="size-5" />
                                            </div>
                                            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                {report.badgeText}
                                            </span>
                                        </div>

                                        <h3 className="mt-3.5 font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                                            {report.title}
                                        </h3>
                                        <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                                            {report.desc}
                                        </p>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                        <button
                                            type="button"
                                            onClick={() => setPreviewReport(report)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B1E28] hover:underline dark:text-[#F7E3E0]"
                                        >
                                            <Eye className="size-3.5" />
                                            <span>Preview Data</span>
                                        </button>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(report.title, 'PDF')}
                                                className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                                PDF
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDownload(report.title, 'Excel')}
                                                className="rounded-lg border border-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                            >
                                                Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal: Preview Report Details */}
            {previewReport && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setPreviewReport(null)}
                >
                    <div
                        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5 dark:border-neutral-800">
                            <div>
                                <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    {previewReport.title}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Sample audit data preview for {period}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewReport(null)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Preview Table */}
                        <div className="mt-4 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 font-semibold uppercase text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    <tr>
                                        {previewReport.previewData.headers.map((h) => (
                                            <th key={h} className="px-3.5 py-3">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/80 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                    {previewReport.previewData.rows.map((row, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                                        >
                                            {row.map((cell, cidx) => (
                                                <td
                                                    key={cidx}
                                                    className="px-3.5 py-3 text-neutral-800 dark:text-neutral-200"
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-800">
                            <span className="text-xs text-neutral-400">Verified by Balay Alumni System</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDownload(previewReport.title, 'PDF')}
                                    className="inline-flex items-center gap-1 rounded-xl bg-[#6B1E28] px-4 py-2 text-xs font-semibold text-white hover:bg-[#581821] active:scale-95 dark:bg-[#881337]"
                                >
                                    <Download className="size-3.5" />
                                    <span>Download PDF</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewReport(null)}
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

Reports.layout = {
    breadcrumbs: [
        {
            title: 'Reports',
            href: reports(),
        },
    ],
};
