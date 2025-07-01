'use client';

import type { PropsWithChildren } from 'react';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import type { NavItem } from '@/lib/nav-links';

type AppLayoutProps = {
  navItems: NavItem[];
  userType: 'Student' | 'Teacher';
};

export function AppLayout({ children, navItems, userType }: PropsWithChildren<AppLayoutProps>) {
  return (
    <SidebarProvider>
      <div className="flex flex-row">
        <AppSidebar navItems={navItems} />
        <SidebarInset>
            <DashboardHeader userType={userType} />
            <main className="flex-1">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
