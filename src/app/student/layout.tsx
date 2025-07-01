'use client';

import type { PropsWithChildren } from 'react';
import { AppLayout } from '@/components/app-layout';
import { studentNavItems } from '@/lib/nav-links';

export default function StudentLayout({ children }: PropsWithChildren) {
  return (
    <AppLayout navItems={studentNavItems} userType="Student">
      {children}
    </AppLayout>
  );
}
