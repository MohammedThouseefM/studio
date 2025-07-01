

import { subDays } from 'date-fns';

// Mock data for the application

export type Student = {
  id: string; // university_number
  rollNumber: string;
  name: string;
  dob: string;
  university_number: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  photoUrl?: string;
  gender: 'Male' | 'Female' | 'Other';
  currentSemester: string;
  academicYear: string;
  address: string;
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

export type CalendarEvent = {
  date: string; // YYYY-MM-DD
  title: string;
  type: 'holiday' | 'exam' | 'assignment' | 'event';
  description?: string;
};

export type ClassTimeTable = {
  [day: string]: string[];
};

export type DepartmentTimeTable = {
  [year: string]: ClassTimeTable;
};

export type FullTimeTable = {
  [department: string]: DepartmentTimeTable;
};

export type Exam = {
  id: string;
  subject: string;
  date: string;
  time: string;
  room: string;
};

export type DepartmentExamTimeTable = {
  [year: string]: Exam[];
};

export type FullExamTimeTable = {
  [department: string]: DepartmentExamTimeTable;
};

export type Teacher = {
  id: string;
  password: string;
  name: string;
};

export type DailyAttendance = {
  hour: string;
  subject: string;
  status: 'present' | 'absent' | 'not-marked';
};

export type LeaveRequest = {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  year: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
};

export type AuditLog = {
    id: string;
    timestamp: Date;
    user: string; // Teacher ID
    action: string;
    type: 'student' | 'teacher' | 'announcement' | 'attendance' | 'leave' | 'academic';
};

export type FeedbackSession = {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'closed';
};

export type Feedback = {
    id: string;
    sessionId: string;
    studentId: string; // Kept for preventing duplicate submissions, but not shown in analytics
    subject: string;
    rating: number; // 1 to 5
    comment?: string;
};


export const teachers: Teacher[] = [
    { id: 'TEACHER01', password: 'password', name: 'Dr. Evelyn Reed' },
    { id: 'TEACHER02', password: 'password123', name: 'Prof. Samuel Cruz' }
];

const rawStudents = [
    { "roll_no": "3BCA-28", "name": "Mohammed Thouseef", "dob": "2005-12-12", "university_number": "36623U09028", "department": "BCA", "year": "3rd Year", "email": "mthouseef100@gmail.com", "phone": "986578987", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "123 Main St, Anytown, India" },
    { "roll_no": "3BCA-15", "name": "Priya Verma", "dob": "2004-08-05", "university_number": "36623U09015", "department": "BCA", "year": "3rd Year", "email": "priya.verma@gmail.com", "phone": "8876543210", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "456 Oak Ave, Anytown, India" },
    { "roll_no": "3BCA-42", "name": "Rahul Desai", "dob": "2005-03-22", "university_number": "36623U09042", "department": "BCA", "year": "3rd Year", "email": "rahul.desai@gmail.com", "phone": "7765432109", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "789 Pine Ln, Anytown, India" },
    { "roll_no": "3BSC-07", "name": "Ananya Joshi", "dob": "2004-09-14", "university_number": "36623U08007", "department": "BSC", "year": "3rd Year", "email": "ananya.joshi@gmail.com", "phone": "9988776655", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "101 Maple Dr, Anytown, India" },
    { "roll_no": "3BSC-19", "name": "Karan Patel", "dob": "2005-11-30", "university_number": "36623U08019", "department": "BSC", "year": "3rd Year", "email": "karan.patel@gmail.com", "phone": "8899001122", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "212 Birch Rd, Anytown, India" },
    { "roll_no": "3BSC-33", "name": "Sneha Menon", "dob": "2005-01-17", "university_number": "36623U08033", "department": "BSC", "year": "3rd Year", "email": "sneha.menon@gmail.com", "phone": "7788990011", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "333 Cedar Ct, Anytown, India" },
    { "roll_no": "3BBA-12", "name": "Aditya Rao", "dob": "2004-04-08", "university_number": "36623U07012", "department": "BBA", "year": "3rd Year", "email": "aditya.rao@gmail.com", "phone": "9876543210", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "444 Elm St, Anytown, India" },
    { "roll_no": "3BBA-25", "name": "Divya Iyer", "dob": "2005-07-25", "university_number": "36623U07025", "department": "BBA", "year": "3rd Year", "email": "divya.iyer@gmail.com", "phone": "8765432109", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "555 Spruce Way, Anytown, India" },
    { "roll_no": "3BBA-38", "name": "Vikram Choudhary", "dob": "2004-10-03", "university_number": "36623U07038", "department": "BBA", "year": "3rd Year", "email": "vikram.c@gmail.com", "phone": "7654321098", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "666 Walnut Blvd, Anytown, India" },
    { "roll_no": "3BCOM-05", "name": "Neha Gupta", "dob": "2005-06-19", "university_number": "36623U06005", "department": "BCOM", "year": "3rd Year", "email": "neha.gupta@gmail.com", "phone": "6543210987", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "777 Aspen Ave, Anytown, India" },
    { "roll_no": "3BCOM-21", "name": "Rajesh Khanna", "dob": "2004-12-11", "university_number": "36623U06021", "department": "BCOM", "year": "3rd Year", "email": "rajesh.k@gmail.com", "phone": "9432109876", "gender": "Male" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "888 Willow Dr, Anytown, India" },
    { "roll_no": "3BCOM-14", "name": "Swati Nair", "dob": "2005-02-28", "university_number": "36623U06014", "department": "BCOM", "year": "3rd Year", "email": "swati.nair@gmail.com", "phone": "8321098765", "gender": "Female" as const, "currentSemester": "6th", "academicYear": "2024-2025", "address": "999 Poplar Pl, Anytown, India" }
];

export const students: Student[] = rawStudents.map(s => ({
  ...s,
  id: s.university_number,
  rollNumber: s.roll_no,
  photoUrl: '',
}));

export const pendingStudents: Student[] = [
    { "id": "PENDING-001", "roll_no": "1BCA-NEW", "name": "Aarav Sharma", "dob": "2006-05-20", "university_number": "APP-2024-001", "department": "BCA", "year": "1st Year", "email": "aarav.sharma.new@example.com", "phone": "9123456789", "gender": "Male" as const, "currentSemester": "1st", "academicYear": "2024-2025", "address": "15 Cherry Blossom Lane, New Delhi" },
    { "id": "PENDING-002", "roll_no": "1BSC-NEW", "name": "Isha Singh", "dob": "2006-04-11", "university_number": "APP-2024-002", "department": "BSC", "year": "1st Year", "email": "isha.singh.new@example.com", "phone": "9234567890", "gender": "Female" as const, "currentSemester": "1st", "academicYear": "2024-2025", "address": "22 Rosewood Drive, Mumbai" }
].map(s => ({
  ...s,
  rollNumber: s.roll_no,
  photoUrl: '',
}));


export const studentUsers = students.map(student => ({
  id: student.university_number,
  password: student.dob,
}));

export const teacherUsers = teachers;

export const previousAttendanceData = [
  // Week 1
  { date: '2024-07-01', studentId: '36623U09028', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U09015', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U09042', attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: '36623U08007', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U08019', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U08033', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U07012', attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: '36623U07025', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U07038', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623U06005', attendanceStatus: 'present' as const },
  // Week 2
  { date: '2024-07-08', studentId: '36623U09028', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U09015', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U09042', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U08007', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U08019', attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: '36623U08033', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U07012', attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: '36623U07025', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U07038', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623U06005', attendanceStatus: 'absent' as const },
];

export const studentAttendance = {
  totalPercentage: 70,
  subjects: [
    { name: 'Data Structures', percentage: 70 },
    { name: 'Algorithms', percentage: 65 },
    { name: 'Database Management', percentage: 75 },
    { name: 'Operating Systems', percentage: 70 },
  ],
  monthly: [
    { month: 'Jan', present: 20, total: 22 },
    { month: 'Feb', present: 18, total: 20 },
    { month: 'Mar', present: 21, total: 24 },
    { month: 'Apr', present: 15, total: 21 },
    { month: 'May', present: 16, total: 22 },
    { month: 'Jun', present: 14, total: 20 },
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
  hours: ['1st Hour', '2nd Hour', '3rd Hour', '4th Hour', '5th Hour'],
};

export const defaultTimetable: ClassTimeTable = {
  'D1': ['-', '-', '-', '-', '-'],
  'D2': ['-', '-', '-', '-', '-'],
  'D3': ['-', '-', '-', '-', '-'],
  'D4': ['-', '-', '-', '-', '-'],
  'D5': ['-', '-', '-', '-', '-'],
  'D6': ['-', '-', '-', '-', '-'],
};

const bca3rdYearTimeTable: ClassTimeTable = {
  'D1': ['Data Structures', 'Algorithms', 'Web Tech', 'OS', 'Project Lab'],
  'D2': ['Algorithms', 'OS', 'DS', 'Web Tech', 'DBMS'],
  'D3': ['DBMS', 'DS', 'OS', 'Algorithms', 'Web Tech'],
  'D4': ['OS', 'DBMS', 'Web Tech', 'Algorithms', 'DS'],
  'D5': ['DS', 'Algorithms', 'DBMS', 'Project Work', 'Seminar'],
  'D6': ['-', '-', '-', '-', '-'],
};

export const timeTable: FullTimeTable = {
  'BCA': { '1st Year': defaultTimetable, '2nd Year': defaultTimetable, '3rd Year': bca3rdYearTimeTable },
  'BSC': { '1st Year': defaultTimetable, '2nd Year': defaultTimetable, '3rd Year': defaultTimetable },
  'BBA': { '1st Year': defaultTimetable, '2nd Year': defaultTimetable, '3rd Year': defaultTimetable },
  'BCOM': { '1st Year': defaultTimetable, '2nd Year': defaultTimetable, '3rd Year': defaultTimetable },
};

export const academicCalendarEvents: CalendarEvent[] = [
  { date: '2024-08-05', title: 'Mid-term Exams Start', type: 'exam', description: 'Best of luck to all students.' },
  { date: '2024-08-06', title: 'Mid-term Exam: Data Structures', type: 'exam' },
  { date: '2024-08-07', title: 'Mid-term Exam: Algorithms', type: 'exam' },
  { date: '2024-08-08', title: 'Mid-term Exam: OS', type: 'exam' },
  { date: '2024-08-09', title: 'Mid-term Exam: DBMS', type: 'exam' },
  { date: '2024-08-12', title: 'Mid-term Exams End', type: 'exam' },
  { date: '2024-08-15', title: 'Independence Day', type: 'holiday', description: 'College will be closed.' },
  { date: '2024-08-20', title: 'Annual Sports Day', type: 'event', description: 'Join us at the sports complex.' },
  { date: '2024-08-25', title: 'DSA Assignment Due', type: 'assignment', description: 'Submit the linked list implementation.' },
  { date: '2024-09-05', title: "Teacher's Day", type: 'event', description: 'Special assembly at 10 AM.' },
  { date: '2024-09-15', title: 'OS Assignment Due', type: 'assignment', description: 'Submit the report on process scheduling.' },
  { date: '2024-10-02', title: 'Gandhi Jayanti', type: 'holiday', description: 'College will be closed.' },
  { date: '2024-10-15', title: 'Final Project Submissions', type: 'assignment', description: 'Final project reports and demos are due.' },
];

export type DailyAttendanceLog = {
  date: string; // YYYY-MM-DD
  schedule: DailyAttendance[];
};

export const studentDailyAttendanceHistory: DailyAttendanceLog[] = [
  {
    date: '2024-07-22', // A Monday
    schedule: [
      { hour: '1st Hour', subject: 'Data Structures', status: 'present' },
      { hour: '2nd Hour', subject: 'Algorithms', status: 'present' },
      { hour: '3rd Hour', subject: 'Web Tech', status: 'absent' },
      { hour: '4th Hour', subject: 'OS', status: 'present' },
      { hour: '5th Hour', subject: 'Project Lab', status: 'present' },
    ]
  },
  {
    date: '2024-07-23', // A Tuesday
    schedule: [
      { hour: '1st Hour', subject: 'Algorithms', status: 'present' },
      { hour: '2nd Hour', subject: 'OS', status: 'present' },
      { hour: '3rd Hour', subject: 'DS', status: 'present' },
      { hour: '4th Hour', subject: 'Web Tech', status: 'present' },
      { hour: '5th Hour', subject: 'DBMS', status: 'present' },
    ]
  },
  {
    date: '2024-07-24', // A Wednesday
    schedule: [
      { hour: '1st Hour', subject: 'DBMS', status: 'present' },
      { hour: '2nd Hour', subject: 'DS', status: 'absent' },
      { hour: '3rd Hour', subject: 'OS', status: 'absent' },
      { hour: '4th Hour', subject: 'Algorithms', status: 'present' },
      { hour: '5th Hour', subject: 'Web Tech', status: 'not-marked' },
    ]
  },
];

export const dailyAttendanceData: DailyAttendance[] = [
  { hour: '1st Hour', subject: 'Data Structures', status: 'present' },
  { hour: '2nd Hour', subject: 'Algorithms', status: 'present' },
  { hour: '3rd Hour', subject: 'Web Tech', status: 'absent' },
  { hour: '4th Hour', subject: 'OS', status: 'present' },
  { hour: '5th Hour', subject: 'Project Lab', status: 'not-marked' },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave-1',
    studentId: '36623U09015',
    studentName: 'Priya Verma',
    department: 'BCA',
    year: '3rd Year',
    startDate: '2024-07-29',
    endDate: '2024-07-30',
    reason: 'Family function.',
    status: 'approved',
  },
  {
    id: 'leave-2',
    studentId: '36623U08007',
    studentName: 'Ananya Joshi',
    department: 'BSC',
    year: '3rd Year',
    startDate: '2024-08-01',
    endDate: '2024-08-01',
    reason: 'Medical appointment.',
    status: 'pending',
  },
   {
    id: 'leave-3',
    studentId: '36623U09042',
    studentName: 'Rahul Desai',
    department: 'BCA',
    year: '3rd Year',
    startDate: '2024-08-02',
    endDate: '2024-08-03',
    reason: 'Not feeling well.',
    status: 'rejected',
    rejectionReason: 'Medical certificate not provided.',
  },
];

export const auditLogs: AuditLog[] = [
    { id: 'log-1', timestamp: subDays(new Date(), 1), user: 'TEACHER01', action: 'Posted announcement: "Mid-term Exams Schedule"', type: 'announcement' },
    { id: 'log-2', timestamp: subDays(new Date(), 2), user: 'TEACHER02', action: 'Approved registration for Aarav Sharma (ID: PENDING-001)', type: 'student' },
    { id: 'log-3', timestamp: subDays(new Date(), 3), user: 'TEACHER01', action: 'Saved attendance for BCA - 3rd Year (Data Structures) on 2024-07-24', type: 'attendance' },
];

export const feedbackSessions: FeedbackSession[] = [
    { id: 'session-1', name: 'Semester End Feedback (Even 2024)', startDate: '2024-07-20', endDate: '2024-08-20', status: 'open' },
    { id: 'session-2', name: 'Mid-Semester Feedback (Even 2024)', startDate: '2024-05-01', endDate: '2024-05-15', status: 'closed' },
];

export const feedbackData: Feedback[] = [
    // Example closed session data
    { id: 'fb-1', sessionId: 'session-2', studentId: '36623U09015', subject: 'Algorithms', rating: 4, comment: 'The professor explains concepts very clearly.' },
    { id: 'fb-2', sessionId: 'session-2', studentId: '36623U09042', subject: 'Algorithms', rating: 5, comment: 'Great examples and practical sessions.' },
    { id: 'fb-3', sessionId: 'session-2', studentId: '36623U09015', subject: 'Data Structures', rating: 3, comment: 'Could use more real-world examples.' },
];

export const examTimeTable: FullExamTimeTable = {
  'BCA': {
    '3rd Year': [
      { id: 'exam-bca-3-1', subject: 'Data Structures', date: '2024-11-10', time: '10:00 AM - 01:00 PM', room: 'A-101' },
      { id: 'exam-bca-3-2', subject: 'Algorithms', date: '2024-11-12', time: '10:00 AM - 01:00 PM', room: 'A-102' },
      { id: 'exam-bca-3-3', subject: 'Operating Systems', date: '2024-11-14', time: '10:00 AM - 01:00 PM', room: 'A-101' },
      { id: 'exam-bca-3-4', subject: 'Database Management', date: '2024-11-16', time: '10:00 AM - 01:00 PM', room: 'A-102' },
    ],
    '1st Year': [],
    '2nd Year': [],
  },
  'BSC': {
      '3rd Year': [], '1st Year': [], '2nd Year': [],
  },
  'BBA': {
      '3rd Year': [], '1st Year': [], '2nd Year': [],
  },
  'BCOM': {
      '3rd Year': [], '1st Year': [], '2nd Year': [],
  }
};
