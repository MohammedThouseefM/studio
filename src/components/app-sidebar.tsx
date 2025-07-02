'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/lib/nav-links';
import Link from 'next/link';

type AppSidebarProps = {
  navItems: NavItem[];
};

function AppSidebarComponent({ navItems }: AppSidebarProps) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarHeader>
        {!isMobile && <SidebarTrigger />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.tooltip, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export const AppSidebar = memo(AppSidebarComponent);
