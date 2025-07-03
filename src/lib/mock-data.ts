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
  fatherContactNumber: string;
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
  subjectCode: string;
  subject: string;
  date: string;
  time: string;
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

export type SemesterFee = {
  semester: string;
  totalFee: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string; // YYYY-MM-DD
};

export type StudentFeeDetails = {
  [studentId: string]: SemesterFee[];
};

export type SubjectResult = {
  subjectCode: string;
  subjectName: string;
  ciaMarks: number;
  semesterMarks: number;
  totalMarks: number;
  grade: string;
  resultStatus: 'Pass' | 'Fail';
};

export type SemesterResult = {
  semester: string; // e.g., '5th'
  results: SubjectResult[];
  gpa: number;
  overallResult: 'Pass' | 'Fail';
};

export type StudentResults = {
  [studentId: string]: SemesterResult[];
};

export const teachers: Teacher[] = [
    { id: 'TEACHER01', password: 'Teacher@Pass1', name: 'Dr. Evelyn Reed' },
    { id: 'TEACHER02', password: 'Professor@Pass2', name: 'Prof. Samuel Cruz' }
];

const names = [
    { name: 'Aarav Sharma', gender: 'Male' as const }, { name: 'Vivaan Singh', gender: 'Male' as const }, { name: 'Aditya Kumar', gender: 'Male' as const }, { name: 'Vihaan Patel', gender: 'Male' as const }, { name: 'Arjun Gupta', gender: 'Male' as const },
    { name: 'Saanvi Sharma', gender: 'Female' as const }, { name: 'Aanya Singh', gender: 'Female' as const }, { name: 'Aadhya Kumar', gender: 'Female' as const }, { name: 'Ananya Patel', gender: 'Female' as const }, { name: 'Diya Gupta', gender: 'Female' as const },
];
const departments = [
    { name: 'BCA', code: '09' },
    { name: 'BSC', code: '08' },
    { name: 'BCOM', code: '10' },
    { name: 'BBA', code: '11' }
];
const years = [
    { name: '1st Year', code: '25', semester: '1st', academicYear: '2024-2025', dobYear: 2006 },
    { name: '2nd Year', code: '24', semester: '3rd', academicYear: '2023-2024', dobYear: 2005 },
    { name: '3rd Year', code: '23', semester: '5th', academicYear: '2022-2023', dobYear: 2004 }
];

const generatedStudents: Student[] = [];
let studentCounter = 1;

departments.forEach(dept => {
    years.forEach(year => {
        for (let i = 1; i <= 6; i++) {
            const nameData = names[(studentCounter -1) % names.length];
            const firstName = nameData.name.split(' ')[0].toLowerCase();
            const paddedCounter = String(i).padStart(3, '0');
            const paddedDeptCounter = String(studentCounter).padStart(3, '0');

            const student: Student = {
                id: `366${year.code}U${dept.code}${paddedDeptCounter}`,
                university_number: `366${year.code}U${dept.code}${paddedDeptCounter}`,
                rollNumber: `${year.name.charAt(0)}${dept.name}-${paddedCounter}`,
                name: `${nameData.name} ${i}`,
                dob: `${year.dobYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                department: dept.name,
                year: year.name,
                email: `${firstName}${i}@example.com`,
                phone: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
                fatherContactNumber: `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`,
                gender: nameData.gender,
                currentSemester: year.semester,
                academicYear: year.academicYear,
                address: `${i * 123} Main St, Anytown, India`,
                photoUrl: '',
            };
            generatedStudents.push(student);
            studentCounter++;
        }
    });
});

export const students: Student[] = generatedStudents;

export const pendingStudents: Student[] = [
    { "id": "PENDING-001", "rollNumber": "1BCA-NEW", "name": "Aarav Sharma", "dob": "2006-05-20", "university_number": "APP-2024-001", "department": "BCA", "year": "1st Year", "email": "aarav.sharma.new@example.com", "phone": "9123456789", "fatherContactNumber": "9123456780", "gender": "Male" as const, "currentSemester": "1st", "academicYear": "2024-2025", "address": "15 Cherry Blossom Lane, New Delhi", photoUrl: '' },
    { "id": "PENDING-002", "rollNumber": "1BSC-NEW", "name": "Isha Singh", "dob": "2006-04-11", "university_number": "APP-2024-002", "department": "BSC", "year": "1st Year", "email": "isha.singh.new@example.com", "phone": "9234567890", "fatherContactNumber": "9234567891", "gender": "Female" as const, "currentSemester": "1st", "academicYear": "2024-2025", "address": "22 Rosewood Drive, Mumbai", photoUrl: '' }
];

export const studentUsers = students.map(student => ({
  id: student.university_number,
  password: student.dob,
}));

export const teacherUsers = teachers;

export const previousAttendanceData = [
  // Week 1
  { date: '2024-07-01', studentId: students[0].id, attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: students[1].id, attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: students[2].id, attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: students[6].id, attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: students[7].id, attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: students[8].id, attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: students[12].id, attendanceStatus: 'absent' as const },
  // Week 2
  { date: '2024-07-08', studentId: students[0].id, attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: students[1].id, attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: students[2].id, attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: students[6].id, attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: students[7].id, attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: students[8].id, attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: students[12].id, attendanceStatus: 'absent' as const },
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
    studentId: students[1].id,
    studentName: students[1].name,
    department: 'BCA',
    year: '1st Year',
    startDate: '2024-07-29',
    endDate: '2024-07-30',
    reason: 'Family function.',
    status: 'approved',
  },
  {
    id: 'leave-2',
    studentId: students[7].id,
    studentName: students[7].name,
    department: 'BSC',
    year: '2nd Year',
    startDate: '2024-08-01',
    endDate: '2024-08-01',
    reason: 'Medical appointment.',
    status: 'pending',
  },
   {
    id: 'leave-3',
    studentId: students[2].id,
    studentName: students[2].name,
    department: 'BCA',
    year: '1st Year',
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
    { id: 'fb-1', sessionId: 'session-2', studentId: '36624U09002', subject: 'Algorithms', rating: 4, comment: 'The professor explains concepts very clearly.' },
    { id: 'fb-2', sessionId: 'session-2', studentId: '36624U09003', subject: 'Algorithms', rating: 5, comment: 'Great examples and practical sessions.' },
    { id: 'fb-3', sessionId: 'session-2', studentId: '36624U09002', subject: 'Data Structures', rating: 3, comment: 'Could use more real-world examples.' },
];

export const examTimeTable: FullExamTimeTable = {
  'BCA': {
    '3rd Year': [
      { id: 'exam-bca-3-1', subjectCode: 'BCA301', subject: 'Data Structures', date: '2024-11-10', time: '10:00 AM - 01:00 PM' },
      { id: 'exam-bca-3-2', subjectCode: 'BCA302', subject: 'Algorithms', date: '2024-11-12', time: '10:00 AM - 01:00 PM' },
      { id: 'exam-bca-3-3', subjectCode: 'BCA303', subject: 'Operating Systems', date: '2024-11-14', time: '10:00 AM - 01:00 PM' },
      { id: 'exam-bca-3-4', subjectCode: 'BCA304', subject: 'Database Management', date: '2024-11-16', time: '10:00 AM - 01:00 PM' },
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

export const studentFeeDetails: StudentFeeDetails = {
  [students[0].id]: [
    { semester: '1st', totalFee: 25000, paid: 25000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
    { semester: '2nd', totalFee: 25000, paid: 15000, balance: 10000, status: 'Pending', dueDate: '2025-01-15' },
  ],
  [students[1].id]: [
    { semester: '1st', totalFee: 25000, paid: 25000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
  ],
  [students[7].id]: [
     { semester: '3rd', totalFee: 22000, paid: 22000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
     { semester: '4th', totalFee: 22000, paid: 0, balance: 22000, status: 'Pending', dueDate: '2025-01-15' },
  ],
  [students[13].id]: [
     { semester: '5th', totalFee: 28000, paid: 10000, balance: 18000, status: 'Overdue', dueDate: '2024-07-15' },
  ],
  [students[19].id]: [
     { semester: '1st', totalFee: 20000, paid: 20000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
  ],
};

export const studentResults: StudentResults = {
  [students[12].id]: [
    {
      semester: '5th',
      gpa: 8.8,
      overallResult: 'Pass',
      results: [
        { subjectCode: 'BCA501', subjectName: 'Computer Networks', ciaMarks: 22, semesterMarks: 65, totalMarks: 87, grade: 'A', resultStatus: 'Pass' },
        { subjectCode: 'BCA502', subjectName: 'Software Engineering', ciaMarks: 24, semesterMarks: 70, totalMarks: 94, grade: 'O', resultStatus: 'Pass' },
      ],
    },
    {
      semester: '4th',
      gpa: 8.5,
      overallResult: 'Pass',
      results: [
        { subjectCode: 'BCA401', subjectName: 'Data Structures', ciaMarks: 21, semesterMarks: 60, totalMarks: 81, grade: 'A', resultStatus: 'Pass' },
      ],
    },
  ],
  [students[13].id]: [
    {
      semester: '5th',
      gpa: 9.2,
      overallResult: 'Pass',
      results: [
        { subjectCode: 'BCA501', subjectName: 'Computer Networks', ciaMarks: 24, semesterMarks: 70, totalMarks: 94, grade: 'O', resultStatus: 'Pass' },
      ],
    },
  ],
};
