// Mock data for the application

export type Student = {
  id: string; // university_number
  rollNumber: string; // roll_no
  name: string;
  dob: string;
  university_number: string;
  department: string;
  year: string;
  email: string;
  phone: string;
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

export const teachers = [
    { id: 'TEACHER01', password: 'password', name: 'Dr. Evelyn Reed' },
    { id: 'TEACHER02', password: 'password123', name: 'Prof. Samuel Cruz' }
];

const rawStudents = [
    { "roll_no": "3BCA-28", "name": "Mohammed Thouseef", "dob": "12-12-2005", "university_number": "36623U09028", "department": "BCA", "year": "3rd", "email": "mthouseef100@gmail.com", "phone": "986578987" },
    { "roll_no": "3BCA-15", "name": "Priya Verma", "dob": "05-08-2004", "university_number": "36623U09015", "department": "BCA", "year": "3rd", "email": "priya.verma@gmail.com", "phone": "8876543210" },
    { "roll_no": "3BCA-42", "name": "Rahul Desai", "dob": "22-03-2005", "university_number": "36623U09042", "department": "BCA", "year": "3rd", "email": "rahul.desai@gmail.com", "phone": "7765432109" },
    { "roll_no": "3BSC-07", "name": "Ananya Joshi", "dob": "14-09-2004", "university_number": "36623U08007", "department": "BSC", "year": "3rd", "email": "ananya.joshi@gmail.com", "phone": "9988776655" },
    { "roll_no": "3BSC-19", "name": "Karan Patel", "dob": "30-11-2005", "university_number": "36623U08019", "department": "BSC", "year": "3rd", "email": "karan.patel@gmail.com", "phone": "8899001122" },
    { "roll_no": "3BSC-33", "name": "Sneha Menon", "dob": "17-01-2005", "university_number": "36623U08033", "department": "BSC", "year": "3rd", "email": "sneha.menon@gmail.com", "phone": "7788990011" },
    { "roll_no": "3BBA-12", "name": "Aditya Rao", "dob": "08-04-2004", "university_number": "36623U07012", "department": "BBA", "year": "3rd", "email": "aditya.rao@gmail.com", "phone": "9876543210" },
    { "roll_no": "3BBA-25", "name": "Divya Iyer", "dob": "25-07-2005", "university_number": "36623U07025", "department": "BBA", "year": "3rd", "email": "divya.iyer@gmail.com", "phone": "8765432109" },
    { "roll_no": "3BBA-38", "name": "Vikram Choudhary", "dob": "03-10-2004", "university_number": "36623U07038", "department": "BBA", "year": "3rd", "email": "vikram.c@gmail.com", "phone": "7654321098" },
    { "roll_no": "3BCOM-05", "name": "Neha Gupta", "dob": "19-06-2005", "university_number": "36623U06005", "department": "BCOM", "year": "3rd", "email": "neha.gupta@gmail.com", "phone": "6543210987" },
    { "roll_no": "3BCOM-21", "name": "Rajesh Khanna", "dob": "11-12-2004", "university_number": "36623U06021", "department": "BCOM", "year": "3rd", "email": "rajesh.k@gmail.com", "phone": "9432109876" },
    { "roll_no": "3BCOM-14", "name": "Swati Nair", "dob": "28-02-2005", "university_number": "36623U06014", "department": "BCOM", "year": "3rd", "email": "swati.nair@gmail.com", "phone": "8321098765" }
];

export const students: Student[] = rawStudents.map(s => ({
  ...s,
  id: s.university_number,
  rollNumber: s.roll_no,
}));

export const studentUsers = students.map(student => ({
  id: student.university_number,
  password: student.roll_no,
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

export const timeTable = {
  'Monday': ['Data Structures', 'Algorithms', 'Lunch', 'Database Management', 'Operating Systems'],
  'Tuesday': ['Algorithms', 'Operating Systems', 'Lunch', 'Data Structures', 'Database Management'],
  'Wednesday': ['Database Management', 'Data Structures', 'Lunch', 'Operating Systems', 'Algorithms'],
  'Thursday': ['Operating Systems', 'Database Management', 'Lunch', 'Algorithms', 'Data Structures'],
  'Friday': ['Data Structures', 'Algorithms', 'Lunch', 'Database Management', 'Project Work'],
  'Saturday': ['-', '-', 'Lunch', '-', '-'],
};

export const timeSlots = ['9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '1:00 - 2:00', '2:00 - 3:00'];
