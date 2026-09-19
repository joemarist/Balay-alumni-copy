import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    CircleAlert,
    Bell,
    CloudRain,
    Trash2,
    Check,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { notifications } from '@/routes';


type NotificationType =
    | 'success'
    | 'warning'
    | 'info'
    | 'weather';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    type: NotificationType;
    unread: boolean;
}

const initialNotifications: NotificationItem[] = [
    {
        id: 1,
        title: 'Reservation Approved',
        message:
            'Your booking for Garden Terrace on Jul 22 has been confirmed.',
        time: '2 min ago',
        type: 'success',
        unread: true,
    },
    {
        id: 2,
        title: 'Payment Reminder',
        message:
            'Down payment of ₱3,250 for Booking #B-2024-089 is due in 3 days.',
        time: '1 hr ago',
        type: 'warning',
        unread: true,
    },
    {
        id: 3,
        title: 'Café Order Ready',
        message:
            'Your order #C-1047 (Cappuccino + Croissant) is ready for pickup.',
        time: '2 hrs ago',
        type: 'info',
        unread: true,
    },
    {
        id: 4,
        title: 'Weather Alert',
        message:
            'Typhoon Signal No. 1 may affect outdoor events Jul 25–26. Consider rescheduling.',
        time: '3 hrs ago',
        type: 'weather',
        unread: false,
    },
    {
        id: 5,
        title: 'Upcoming Event Reminder',
        message:
            'Batch 2015 Reunion at Alumni Courtyard is in 2 days.',
        time: '5 hrs ago',
        type: 'info',
        unread: false,
    },
    {
        id: 6,
        title: 'Payment Confirmed',
        message:
            'Full payment of ₱55,000 for Dungan Package received.',
        time: 'Yesterday',
        type: 'success',
        unread: false,
    },
];

function NotificationIcon({
                              type,
                          }: {
    type: NotificationType;
}) {
    if (type === 'success') {
        return (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2
                    className="h-5 w-5 text-green-600"
                    strokeWidth={2}
                />
            </div>
        );
    }

    if (type === 'warning') {
        return (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-50">
                <CircleAlert
                    className="h-5 w-5 text-orange-500"
                    strokeWidth={2}
                />
            </div>
        );
    }

    if (type === 'weather') {
        return (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50">
                <CloudRain
                    className="h-5 w-5 text-red-500"
                    strokeWidth={2}
                />
            </div>
        );
    }

    return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <Bell
                className="h-5 w-5 text-blue-500"
                strokeWidth={2}
            />
        </div>
    );
}

export default function Notifications() {
    const [notificationList, setNotificationList] =
        useState<NotificationItem[]>(initialNotifications);

    const [selectedNotification, setSelectedNotification] =
        useState<NotificationItem | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);

    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    const unreadCount = notificationList.filter(
        (notification) => notification.unread,
    ).length;

    /*
     * Open notification details
     */
    const openNotification = (
        notification: NotificationItem,
    ) => {
        setSelectedNotification(notification);
        setDetailsOpen(true);
    };

    /*
     * Mark all notifications as read
     */
    const markAllAsRead = () => {
        setNotificationList((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            })),
        );

        if (selectedNotification) {
            setSelectedNotification({
                ...selectedNotification,
                unread: false,
            });
        }
    };

    /*
     * Mark individual notification as read
     */
    const markAsRead = (id: number) => {
        setNotificationList((current) =>
            current.map((notification) =>
                notification.id === id
                    ? {
                        ...notification,
                        unread: false,
                    }
                    : notification,
            ),
        );

        if (selectedNotification?.id === id) {
            setSelectedNotification({
                ...selectedNotification,
                unread: false,
            });
        }
    };

    /*
     * Delete individual notification
     */
    const deleteNotification = (id: number) => {
        setNotificationList((current) =>
            current.filter(
                (notification) => notification.id !== id,
            ),
        );

        setDetailsOpen(false);
        setSelectedNotification(null);
    };

    /*
     * Delete all notifications
     */
    const deleteAllNotifications = () => {
        setNotificationList([]);
        setDeleteAllOpen(false);
        setDetailsOpen(false);
        setSelectedNotification(null);
    };

    return (
        <>
            <Head title="Notifications" />

            <div className="min-h-screen w-full bg-[#fffafa] px-7 pb-12 pt-8">

                {/* Header */}
                <div className="mb-8 flex items-start justify-between">

                    <div>
                        <h1 className="font-serif text-2xl font-bold text-[#161622]">
                            Notifications
                        </h1>

                        <p className="mt-1 text-sm text-[#744b55]">
                            {unreadCount} unread
                        </p>
                    </div>

                    <div className="flex items-center gap-2">

                        {/* Mark All Read */}
                        <Button
                            variant="ghost"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                            className="text-sm font-medium text-[#8f1735] hover:bg-transparent hover:text-[#74132d]"
                        >
                            <Check className="mr-1.5 h-4 w-4" />
                            Mark all read
                        </Button>

                        {/* Delete All */}
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteAllOpen(true)}
                            disabled={notificationList.length === 0}
                            className="text-sm font-medium text-red-600 hover:bg-transparent hover:text-red-700"
                        >
                            <Trash2 className="mr-1.5 h-4 w-4" />
                            Delete all
                        </Button>

                    </div>

                </div>

                {/* Notification List */}
                <div className="space-y-4">

                    {notificationList.length === 0 ? (

                        <Card className="flex min-h-[250px] items-center justify-center rounded-[18px] border border-[#eadfe2] bg-white shadow-none">

                            <div className="text-center">

                                <Bell className="mx-auto mb-3 h-10 w-10 text-[#b98b96]" />

                                <h2 className="text-base font-semibold text-[#161622]">
                                    No notifications
                                </h2>

                                <p className="mt-1 text-sm text-[#744b55]">
                                    You're all caught up.
                                </p>

                            </div>

                        </Card>

                    ) : (

                        notificationList.map((notification) => (

                            <Card
                                key={notification.id}
                                onClick={() =>
                                    openNotification(notification)
                                }
                                className={`
                                    cursor-pointer rounded-[18px]
                                    border border-[#eadfe2]
                                    bg-white p-0 shadow-none
                                    transition-all duration-200
                                    hover:shadow-sm
                                    ${
                                    notification.unread
                                        ? 'border-l-[5px] border-l-[#8f1735]'
                                        : ''
                                }
                                `}
                            >

                                <div className="flex min-h-[100px] items-center gap-4 px-6 py-5">

                                    {/* Icon */}
                                    <NotificationIcon
                                        type={notification.type}
                                    />

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">

                                        <h2 className="text-sm font-semibold text-[#11111a]">
                                            {notification.title}
                                        </h2>

                                        <p className="mt-1 text-sm leading-6 text-[#744b55]">
                                            {notification.message}
                                        </p>

                                    </div>

                                    {/* Time */}
                                    <div className="flex shrink-0 items-center gap-4 self-start pt-1">

                                        <span className="text-xs text-[#89515c]">
                                            {notification.time}
                                        </span>

                                        {notification.unread && (
                                            <span className="h-2.5 w-2.5 rounded-full bg-[#8f1735]" />
                                        )}

                                    </div>

                                </div>

                            </Card>

                        ))

                    )}

                </div>

            </div>

            {/* =====================================================
                NOTIFICATION DETAILS MODAL
            ====================================================== */}

            <Dialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            >
                <DialogContent className="sm:max-w-[500px]">

                    {selectedNotification && (
                        <>
                            <DialogHeader>

                                <div className="mb-4 flex items-center gap-3">
                                    <NotificationIcon
                                        type={
                                            selectedNotification.type
                                        }
                                    />

                                    <div>
                                        <DialogTitle className="text-lg">
                                            {selectedNotification.title}
                                        </DialogTitle>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {selectedNotification.time}
                                        </p>
                                    </div>
                                </div>

                                <DialogDescription className="pt-2 text-sm leading-6 text-[#744b55]">
                                    {selectedNotification.message}
                                </DialogDescription>

                            </DialogHeader>

                            <DialogFooter className="mt-5 gap-2 sm:justify-between">

                                {/* Delete Notification */}
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        deleteNotification(
                                            selectedNotification.id,
                                        )
                                    }
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete notification
                                </Button>

                                {/* Mark As Read */}
                                {selectedNotification.unread && (
                                    <Button
                                        onClick={() =>
                                            markAsRead(
                                                selectedNotification.id,
                                            )
                                        }
                                        className="bg-[#941b3b] text-white hover:bg-[#76152f]"
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Mark as read
                                    </Button>
                                )}

                            </DialogFooter>
                        </>
                    )}

                </DialogContent>
            </Dialog>

            {/* =====================================================
                DELETE ALL CONFIRMATION MODAL
            ====================================================== */}

            <Dialog
                open={deleteAllOpen}
                onOpenChange={setDeleteAllOpen}
            >
                <DialogContent className="sm:max-w-[425px]">

                    <DialogHeader>

                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>

                        <DialogTitle>
                            Delete all notifications?
                        </DialogTitle>

                        <DialogDescription className="pt-1">
                            This will permanently remove all{' '}
                            <span className="font-medium text-[#161622]">
                                {notificationList.length}
                            </span>{' '}
                            notifications. This action cannot be undone.
                        </DialogDescription>

                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-2">

                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteAllOpen(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={deleteAllNotifications}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete all
                        </Button>

                    </DialogFooter>

                </DialogContent>
            </Dialog>
        </>
    );
}

Notifications.layout = {
    breadcrumbs: [
        {
            title: 'Notifications',
            href: notifications(),
        },
    ],
};
