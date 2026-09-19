import { Head } from '@inertiajs/react';
import React, { useState, useMemo, createContext, useContext } from 'react';

// ─── INLINE SVG ICONS ───────────────────────────────────────────────────────
const IconCalendar = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconClock = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLeft = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>;
const IconRight = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>;
const IconX = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconMapPin = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

// ─── TYPES & UTILS ──────────────────────────────────────────────────────────
type ViewMode = 'week' | 'month';
type StatusType = 'Booked' | 'Pending';

interface Venue { id: string; name: string; }
interface Reservation { id: string; venueId: string; date: string; startTime: string; endTime: string; status: 'Booked' | 'Pending'; eventName: string; }

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
    { id: 'v1', name: 'Balay Alumni Function Hall' },
    { id: 'v2', name: 'Balay Cafe Conference Room' },
    { id: 'v3', name: 'Whole Area of Balay Alumni' },
];

const MOCK_RESERVATIONS: Reservation[] = [
    { id: 'r1', venueId: 'v1', date: '2026-09-07', startTime: '08:00', endTime: '10:00', status: 'Booked', eventName: 'Corporate Summit' },
    { id: 'r2', venueId: 'v2', date: '2026-09-07', startTime: '10:30', endTime: '12:00', status: 'Booked', eventName: 'Board Meeting' },
    { id: 'r3', venueId: 'v1', date: '2026-09-07', startTime: '13:00', endTime: '15:00', status: 'Pending', eventName: 'Client Presentation' },
    { id: 'r4', venueId: 'v2', date: '2026-09-07', startTime: '15:30', endTime: '17:00', status: 'Pending', eventName: 'Team Meeting' },
    { id: 'r5', venueId: 'v3', date: '2026-09-07', startTime: '18:00', endTime: '22:00', status: 'Booked', eventName: 'Company Anniversary' },
    { id: 'r6', venueId: 'v1', date: '2026-09-08', startTime: '09:00', endTime: '11:00', status: 'Booked', eventName: 'Workshop' },
    { id: 'r7', venueId: 'v2', date: '2026-09-08', startTime: '14:00', endTime: '16:00', status: 'Pending', eventName: 'Consultation' },
    { id: 'r8', venueId: 'v1', date: '2026-09-09', startTime: '10:00', endTime: '12:00', status: 'Booked', eventName: 'Product Launch' },
    { id: 'r9', venueId: 'v2', date: '2026-09-09', startTime: '10:00', endTime: '12:00', status: 'Booked', eventName: 'Interviews' },
    { id: 'r10', venueId: 'v3', date: '2026-09-09', startTime: '18:00', endTime: '23:00', status: 'Pending', eventName: 'Alumni Mixer' },
    { id: 'r11', venueId: 'v1', date: '2026-09-10', startTime: '08:00', endTime: '10:00', status: 'Booked', eventName: 'Morning Seminar' },
    { id: 'r12', venueId: 'v1', date: '2026-09-10', startTime: '11:00', endTime: '13:00', status: 'Booked', eventName: 'Client Meeting' },
    { id: 'r13', venueId: 'v1', date: '2026-09-10', startTime: '14:00', endTime: '17:00', status: 'Booked', eventName: 'Training Workshop' },
    { id: 'r14', venueId: 'v3', date: '2026-09-11', startTime: '16:00', endTime: '20:00', status: 'Booked', eventName: 'Wedding Prep' },
    { id: 'r15', venueId: 'v1', date: '2026-09-11', startTime: '18:00', endTime: '22:00', status: 'Pending', eventName: 'Rehearsal Dinner' },
    { id: 'r16', venueId: 'v1', date: '2026-09-13', startTime: '09:00', endTime: '15:00', status: 'Booked', eventName: 'Sunday Service' },
    { id: 'r17', venueId: 'v2', date: '2026-09-13', startTime: '10:00', endTime: '12:00', status: 'Pending', eventName: 'Committee Meeting' },
];

// ─── CONTEXT ────────────────────────────────────────────────────────────────
const CalendarContext = createContext<any>(null);
function useCalendar() {
 return useContext(CalendarContext); 
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function UserCalendar() {
    const [venues] = useState<Venue[]>(MOCK_VENUES);
    const [reservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
    
    const [currentDate, setCurrentDate] = useState(new Date('2026-09-07T00:00:00'));
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [activeFilter, setActiveFilter] = useState<StatusType | 'All'>('All');
    
    const [selectedMobileDate, setSelectedMobileDate] = useState<string>(formatDateStr(new Date('2026-09-07')));
    const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
    const [selectedDayDetails, setSelectedDayDetails] = useState<{dateStr: string} | null>(null);

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
    };
    const handleNext = () => {
        const d = new Date(currentDate);

        if (viewMode === 'week') {
            d.setDate(d.getDate() + 7);
        } else {
            d.setMonth(d.getMonth() + 1);
        }

        setCurrentDate(d);
    };

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

    return (
        <CalendarContext.Provider value={{
            venues, reservationsByDate, viewMode, activeFilter, setActiveFilter, 
            weekDates, currentDate, setCurrentDate, setViewMode,
            selectedMobileDate, setSelectedMobileDate,
            selectedDayDetails, setSelectedDayDetails, setSelectedRes
        }}>
            <Head title="Calendar" />
            <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-slate-200 font-sans selection:bg-[#7D1933] selection:text-white min-w-0 w-full">
                <header className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-800 p-4 md:px-6 flex flex-col justify-center flex-shrink-0 min-w-0 w-full">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight truncate w-full">Venue Calendar</h1>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate w-full">View upcoming events and availability</p>
                </header>

                <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
                    <main className="flex-1 flex flex-col overflow-hidden min-w-0 w-full">
                        <div className="bg-white dark:bg-[#0F172A] border-b border-gray-200 dark:border-slate-800 p-4 md:px-6 flex flex-col lg:flex-row justify-between gap-4 flex-shrink-0 min-w-0 w-full">
                            
                            {/* Mobile/Tablet Toolbar */}
                            <div className="flex lg:hidden flex-col gap-3 w-full min-w-0">
                                <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-1 w-full min-w-0">
                                    <button onClick={handlePrev} className="p-2 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center min-w-[40px] flex-shrink-0"><IconLeft className="w-4 h-4" /></button>
                                    <div className="flex-1 text-center font-semibold text-xs sm:text-sm px-2 text-gray-900 dark:text-slate-200 select-none truncate min-w-0">
                                        {viewMode === 'week' 
                                            ? `${weekDates[0].toLocaleDateString('default',{month:'short', day:'numeric'})} - ${weekDates[6].toLocaleDateString('default',{month:'short', day:'numeric'})}`
                                            : currentDate.toLocaleDateString('default',{month:'long', year:'numeric'})}
                                    </div>
                                    <button onClick={handleNext} className="p-2 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors flex items-center justify-center min-w-[40px] flex-shrink-0"><IconRight className="w-4 h-4" /></button>
                                </div>
                                <div className="flex gap-2 w-full min-w-0">
                                    <button onClick={handleJumpToday} className="flex-1 px-2 py-2 min-h-[44px] text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl transition-colors border border-gray-200 dark:border-slate-700 truncate">Today</button>
                                    <div className="flex flex-1 bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-700 min-w-0">
                                        <button onClick={()=>setViewMode('week')} className={cn("flex-1 px-2 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all truncate", viewMode === 'week' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Week</button>
                                        <button onClick={()=>setViewMode('month')} className={cn("flex-1 px-2 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all truncate", viewMode === 'month' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Month</button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full min-w-0">
                                    <TopStatsContent />
                                </div>
                            </div>

                            {/* Desktop Toolbar */}
                            <div className="hidden lg:flex flex-wrap items-center gap-4 w-full justify-between min-w-0">
                                <div className="flex flex-wrap items-center gap-4 min-w-0">
                                    <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-1 flex-shrink-0">
                                        <button onClick={handlePrev} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors"><IconLeft className="w-4 h-4" /></button>
                                        <div className="font-semibold text-sm px-4 text-gray-900 dark:text-slate-200 select-none whitespace-nowrap">
                                            {viewMode === 'week' 
                                                ? `${weekDates[0].toLocaleDateString('default',{month:'short', day:'numeric'})} - ${weekDates[6].toLocaleDateString('default',{month:'short', day:'numeric'})}`
                                                : currentDate.toLocaleDateString('default',{month:'long', year:'numeric'})}
                                        </div>
                                        <button onClick={handleNext} className="p-1.5 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 rounded-lg transition-colors"><IconRight className="w-4 h-4" /></button>
                                    </div>
                                    <button onClick={handleJumpToday} className="px-4 py-2 min-h-[36px] text-xs font-bold bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-xl transition-colors border border-gray-200 dark:border-slate-700 whitespace-nowrap flex-shrink-0">Today</button>
                                    
                                    <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-xl border border-gray-200 dark:border-slate-700 flex-shrink-0">
                                        <button onClick={()=>setViewMode('week')} className={cn("px-4 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all", viewMode === 'week' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Week</button>
                                        <button onClick={()=>setViewMode('month')} className={cn("px-4 py-1.5 min-h-[36px] text-xs font-bold rounded-lg transition-all", viewMode === 'month' ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow" : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200")}>Month</button>
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
                {selectedDayDetails && <DayReservationsModal dateStr={selectedDayDetails.dateStr} onClose={() => setSelectedDayDetails(null)} />}
            </div>
        </CalendarContext.Provider>
    );
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────────────────────

function TopStatsContent() {
    const { reservationsByDate, activeFilter, setActiveFilter, weekDates, viewMode, currentDate } = useCalendar();
    
    const stats = useMemo(() => {
        const relevantRes: Reservation[] = [];
        
        if (viewMode === 'week') {
            (weekDates ?? []).forEach((d:Date) => {
                const dateStr = formatDateStr(d);
                relevantRes.push(...(reservationsByDate.get(dateStr) ?? []));
            });
        } else {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                const dateStr = formatDateStr(new Date(year, month, i));
                relevantRes.push(...(reservationsByDate.get(dateStr) ?? []));
            }
        }

        const bookedCount = relevantRes.filter((r: Reservation) => r.status === 'Booked').length;
        const pendingCount = relevantRes.filter((r: Reservation) => r.status === 'Pending').length;

        return { bookedCount, pendingCount };
    }, [reservationsByDate, weekDates, viewMode, currentDate]);

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
    const { weekDates, reservationsByDate, activeFilter, setSelectedDayDetails, venues } = useCalendar();
    
    return (
        <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl overflow-hidden flex flex-col h-full w-full min-w-0">
            <div className="grid w-full text-sm sticky top-0 z-30 bg-white dark:bg-[#0F172A] shadow-sm border-b border-gray-200 dark:border-slate-800 gap-[1px] min-w-0" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                {(weekDates ?? []).map((date: Date) => (
                    <div key={date.toISOString()} className="bg-gray-50 dark:bg-[#1E293B] p-2 lg:p-4 text-center overflow-hidden flex flex-col items-center justify-center min-w-0">
                        <p className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest hidden lg:block truncate w-full">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-widest lg:hidden truncate w-full">{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</p>
                        <p className="text-sm lg:text-lg font-extrabold text-gray-900 dark:text-white mt-0.5 truncate w-full">{date.getDate()}</p>
                    </div>
                ))}
            </div>
            
            <div className="grid w-full flex-1 gap-[1px] min-w-0 bg-gray-200 dark:bg-slate-700" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                {(weekDates ?? []).map((date: Date) => {
                    const dateStr = formatDateStr(date);
                    const dayRes = reservationsByDate.get(dateStr) ?? [];
                    
                    return (
                        <div key={dateStr} className="bg-white dark:bg-[#0F172A] p-1.5 lg:p-2 transition-colors flex flex-col min-h-0 min-w-0 h-full overflow-y-auto hide-scrollbar gap-1.5">
                            {[...dayRes].sort((a,b) => a.startTime.localeCompare(b.startTime)).map(res => {
                                const venue = venues.find((v:Venue) => v.id === res.venueId);
                                const isDimmed = activeFilter !== 'All' && activeFilter !== res.status;
                                
                                return (
                                    <button 
                                        key={res.id}
                                        onClick={() => !isDimmed && setSelectedDayDetails({ dateStr })}
                                        className={cn(
                                            "text-left p-1.5 lg:p-2 rounded-lg border transition-all flex flex-col gap-1 w-full min-w-0 overflow-hidden",
                                            isDimmed ? "opacity-30 grayscale cursor-default" : "hover:shadow-md cursor-pointer hover:-translate-y-0.5",
                                            res.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60"
                                        )}
                                    >
                                        <div className="text-[10px] font-bold truncate leading-tight w-full">{res.eventName}</div>
                                        <div className="text-[9px] font-mono opacity-80 truncate w-full hidden sm:block">{res.startTime} - {res.endTime}</div>
                                        <div className="text-[9px] opacity-70 truncate w-full flex items-center gap-1 mt-0.5">
                                            <IconMapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                            <span className="truncate">{venue ? getShortVenueName(venue.name) : 'Venue'}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DesktopMonthGrid() {
    const { currentDate, reservationsByDate, activeFilter, setSelectedDayDetails } = useCalendar();
    
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
                    const isToday = dateStr === todayStr;

                    const items = [
                        ...dayRes.filter(r => r.status === 'Booked').map(r => ({ key: 'r' + r.id, label: r.eventName, time: r.startTime, venueId: r.venueId, kind: 'Booked' })),
                        ...dayRes.filter(r => r.status === 'Pending').map(r => ({ key: 'r' + r.id, label: r.eventName, time: r.startTime, venueId: r.venueId, kind: 'Pending' }))
                    ].sort((a, b) => a.time.localeCompare(b.time));
                    
                    const filteredItems = items.filter(item => activeFilter === 'All' || activeFilter === item.kind);
                    const maxVisible = days.rows === 6 ? 2 : 3;
                    const visibleItems = filteredItems.slice(0, maxVisible);
                    const hiddenCount = filteredItems.length - visibleItems.length;

                    const kindStyle: Record<string, string> = {
                        Booked: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60 hover:bg-rose-200 dark:hover:bg-rose-900/60',
                        Pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-900/60'
                    };

                    return (
                        <div 
                            key={idx} 
                            onClick={() => {
                                if (!dateObj.isCurrentMonth) {
return;
}

                                if (dayRes.length > 0) {
                                    setSelectedDayDetails({ dateStr });
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
                                                activeFilter !== 'All' && activeFilter !== item.kind ? 'opacity-40 grayscale' : ''
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
    const { currentDate, reservationsByDate, activeFilter, setSelectedMobileDate, setViewMode } = useCalendar();
    
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
                    const isToday = dateStr === todayStr;

                    const hasBooked = dayRes.some(r => r.status === 'Booked' && (activeFilter === 'All' || activeFilter === 'Booked'));
                    const hasPending = dayRes.some(r => r.status === 'Pending' && (activeFilter === 'All' || activeFilter === 'Pending'));

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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function MobileAgenda() {
    const { setCurrentDate, venues, reservationsByDate, activeFilter, selectedMobileDate, setSelectedMobileDate, setSelectedDayDetails } = useCalendar();
    
    const selectedRes = reservationsByDate.get(selectedMobileDate) ?? [];

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
                    <button onClick={handleMobilePrevDay} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg flex-shrink-0 transition-colors"><IconLeft className="w-4 h-4 text-gray-600 dark:text-slate-400"/></button>
                    <h2 className="text-xs sm:text-sm font-bold tracking-widest text-gray-900 dark:text-white uppercase truncate px-2 min-w-0">{mobileDateDisplay}</h2>
                    <button onClick={handleMobileNextDay} className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg flex-shrink-0 transition-colors"><IconRight className="w-4 h-4 text-gray-600 dark:text-slate-400"/></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar pb-10 min-w-0 w-full px-1">
                {selectedRes.length === 0 ? (
                    <div className="text-center py-10 w-full min-w-0">
                        <p className="text-sm text-gray-500 dark:text-slate-500 truncate w-full">No events scheduled for this day.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 min-w-0 w-full">
                        {[...selectedRes].sort((a,b) => a.startTime.localeCompare(b.startTime)).map(res => {
                            const venue = venues.find((v:Venue) => v.id === res.venueId);
                            const isPending = res.status === 'Pending';
                            const isDimmed = activeFilter !== 'All' && activeFilter !== res.status;
                            
                            if (isDimmed) {
return null;
}
                            
                            return (
                                <button 
                                    key={res.id} 
                                    onClick={() => setSelectedDayDetails({ dateStr: selectedMobileDate })}
                                    className={cn(
                                        "text-left border rounded-xl p-4 flex flex-col gap-2 w-full transition-all cursor-pointer min-w-0",
                                        isPending ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-900/60" : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-900/60",
                                        "hover:shadow-md shadow-sm"
                                    )}
                                >
                                    <div className="flex justify-between items-start w-full gap-2 min-w-0 mb-1">
                                        <span className="text-sm font-bold truncate w-full min-w-0">{res.eventName}</span>
                                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm flex-shrink-0", isPending ? "bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300" : "bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300")}>{res.status}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                       <span className="text-xs font-mono opacity-80 flex-shrink-0 flex items-center gap-1.5"><IconClock className="w-3.5 h-3.5" /> {res.startTime} - {res.endTime}</span>
                                       <span className="text-xs opacity-80 flex-shrink-0 flex items-center gap-1.5"><IconMapPin className="w-3.5 h-3.5" /> {venue ? getShortVenueName(venue.name) : 'Unknown Venue'}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── MODALS ─────────────────────────────────────────────────────────────────

function DayReservationsModal({ dateStr, onClose }: { dateStr: string, onClose: () => void }) {
    const { reservationsByDate, venues, setSelectedRes } = useCalendar();
    
    const dayRes: Reservation[] = reservationsByDate.get(dateStr) ?? [];
    const d = new Date(dateStr);
    const formattedDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-[50] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border-t sm:border border-gray-200 dark:border-slate-800 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-[#1E293B] rounded-t-2xl min-w-0">
                    <div className="min-w-0 pr-4 flex-1">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate w-full">Events for {formattedDate}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors cursor-pointer flex-shrink-0"><IconX className="w-5 h-5"/></button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3 hide-scrollbar min-w-0 w-full">
                    {dayRes.length === 0 && (
                        <p className="text-center text-sm text-gray-500 dark:text-slate-500 py-10 w-full truncate">No events for this date.</p>
                    )}
                    
                    {(dayRes ?? []).sort((a,b) => a.startTime.localeCompare(b.startTime)).map((res: Reservation) => {
                        const venue = (venues ?? []).find((v:Venue) => v.id === res.venueId);
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
                                <div className="flex flex-col gap-1.5 mt-2">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-slate-400 min-w-0 w-full">
                                        <IconMapPin className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate flex-1">{venue?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500 dark:text-slate-500 min-w-0 w-full">
                                        <IconClock className="w-3.5 h-3.5 flex-shrink-0" /> <span className="truncate flex-1">{res.startTime} - {res.endTime}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function ReservationDetailModal({ res, onClose }: { res:Reservation, onClose:()=>void }) {
    const { venues } = useCalendar();
    const venue = (venues ?? []).find((v:Venue) => v.id === res.venueId);

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/40 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-[#0F172A] border sm:border-gray-200 dark:border-slate-700 rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md shadow-2xl overflow-hidden flex flex-col mt-auto sm:mt-0 min-w-0">
                <div className={cn("p-5 sm:p-6 relative flex-shrink-0 min-w-0", res.status === 'Pending' ? "bg-amber-100 dark:bg-amber-950/50" : "bg-rose-100 dark:bg-rose-950/50")}>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-white/50 hover:bg-white/40 dark:hover:bg-black/20 hover:text-gray-900 dark:hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full cursor-pointer transition-colors flex-shrink-0"><IconX className="w-4 h-4"/></button>
                    <span className="bg-black/10 dark:bg-black/30 text-gray-800 dark:text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest mb-3 inline-block">{res.status}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight pr-10 truncate w-full">{res.eventName}</h2>
                    <p className="text-gray-700 dark:text-white/70 text-xs flex items-center gap-1.5 font-mono mt-2 min-w-0"><IconCalendar className="w-3.5 h-3.5 flex-shrink-0"/> <span className="truncate">{res.date} • {res.startTime} - {res.endTime}</span></p>
                </div>
                <div className="p-4 sm:p-6 flex flex-col flex-1 overflow-hidden min-w-0">
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-8 overflow-y-auto flex-1 hide-scrollbar min-w-0">
                        <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 min-w-0 flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-slate-800 rounded-lg flex-shrink-0">
                                <IconMapPin className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] text-gray-500 dark:text-slate-500 uppercase tracking-widest font-bold mb-0.5 truncate">Venue</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-slate-200 truncate">{venue?.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 sm:pt-5 border-t border-gray-200 dark:border-slate-800 mt-auto min-w-0">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-3 min-h-[44px] bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors cursor-pointer truncate w-full">Close Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

UserCalendar.layout = (page: React.ReactNode) => page;