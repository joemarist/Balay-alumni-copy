import { Head } from '@inertiajs/react';
import React, { useState, useMemo, createContext, useContext} from 'react';

// ─── INLINE SVG ICONS ───────────────────────────────────────────────────────
const IconCalendar = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconCheck = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconBan = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const IconClock = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLeft = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconRight = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const IconPlus = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconX = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconSearch = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconUsers = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconHistory = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline><polyline points="12 7 12 12 15 15"></polyline></svg>;
const IconMapPin = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconEdit = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconTrash = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const IconMenu = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// ─── TYPES & UTILS ──────────────────────────────────────────────────────────
type ViewMode = 'week' | 'month';
type StatusType = 'Booked' | 'Pending' | 'Blocked';

interface Venue { id: string; name: string; capacity: number; tags: string[]; enabled: boolean; }
interface Reservation { id: string; venueId: string; date: string; startTime: string; endTime: string; status: 'Booked' | 'Pending'; eventName: string; clientName: string; amount: number; paid: boolean; }
interface Block { id: string; venueId: string; date: string; reason: string; }
interface AuditLog { id: string; timestamp: string; user: string; action: string; details: string; }
interface ToastMessage { id: number; message: string; type: 'success' | 'error' | 'info'; }

const cn = (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(" ");
const formatDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${y}-${m}-${day}`;
};

const getShortVenueName = (name: string) => {
    if (name.includes('Function Hall')) {
return 'Function Hall';
}

    if (name.includes('Conference Room')) {
return 'Conference Room';
}

    if (name.includes('Whole Area')) {
return 'Whole Area';
}

    return name;
};

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_VENUES: Venue[] = [
    { id: 'v1', name: 'Balay Alumni Function Hall', capacity: 100, tags: ['Hall', 'AC'], enabled: true },
    { id: 'v2', name: 'Balay Cafe Conference Room', capacity: 20, tags: ['Meeting', 'AC'], enabled: true },
    { id: 'v3', name: 'Whole Area of Balay Alumni', capacity: 200, tags: ['Outdoor', 'Event'], enabled: true },
];

const MOCK_RESERVATIONS: Reservation[] = [
    { id: 'r1', venueId: 'v1', date: '2026-09-07', startTime: '08:00', endTime: '10:00', status: 'Booked', eventName: 'Corporate Summit', clientName: 'Tech Corp', amount: 15000, paid: true },
    { id: 'r2', venueId: 'v2', date: '2026-09-07', startTime: '10:30', endTime: '12:00', status: 'Booked', eventName: 'Board Meeting', clientName: 'Acme Inc', amount: 3000, paid: true },
    { id: 'r3', venueId: 'v1', date: '2026-09-07', startTime: '13:00', endTime: '15:00', status: 'Pending', eventName: 'Client Presentation', clientName: 'Global Co', amount: 5000, paid: false },
    { id: 'r4', venueId: 'v2', date: '2026-09-07', startTime: '15:30', endTime: '17:00', status: 'Pending', eventName: 'Team Meeting', clientName: 'Internal', amount: 0, paid: true },
    { id: 'r5', venueId: 'v3', date: '2026-09-07', startTime: '18:00', endTime: '22:00', status: 'Booked', eventName: 'Company Anniversary', clientName: 'Tech Corp', amount: 30000, paid: true },
    { id: 'r6', venueId: 'v1', date: '2026-09-08', startTime: '09:00', endTime: '11:00', status: 'Booked', eventName: 'Workshop', clientName: 'EduGroup', amount: 8000, paid: true },
    { id: 'r7', venueId: 'v2', date: '2026-09-08', startTime: '14:00', endTime: '16:00', status: 'Pending', eventName: 'Consultation', clientName: 'Private', amount: 2000, paid: false },
    { id: 'r8', venueId: 'v1', date: '2026-09-09', startTime: '10:00', endTime: '12:00', status: 'Booked', eventName: 'Product Launch', clientName: 'StartupX', amount: 12000, paid: true },
    { id: 'r9', venueId: 'v2', date: '2026-09-09', startTime: '10:00', endTime: '12:00', status: 'Booked', eventName: 'Interviews', clientName: 'HR Dept', amount: 0, paid: true },
    { id: 'r10', venueId: 'v3', date: '2026-09-09', startTime: '18:00', endTime: '23:00', status: 'Pending', eventName: 'Alumni Mixer', clientName: 'Assoc', amount: 25000, paid: false },
    { id: 'r11', venueId: 'v1', date: '2026-09-10', startTime: '08:00', endTime: '10:00', status: 'Booked', eventName: 'Morning Seminar', clientName: 'Gov', amount: 10000, paid: true },
    { id: 'r12', venueId: 'v1', date: '2026-09-10', startTime: '11:00', endTime: '13:00', status: 'Booked', eventName: 'Client Meeting', clientName: 'Gov', amount: 5000, paid: true },
    { id: 'r13', venueId: 'v1', date: '2026-09-10', startTime: '14:00', endTime: '17:00', status: 'Booked', eventName: 'Training Workshop', clientName: 'Gov', amount: 15000, paid: true },
    { id: 'r14', venueId: 'v3', date: '2026-09-11', startTime: '16:00', endTime: '20:00', status: 'Booked', eventName: 'Wedding Prep', clientName: 'Couple', amount: 10000, paid: true },
    { id: 'r15', venueId: 'v1', date: '2026-09-11', startTime: '18:00', endTime: '22:00', status: 'Pending', eventName: 'Rehearsal Dinner', clientName: 'Couple', amount: 12000, paid: false },
    { id: 'r16', venueId: 'v1', date: '2026-09-13', startTime: '09:00', endTime: '15:00', status: 'Booked', eventName: 'Sunday Service', clientName: 'Church', amount: 8000, paid: true },
    { id: 'r17', venueId: 'v2', date: '2026-09-13', startTime: '10:00', endTime: '12:00', status: 'Pending', eventName: 'Committee Meeting', clientName: 'Church', amount: 0, paid: false },
];

const MOCK_BLOCKS: Block[] = [
    { id: 'b1', venueId: 'v3', date: '2026-09-08', reason: 'Maintenance' },
    { id: 'b2', venueId: 'v2', date: '2026-09-12', reason: 'Deep Cleaning' },
];

// ─── CONTEXT ────────────────────────────────────────────────────────────────
const SchedulingContext = createContext<any>(null);
function useScheduling() {
 return useContext(SchedulingContext); 
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function Scheduling() {
    const [venues, setVenues] = useState<Venue[]>(MOCK_VENUES);
    const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    const [blocks, setBlocks] = useState<Block[]>(MOCK_BLOCKS);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    const [currentDate, setCurrentDate] = useState(new Date('2026-09-07T00:00:00'));
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<StatusType | 'All'>('All');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const [selectedMobileDate, setSelectedMobileDate] = useState<string>(formatDateStr(new Date('2026-09-07')));
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
    const [selectedDayDetails, setSelectedDayDetails] = useState<{ dateStr: string, venueId?: string } | null>(null);
    const [quickAddData, setQuickAddData] = useState<{ venueId: string | null, date: string } | null>(null);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [showAddVenueModal, setShowAddVenueModal] = useState(false);


    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...(prev ?? []), { id, message, type }]);
        setTimeout(() => setToasts(prev => (prev ?? []).filter(t => t.id !== id)), 4000);
    };

    const logAudit = (action: string, details: string) => {
        setAuditLogs(prev => [{ id: Math.random().toString(), timestamp: new Date().toISOString(), user: 'Admin', action, details }, ...(prev ?? [])]);
    };

    const weekDates = useMemo(() => {
        const dates = [];
        const start = new Date(currentDate);
        const day = start.getDay();
        start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));

        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d);
        }

        return dates;
    }, [currentDate]);

    const handleJumpToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedMobileDate(formatDateStr(today));
    };

    const handlePrev = () => {
        const d = new Date(currentDate);

        if (viewMode === 'week') {
            d.setDate(d.getDate() - 7);
        } else {
            d.setMonth(d.getMonth() - 1);
        }

        setCurrentDate(d);

        if (viewMode === 'week') {
            const day = d.getDay();
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - day + (day === 0 ? -6 : 1));

            setSelectedMobileDate(formatDateStr(weekStart));
        }
    };
    const handleNext = () => {
        const d = new Date(currentDate);

        if (viewMode === 'week') {
            d.setDate(d.getDate() + 7);
        } else {
            d.setMonth(d.getMonth() + 1);
        }

        setCurrentDate(d);

        if (viewMode === 'week') {
            const day = d.getDay();
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - day + (day === 0 ? -6 : 1));

            setSelectedMobileDate(formatDateStr(weekStart));
        }
    };

    const toggleVenue = (id: string) => {
        setVenues(prev => (prev ?? []).map(v => {
            if (v.id === id) {
                logAudit(v.enabled ? 'Disabled Venue' : 'Enabled Venue', v.name);

                return { ...v, enabled: !v.enabled };
            }

            return v;
        }));
    };

    // Pre-group data by date to optimize rendering
    const reservationsByDate = useMemo(() => {
        const map = new Map<string, Reservation[]>();
        reservations.forEach(r => {
            if (!map.has(r.date)) {
map.set(r.date, []);
}

            map.get(r.date)!.push(r);
        });

        return map;
    }, [reservations]);

    const blocksByDate = useMemo(() => {
        const map = new Map<string, Block[]>();
        blocks.forEach(b => {
            if (!map.has(b.date)) {
map.set(b.date, []);
}

            map.get(b.date)!.push(b);
        });

        return map;
    }, [blocks]);

    const handleCellToggle = (venueId: string, dateStr: string) => {
        const venue = (venues ?? []).find(v => v.id === venueId);

        if (!venue?.enabled) {
return showToast('Venue is disabled for bookings.', 'error');
}

        const isBooked = (reservationsByDate.get(dateStr) ?? []).find(r => r.venueId === venueId);

        if (isBooked) {
return showToast('Cannot block a date with active reservations.', 'error');
}

        const existingBlock = (blocksByDate.get(dateStr) ?? []).find(b => b.venueId === venueId);

        if (existingBlock) {
            setBlocks(prev => (prev ?? []).filter(b => b.id !== existingBlock.id));
            logAudit('Unblocked Date', `${venue.name} on ${dateStr}`);
            showToast('Date unblocked successfully.', 'success');
        } else {
            const newBlock: Block = { id: Math.random().toString(), venueId, date: dateStr, reason: 'Quick Block' };
            setBlocks(prev => [...(prev ?? []), newBlock]);
            logAudit('Blocked Date', `${venue.name} on ${dateStr}`);
            showToast('Date blocked successfully.', 'success');
        }
    };

    const hasConflict = (venueId: string, date: string, start: string, end: string, excludeId?: string) => {
        const dayRes = reservationsByDate.get(date) ?? [];

        return dayRes.some(r => {
            if (r.venueId !== venueId) {
return false;
}

            if (excludeId && r.id === excludeId) {
return false;
}

            return start < r.endTime && r.startTime < end;
        });
    };

    return (
        <SchedulingContext.Provider value={{
            venues, setVenues, reservations, setReservations, blocks, setBlocks,
            reservationsByDate, blocksByDate,
            viewMode, activeFilter, setActiveFilter, searchQuery, setSearchQuery,
            weekDates, currentDate, setCurrentDate, logAudit, showToast, toggleVenue, handleCellToggle, hasConflict,
            setSelectedRes, setQuickAddData, setShowBlockModal, setViewMode,
            selectedMobileDate, setSelectedMobileDate,
            selectedDayDetails, setSelectedDayDetails
        }}>
            <Head title="Scheduling" />
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4 sm:px-0">
                {(toasts ?? []).map(t => (
                    <div key={t.id} className={cn(
                        "px-4 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 pointer-events-auto transition-all animate-in slide-in-from-top-2 border",
                        t.type === 'error' ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900" :
                            t.type === 'success' ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900" :
                                "bg-white text-gray-900 border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-700"
                    )}>
                        {t.type === 'error' ? <IconBan className="w-4 h-4 flex-shrink-0" /> : <IconCheck className="w-4 h-4 flex-shrink-0" />}
                        {t.message}
                    </div>
                ))}
            </div>

            <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-slate-200 font-sans selection:bg-[#7D1933] selection:text-white min-w-0 w-full">
                <header className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-800 p-4 md:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0 min-w-0 w-full">
                    <div className="min-w-0 flex-1 w-full mb-1 sm:mb-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate w-full">Scheduling & Availability</h1>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate w-full">Manage venue capacity and event conflicts</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto flex-shrink-0">
                        <button onClick={() => setShowAuditModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 min-h-[44px] bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-gray-200 dark:border-slate-700 min-w-0">
                            <IconHistory className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Audit Log</span>
                        </button>
                        <button onClick={() => setShowBlockModal(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 min-h-[44px] bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-sm font-bold transition-all shadow-sm min-w-0">
                            <IconBan className="w-4 h-4 flex-shrink-0" /> <span className="truncate">Bulk Block</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0 w-full">
                    <div className="lg:hidden bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-800 p-4 flex flex-col gap-4 flex-shrink-0 z-10 w-full min-w-0">
                        <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-bold text-gray-900 dark:text-slate-200 min-h-[44px] min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <IconMenu className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="truncate">Venues ({(venues ?? []).length})</span>
                            </div>
                            <IconLeft className={cn("w-4 h-4 transition-transform text-gray-400 flex-shrink-0", mobileSidebarOpen ? "-rotate-90" : "rotate-180")} />
                        </button>
                        {mobileSidebarOpen && (
                            <div className="max-h-[50vh] overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col min-w-0">
                                <SidebarContent onAddVenue={() => setShowAddVenueModal(true)} />
                            </div>
                        )}
                    </div>

                    <aside className="hidden lg:flex w-64 bg-white dark:bg-[#0F172A] border-r border-gray-200 dark:border-slate-800 flex-col flex-shrink-0 h-full z-20 overflow-hidden min-w-0">
                        <SidebarContent onAddVenue={() => setShowAddVenueModal(true)} />
                    </aside>

                    <main className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
                        <div className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-800 p-4 md:px-6 flex flex-col lg:flex-row justify-between gap-4 flex-shrink-0 min-w-0 w-full">

                            {/* Mobile/Tablet Toolbar (<=1023px) */}
                            <div className="flex lg:hidden flex-col gap-3 w-full min-w-0">
                                <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-1 w-full min-w-0">
                                    <button onClick={handlePrev} className="p-2 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center min-w-[40px] flex-shrink-0"><IconLeft className="w-4 h-4" /></button>
                                    <div className="flex-1 text-center font-semibold text-xs sm:text-sm px-2 text-gray-900 dark:text-slate-200 select-none truncate min-w-0">
                                        {viewMode === 'week'
                                            ? `${weekDates[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
                                            : currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                                    </div>
                                    <button onClick={handleNext} className="p-2 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center min-w-[40px] flex-shrink-0"><IconRight className="w-4 h-4" /></button>
                                </div>
                                <div className="flex gap-2 w-full min-w-0">
                                    <button onClick={handleJumpToday} className="flex-1 px-2 py-2 min-h-[44px] text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl transition-colors border border-gray-200 dark:border-slate-700 truncate">Today</button>
                                    <div className="flex flex-1 bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-700 min-w-0">
                                        <button onClick={() => setViewMode('week')} className={cn("flex-1 px-2 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all truncate", viewMode === 'week' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Week</button>
                                        <button onClick={() => setViewMode('month')} className={cn("flex-1 px-2 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all truncate", viewMode === 'month' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Month</button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full min-w-0">
                                    <TopStatsContent />
                                </div>
                            </div>

                            {/* Desktop Toolbar (>=1024px) */}
                            <div className="hidden lg:flex flex-wrap items-center gap-4 w-full justify-between min-w-0">
                                <div className="flex flex-wrap items-center gap-4 min-w-0">
                                    <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-1 flex-shrink-0">
                                        <button onClick={handlePrev} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors"><IconLeft className="w-4 h-4" /></button>
                                        <div className="font-semibold text-sm px-4 text-gray-900 dark:text-slate-200 select-none whitespace-nowrap">
                                            {viewMode === 'week'
                                                ? `${weekDates[0].toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
                                                : currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <button onClick={handleNext} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors"><IconRight className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={handleJumpToday} className="px-4 py-2 min-h-[36px] text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl transition-colors border border-gray-200 dark:border-slate-700 whitespace-nowrap flex-shrink-0">Today</button>

                                    <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-700 flex-shrink-0">
                                        <button onClick={() => setViewMode('week')} className={cn("px-4 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all", viewMode === 'week' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Week</button>
                                        <button onClick={() => setViewMode('month')} className={cn("px-4 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all", viewMode === 'month' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Month</button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 min-w-0">
                                    <TopStatsContent />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden p-4 lg:p-6 bg-gray-50 dark:bg-[#0B1120] flex flex-col min-w-0">
                            <div className="hidden lg:flex flex-col h-full w-full overflow-hidden min-w-0">
                                {viewMode === 'week' ? <DesktopWeekGrid /> : <DesktopMonthGrid />}
                            </div>
                            <div className="flex lg:hidden flex-col h-full w-full overflow-hidden min-w-0">
                                {viewMode === 'week' ? <MobileAgenda /> : <MobileMonthGrid />}
                            </div>
                        </div>
                    </main>
                </div>

                {selectedRes && <ReservationDetailModal res={selectedRes} onClose={() => setSelectedRes(null)} />}
                {selectedDayDetails && <DayReservationsModal dateStr={selectedDayDetails.dateStr} venueId={selectedDayDetails.venueId} onClose={() => setSelectedDayDetails(null)} />}
                {quickAddData && <QuickAddModal data={quickAddData} onClose={() => setQuickAddData(null)} />}
                {showBlockModal && <BlockDatesModal onClose={() => setShowBlockModal(false)} />}
                {showAuditModal && <AuditModal logs={auditLogs} onClose={() => setShowAuditModal(false)} />}
                {showAddVenueModal && <AddVenueModal onClose={() => setShowAddVenueModal(false)} />}
            </div>
        </SchedulingContext.Provider>
    );
}

// ─── REUSABLE SCROLL CONTAINER WITH FADE EDGES ──────────────────────────────


// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function SidebarContent({ onAddVenue }: { onAddVenue: () => void }) {
    const { venues, toggleVenue, searchQuery, setSearchQuery } = useScheduling();

    return (
        <div className="flex flex-col h-full w-full bg-white dark:bg-[#0F172A] overflow-hidden min-w-0">
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-[#0F172A] z-10 space-y-4 min-w-0">
                <div className="relative min-w-0 w-full">
                    <IconSearch className="absolute left-3 top-3 text-gray-400 dark:text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search venues..."
                        className="w-full pl-9 pr-4 py-2.5 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-1 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all text-gray-900 dark:text-slate-200 placeholder-gray-500 dark:placeholder-slate-500"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <button onClick={onAddVenue} className="w-full py-2.5 min-h-[44px] flex items-center justify-center gap-2 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-bold text-gray-500 dark:text-slate-400 hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex-shrink-0">
                    <IconPlus className="w-4 h-4" /> Add Venue
                </button>
            </div>
            <div className="p-2 sm:p-3 space-y-1 flex-1 overflow-y-auto hide-scrollbar min-w-0">
                <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-500 mb-3 mt-2 truncate">Venues ({(venues ?? []).length})</p>
                {(venues ?? []).filter((v: Venue) => v.name.toLowerCase().includes(searchQuery.toLowerCase())).map((venue: Venue) => (
                    <div key={venue.id} className="group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700 flex flex-col gap-2 cursor-pointer min-w-0 w-full">
                        <div className="flex justify-between items-start min-w-0 gap-2 w-full">
                            <div className="min-w-0 flex-1 w-full">
                                <h3 className="font-bold text-sm text-gray-900 dark:text-slate-200 leading-tight truncate w-full">{venue.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium truncate w-full">
                                    <IconUsers className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{venue.capacity} pax max</span>
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
 e.stopPropagation(); toggleVenue(venue.id); 
}}
                                className={cn("relative inline-flex min-h-[24px] w-10 items-center rounded-full transition-all duration-200 ease-in-out focus:outline-none flex-shrink-0 shadow-inner", venue.enabled ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-gray-300 dark:bg-slate-700')}
                            >
                                <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 shadow-sm", venue.enabled ? 'translate-x-5' : 'translate-x-1')} />
                            </button>
                        </div>
                        <div className="flex gap-1.5 flex-wrap mt-1 min-w-0">
                            {(venue.tags ?? []).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-[9px] font-bold tracking-wider uppercase text-gray-500 dark:text-slate-400 truncate max-w-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TopStatsContent() {
    const { reservationsByDate, blocksByDate, activeFilter, setActiveFilter, weekDates, viewMode, currentDate } = useScheduling();

    const stats = useMemo(() => {
        const relevantRes: Reservation[] = [];
        const relevantBlocks: Block[] = [];

        if (viewMode === 'week') {
            (weekDates ?? []).forEach((d: Date) => {
                const dateStr = formatDateStr(d);
                relevantRes.push(...(reservationsByDate.get(dateStr) ?? []));
                relevantBlocks.push(...(blocksByDate.get(dateStr) ?? []));
            });
        } else {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                const dateStr = formatDateStr(new Date(year, month, i));
                relevantRes.push(...(reservationsByDate.get(dateStr) ?? []));
                relevantBlocks.push(...(blocksByDate.get(dateStr) ?? []));
            }
        }

        const bookedCount = relevantRes.filter((r: Reservation) => r.status === 'Booked').length;
        const pendingCount = relevantRes.filter((r: Reservation) => r.status === 'Pending').length;

        return { bookedCount, pendingCount };
    }, [reservationsByDate, blocksByDate, weekDates, viewMode, currentDate]);

    const statCards = [
        { id: 'All', label: 'All', count: '—', base: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700', active: 'ring-2 ring-gray-400 border-gray-400 bg-gray-200 dark:bg-slate-700 dark:ring-slate-400 dark:border-slate-400' },
        { id: 'Booked', label: 'Confirmed', count: stats.bookedCount, base: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30', active: 'ring-2 ring-rose-500 border-rose-500 bg-rose-100 dark:bg-rose-900/40 dark:ring-rose-400 dark:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]' },
        { id: 'Pending', label: 'Pending', count: stats.pendingCount, base: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30', active: 'ring-2 ring-amber-500 border-amber-500 bg-amber-100 dark:bg-amber-900/40 dark:ring-amber-400 dark:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
    ];

    return (
        <>
            {statCards.map(stat => {
                const isActive = activeFilter === stat.id;

                return (
                    <button
                        key={stat.id}
                        onClick={() => setActiveFilter(isActive ? 'All' : stat.id as StatusType)}
                        className={cn(
                            "flex items-center px-4 min-h-[44px] rounded-xl border transition-all cursor-pointer whitespace-nowrap justify-center flex-1 lg:flex-none min-w-0",
                            isActive ? `${stat.active} scale-[1.02] z-10` : `${stat.base} hover:brightness-95 dark:hover:brightness-125 opacity-80`
                        )}
                    >
                        <span className="font-bold text-base md:text-lg mr-2 flex-shrink-0">{stat.count}</span>
                        <span className="text-[10px] uppercase tracking-wider font-bold opacity-90 truncate">{stat.label}</span>
                    </button>
                );
            })}
        </>
    );
}

function DesktopWeekGrid() {
    const { venues, weekDates, reservationsByDate, blocksByDate, activeFilter, setSelectedDayDetails, setQuickAddData, handleCellToggle } = useScheduling();

    return (
        <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col h-full w-full min-w-0">
            <div className="overflow-y-auto flex-1 hide-scrollbar bg-gray-100 dark:bg-slate-800 gap-[1px] flex flex-col relative min-w-0 w-full">

                <div className="grid w-full text-sm sticky top-0 z-30 bg-white dark:bg-[#0F172A] shadow-sm dark:shadow-md border-b border-gray-200 dark:border-slate-800 gap-[1px] min-w-0" style={{ gridTemplateColumns: 'minmax(80px, 1.2fr) repeat(7, minmax(0, 1fr))' }}>
                    <div className="bg-gray-50 dark:bg-[#1E293B] p-2 lg:p-4 text-left font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest text-[10px] truncate min-w-0">
                        Venue
                    </div>
                    {(weekDates ?? []).map((date: Date) => (
                        <div key={date.toISOString()} className="bg-gray-50 dark:bg-[#1E293B] p-2 lg:p-4 text-center overflow-hidden flex flex-col items-center justify-center min-w-0">
                            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest hidden lg:block truncate w-full">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest lg:hidden truncate w-full">{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</p>
                            <p className="text-sm lg:text-lg font-extrabold text-gray-900 dark:text-white mt-0.5 truncate w-full">{date.getDate()}</p>
                        </div>
                    ))}
                </div>

                {(venues ?? []).map((venue: Venue) => (
                    <div key={venue.id} className="grid w-full group gap-[1px] min-w-0 border-b border-gray-100 dark:border-slate-800/50 last:border-0" style={{ gridTemplateColumns: 'minmax(80px, 1.2fr) repeat(7, minmax(0, 1fr))' }}>
                        <div className="bg-white dark:bg-[#0F172A] p-2 lg:p-4 group-hover:bg-gray-50 dark:group-hover:bg-slate-800/50 transition-colors flex flex-col justify-start overflow-hidden min-w-0">
                            <p className="font-bold text-gray-900 dark:text-slate-200 text-xs lg:text-sm leading-snug truncate w-full" title={venue.name}>{getShortVenueName(venue.name)}</p>
                            <p className="text-[9px] lg:text-[10px] mt-1 font-semibold uppercase tracking-widest truncate w-full">
                                {!venue.enabled ? <span className="text-red-500">Disabled</span> : <span className="text-gray-500 dark:text-slate-500">{venue.capacity} Pax</span>}
                            </p>
                        </div>

                        {(weekDates ?? []).map((date: Date) => {
                            const dateStr = formatDateStr(date);
                            const dayRes = (reservationsByDate.get(dateStr) ?? []).filter((r: Reservation) => r.venueId === venue.id);
                            const isBlocked = (blocksByDate.get(dateStr) ?? []).some((b: Block) => b.venueId === venue.id);
                            const isDisabled = !venue.enabled;

                            let isDimmed = false;
                            let isHighlighted = false;

                            if (activeFilter !== 'All') {
                                const matchesFilter = dayRes.some((r: Reservation) => r.status === activeFilter);
                                isDimmed = !matchesFilter && !isBlocked;
                                isHighlighted = matchesFilter || (activeFilter === 'Blocked' && isBlocked);
                            }

                            const highlightClasses = isHighlighted ? "ring-2 ring-inset ring-rose-500 dark:ring-rose-400 z-10 relative shadow-[0_0_10px_rgba(244,63,94,0.3)]" : "";
                            const dimClasses = isDimmed ? "opacity-50 grayscale hover:opacity-75" : "opacity-100";

                            return (
                                <div key={dateStr} className="bg-white dark:bg-[#0F172A] p-1 lg:p-1.5 transition-colors duration-300 flex flex-col min-h-0 min-w-0">
                                    <div className="w-full h-full max-h-[140px] overflow-y-auto hide-scrollbar flex flex-col flex-1 min-h-[60px] lg:min-h-[80px] min-w-0">
                                        {isDisabled ? (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-gray-200 dark:border-slate-800 min-w-0 overflow-hidden"><IconBan className="w-4 h-4 text-gray-400 dark:text-slate-700 flex-shrink-0" /></div>
                                        ) : isBlocked ? (
                                            <button onClick={() => handleCellToggle(venue.id, dateStr)} className={cn("w-full h-full rounded-lg bg-red-50 dark:bg-red-950/30 border-2 border-dashed border-red-300 dark:border-red-900 flex flex-col items-center justify-center text-red-600 dark:text-red-500 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors overflow-hidden min-w-0", highlightClasses, dimClasses)}>
                                                <IconBan className="w-4 h-4 lg:w-5 lg:h-5 mb-1 opacity-50 flex-shrink-0" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest truncate px-1 hidden xl:inline-block w-full text-center">Blocked</span>
                                            </button>
                                        ) : dayRes.length > 0 ? (
                                            <button onClick={() => setSelectedDayDetails({ venueId: venue.id, dateStr })} className={cn("w-full h-full rounded-lg p-1.5 text-left flex flex-col gap-1 border transition-all cursor-pointer bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md overflow-hidden min-w-0", highlightClasses, dimClasses)}>
                                                <div className="flex items-center w-full min-w-0">
                                                    <span className="text-[9px] lg:text-[10px] font-bold text-gray-500 dark:text-slate-400 px-1 truncate w-full">
                                                        {dayRes.length} <span className="hidden xl:inline">booking{dayRes.length !== 1 ? 's' : ''}</span>
                                                    </span>
                                                </div>
                                                <div className="hidden lg:flex flex-col gap-1 w-full min-w-0 overflow-hidden">
                                                    {[...dayRes].sort((a: Reservation, b: Reservation) => a.startTime.localeCompare(b.startTime)).slice(0, 2).map((res: Reservation) => (
                                                        <div key={res.id} className={cn("text-[9px] font-semibold px-1.5 py-1 rounded border flex justify-between items-center gap-1 w-full truncate transition-colors min-w-0", res.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60")}>
                                                            <span className="truncate flex-1 leading-tight font-bold">{res.eventName}</span>
                                                        </div>
                                                    ))}
                                                    {dayRes.length > 2 && <span className="text-[9px] text-gray-500 dark:text-slate-500 font-bold px-1.5 truncate w-full">+{dayRes.length - 2} more</span>}
                                                </div>
                                            </button>
                                        ) : (
                                            <button onClick={() => setQuickAddData({ venueId: venue.id, date: dateStr })} className={cn("w-full h-full rounded-lg border border-transparent hover:border-emerald-300 dark:hover:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex items-center justify-center group transition-all cursor-pointer overflow-hidden min-w-0", highlightClasses, dimClasses)}>
                                                <IconPlus className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-slate-700 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

function DesktopMonthGrid() {
    const { currentDate, reservationsByDate, blocksByDate, venues, activeFilter, setSelectedDayDetails, setQuickAddData } = useScheduling();

    const days = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const arr = [];
        const shift = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = new Date(year, month, 0).getDate();

        for (let i = shift - 1; i >= 0; i--) {
            arr.push({ day: prevMonthDays - i, isCurrentMonth: false, fullDate: new Date(year, month - 1, prevMonthDays - i) });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            arr.push({ day: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
        }

        const totalRows = Math.ceil(arr.length / 7);
        const totalCells = totalRows * 7;
        let nextMonthDay = 1;

        while (arr.length < totalCells) {
            arr.push({ day: nextMonthDay++, isCurrentMonth: false, fullDate: new Date(year, month + 1, nextMonthDay - 1) });
        }

        return { arr, rows: totalRows };
    }, [currentDate]);

    const todayStr = formatDateStr(new Date());

    return (
        <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden h-full flex flex-col w-full flex-1 min-w-0">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#1E293B] flex-shrink-0 min-w-0 w-full">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="p-3 text-center text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest hidden sm:block truncate min-w-0">{d}</div>
                ))}
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                    <div key={d} className="p-3 text-center text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest sm:hidden truncate min-w-0">{d}</div>
                ))}
            </div>

            <div className={cn("grid grid-cols-7 flex-1 min-h-0 overflow-hidden min-w-0 w-full", days.rows === 5 ? "grid-rows-5" : "grid-rows-6")}>
                {(days.arr ?? []).map((dateObj, idx) => {
                    const dateStr = formatDateStr(dateObj.fullDate);
                    const dayRes: Reservation[] = reservationsByDate.get(dateStr) ?? [];
                    const dayBlocks: Block[] = blocksByDate.get(dateStr) ?? [];
                    const isToday = dateStr === todayStr;

                    const items = [
                        ...dayRes.filter((r: Reservation) => r.status === 'Booked').map((r: Reservation) => ({ key: 'r' + r.id, label: r.eventName, time: r.startTime, venueId: r.venueId, kind: 'Booked' })),
                        ...dayRes.filter((r: Reservation) => r.status === 'Pending').map((r: Reservation) => ({ key: 'r' + r.id, label: r.eventName, time: r.startTime, venueId: r.venueId, kind: 'Pending' })),
                        ...dayBlocks.map((b: Block) => {
                            const v = (venues ?? []).find((v: Venue) => v.id === b.venueId);

                            return { key: 'b' + b.id, label: (v ? getShortVenueName(v.name) : 'Venue') + ' Blocked', time: 'All Day', venueId: b.venueId, kind: 'Blocked' };
                        }),
                    ].sort((a, b) => a.time.localeCompare(b.time));

                    const filteredItems = items.filter(item => activeFilter === 'All' || activeFilter === item.kind || item.kind === 'Blocked');
                    const maxVisible = days.rows === 6 ? 2 : 3;
                    const visibleItems = filteredItems.slice(0, maxVisible);
                    const hiddenCount = filteredItems.length - visibleItems.length;

                    const kindStyle: Record<string, string> = {
                        Booked: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60 hover:bg-rose-200 dark:hover:bg-rose-900/60',
                        Pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-900/60',
                        Blocked: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/60 hover:bg-red-200 dark:hover:bg-red-900/60',
                    };

                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                if (!dateObj.isCurrentMonth) {
return;
}

                                if (dayRes.length > 0 || dayBlocks.length > 0) {
                                    setSelectedDayDetails({ dateStr });
                                } else {
                                    setQuickAddData({ venueId: null, date: dateStr });
                                }
                            }}
                            className={cn(
                                "border-b border-r border-gray-200 dark:border-slate-800 p-1 sm:p-1.5 flex flex-col min-h-0 overflow-hidden group relative w-full min-w-0",
                                !dateObj.isCurrentMonth ? "bg-gray-50/30 dark:bg-slate-900/10 opacity-50" : "bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] sm:text-xs font-bold mb-1 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors",
                                isToday ? "bg-rose-600 text-white shadow-md" : "text-gray-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400"
                            )}>{dateObj.day}</span>

                            <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 overflow-hidden pointer-events-none min-h-0 w-full min-w-0">
                                {(visibleItems ?? []).map(item => {
                                    return (
                                        <div key={item.key}
                                            className={cn(
                                                "text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 sm:py-1 rounded border flex justify-between items-center gap-1 sm:gap-2 transition-colors w-full text-left overflow-hidden flex-shrink-0 min-w-0",
                                                kindStyle[item.kind],
                                                activeFilter !== 'All' && activeFilter !== item.kind && item.kind !== 'Blocked' ? 'opacity-40 grayscale' : ''
                                            )}
                                        >
                                            <span className="truncate leading-tight font-bold flex-1 min-w-0">{item.label}</span>
                                            <span className="text-[8px] font-mono opacity-80 flex-shrink-0 hidden xl:inline-block truncate">{item.time}</span>
                                        </div>
                                    );
                                })}
                                {hiddenCount > 0 && (
                                    <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-slate-500 font-bold px-1 mt-0.5 text-left transition-colors flex-shrink-0 truncate w-full min-w-0">
                                        +{hiddenCount} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MobileMonthGrid() {
    const { currentDate, reservationsByDate, blocksByDate, activeFilter, setSelectedMobileDate, setViewMode } = useScheduling();

    const days = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const arr = [];
        const shift = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = new Date(year, month, 0).getDate();

        for (let i = shift - 1; i >= 0; i--) {
            arr.push({ day: prevMonthDays - i, isCurrentMonth: false, fullDate: new Date(year, month - 1, prevMonthDays - i) });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            arr.push({ day: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
        }

        const totalRows = Math.ceil(arr.length / 7);
        const totalCells = totalRows * 7;
        let nextMonthDay = 1;

        while (arr.length < totalCells) {
            arr.push({ day: nextMonthDay++, isCurrentMonth: false, fullDate: new Date(year, month + 1, nextMonthDay - 1) });
        }

        return { arr, rows: totalRows };
    }, [currentDate]);

    const todayStr = formatDateStr(new Date());

    return (
        <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col w-full flex-1 min-w-0">
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#1E293B] overflow-hidden flex-shrink-0 min-w-0 w-full">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                    <div key={d} className="p-3 text-center text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest truncate min-w-0">{d}</div>
                ))}
            </div>

            <div className={cn("grid grid-cols-7 flex-1 min-h-0 overflow-hidden min-w-0 w-full", days.rows === 5 ? "grid-rows-5" : "grid-rows-6")}>
                {(days.arr ?? []).map((dateObj, idx) => {
                    if (!dateObj.isCurrentMonth) {
                        return <div key={idx} className="border-b border-r border-gray-200 dark:border-slate-800 p-2 bg-gray-50/30 dark:bg-slate-900/10 min-h-[60px]" />;
                    }

                    const dateStr = formatDateStr(dateObj.fullDate);
                    const dayRes: Reservation[] = reservationsByDate.get(dateStr) ?? [];
                    const dayBlocks: Block[] = blocksByDate.get(dateStr) ?? [];
                    const isToday = dateStr === todayStr;

                    const hasBooked = dayRes.some((r: Reservation) => r.status === 'Booked' && (activeFilter === 'All' || activeFilter === 'Booked'));
                    const hasPending = dayRes.some((r: Reservation) => r.status === 'Pending' && (activeFilter === 'All' || activeFilter === 'Pending'));
                    const hasBlocked = dayBlocks.length > 0 && (activeFilter === 'All' || activeFilter === 'Blocked');

                    return (
                        <div
                            key={idx}
                            onClick={() => {
                                setSelectedMobileDate(dateStr);
                                setViewMode('week');
                            }}
                            className="border-b border-r border-gray-200 dark:border-slate-800 p-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center cursor-pointer min-h-[60px] min-w-0"
                        >
                            <span className={cn(
                                "text-[10px] font-bold flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                                isToday ? "bg-rose-600 text-white shadow-md" : "text-gray-600 dark:text-slate-300"
                            )}>{dateObj.day}</span>
                            <div className="flex gap-0.5 mt-1 justify-center min-h-[6px] min-w-0 flex-wrap">
                                {hasBooked && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 flex-shrink-0" />}
                                {hasPending && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 flex-shrink-0" />}
                                {hasBlocked && <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400 flex-shrink-0" />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MobileAgenda() {
    const { setCurrentDate, venues, reservationsByDate, blocksByDate, activeFilter, selectedMobileDate, setSelectedMobileDate, setQuickAddData, handleCellToggle, setSelectedDayDetails } = useScheduling();

    const selectedRes = reservationsByDate.get(selectedMobileDate) ?? [];
    const selectedBlocks = blocksByDate.get(selectedMobileDate) ?? [];

    const handleMobilePrevDay = () => {
        const d = new Date(selectedMobileDate);
        d.setDate(d.getDate() - 1);
        setSelectedMobileDate(formatDateStr(d));
        setCurrentDate(d);
    };

    const handleMobileNextDay = () => {
        const d = new Date(selectedMobileDate);
        d.setDate(d.getDate() + 1);
        setSelectedMobileDate(formatDateStr(d));
        setCurrentDate(d);
    };

    const mobileDateDisplay = useMemo(() => {
        const d = new Date(selectedMobileDate);

        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    }, [selectedMobileDate]);

    return (
        <div className="flex flex-col h-full w-full space-y-4 min-w-0">
            <div className="flex-shrink-0 w-full min-w-0">
                <div className="flex items-center justify-between bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-700 rounded-xl p-2 shadow-sm min-w-0">
                    <button onClick={handleMobilePrevDay} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg flex-shrink-0 transition-colors"><IconLeft className="w-4 h-4 text-gray-600 dark:text-slate-400" /></button>
                    <h2 className="text-xs sm:text-sm font-bold tracking-widest text-gray-900 dark:text-white uppercase truncate px-2 min-w-0">{mobileDateDisplay}</h2>
                    <button onClick={handleMobileNextDay} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg flex-shrink-0 transition-colors"><IconRight className="w-4 h-4 text-gray-600 dark:text-slate-400" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 min-w-0 w-full">
                {(venues ?? []).map((venue: Venue) => {
                    const venueRes = selectedRes.filter((r: Reservation) => r.venueId === venue.id);
                    const isBlocked = selectedBlocks.some((b: Block) => b.venueId === venue.id);
                    const isDisabled = !venue.enabled;

                    return (
                        <div key={venue.id} className="bg-white dark:bg-[#0F172A] rounded-2xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col min-w-0 w-full mb-4 shadow-sm">
                            <div className="border-b border-gray-100 dark:border-slate-800 pb-3 mb-3 flex justify-between items-start min-w-0 w-full">
                                <div className="min-w-0 flex-1 pr-4">
                                    <h3 className="font-bold text-gray-900 dark:text-slate-200 text-sm leading-tight truncate w-full">{venue.name}</h3>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-widest truncate w-full">{venue.capacity} PAX MAX</p>
                                </div>
                                {isDisabled && <span className="bg-gray-100 dark:bg-slate-900 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-900/30 text-[10px] font-bold px-2 py-1 rounded flex-shrink-0">DISABLED</span>}
                            </div>

                            <div className="w-full min-w-0 flex flex-col">
                                {isDisabled ? (
                                    <div className="text-center py-4 w-full border border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-900/50 min-w-0 overflow-hidden">
                                        <p className="text-xs font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest truncate w-full">Venue Closed</p>
                                    </div>
                                ) : isBlocked ? (
                                    <button onClick={() => handleCellToggle(venue.id, selectedMobileDate)} className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-dashed border-red-300 dark:border-red-900 flex flex-col items-center justify-center text-red-600 dark:text-red-500 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors overflow-hidden ring-2 ring-inset ring-red-500 dark:ring-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)] min-w-0">
                                        <IconBan className="w-5 h-5 mb-1 opacity-50 flex-shrink-0" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest truncate px-1 max-w-full">Blocked - Tap to Unblock</span>
                                    </button>
                                ) : venueRes.length > 0 ? (
                                    <div className="flex flex-col gap-3 min-w-0 w-full">
                                        {venueRes.map((res: Reservation) => {
                                            const isPending = res.status === 'Pending';
                                            const isDimmed = activeFilter !== 'All' && activeFilter !== res.status;

                                            return (
                                                <button
                                                    key={res.id}
                                                    onClick={() => setSelectedDayDetails({ venueId: venue.id, dateStr: selectedMobileDate })}
                                                    className={cn(
                                                        "text-left border rounded-xl p-3 flex flex-col gap-2 w-full transition-all cursor-pointer min-w-0",
                                                        isPending ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60",
                                                        isDimmed ? "opacity-40 grayscale" : "hover:shadow-md hover:-translate-y-0.5 shadow-sm"
                                                    )}
                                                >
                                                    <div className="flex justify-between items-center w-full gap-2 min-w-0">
                                                        <span className="text-xs font-mono opacity-80 flex-shrink-0">{res.startTime} - {res.endTime}</span>
                                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex-shrink-0", isPending ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300" : "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300")}>{res.status}</span>
                                                    </div>
                                                    <span className="text-sm font-bold truncate w-full min-w-0">{res.eventName}</span>
                                                </button>
                                            );
                                        })}
                                        <button onClick={() => setQuickAddData({ venueId: venue.id, date: selectedMobileDate })} className="mt-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl text-xs font-bold w-full transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50 min-w-0">
                                            <IconPlus className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">Add Reservation</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 w-full min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-3 truncate w-full">No reservations</p>
                                        <button onClick={() => setQuickAddData({ venueId: venue.id, date: selectedMobileDate })} className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl text-xs font-bold w-full transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50 min-w-0 truncate">
                                            + Add Reservation
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── MODALS ─────────────────────────────────────────────────────────────────

function DayReservationsModal({ dateStr, venueId, onClose }: { dateStr: string, venueId?: string, onClose: () => void }) {
    const { reservationsByDate, blocksByDate, venues, setSelectedRes, handleCellToggle } = useScheduling();

    const dayRes = (reservationsByDate.get(dateStr) ?? []).filter((r: Reservation) => !venueId || r.venueId === venueId);
    const dayBlocks = (blocksByDate.get(dateStr) ?? []).filter((b: Block) => !venueId || b.venueId === venueId);

    const d = new Date(dateStr);
    const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const targetVenue = venueId ? (venues ?? []).find((v: Venue) => v.id === venueId) : null;
    const title = targetVenue ? targetVenue.name : "Day Summary";

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border-t sm:border border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-[#1E293B] rounded-t-2xl min-w-0">
                    <div className="min-w-0 pr-4 flex-1">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate w-full">{title}</h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate w-full">{formattedDate}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"><IconX className="w-5 h-5" /></button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 hide-scrollbar min-w-0 w-full">
                    {dayRes.length === 0 && dayBlocks.length === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-slate-500 py-10 w-full truncate">No events or blocks for this date.</p>
                    )}

                    {(dayRes ?? []).sort((a: Reservation, b: Reservation) => a.startTime.localeCompare(b.startTime)).map((res: Reservation) => {
                        const venue = (venues ?? []).find((v: Venue) => v.id === res.venueId);
                        const isPending = res.status === 'Pending';

                        return (
                            <button
                                key={res.id}
                                onClick={() => {
 onClose(); setSelectedRes(res); 
}}
                                className={cn(
                                    "w-full text-left p-4 rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 min-w-0",
                                    isPending ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50" : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2 gap-2 min-w-0 w-full">
                                    <h3 className={cn("font-bold text-sm truncate flex-1 min-w-0", isPending ? "text-amber-900 dark:text-amber-100" : "text-rose-900 dark:text-rose-100")}>{res.eventName}</h3>
                                    <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex-shrink-0", isPending ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300" : "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300")}>{res.status}</span>
                                </div>
                                {!venueId && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 mb-1 min-w-0 w-full">
                                        <IconMapPin className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate flex-1">{venue?.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-slate-500 min-w-0 w-full">
                                    <IconClock className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate flex-1">{res.startTime} - {res.endTime}</span>
                                </div>
                            </button>
                        );
                    })}

                    {(dayBlocks ?? []).map((block: Block) => {
                        const venue = (venues ?? []).find((v: Venue) => v.id === block.venueId);

                        return (
                            <button
                                key={block.id}
                                onClick={() => {
 onClose(); handleCellToggle(block.venueId, dateStr); 
}}
                                className="w-full text-left p-4 rounded-xl border-2 border-dashed bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 flex flex-col gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer min-w-0"
                            >
                                <div className="flex justify-between items-start min-w-0 w-full">
                                    <h3 className="font-bold text-sm text-red-800 dark:text-red-400 flex items-center gap-1.5 truncate w-full"><IconBan className="w-4 h-4 flex-shrink-0" /> Blocked</h3>
                                </div>
                                {!venueId && (
                                    <div className="flex items-center gap-1.5 text-xs text-red-700 dark:text-red-300 opacity-80 min-w-0 w-full">
                                        <IconMapPin className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate flex-1">{venue?.name}</span>
                                    </div>
                                )}
                                {block.reason && <p className="text-xs text-red-600 dark:text-red-500 italic mt-1 line-clamp-2 w-full">"{block.reason}"</p>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function AddVenueModal({ onClose }: { onClose: () => void }) {
    const { setVenues, showToast, logAudit } = useScheduling();
    const [form, setForm] = useState({ name: '', pax: '', tags: '', enabled: true });
    const [err, setErr] = useState('');

    const submit = () => {
        if (!form.name.trim() || !form.pax.trim()) {
return setErr('Name and Max Pax are required.');
}

        if (isNaN(Number(form.pax))) {
return setErr('Max Pax must be a number.');
}

        const newVenue: Venue = {
            id: 'v' + Date.now(),
            name: form.name.trim(),
            capacity: Number(form.pax),
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            enabled: form.enabled
        };
        setVenues((prev: Venue[]) => [...(prev ?? []), newVenue]);
        logAudit('Added Venue', newVenue.name);
        showToast('Venue added successfully.');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl p-4 sm:p-6 flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="flex justify-between items-center mb-6 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">Add New Venue</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors flex-shrink-0"><IconX className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 hide-scrollbar min-w-0">
                    <div>
                        <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Venue Name</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Max Pax (Capacity)</label>
                        <input type="number" value={form.pax} onChange={e => setForm(f => ({ ...f, pax: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Tags (comma separated)</label>
                        <input type="text" placeholder="Outdoor, AC, Projector" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                    </div>
                    {err && <p className="text-xs font-bold text-red-500 dark:text-red-400 mt-2">{err}</p>}
                </div>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800 min-w-0">
                    <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer truncate">Cancel</button>
                    <button onClick={submit} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-xl shadow-md transition-colors cursor-pointer truncate">Add Venue</button>
                </div>
            </div>
        </div>
    );
}

function QuickAddModal({ data, onClose }: { data: { venueId: string | null, date: string }, onClose: () => void }) {
    const { setReservations, showToast, logAudit, venues, hasConflict } = useScheduling();

    const [form, setForm] = useState({
        venueId: data.venueId || ((venues ?? []).filter((v: Venue) => v.enabled)[0]?.id || ''),
        eventName: '',
        clientName: 'Walk-in Client',
        startTime: '09:00',
        endTime: '10:00',
        status: 'Pending' as 'Booked' | 'Pending',
        amount: 0,
        paid: false
    });
    const [err, setErr] = useState('');

    const save = () => {
        if (!form.eventName.trim() || !form.venueId) {
return setErr('Event name and venue are required.');
}

        if (form.endTime <= form.startTime) {
return setErr('End time must be after start time.');
}

        if (hasConflict(form.venueId, data.date, form.startTime, form.endTime)) {
            return setErr('This time slot conflicts with an existing reservation.');
        }

        const newRes: Reservation = {
            id: 'r' + Date.now(),
            date: data.date,
            ...form
        };
        setReservations((prev: Reservation[]) => [...(prev ?? []), newRes]);
        logAudit('Quick Added Reservation', form.eventName);
        showToast('Reservation created successfully.', 'success');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl p-4 sm:p-6 flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="flex justify-between items-center mb-6 min-w-0">
                    <div className="min-w-0 flex-1 pr-2">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">Quick Add</h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{data.date}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"><IconX className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar pr-1 min-w-0 w-full">
                    {!data.venueId && (
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Select Venue</label>
                            <select value={form.venueId} onChange={e => setForm(f => ({ ...f, venueId: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none">
                                {(venues ?? []).filter((v: Venue) => v.enabled).map((v: Venue) => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Event Name</label>
                        <input autoFocus type="text" value={form.eventName} onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-0">
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Start Time</label>
                            <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">End Time</label>
                            <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-0">
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
                            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Booked' | 'Pending' }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none">
                                <option value="Pending">Pending</option>
                                <option value="Booked">Confirmed</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Client Name</label>
                            <input type="text" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                        </div>
                    </div>
                    {err && <p className="text-xs font-bold text-red-500 dark:text-red-400 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl truncate">{err}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800 mt-auto min-w-0 w-full">
                    <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors truncate">Cancel</button>
                    <button onClick={save} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-xl cursor-pointer transition-colors shadow-md truncate">Save</button>
                </div>
            </div>
        </div>
    );
}

function ReservationDetailModal({ res, onClose }: { res: Reservation, onClose: () => void }) {
    const { venues, setReservations, showToast, logAudit, hasConflict } = useScheduling();
    const venue = (venues ?? []).find((v: Venue) => v.id === res.venueId);

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [form, setForm] = useState<Reservation>(res);
    const [err, setErr] = useState('');

    
    const remove = () => {
        setReservations((prev: Reservation[]) => (prev ?? []).filter(r => r.id !== res.id));
        logAudit('Deleted Reservation', res.eventName);
        showToast('Reservation deleted.', 'info');
        onClose();
    };

    const save = () => {
        if (!form.eventName.trim()) {
return setErr('Event name is required.');
}

        if (form.endTime <= form.startTime) {
return setErr('End time must be after start time.');
}

        if (hasConflict(form.venueId, form.date, form.startTime, form.endTime, res.id)) {
            return setErr('This time slot conflicts with another reservation.');
        }

        setReservations((prev: Reservation[]) => (prev ?? []).map(r => r.id === res.id ? form : r));
        logAudit('Updated Reservation', form.eventName);
        showToast('Reservation updated successfully.', 'success');
        setIsEditing(false);
        setErr('');
    };

    if (isDeleting) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-700 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-sm shadow-2xl p-6 flex flex-col justify-center items-center text-center min-w-0">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 flex items-center justify-center mb-4 flex-shrink-0">
                        <IconBan className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate w-full">Delete Reservation?</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-8 whitespace-normal">This action cannot be undone. This will free up the time slot for other bookings.</p>
                    <div className="flex gap-3 w-full mt-auto sm:mt-0 min-w-0">
                        <button onClick={() => setIsDeleting(false)} className="flex-1 px-5 py-3 min-h-[44px] text-sm font-bold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors truncate">Cancel</button>
                        <button onClick={remove} className="flex-1 px-5 py-3 min-h-[44px] text-sm font-bold text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-xl cursor-pointer transition-colors shadow-md truncate">Yes, Delete</button>
                    </div>
                </div>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-700 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl flex flex-col mt-auto sm:mt-0 min-w-0">
                    <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-[#1E293B] rounded-t-2xl min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">Edit Reservation</h2>
                        <button onClick={() => {
 setIsEditing(false); setForm(res); setErr(''); 
}} className="text-gray-500 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"><IconX className="w-5 h-5" /></button>
                    </div>
                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 hide-scrollbar min-w-0 w-full">
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Venue</label>
                            <select value={form.venueId} onChange={e => setForm(f => ({ ...f, venueId: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none">
                                {(venues ?? []).filter((v: Venue) => v.enabled || v.id === form.venueId).map((v: Venue) => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Event Name</label>
                            <input type="text" value={form.eventName} onChange={e => setForm(f => ({ ...f, eventName: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3 min-w-0">
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Date</label>
                                <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'Booked' | 'Pending' }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none">
                                    <option value="Pending">Pending</option>
                                    <option value="Booked">Confirmed</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 min-w-0">
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Start Time</label>
                                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">End Time</label>
                                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 min-w-0">
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Client</label>
                                <input type="text" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Amount (₱)</label>
                                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl min-h-[44px] px-4 text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none" />
                            </div>
                        </div>
                        {err && <p className="text-xs font-bold text-red-500 dark:text-red-400 mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl truncate">{err}</p>}
                    </div>
                    <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3 mt-auto min-w-0 w-full">
                        <button onClick={() => {
 setIsEditing(false); setForm(res); setErr(''); 
}} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors truncate">Cancel</button>
                        <button onClick={save} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-xl cursor-pointer transition-colors shadow-md truncate">Save Changes</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-700 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl overflow-hidden flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className={cn("p-5 sm:p-6 relative flex-shrink-0 min-w-0", res.status === 'Pending' ? "bg-amber-100 dark:bg-amber-950/50" : "bg-rose-100 dark:bg-rose-950/50")}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-white/50 hover:bg-white/40 dark:hover:bg-black/20 hover:text-gray-900 dark:hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full cursor-pointer transition-colors flex-shrink-0"><IconX className="w-4 h-4" /></button>
                    <span className="bg-black/10 dark:bg-black/30 text-gray-800 dark:text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest mb-3 inline-block">{res.status}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight pr-10 truncate w-full">{res.eventName}</h2>
                    <p className="text-gray-700 dark:text-white/70 text-xs flex items-center gap-1.5 font-mono mt-2 min-w-0"><IconCalendar className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate">{res.date} • {res.startTime} - {res.endTime}</span></p>
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-1 overflow-hidden min-w-0">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8 overflow-y-auto flex-1 hide-scrollbar min-w-0">
                        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 min-w-0">
                            <p className="text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1 truncate">Venue</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 truncate">{venue?.name}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 min-w-0">
                            <p className="text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1 truncate">Client</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">{res.clientName}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 min-w-0">
                            <p className="text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1 truncate">Amount</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate">₱{res.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800 min-w-0">
                            <p className="text-[9px] text-gray-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-1 truncate">Payment</p>
                            <p className={cn("text-sm font-semibold truncate", res.paid ? "text-emerald-600 dark:text-emerald-500" : "text-amber-600 dark:text-amber-500")}>{res.paid ? 'Fully Paid' : 'Unpaid'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-200 dark:border-slate-800 pt-4 sm:pt-5 mt-auto min-w-0">
                        <button onClick={() => setIsDeleting(true)} className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors py-2 cursor-pointer w-full sm:w-auto justify-center sm:justify-start">
                            <IconTrash className="w-4 h-4 flex-shrink-0" /> Delete
                        </button>
                        <div className="flex gap-2 w-full sm:w-auto min-w-0">
                            <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 min-h-[44px] bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer truncate">Close</button>
                            <button onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer truncate">
                                <IconEdit className="w-4 h-4 flex-shrink-0" /> Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BlockDatesModal({ onClose }: { onClose: () => void }) {
    const { venues, setBlocks, showToast, logAudit, reservationsByDate } = useScheduling();
    const [form, setForm] = useState({ venueId: (venues ?? [])[0]?.id || '', start: '', end: '', reason: '' });

    const save = () => {
        if (!form.venueId || !form.start || !form.end) {
return showToast("Fill all required fields.", 'error');
}

        const [sy, sm, sd] = form.start.split('-');
        const [ey, em, ed] = form.end.split('-');
        const start = new Date(Number(sy), Number(sm) - 1, Number(sd));
        const end = new Date(Number(ey), Number(em) - 1, Number(ed));

        if (end < start) {
return showToast("End date must be after start.", 'error');
}

        const newBlocks: Block[] = [];
        let conflictCount = 0;
        const cur = new Date(start);

        while (cur <= end) {
            const dStr = formatDateStr(cur);
            const isBooked = (reservationsByDate.get(dStr) ?? []).find((r: Reservation) => r.venueId === form.venueId);

            if (isBooked) {
                conflictCount++;
            } else {
                newBlocks.push({ id: Math.random().toString(), venueId: form.venueId, date: dStr, reason: form.reason || 'Bulk Block' });
            }

            cur.setDate(cur.getDate() + 1);
        }

        if (newBlocks.length > 0) {
            setBlocks((prev: Block[]) => [...(prev ?? []), ...newBlocks]);
            logAudit('Bulk Block', `Blocked ${newBlocks.length} days`);
            showToast(`Blocked ${newBlocks.length} days successfully.`, 'success');
        }

        if (conflictCount > 0) {
            showToast(`Skipped ${conflictCount} dates due to existing bookings.`, 'error');
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl p-4 sm:p-6 flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="flex justify-between items-center mb-6 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate w-full">
                        <IconBan className="text-rose-600 dark:text-rose-500 w-5 h-5 flex-shrink-0" /> Bulk Block
                    </h2>
                    <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors flex-shrink-0"><IconX className="w-5 h-5 text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-white" /></button>
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 hide-scrollbar min-w-0">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-500 mb-1.5 block">Venue</label>
                        <select value={form.venueId} onChange={e => setForm(f => ({ ...f, venueId: e.target.value }))} className="w-full px-4 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none">
                            {(venues ?? []).map((v: Venue) => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 min-w-0">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-500 mb-1.5 block">Start Date</label>
                            <input type="date" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))} className="w-full px-4 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-500 mb-1.5 block">End Date</label>
                            <input type="date" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))} className="w-full px-4 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-rose-500 outline-none dark:[color-scheme:dark]" />
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl flex gap-2 items-start mt-2 min-w-0">
                        <IconBan className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-500 leading-relaxed truncate whitespace-normal w-full">Existing reservations inside this range will be skipped to prevent conflicts.</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800 min-w-0 w-full">
                    <button onClick={onClose} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer truncate">Cancel</button>
                    <button onClick={save} className="flex-1 sm:flex-none px-5 py-3 min-h-[44px] text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 rounded-xl transition-colors cursor-pointer shadow-md truncate">Apply Block</button>
                </div>
            </div>
        </div>
    );
}

function AuditModal({ logs, onClose }: { logs: AuditLog[], onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[80vh] sm:max-w-lg shadow-2xl flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-[#1E293B] rounded-t-2xl min-w-0">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate"><IconHistory className="w-5 h-5 text-gray-500 dark:text-slate-400 flex-shrink-0" /> Audit Log</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"><IconX className="w-5 h-5" /></button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 hide-scrollbar min-w-0">
                    {(logs ?? []).length === 0 ? <p className="text-center text-sm text-gray-500 dark:text-slate-500 py-10 w-full truncate">No recent actions.</p> :
                        logs.map((log) => (
                            <div key={log.id} className="flex gap-4 items-start min-w-0">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-600 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate">{log.action}</p>
                                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5 whitespace-normal leading-relaxed">{log.details}</p>
                                    <p className="text-[9px] text-gray-400 dark:text-slate-600 mt-1.5 font-mono uppercase tracking-widest truncate">{new Date(log.timestamp).toLocaleString()} • {log.user}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

import AppLayout from '@/layouts/app-layout';

Scheduling.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Scheduling',
                href: '/admin-scheduling',
            },
        ]}
    >
        {page}
    </AppLayout>
);