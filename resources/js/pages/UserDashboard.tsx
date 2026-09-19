import { Head } from '@inertiajs/react';
import {
    Building2,
    Coffee,
    Gift,
    Bell,
    CreditCard,
    Sun,
    CloudRain,
    Wind,
    CheckCircle2,
    AlertTriangle,
} from 'lucide-react';

import { dashboard } from '@/routes';

type StatCardProps = {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string;
    note: string;
};

function StatCard({ icon, iconBg, label, value, note }: StatCardProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                {icon}
            </span>
            <div>
                <p className="text-xs font-medium tracking-wide text-neutral-500">{label}</p>
                <p className="text-xl font-semibold text-neutral-900">{value}</p>
                <p className="text-xs text-neutral-400">{note}</p>
            </div>
        </div>
    );
}

type QuickActionProps = {
    icon: React.ReactNode;
    label: string;
};

function QuickAction({ icon, label }: QuickActionProps) {
    return (
        <button className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 py-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
            {icon}
            {label}
        </button>
    );
}

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 bg-white p-6">
                {/* Greeting row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 font-serif text-2xl font-semibold text-[#3A1A1F]">
                            Good morning, Maria! <span>☀️</span>
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">
                            Tuesday, July 16, 2024 · Here is what's happening today.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 rounded-lg bg-[#6B1E28] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5A1821]">
                            <Building2 className="size-4" />
                            Reserve Venue
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
                            <Coffee className="size-4" />
                            Order Coffee
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={<Building2 className="size-5 text-[#6B1E28]" />}
                        iconBg="bg-[#F7E3E0]"
                        label="My Reservations"
                        value="1"
                        note="0 pending"
                    />
                    <StatCard
                        icon={<Coffee className="size-5 text-emerald-600" />}
                        iconBg="bg-emerald-50"
                        label="Active Café Orders"
                        value="1"
                        note="In progress"
                    />
                    <StatCard
                        icon={<Gift className="size-5 text-[#6B1E28]" />}
                        iconBg="bg-[#F7E3E0]"
                        label="Upcoming Events"
                        value="3"
                        note="Next in 6 days"
                    />
                    <StatCard
                        icon={<Bell className="size-5 text-amber-500" />}
                        iconBg="bg-amber-50"
                        label="Notifications"
                        value="3"
                        note="3 unread"
                    />
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Reservations list */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">My Reservations</h2>
                            <a href="#" className="text-sm font-medium text-[#6B1E28] hover:underline">
                                View all
                            </a>
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-lg bg-[#F7E3E0]">
                                    <Building2 className="size-5 text-[#6B1E28]" />
                                </span>
                                <div>
                                    <p className="font-medium text-neutral-900">Garden Terrace</p>
                                    <p className="text-sm text-neutral-500">Jul 22, 2024 · 65 guests</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                                    Approved
                                </span>
                                <p className="mt-1 text-sm text-neutral-500">₱6,500</p>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4">
                        {/* Weather card */}
                        <div className="rounded-xl bg-[#6B1E28] p-5 text-white">
                            <div className="flex items-center justify-between text-xs font-medium tracking-wide text-white/70">
                                <span>Weather · Cebu City</span>
                                <Sun className="size-4" />
                            </div>
                            <p className="mt-2 text-4xl font-semibold">28°C</p>
                            <p className="text-sm text-white/80">Partly Cloudy</p>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="rounded-lg bg-white/10 py-2">
                                    <p>Wed</p>
                                    <Sun className="mx-auto my-1 size-4" />
                                    <p className="font-semibold">30°</p>
                                </div>
                                <div className="rounded-lg bg-white/10 py-2">
                                    <p>Thu</p>
                                    <CloudRain className="mx-auto my-1 size-4" />
                                    <p className="font-semibold">25°</p>
                                </div>
                                <div className="rounded-lg bg-white/10 py-2">
                                    <p>Fri</p>
                                    <Wind className="mx-auto my-1 size-4" />
                                    <p className="font-semibold">27°</p>
                                </div>
                            </div>
                            <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/10 p-2.5 text-xs">
                                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-300" />
                                <span>Rain expected Thu. Consider rescheduling outdoor events.</span>
                            </div>
                        </div>

                        {/* Active café order */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                            <h2 className="font-serif text-base font-semibold text-[#3A1A1F]">Active Café Order</h2>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-lg bg-[#F7E3E0]">
                                    <Coffee className="size-5 text-[#6B1E28]" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        1x Creamy Cappuccino, 1x Butter Croissant
                                    </p>
                                    <p className="text-xs text-neutral-500">C-1047 · ₱200</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs text-neutral-500">
                                <span className="size-2 rounded-full bg-emerald-500" /> Ordered
                                <span className="mx-1 h-px w-6 bg-emerald-500" />
                                <span className="size-2 rounded-full bg-emerald-500" /> Preparing
                                <span className="mx-1 h-px w-6 bg-neutral-200" />
                                <span className="size-2 rounded-full bg-neutral-200" /> Ready
                            </div>
                            <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                <CheckCircle2 className="size-4" />
                                Preparing — est. 5 min
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5">
                            <h2 className="font-serif text-base font-semibold text-[#3A1A1F]">Quick Actions</h2>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <QuickAction icon={<Building2 className="size-5 text-[#6B1E28]" />} label="Reserve Venue" />
                                <QuickAction icon={<Coffee className="size-5 text-emerald-600" />} label="Order Coffee" />
                                <QuickAction icon={<Gift className="size-5 text-[#6B1E28]" />} label="View Events" />
                                <QuickAction icon={<CreditCard className="size-5 text-amber-500" />} label="Payments" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
