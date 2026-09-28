import React, { useState, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// ─── INLINE ICONS ────────────────────────────────────────────────────────────
const IconSearch = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconCoffee = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
const IconCheck = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconClock = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconVolume2 = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;
const IconVolumeX = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>;
const IconPlus = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconAlert = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconX = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// ─── TYPES ───────────────────────────────────────────────────────────────────
type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'rejected'
    | 'cancelled';

interface BackendOrderItem {
    id: number;
    quantity: number;
    unit_price: string;
    subtotal: string;
    menu_item: {
        id: number;
        name: string;
        price: string;
    };
}

interface BackendOrder {
    id: number;
    status: OrderStatus;
    payment_status: string;
    payment_method: string | null;
    pickup_time: string | null;
    total_amount: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    items: BackendOrderItem[];
}

interface OrderItem {
    name: string;
    qty: number;
    price: number;
}

interface Order {
    id: string;
    customer: string;
    items: OrderItem[];
    placedAt: number;
    pickupTime: string;
    status: OrderStatus;
    total: number;
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" ");

const formatTimer = (ms: number) => {
    if (ms < 0) {
        return "00:00";
    }

    const totalSecs = Math.floor(ms / 1000);

    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Simulated Web Audio API "ding"
const playDing = (muted: boolean) => {
    if (muted) {
return;
}

    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

        if (!AudioContext) {
return;
}

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.warn("AudioContext not supported or failed to play sound:", e);
    }
};


interface StaffCafeProps {
    orders: BackendOrder[];
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function StaffCafe({ 
    orders: backendOrders
}: StaffCafeProps) {
    const orders = useMemo<Order[]>(() => {
        return backendOrders.map((order) => ({
            id: String(order.id),
            customer: order.user.name,
            items: order.items.map((item) => ({
                name: item.menu_item.name,
                qty: item.quantity,
                price: Number(item.unit_price),
            })),
            placedAt: new Date(order.created_at).getTime(),
            pickupTime: order.pickup_time
                ? new Date(order.pickup_time).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                })
                : 'ASAP',
            status: order.status,
            total: Number(order.total_amount),
        }));
    }, [backendOrders]);
    const [now, setNow] = useState(() => Date.now());
    const [searchQuery, setSearchQuery] = useState("");
    const [isMuted, setIsMuted] = useState(false); // Default muted for browser autoplay policies


    // Global timer
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, []);

    


    return (
        <>
            <div className="flex flex-col h-[calc(100vh-5rem)] bg-white text-[#250D15] dark:bg-[#0B1120] dark:text-slate-200 font-sans overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                {/* INJECT CUSTOM ANIMATIONS */}
                <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes pulse-red-border {
                    0% { border-color: #C62828; box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.4); }
                    70% { border-color: #ef4444; box-shadow: 0 0 0 6px rgba(198, 40, 40, 0); }
                    100% { border-color: #C62828; box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); }
                }
                .urgent-pulse { animation: pulse-red-border 2s infinite; }
                @keyframes highlight-flash {
                    0% { background-color: #fef08a; }
                    100% { background-color: transparent; }
                }
                .flash-new { animation: highlight-flash 2s ease-out; }
            `}</style>

                {/* HEADER */}
                <header className="bg-white dark:bg-[#0F172A] border-b border-[#F2E5E8] dark:border-slate-800 p-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="w-10 h-10 rounded-xl bg-[#7D1933] flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                            <IconCoffee className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg md:text-xl font-bold text-[#7D1933] dark:text-white truncate">Café Order Display</h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64 min-w-0">
                            <IconSearch className="absolute left-3 top-2.5 w-4 h-4 text-[#7A4D58]/60 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search #ID or Name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-10 py-2 text-sm bg-white dark:bg-slate-900 border border-[#F2E5E8] dark:border-slate-700 rounded-xl outline-none focus:border-[#7D1933] dark:focus:border-rose-500 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2 top-1.5 p-1 text-[#7A4D58]/60 hover:text-[#7D1933] dark:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-lg bg-transparent"
                                    title="Clear search"
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2.5 rounded-xl border border-[#F2E5E8] dark:border-slate-700 text-[#7A4D58] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                            title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
                        >
                            {isMuted ? <IconVolumeX className="w-4 h-4" /> : <IconVolume2 className="w-4 h-4 text-[#7D1933] dark:text-rose-400" />}
                        </button>
                        {/* <button
                            onClick={simulateNewOrder}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7D1933] hover:bg-[#5f1327] dark:bg-rose-700 dark:hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                        >
                            <IconPlus className="w-4 h-4" /> New Order
                        </button> */}
                    </div>
                </header>

                {/* KANBAN BOARD */}
                <main className="flex-1 overflow-hidden min-w-0 flex flex-col p-4 md:p-6 pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 flex-1 min-w-0 pb-6 overflow-y-auto lg:overflow-hidden">

                        <KanbanColumn
                            title="Pending"
                            status="pending"
                            colorClass="bg-blue-500"
                            orders={orders}
                            now={now}
                            searchQuery={searchQuery}
                        />

                        <KanbanColumn
                            title="Confirmed"
                            status="confirmed"
                            colorClass="bg-indigo-500"
                            orders={orders}
                            now={now}
                            searchQuery={searchQuery}
                        />

                        <KanbanColumn
                            title="Preparing"
                            status="preparing"
                            colorClass="bg-amber-500"
                            orders={orders}
                            now={now}
                            searchQuery={searchQuery}
                        />

                        <KanbanColumn
                            title="Ready for Pickup"
                            status="ready"
                            colorClass="bg-[#2E7D32]"
                            orders={orders}
                            now={now}
                            searchQuery={searchQuery}
                        />

                        <KanbanColumn
                            title="Completed"
                            status="completed"
                            colorClass="bg-gray-400 dark:bg-slate-600"
                            orders={orders}
                            now={now}
                            searchQuery={searchQuery}
                        />
                    </div>
                </main>
            </div>
        </>
    );
}

StaffCafe.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            {
                title: 'Staff Cafe Queue',
                href: '/staff-cafe',
            },
        ]}
    >
        {page}
    </AppLayout>
);

// ─── KANBAN COLUMN COMPONENT ─────────────────────────────────────────────────
interface ColumnProps {
    title: string;
    status: OrderStatus;
    colorClass: string;
    orders: Order[];
    now: number;
    searchQuery: string;
}

function KanbanColumn({ title, status, colorClass, orders, now, searchQuery }: ColumnProps) {
    // Filter by status, search query, and sort old -> new
    const filteredOrders = useMemo(() => {
        let currentOrders = orders.filter(o => o.status === status);

        if (searchQuery.trim() !== "") {
            const terms = searchQuery.trim().toLowerCase().split(/\s+/);
            currentOrders = currentOrders.filter(o => {
                const searchString = `${o.id} ${o.customer}`.toLowerCase();

                return terms.every(term => searchString.includes(term));
            });
        }

        return currentOrders.sort((a, b) => a.placedAt - b.placedAt);
    }, [orders, status, searchQuery]);

    return (
        <div className="flex flex-col flex-1 h-[400px] lg:h-full bg-white dark:bg-[#0F172A] rounded-2xl border border-[#F2E5E8] dark:border-slate-800 shadow-sm overflow-hidden min-w-0">
            {/* Column Header */}
            <div className="p-4 border-b border-[#F2E5E8] dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", colorClass)} />
                    <h2 className="font-bold text-sm md:text-base truncate">{title}</h2>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-[#F2E5E8] dark:border-slate-700 text-xs font-bold shadow-sm">
                    {filteredOrders.length}
                </div>
            </div>

            {/* Scrollable Order List */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-3 md:p-4 space-y-3 relative">
                {filteredOrders.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-[#7A4D58]/50 dark:text-slate-500 opacity-60 pointer-events-none">
                        <IconCoffee className="w-10 h-10 mb-2" />
                        <p className="text-sm font-semibold text-center px-4">
                            {searchQuery ? "No matching orders" : "No orders here"}
                        </p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <OrderCard
                            order={order}
                            now={now}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// ─── ORDER CARD COMPONENT ────────────────────────────────────────────────────
interface CardProps {
    order: Order;
    now: number;
}

function OrderCard({ order, now }: CardProps) {
    const elapsedMs = Math.max(0, now - order.placedAt);
    const elapsedMins = elapsedMs / 60000;

    // Evaluate Urgency (only for active orders, not completed)
    let urgencyLevel = 'neutral';

    if (order.status !== 'completed') {
        if (elapsedMins >= 10) {
            urgencyLevel = 'danger';
            } else if (elapsedMins >= 5) {
            urgencyLevel = 'warning';
            } else {
            urgencyLevel = 'good';
            }
    }

    const isCompleted = order.status === 'completed';

    // Dynamic Classes based on urgency
    const cardBorderClasses = {
        good: "border-[#2E7D32]/30 dark:border-emerald-500/30",
        warning: "border-[#F9A825]/50 dark:border-amber-500/50",
        danger: "border-[#C62828] dark:border-red-500 urgent-pulse",
        neutral: "border-[#F2E5E8] dark:border-slate-700 opacity-70 grayscale"
    }[urgencyLevel];

    const timerColorClasses = {
        good: "text-[#2E7D32] bg-[#2E7D32]/10 dark:text-emerald-400 dark:bg-emerald-500/10",
        warning: "text-[#F9A825] bg-[#F9A825]/10 dark:text-amber-400 dark:bg-amber-500/10",
        danger: "text-[#C62828] bg-[#C62828]/10 font-bold dark:text-red-400 dark:bg-red-500/10",
        neutral: "text-[#7A4D58] bg-white dark:text-slate-400 dark:bg-slate-800"
    }[urgencyLevel];

    
    const buttonLabel = {
        pending: "Confirm Order",
        confirmed: "Start Preparing",
        preparing: "Mark Ready",
        ready: "Complete Pickup",
        completed: "",
        rejected: "",
        cancelled: "",
    }[order.status];

    const advanceOrderStatus = () => {
        let nextStatus: OrderStatus | null = null;

        switch (order.status) {
            case 'pending':
                nextStatus = 'confirmed';
                break;

            case 'confirmed':
                nextStatus = 'preparing';
                break;

            case 'preparing':
                nextStatus = 'ready';
                break;

            case 'ready':
                nextStatus = 'completed';
                break;

            default:
                return;
        }

        router.patch(
            `/cafe/orders/${order.id}/status`,
            {
                status: nextStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className={cn(
            "p-3 rounded-xl border flex flex-col gap-3 transition-all duration-300 shadow-sm bg-white dark:bg-[#0F172A]",
            cardBorderClasses,
        )}>
            {/* Header: ID, Timer, Priority */}
            <div className="flex items-start justify-between min-w-0 gap-2">
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-lg leading-none tracking-tight">#{order.id}</span>
                        {urgencyLevel === 'danger' && <IconAlert className="w-4 h-4 text-[#C62828] dark:text-red-500 animate-pulse" />}
                    </div>
                    <span className="text-[10px] font-bold text-[#7A4D58] dark:text-slate-500 uppercase tracking-widest mt-1 truncate">{order.pickupTime}</span>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <div
                        className={cn(
                            "px-2 py-0.5 rounded-md flex items-center gap-1.5 text-xs font-mono border border-transparent transition-colors",
                            timerColorClasses
                        )}
                    >
                        {!isCompleted && <IconClock className="w-3 h-3" />}
                        {isCompleted ? "Finished" : formatTimer(elapsedMs)}
                    </div>
                </div>
            </div>

            {/* Customer & Detailed Items List */}
            <div className="flex flex-col min-w-0">
                <p className="font-bold text-sm truncate">{order.customer}</p>
                <div className="flex flex-col mt-2 gap-1.5 text-xs text-[#7A4D58] dark:text-slate-400 min-w-0 pb-1">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between min-w-0 gap-2">
                            <span className="whitespace-normal break-words flex-1 leading-snug">
                                <span className="font-bold mr-1">{item.qty}x</span>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-[#F2E5E8] dark:border-slate-700/50">
                    <span className="text-xs font-semibold text-[#7A4D58] dark:text-slate-400">Total</span>
                    <span className="font-bold text-[#250D15] dark:text-slate-300">
                        ₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Action Button */}
            {!isCompleted ? (
                <button
                    onClick={advanceOrderStatus}
                    className="w-full mt-1 py-2.5 rounded-lg font-bold text-xs bg-white hover:bg-[#F2E5E8] text-[#7D1933] border border-[#F2E5E8] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors active:scale-[0.98]"
                >
                    {buttonLabel}
                </button>
            ) : (
                <div className="w-full mt-1 py-2 rounded-lg flex justify-center items-center text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                    <IconCheck className="w-5 h-5" />
                </div>
            )}
        </div>
    );
}