import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle,
    ClipboardCheck,
    Coffee,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { dashboard as staffDashboard } from '@/routes/staff';

type Order = {
    code: string;
    customer: string;
    quantity: number;
    status: 'Ordered' | 'Preparing' | 'Ready';
};

type Event = {
    title: string;
    location: string;
    schedule: string;
    status: 'Not Started' | 'In Progress' | 'Completed';
};

const orders: Order[] = [
    {
        code: 'C-1047',
        customer: 'Maria Santos',
        quantity: 2,
        status: 'Preparing',
    },
    {
        code: 'C-1046',
        customer: 'Juan Dela Cruz',
        quantity: 2,
        status: 'Ordered',
    },
    {
        code: 'C-1045',
        customer: 'Ana Reyes',
        quantity: 2,
        status: 'Ready',
    },
];

const events: Event[] = [
    {
        title: 'Alumni Reunion',
        location: 'Garden Terrace',
        schedule: 'Jul 22, 2024',
        status: 'Not Started',
    },
    {
        title: 'Wedding Reception',
        location: 'Grand Ballroom',
        schedule: 'Aug 18, 2024',
        status: 'Not Started',
    },
    {
        title: 'Graduation Party',
        location: 'Garden Terrace',
        schedule: 'Jul 30, 2024',
        status: 'Not Started',
    },
    {
        title: 'Product Launch',
        location: 'Conference Hall A',
        schedule: 'Aug 10, 2024',
        status: 'Not Started',
    },
];

const orderBadge: Record<Order['status'], string> = {
    Ordered: 'bg-amber-50 text-amber-600',
    Preparing: 'bg-blue-50 text-blue-600',
    Ready: 'bg-emerald-50 text-emerald-600',
};

const eventBadge: Record<Event['status'], string> = {
    'Not Started': 'bg-amber-50 text-amber-600',
    'In Progress': 'bg-blue-50 text-blue-600',
    Completed: 'bg-emerald-50 text-emerald-600',
};

function SummaryCard({
    icon,
    iconStyle,
    title,
    amount,
    description,
}: {
    icon: ReactNode;
    iconStyle: string;
    title: string;
    amount: number;
    description: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4">
            <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
            >
                {icon}
            </div>

            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {title}
                </p>

                <p className="text-xl font-semibold text-neutral-900">
                    {amount}
                </p>

                <p className="text-xs text-neutral-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

function StatusLabel({
    status,
    className,
}: {
    status: string;
    className: string;
}) {
    return (
        <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${className}`}
        >
            {status}
        </span>
    );
}

function SectionHeader({
    title,
    link,
}: {
    title: string;
    link: string;
}) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#3A1A1F]">
                {title}
            </h2>

            <a
                href={link}
                className="text-sm font-medium text-[#6B1E28] hover:underline"
            >
                View all
            </a>
        </div>
    );
}

export default function StaffDashboard() {
    const activeOrders = orders.filter(
        ({ status }) => status === 'Ordered' || status === 'Preparing',
    ).length;

    const readyOrders = orders.filter(
        ({ status }) => status === 'Ready',
    ).length;

    const totalEvents = events.length;

    const unfinishedEvents = events.filter(
        ({ status }) => status !== 'Completed',
    ).length;

    return (
        <>
            <Head title="Staff Dashboard" />

            <main className="flex flex-1 flex-col gap-5 bg-white p-6">
                {/* Dashboard Summary */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon={<Coffee className="size-5 text-amber-500" />}
                        iconStyle="bg-amber-50"
                        title="Active Orders"
                        amount={activeOrders}
                        description="In the queue"
                    />

                    <SummaryCard
                        icon={
                            <CheckCircle className="size-5 text-emerald-600" />
                        }
                        iconStyle="bg-emerald-50"
                        title="Ready for Pickup"
                        amount={readyOrders}
                        description="Awaiting customer"
                    />

                    <SummaryCard
                        icon={
                            <CalendarDays className="size-5 text-[#6B1E28]" />
                        }
                        iconStyle="bg-[#F7E3E0]"
                        title="Assigned Events"
                        amount={totalEvents}
                        description="Approved bookings"
                    />

                    <SummaryCard
                        icon={
                            <ClipboardCheck className="size-5 text-[#6B1E28]" />
                        }
                        iconStyle="bg-[#F7E3E0]"
                        title="Events to Prep"
                        amount={unfinishedEvents}
                        description="Not yet ready"
                    />
                </section>

                {/* Dashboard Details */}
                <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Café Queue */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <SectionHeader
                            title="Café Queue"
                            link="/staff-cafe"
                        />

                        <div className="mt-4 divide-y divide-neutral-100">
                            {orders.map((order) => (
                                <div
                                    key={order.code}
                                    className="flex items-center justify-between gap-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">
                                            {order.code}
                                        </p>

                                        <p className="text-sm text-neutral-500">
                                            {order.customer} · {order.quantity}{' '}
                                            item(s)
                                        </p>
                                    </div>

                                    <StatusLabel
                                        status={order.status}
                                        className={orderBadge[order.status]}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Assigned Events */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5">
                        <SectionHeader
                            title="Assigned Events"
                            link="/scheduling"
                        />

                        <div className="mt-4 divide-y divide-neutral-100">
                            {events.map((event) => (
                                <div
                                    key={`${event.title}-${event.schedule}`}
                                    className="flex items-center justify-between gap-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-900">
                                            {event.title}
                                        </p>

                                        <p className="text-sm text-neutral-500">
                                            {event.location} · {event.schedule}
                                        </p>
                                    </div>

                                    <StatusLabel
                                        status={event.status}
                                        className={eventBadge[event.status]}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

StaffDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: staffDashboard(),
        },
    ],
};