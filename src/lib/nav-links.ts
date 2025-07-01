import {
  LayoutDashboard,
  User,
  CalendarPlus,
  Star,
  Calendar,
  MailCheck,
  CalendarX,
  Users,
  Shield,
  ClipboardEdit,
  Megaphone,
  Settings,
  CalendarClock,
  BookCopy,
  FileText,
  History,
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
  { href: '/teacher/registrations', label: 'Registrations', icon: MailCheck, tooltip: 'Student Registrations' },
  { href: '/teacher/leave-requests', label: 'Leave Requests', icon: CalendarX, tooltip: 'Leave Requests' },
  { href: '/teacher/student-management', label: 'Students', icon: Users, tooltip: 'Student Management' },
  { href: '/teacher/staff-management', label: 'Staff', icon: Shield, tooltip: 'Staff Management' },
  { href: '/teacher/academic-structure', label: 'Structure', icon: ClipboardEdit, tooltip: 'Academic Structure' },
  { href: '/teacher/announcements', label: 'Announcements', icon: Megaphone, tooltip: 'Announcements' },
  { href: '/teacher/academic-settings', label: 'Calendar Settings', icon: Settings, tooltip: 'Academic Settings' },
  { href: '/teacher/timetable', label: 'Timetable', icon: CalendarClock, tooltip: 'Timetable Editor' },
  { href: '/teacher/seating-plan', label: 'Seating Plan', icon: BookCopy, tooltip: 'Exam Seating Plan' },
  { href: '/teacher/reports', label: 'Reports', icon: FileText, tooltip: 'Reports & Analytics' },
  { href: '/teacher/feedback', label: 'Feedback', icon: Star, tooltip: 'Student Feedback' },
  { href: '/teacher/audit-logs', label: 'Audit Logs', icon: History, tooltip: 'Audit Logs' },
];
