import { Head } from '@inertiajs/react';
import {
    Activity,
    Search,
    Download,
    X,
    User,
    FileText,
    Database,
    ShieldAlert,
    Check,
} from 'lucide-react';
import { useState, useMemo } from 'react';

type LogLevel = 'info' | 'warning' | 'danger' | 'success';

interface ActivityLog {
    id: string;
    timestamp: string;
    causer: string;
    causerRole: string;
    subject: string;
    action: string;
    description: string;
    level: LogLevel;
    properties: string; // JSON string for dummy display
}
interface ActivityLogsProps {
    logs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}


export default function ActivityLogs({ logs }: ActivityLogsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Filter logic
    const filteredLogs = useMemo(() => {
    return logs.data.filter((log) => {
        const query = searchQuery.toLowerCase();

        const matchesQuery =
            !query ||
                    log.causer.toLowerCase().includes(query) ||
                    log.action.toLowerCase().includes(query) ||
                    log.subject.toLowerCase().includes(query) ||
                    log.description.toLowerCase().includes(query);

                const matchesDate =
                    !dateFilter || log.timestamp.includes(dateFilter);

                return matchesQuery && matchesDate;
            });
        }, [logs.data, searchQuery, dateFilter]);

    const getLevelBadge = (level: LogLevel) => {
        switch (level) {
            case 'success':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
            case 'info':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
            case 'warning':
                return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
            case 'danger':
                return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
        }
    };

    const getActionIcon = (level: LogLevel) => {
        switch (level) {
            case 'success':
                return <Check className="size-4 text-emerald-600 dark:text-emerald-400" />;
            case 'info':
                return <FileText className="size-4 text-blue-600 dark:text-blue-400" />;
            case 'warning':
                return <ShieldAlert className="size-4 text-amber-600 dark:text-amber-400" />;
            case 'danger':
                return <Database className="size-4 text-rose-600 dark:text-rose-400" />;
        }
    }

    return (
        <>
            <Head title="Activity Logs (Admin)" />

            <div className="flex flex-1 flex-col gap-6 bg-background p-4 sm:p-6 dark:bg-neutral-950">
                
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-[#3A1A1F] dark:text-neutral-100 sm:text-3xl">
                            System Activity Logs
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            Monitor and audit all user actions and system events.
                        </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 dark:hover:bg-neutral-800"
                        >
                            <Download className="size-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Export Logs</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                        <div className="relative min-w-[220px] flex-1 sm:w-80">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search causer, subject, or action..."
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

                        <div className="relative">
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 focus:border-[#6B1E28] focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:focus:border-[#881337]"
                            />
                        </div>
                        
                        {dateFilter && (
                            <button
                                type="button"
                                onClick={() => setDateFilter('')}
                                className="rounded-xl border border-neutral-200 bg-white px-2.5 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                            >
                                Clear Date
                            </button>
                        )}
                    </div>

                    <div className="max-h-[500px] overflow-auto rounded-xl border border-neutral-200/80 dark:border-neutral-800 mt-2">
                        <table className="relative w-full min-w-[800px] text-left text-xs">
                            <thead className="sticky top-0 z-10 bg-neutral-50 font-semibold uppercase tracking-wider text-neutral-500 shadow-sm dark:bg-neutral-800 dark:text-neutral-400">
                                <tr>
                                    <th className="px-4 py-3.5">Timestamp</th>
                                    <th className="px-4 py-3.5">Causer</th>
                                    <th className="px-4 py-3.5">Action</th>
                                    <th className="px-4 py-3.5">Subject</th>
                                    <th className="px-4 py-3.5 w-[300px]">Properties / Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200/70 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
                                {filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-neutral-400 dark:text-neutral-500">
                                            <Activity className="mx-auto mb-2 size-8 text-neutral-300 dark:text-neutral-600" />
                                            <p className="font-medium">No activity logs found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr
                                            key={log.id}
                                            className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                                                {log.timestamp}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                                                        <User className="size-3" />
                                                    </div>
                                                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                        {log.causer}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLevelBadge(log.level)}`}>
                                                        {getActionIcon(log.level)}
                                                        {log.action}
                                                    </span>
                                                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{log.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-neutral-700 dark:text-neutral-300">
                                                {log.subject}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex flex-col gap-1.5">
                                                    {(() => {
                                                        try {
                                                            const props = JSON.parse(log.properties);
                                                            
                                                            const hasOld = props.old && Object.keys(props.old).length > 0;
                                                            const hasNew = props.attributes && Object.keys(props.attributes).length > 0;
                                                            
                                                            if (hasOld && hasNew) {
                                                                return Object.keys(props.attributes).map(key => (
                                                                    <div key={key} className="flex items-center gap-1.5 text-[11px] flex-wrap">
                                                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 line-through">{String(props.old[key])}</span>
                                                                        <span className="text-neutral-400 text-[10px]">➔</span>
                                                                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium">{String(props.attributes[key])}</span>
                                                                    </div>
                                                                ));
                                                            } else if (hasNew) {
                                                                return Object.keys(props.attributes).map(key => (
                                                                    <div key={key} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                                                         <span className="font-semibold text-neutral-700 dark:text-neutral-300 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                         <span className="text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5">{String(props.attributes[key])}</span>
                                                                    </div>
                                                                ));
                                                            } else if (hasOld) {
                                                                return Object.keys(props.old).map(key => (
                                                                    <div key={key} className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                                                         <span className="font-semibold text-neutral-700 dark:text-neutral-300 capitalize">{key.replace(/_/g, ' ')}:</span>
                                                                         <span className="text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded px-1.5 py-0.5 line-through">{String(props.old[key])}</span>
                                                                    </div>
                                                                ));
                                                            }

                                                            return <span className="text-neutral-400 text-[11px] italic">No details recorded</span>;
                                                        } catch {
                                                            return <span className="text-neutral-400 text-[11px]">Invalid data</span>;
                                                        }
                                                    })()}
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
        </>
    );
}
