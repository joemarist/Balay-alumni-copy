import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel> </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                            className="relative font-medium text-[#3A1A1F] transition-colors hover:bg-[#FAF0EE] hover:text-[#6B1E28] data-[active=true]:bg-[#F7E3E0] data-[active=true]:font-semibold data-[active=true]:text-[#6B1E28] data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1 data-[active=true]:before:bottom-1 data-[active=true]:before:w-1.5 data-[active=true]:before:rounded-r-md data-[active=true]:before:bg-[#6B1E28] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:data-[active=true]:bg-neutral-800 dark:data-[active=true]:text-white dark:data-[active=true]:before:bg-[#6B1E28]"
                        >
                            <Link href={toUrl(item.href)}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
