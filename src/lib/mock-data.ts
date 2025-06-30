// Mock data for the application

export type Student = {
  id: string;
  name: string;
  rollNumber: string;
};

export type AttendanceRecord = {
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export const students: Student[] = [
  { id: '101', name: 'Aarav Sharma', rollNumber: 'BCA-01' },
  { id: '102', name: 'Diya Patel', rollNumber: 'BCA-02' },
  { id: '103', name: 'Rohan Gupta', rollNumber: 'BCA-03' },
  { id: '104', name: 'Priya Singh', rollNumber: 'BCA-04' },
  { id: '105', name: 'Arjun Verma', rollNumber: 'BCA-05' },
  { id: '106', name: 'Saanvi Kumar', rollNumber: 'BCA-06' },
  { id: '107', name: 'Advik Reddy', rollNumber: 'BCA-07' },
  { id: '108', name: 'Isha Desai', rollNumber: 'BCA-08' },
  { id: '109', name: 'Kabir Joshi', rollNumber: 'BCA-09' },
  { id: '110', name: 'Myra Mehta', rollNumber: 'BCA-10' },
];

export const previousAttendanceData = [
  // Week 1
  { date: '2024-07-01', studentId: '101', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '102', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '103', attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: '104', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '105', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '106', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '107', attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: '108', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '109', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '110', attendanceStatus: 'present' as const },
  // Week 2
  { date: '2024-07-08', studentId: '101', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '102', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '103', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '104', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '105', attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: '106', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '107', attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: '108', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '109', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '110', attendanceStatus: 'absent' as const },
];

export const studentAttendance = {
  totalPercentage: 85,
  subjects: [
    { name: 'Data Structures', percentage: 90 },
    { name: 'Algorithms', percentage: 80 },
    { name: 'Database Management', percentage: 75 },
    { name: 'Operating Systems', percentage: 95 },
  ],
  monthly: [
    { month: 'Jan', present: 20, total: 22 },
    { month: 'Feb', present: 18, total: 20 },
    { month: 'Mar', present: 21, total: 24 },
    { month: 'Apr', present: 19, total: 21 },
    { month: 'May', present: 22, total: 22 },
    { month: 'Jun', present: 17, total: 20 },
  ],
};

export const announcements: Announcement[] = [
  { id: '1', title: 'Mid-term Exams Schedule', content: 'The mid-term exams will be held from August 5th to August 12th. The detailed schedule is available on the college website.', date: '2024-07-10' },
  { id: '2', title: 'Annual Sports Day', content: 'Get ready for the annual sports day on August 20th! Registrations are open until August 15th.', date: '2024-07-08' },
  { id: '3', title: 'Library Closure', content: 'The college library will be closed this weekend for maintenance.', date: '2024-07-05' },
];

export const collegeData = {
  departments: ['BCA', 'BSC', 'BBA', 'BCOM'],
  years: ['1st Year', '2nd Year', '3rd Year'],
  subjects: {
    BCA: ['Data Structures', 'Algorithms', 'Web Development'],
    BSC: ['Physics', 'Chemistry', 'Mathematics'],
    BBA: ['Marketing', 'Finance', 'Human Resources'],
    BCOM: ['Accounting', 'Business Law', 'Economics'],
  },
};
