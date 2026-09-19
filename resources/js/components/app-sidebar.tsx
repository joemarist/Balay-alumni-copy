import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    Bell,
    Building2,
    Calendar,
    CalendarCheck,
    CalendarDays,
    ClipboardList,
    Coffee,
    CreditCard,
    Gift,
    Home,
    LayoutDashboard,
    Package,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
    cafe,
    dashboard,
    notifications,
    packages,
    payments,
    reports,
    reservations,
    scheduling,
    users,
    venues,
} from '@/routes';
import adminRoutes from '@/routes/admin';
import staffRoutes from '@/routes/staff';
import type { NavItem } from '@/types';

// Full menu for Admin / Superadmin
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminRoutes.dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Users & Staff',
        href: users(),
        icon: Users,
    },
    {
        title: 'Venues',
        href: adminRoutes.venues(),
        icon: Building2,
    },
    {
        title: 'Reservations',
        href: reservations(),
        icon: CalendarCheck,
    },
    {
        title: 'Scheduling',
        href: adminRoutes.scheduling(),
        icon: CalendarDays,
    },
    {
        title: 'Assigned Events',
        href: '/assigned-events',
        icon: ClipboardList,
    },
    {
        title: 'Cafe & Orders',
        href: adminRoutes.cafe(),
        icon: Coffee,
    },
    {
        title: 'Event Packages',
        href: adminRoutes.packages(),
        icon: Package,
    },
    {
        title: 'Payments',
        href: payments(),
        icon: CreditCard,
    },
    {
        title: 'Reports',
        href: reports(),
        icon: BarChart3,
    },
    {
        title: 'Notifications',
        href: notifications(),
        icon: Bell,
    },
    {
        title: 'Activity Logs',
        href: '/activity-logs',
        icon: Activity,
    },
];

// Dedicated menu for Staff
const staffNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: staffRoutes.dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Cafe Queue',
        href: '/staff-cafe',
        icon: Coffee,
    },
    {
        title: 'Assigned Events',
        href: '/assigned-events',
        icon: ClipboardList,
    },
    {
        title: 'Notifications',
        href: notifications(),
        icon: Bell,
    },
];

// Dedicated menu for Customer / Regular User
const customerNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/user-dashboard',
        icon: Home,
    },
    {
        title: 'Venues',
        href: venues(),
        icon: Building2,
    },
    {
        title: 'Calendar',
        href: scheduling(),
        icon: Calendar,
    },
    {
        title: 'Event Packages',
        href: packages(),
        icon: Gift,
    },
    {
        title: 'Café',
        href: cafe(),
        icon: Coffee,
    },
    {
        title: 'Payments',
        href: payments(),
        icon: CreditCard,
    },
    {
        title: 'Notifications',
        href: notifications(),
        icon: Bell,
    },
];



export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles ?? [];

    const isAdmin = ['admin', 'superadmin'].some((role) =>
        userRoles.includes(role),
    );
    const isStaff = userRoles.includes('staff');

    // Determine which nav to show based on role priority
    const navItems = isAdmin ? adminNavItems : isStaff ? staffNavItems : customerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={typeof dashboard() === 'string' ? dashboard() : (dashboard() as any).url}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>


        </Sidebar>
    );
}
