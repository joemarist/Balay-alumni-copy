import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    Users,
    Check,
    AlertCircle,
    Calendar,
    Phone,
    Search,
    Sparkles,
} from 'lucide-react';
import { useState, useMemo } from 'react';

type PrepStage = 'Not Started' | 'In Progress' | 'Ready';

interface AssignedEvent {
    id: string;
    bookingId: string;
    eventType: string;
    venue: string;
    date: string;
    startTime: string;
    endTime: string;
    guests: number;
    customer: string;
    phone: string;
    email: string;
    prepStatus: PrepStage;
    organizerNotes: string;
    checklist: { id: number; text: string; done: boolean }[];
}

const INITIAL_ASSIGNED_EVENTS: AssignedEvent[] = [
    {
        id: 'EVT-01',
        bookingId: 'B-2024-091',
        eventType: 'Alumni Reunion & Networking',
        venue: 'Garden Terrace',
        date: '2024-07-22',
        startTime: '2:00 PM',
        endTime: '8:00 PM',
        guests: 65,
        customer: 'Maria Santos',
        phone: '+63 917 123 4567',
        email: 'm.santos@email.ph',
        prepStatus: 'In Progress',
        organizerNotes: 'Requested podium, 2 wireless microphones, and registration table at entrance.',
        checklist: [
            { id: 1, text: 'Arrange 10 round tables & 65 chairs', done: true },
            { id: 2, text: 'Test wireless microphones and audio system', done: true },
            { id: 3, text: 'Pre-cool garden terrace air-conditioned lounge', done: false },
            { id: 4, text: 'Place alumni welcome banner and sign-in sheets', done: false },
        ],
    },
    {
        id: 'EVT-02',
        bookingId: 'B-2024-089',
        eventType: 'Wedding Reception',
        venue: 'Balay Function Hall',
        date: '2024-08-18',
        startTime: '5:00 PM',
        endTime: '11:00 PM',
        guests: 100,
        customer: 'Ana Reyes',
        phone: '+63 919 345 6789',
        email: 'ana.r@email.ph',
        prepStatus: 'Not Started',
        organizerNotes: 'Requires elevated head table, special dance floor clearance, and floral arch clearance.',
        checklist: [
            { id: 1, text: 'Clear center area for dance floor', done: false },
            { id: 2, text: 'Coordinate with external decorator team', done: false },
            { id: 3, text: 'Set up audio-visual projector for montage video', done: false },
            { id: 4, text: 'Reserve front parking spots for bridal car', done: false },
        ],
    },
    {
        id: 'EVT-03',
        bookingId: 'B-2024-085',
        eventType: 'Graduation Celebration Banquet',
        venue: 'Balay Alumni Function Hall',
        date: '2024-07-30',
        startTime: '3:00 PM',
        endTime: '9:00 PM',
        guests: 85,
        customer: 'Lucia Mendoza',
        phone: '+63 923 789 0123',
        email: 'l.mendoza@email.ph',
        prepStatus: 'Ready',
        organizerNotes: 'Sound check scheduled at 1:30 PM. Buffet tables set along the east wall.',
        checklist: [
            { id: 1, text: 'Set up buffet catering warmers and electrical outlets', done: true },
            { id: 2, text: 'Stage lighting and background banner hung', done: true },
            { id: 3, text: 'Sound system tested with playlist', done: true },
            { id: 4, text: 'Air-conditioning operating and temperature stabilized', done: true },
        ],
    },
    {
        id: 'EVT-04',
        bookingId: 'B-2024-088',
        eventType: 'Department Strategic Planning',
        venue: 'Balay Cafe Conference Room',
        date: '2024-06-30',
        startTime: '9:00 AM',
        endTime: '1:00 PM',
        guests: 18,
        customer: 'Marco Lim',
        phone: '+63 920 456 7890',
        email: 'marco.lim@email.ph',
        prepStatus: 'Ready',
        organizerNotes: 'Coffee and snacks served during 10:30 AM break. HDMI cable provided for TV display.',
        checklist: [
            { id: 1, text: 'Connect flat screen TV and test HDMI input', done: true },
            { id: 2, text: '18 executive chairs arranged around conference table', done: true },
            { id: 3, text: 'Whiteboard cleaned and dry markers provided', done: true },
            { id: 4, text: 'Order dispatched to Balay Café for 10:30 AM delivery', done: true },
        ],
    },
];

const STAGES: PrepStage[] = ['Not Started', 'In Progress', 'Ready'];

export default function AssignedEvents() {
    const [eventsList, setEventsList] = useState<AssignedEvent[]>(INITIAL_ASSIGNED_EVENTS);
    const [activeTab, setActiveTab] = useState<'All' | PrepStage>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Metrics
    const stats = useMemo(() => {
        const total = eventsList.length;
        const inProgress = eventsList.filter((e) => e.prepStatus === 'In Progress').length;
        const ready = eventsList.filter((e) => e.prepStatus === 'Ready').length;
        const notStarted = eventsList.filter((e) => e.prepStatus === 'Not Started').length;

        return { total, inProgress, ready, notStarted };
    }, [eventsList]);

    // Advance event prep
    const handleAdvancePrep = (id: string) => {
        setEventsList((prev) =>
            prev.map((evt) => {
                if (evt.id !== id) {
return evt;
}

                const currentIndex = STAGES.indexOf(evt.prepStatus);
                const nextStatus = STAGES[Math.min(currentIndex + 1, STAGES.length - 1)];
                showToast(`${evt.eventType} prep status updated to "${nextStatus}"`);

                return { ...evt, prepStatus: nextStatus };
            }),
        );
    };

    // Toggle checklist item
    const handleToggleChecklist = (eventId: string, itemId: number) => {
        setEventsList((prev) =>
            prev.map((evt) => {
                if (evt.id !== eventId) {
return evt;
}

                const updatedChecklist = evt.checklist.map((item) =>
                    item.id === itemId ? { ...item, done: !item.done } : item,
                );

                return { ...evt, checklist: updatedChecklist };
            }),
        );
    };

    // Filter events
    const filteredEvents = useMemo(() => {
        return eventsList.filter((e) => {
            const matchesTab = activeTab === 'All' || e.prepStatus === activeTab;
            const query = searchQuery.toLowerCase();
            const matchesQuery =
                !query ||
                e.eventType.toLowerCase().includes(query) ||
                e.venue.toLowerCase().includes(query) ||
                e.customer.toLowerCase().includes(query) ||
                e.bookingId.toLowerCase().includes(query);

            return matchesTab && matchesQuery;
        });
    }, [eventsList, activeTab, searchQuery]);

    const getStageBadge = (stage: PrepStage) => {
        switch (stage) {
            case 'Ready':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            case 'In Progress':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
            case 'Not Started':
                return 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700';
        }
    };

    return (
        <>
            <Head title="Assigned Events (Staff)" />

            <div className="flex flex-1 flex-col gap-6 bg-white p-4 sm:p-6 dark:bg-neutral-950">
                {/* Notification toast */}
                {toastMessage && (
                    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#6B1E28] px-4 py-3 text-sm font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-5 dark:bg-[#881337]">
                        <Check className="size-4 shrink-0 text-white" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#3A1A1F] sm:text-3xl dark:text-neutral-100">
                            Assigned Events & Coordination
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Staff task briefing, preparation workflow, venue setup, and day-of execution.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                            Staff Member on Duty
                        </span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F7E3E0] text-[#6B1E28] dark:bg-[#6B1E28]/20 dark:text-[#F7E3E0]">
                            <CalendarDays className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Assigned Events</p>
                            <p className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100">
                                {stats.total}
                            </p>
                            <p className="text-xs text-neutral-400">Active roster</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <Clock className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">In Prep</p>
                            <p className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
                                {stats.inProgress}
                            </p>
                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Staff working</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Ready for Event</p>
                            <p className="text-xl font-bold text-emerald-600 sm:text-2xl dark:text-emerald-400">
                                {stats.ready}
                            </p>
                            <p className="text-xs text-neutral-400">Venue cleared</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                            <AlertCircle className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Not Started</p>
                            <p className="text-xl font-bold text-neutral-900 sm:text-2xl dark:text-neutral-100">
                                {stats.notStarted}
                            </p>
                            <p className="text-xs text-neutral-400">Upcoming queue</p>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {(['All', 'Not Started', 'In Progress', 'Ready'] as const).map((stage) => (
                            <button
                                key={stage}
                                type="button"
                                onClick={() => setActiveTab(stage)}
                                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                    activeTab === stage
                                        ? 'bg-[#6B1E28] text-white shadow-sm dark:bg-[#881337]'
                                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                                }`}
                            >
                                {stage}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[200px] flex-1 sm:w-64">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search event, venue, customer..."
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-3.5 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:placeholder:text-neutral-500"
                        />
                    </div>
                </div>

                {/* Event Assignment Cards */}
                <div className="space-y-4">
                    {filteredEvents.length === 0 ? (
                        <div className="rounded-2xl border border-neutral-200/80 bg-white py-16 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <CalendarDays className="mx-auto mb-2 size-8 text-neutral-300 dark:text-neutral-600" />
                            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                No assigned events match this filter.
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map((event) => {
                            const currentStageIndex = STAGES.indexOf(event.prepStatus);

                            return (
                                <div
                                    key={event.id}
                                    className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#6B1E28]/30 dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col justify-between gap-3 border-b border-neutral-100 pb-4 sm:flex-row sm:items-start dark:border-neutral-800">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-[#6B1E28] dark:text-[#F7E3E0]">
                                                    {event.bookingId}
                                                </span>
                                                <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                                    {event.eventType}
                                                </h3>
                                            </div>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="size-3.5 text-neutral-400" />
                                                    {event.venue}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3.5 text-neutral-400" />
                                                    {event.date} · {event.startTime} - {event.endTime}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="size-3.5 text-neutral-400" />
                                                    {event.guests} pax
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStageBadge(
                                                    event.prepStatus,
                                                )}`}
                                            >
                                                {event.prepStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3-Stage Stepper Progress Bar */}
                                    <div className="my-4">
                                        <div className="flex items-center justify-between">
                                            {STAGES.map((stage, idx) => {
                                                const isDone = currentStageIndex >= idx;
                                                const isCurrent = currentStageIndex === idx;

                                                return (
                                                    <div key={stage} className="flex flex-1 items-center">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                                                    isDone
                                                                        ? 'bg-[#6B1E28] text-white dark:bg-[#881337]'
                                                                        : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800'
                                                                }`}
                                                            >
                                                                {isDone ? <Check className="size-3.5" /> : idx + 1}
                                                            </div>
                                                            <span
                                                                className={`text-xs font-semibold ${
                                                                    isCurrent
                                                                        ? 'text-[#6B1E28] dark:text-[#F7E3E0]'
                                                                        : isDone
                                                                        ? 'text-neutral-700 dark:text-neutral-300'
                                                                        : 'text-neutral-400'
                                                                }`}
                                                            >
                                                                {stage}
                                                            </span>
                                                        </div>

                                                        {idx < STAGES.length - 1 && (
                                                            <div
                                                                className={`mx-3 h-0.5 flex-1 rounded transition-colors ${
                                                                    currentStageIndex > idx
                                                                        ? 'bg-[#6B1E28] dark:bg-[#881337]'
                                                                        : 'bg-neutral-200 dark:bg-neutral-800'
                                                                }`}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Coordinator Details & Checklist */}
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                        {/* Left: Client Notes & Details */}
                                        <div className="space-y-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                                    Client & Special Requests
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="size-3" />
                                                        {event.phone}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                                                <p className="font-semibold">Organizer Instructions:</p>
                                                <p className="mt-0.5 leading-relaxed">{event.organizerNotes}</p>
                                            </div>
                                        </div>

                                        {/* Right: Staff Setup Checklist */}
                                        <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                                    Staff Preparation Checklist
                                                </h4>
                                                <span className="text-[11px] font-semibold text-neutral-500">
                                                    {event.checklist.filter((c) => c.done).length} of{' '}
                                                    {event.checklist.length} Completed
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {event.checklist.map((item) => (
                                                    <label
                                                        key={item.id}
                                                        className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={item.done}
                                                            onChange={() => handleToggleChecklist(event.id, item.id)}
                                                            className="mt-0.5 size-4 rounded border-neutral-300 text-[#6B1E28] focus:ring-[#6B1E28] dark:border-neutral-700 dark:bg-neutral-800"
                                                        />
                                                        <span
                                                            className={`text-xs ${
                                                                item.done
                                                                    ? 'text-neutral-400 line-through dark:text-neutral-500'
                                                                    : 'font-medium text-neutral-800 dark:text-neutral-200'
                                                            }`}
                                                        >
                                                            {item.text}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                        <p className="text-xs text-neutral-400">
                                            Assigned Coordinator: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{event.customer} (Host)</span>
                                        </p>

                                        <div>
                                            {event.prepStatus !== 'Ready' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAdvancePrep(event.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#6B1E28] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#581821] active:scale-95 dark:bg-[#881337]"
                                                >
                                                    <Sparkles className="size-3.5" />
                                                    <span>
                                                        {event.prepStatus === 'Not Started'
                                                            ? 'Start Event Prep'
                                                            : 'Mark Venue Ready'}
                                                    </span>
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle2 className="size-4" />
                                                    <span>Ready for Event Start</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}

AssignedEvents.layout = {
    breadcrumbs: [
        {
            title: 'Assigned Events',
            href: '/assigned-events',
        },
    ],
};
