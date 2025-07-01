import {
  LayoutDashboard,
  User,
  CalendarPlus,
  Star,
  Calendar,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

export const studentNavItems: NavItem[] = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/student/profile', label: 'My Profile', icon: User, tooltip: 'Profile' },
  { href: '/student/leave', label: 'Leave Requests', icon: CalendarPlus, tooltip: 'Leave Requests' },
  { href: '/student/feedback', label: 'Course Feedback', icon: Star, tooltip: 'Course Feedback' },
  { href: '/student/calendar', label: 'Full Calendar', icon: Calendar, tooltip: 'Full Calendar' },
];

export const teacherNavItems: NavItem[] = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  // All other teacher functionality is on the dashboard page via tabs, so one link is enough for now.
];
