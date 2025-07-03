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
  [studentId: string]: StudentResult[];
};

export const teachers: Teacher[] = [
    { id: 'TEACHER01', password: 'Teacher@Pass1', name: 'Dr. Evelyn Reed' },
    { id: 'TEACHER02', password: 'Professor@Pass2', name: 'Prof. Samuel Cruz' }
];

const rawStudentData = {
  "BCA": {
    "1st_year": [
      { "full_name": "Mohammed Thouseef M", "email": "mthncidbi@gmail.com", "phone_number": "4567876548", "father_phone_number": "4578965498", "roll_number": 1, "registration_number": "36623u09001", "department": "BCA", "year": "1st", "date_of_birth": "01-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "22 Mosque Street, Katpadi, Vellore District" },
      { "full_name": "Priya Sharma", "email": "priya.sharma@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 2, "registration_number": "36623u09002", "department": "BCA", "year": "1st", "date_of_birth": "15-05-2003", "gender": "female", "current_semester": "1st", "academic_year": "2023-2024", "address": "45 Gandhi Road, Gudiyatham, Vellore District" },
      { "full_name": "Rahul Kumar", "email": "rahul.kumar@example.com", "phone_number": "7890123456", "father_phone_number": "8901234567", "roll_number": 3, "registration_number": "36623u09003", "department": "BCA", "year": "1st", "date_of_birth": "22-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "12 Nehru Nagar, Arakkonam, Vellore District" },
      { "full_name": "Anjali Patel", "email": "anjali.patel@example.com", "phone_number": "6789012345", "father_phone_number": "7890123456", "roll_number": 4, "registration_number": "36623u09004", "department": "BCA", "year": "1st", "date_of_birth": "10-03-2003", "gender": "female", "current_semester": "1st", "academic_year": "2023-2024", "address": "32 Patel Street, Walajapet, Vellore District" },
      { "full_name": "Vikram Singh", "email": "vikram.singh@example.com", "phone_number": "8901234567", "father_phone_number": "9012345678", "roll_number": 5, "registration_number": "36623u09005", "department": "BCA", "year": "1st", "date_of_birth": "05-12-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "7 Fort Road, Vellore Town" }
    ],
    "2nd_year": [
      { "full_name": "Sneha Reddy", "email": "sneha.reddy@example.com", "phone_number": "9012345678", "father_phone_number": "0123456789", "roll_number": 1, "registration_number": "36623u09006", "department": "BCA", "year": "2nd", "date_of_birth": "18-07-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "56 Reddy Colony, Ambur, Vellore District" },
      { "full_name": "Arjun Mehta", "email": "arjun.mehta@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 2, "registration_number": "36623u09002", "department": "BCA", "year": "2nd", "date_of_birth": "14-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "23 Mehta Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Divya Nair", "email": "divya.nair@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 3, "registration_number": "36623u09003", "department": "BCA", "year": "2nd", "date_of_birth": "25-04-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "89 Nair Gardens, Jolarpet, Vellore District" },
      { "full_name": "Karthik Iyer", "email": "karthik.iyer@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 4, "registration_number": "36623u09004", "department": "BCA", "year": "2nd", "date_of_birth": "30-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Iyer Street, Alangayam, Vellore District" },
      { "full_name": "Meera Joshi", "email": "meera.joshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 5, "registration_number": "36623u09005", "department": "BCA", "year": "2nd", "date_of_birth": "08-06-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Joshi Nagar, Melvisharam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Sanjay Gupta", "email": "sanjay.gupta@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 1, "registration_number": "36623u09001", "department": "BCA", "year": "3rd", "date_of_birth": "19-02-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "78 Gupta Complex, Pernambut, Vellore District" },
      { "full_name": "Aanya Khanna", "email": "aanya.khanna@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 2, "registration_number": "36623u09002", "department": "BCA", "year": "3rd", "date_of_birth": "14-09-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "23 Khanna Residency, Sathuvachari, Vellore District" },
      { "full_name": "Vedant Malhotra", "email": "vedant.malhotra@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 3, "registration_number": "36623u09003", "department": "BCA", "year": "3rd", "date_of_birth": "25-04-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "45 Malhotra Enclave, Viruthampet, Vellore District" },
      { "full_name": "Myra Chatterjee", "email": "myra.chat@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 4, "registration_number": "36623u09004", "department": "BCA", "year": "3rd", "date_of_birth": "30-11-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "67 Chatterjee Lane, Pallikonda, Vellore District" },
      { "full_name": "Kabir Bedi", "email": "kabir.bedi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 5, "registration_number": "36623u09005", "department": "BCA", "year": "3rd", "date_of_birth": "08-06-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "34 Bedi Nagar, Kaniyambadi, Vellore District" }
    ]
  },
  "BSc": {
    "1st_year": [
      { "full_name": "Mohammed Ayaan Khan", "email": "ayaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u08001", "department": "BSc", "year": "1st", "date_of_birth": "09-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "45 Khan Villa, Nemili, Vellore District" },
      { "full_name": "Abdul Rahman Siddiqui", "email": "abdul.siddiqui@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u08002", "department": "BSc", "year": "1st", "date_of_birth": "12-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Siddiqui Nagar, Natrampalli, Vellore District" },
      { "full_name": "Zain Ahmed Sheikh", "email": "zain.sheikh@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u08003", "department": "BSc", "year": "1st", "date_of_birth": "18-07-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "32 Sheikh Street, K.V. Kuppam, Vellore District" },
      { "full_name": "Ibrahim Hussain Malik", "email": "ibrahim.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u08004", "department": "BSc", "year": "1st", "date_of_birth": "22-09-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "12 Malik Apartments, Gudiyatham, Vellore District" },
      { "full_name": "Yusuf Mohammed Ansari", "email": "yusuf.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u08005", "department": "BSc", "year": "1st", "date_of_birth": "30-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "89 Ansari Colony, Jolarpet, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Farhan Ali", "email": "farhan.ali@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 1, "registration_number": "36623u08006", "department": "BSc", "year": "2nd", "date_of_birth": "14-05-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "56 Ali Mansion, Alangayam, Vellore District" },
      { "full_name": "Abdullah Khan Pathan", "email": "abdullah.pathan@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u08002", "department": "BSc", "year": "2nd", "date_of_birth": "22-08-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "78 Pathan Street, Ambur, Vellore District" },
      { "full_name": "Armaan Mohammed Siddique", "email": "armaan.siddique@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 3, "registration_number": "36623u08003", "department": "BSc", "year": "2nd", "date_of_birth": "03-12-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Siddique Plaza, Vaniyambadi, Vellore District" },
      { "full_name": "Rehan Ahmed Qureshi", "email": "rehan.qureshi@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 4, "registration_number": "36623u08004", "department": "BSc", "year": "2nd", "date_of_birth": "19-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "12 Qureshi Nagar, Pernambut, Vellore District" },
      { "full_name": "Saifuddin Ibrahim Khan", "email": "saifuddin.khan@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u08005", "department": "BSc", "year": "2nd", "date_of_birth": "27-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "90 Khan Residency, Walajapet, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Asif Hussain", "email": "asif.hussain@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u08001", "department": "BSc", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Hussain Complex, Katpadi, Vellore District" },
      { "full_name": "Abdul Hameed Khan", "email": "hameed.khan@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u08002", "department": "BSc", "year": "3rd", "date_of_birth": "15-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Khan Mansion, Gudiyatham, Vellore District" },
      { "full_name": "Zubair Ahmed Siddiqui", "email": "zubair.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u08003", "department": "BSc", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Arakkonam, Vellore District" },
      { "full_name": "Faisal Mohammed Rahman", "email": "faisal.rahman@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u08004", "department": "BSc", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Rahman Colony, Ambur, Vellore District" },
      { "full_name": "Shahid Akhtar Malik", "email": "shahid.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u08005", "department": "BSc", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Vaniyambadi, Vellore District" }
    ]
  },
  "BCom": {
    "1st_year": [
      { "full_name": "Mohammed Amaan Khan", "email": "amaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u10001", "department": "BCom", "year": "1st", "date_of_birth": "12-05-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "34 Khan Plaza, Pallikonda, Vellore District" },
      { "full_name": "Abdul Qadir Sheikh", "email": "qadir.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u10002", "department": "BCom", "year": "1st", "date_of_birth": "23-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Sheikh Nagar, Kaniyambadi, Vellore District" },
      { "full_name": "Zeeshan Ahmed Siddiqui", "email": "zeeshan.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u10003", "department": "BCom", "year": "1st", "date_of_birth": "07-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "15 Siddiqui Street, Sathuvachari, Vellore District" },
      { "full_name": "Irfan Mohammed Malik", "email": "irfan.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u10004", "department": "BCom", "year": "1st", "date_of_birth": "19-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "92 Malik Residency, Viruthampet, Vellore District" },
      { "full_name": "Yunus Ibrahim Ansari", "email": "yunus.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u10005", "department": "BCom", "year": "1st", "date_of_birth": "30-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "56 Ansari Colony, Nemili, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Arhaan Khan", "email": "arhaan.khan@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 1, "registration_number": "36623u10006", "department": "BCom", "year": "2nd", "date_of_birth": "15-06-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Khan Mansion, Natrampalli, Vellore District" },
      { "full_name": "Abdul Sami Sheikh", "email": "sami.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u10002", "department": "BCom", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, K.V. Kuppam, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 3, "registration_number": "36623u10003", "department": "BCom", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Alangayam, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 4, "registration_number": "36623u10004", "department": "BCom", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Jolarpet, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u10005", "department": "BCom", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, Pernambut, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u10001", "department": "BCom", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Walajapet, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u10002", "department": "BCom", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Ambur, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u10003", "department": "BCom", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u10004", "department": "BCom", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Gudiyatham, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u10005", "department": "BCom", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Arakkonam, Vellore District" }
    ]
  },
  "BBA": {
    "1st_year": [
      { "full_name": "Mohammed Ayaan Khan", "email": "ayaan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u11001", "department": "BBA", "year": "1st", "date_of_birth": "12-05-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "34 Khan Plaza, Katpadi, Vellore District" },
      { "full_name": "Abdul Hadi Sheikh", "email": "hadi.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u11002", "department": "BBA", "year": "1st", "date_of_birth": "23-08-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "78 Sheikh Nagar, Pernambut, Vellore District" },
      { "full_name": "Zainul Abideen Siddiqui", "email": "zainul.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u11003", "department": "BBA", "year": "1st", "date_of_birth": "07-01-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "15 Siddiqui Street, Melvisharam, Vellore District" },
      { "full_name": "Faris Mohammed Malik", "email": "faris.malik@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u11004", "department": "BBA", "year": "1st", "date_of_birth": "19-04-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "92 Malik Residency, Pallikonda, Vellore District" },
      { "full_name": "Yasin Ibrahim Ansari", "email": "yasin.ansari@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u11005", "department": "BBA", "year": "1st", "date_of_birth": "30-11-2003", "gender": "male", "current_semester": "1st", "academic_year": "2023-2024", "address": "56 Ansari Colony, Kaniyambadi, Vellore District" }
    ],
    "2nd_year": [
      { "full_name": "Mohammed Arham Khan", "email": "arham.khan@example.com", "phone_number": "2109876543", "father_phone_number": "1098765432", "roll_number": 1, "registration_number": "36623u11006", "department": "BBA", "year": "2nd", "date_of_birth": "14-06-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Khan Mansion, Sathuvachari, Vellore District" },
      { "full_name": "Abdul Samad Sheikh", "email": "samad.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u11002", "department": "BBA", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, Viruthampet, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543205", "roll_number": 3, "registration_number": "36623u11003", "department": "BBA", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Nemili, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543205", "father_phone_number": "8765432104", "roll_number": 4, "registration_number": "36623u11004", "department": "BBA", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Natrampalli, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432104", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u11005", "department": "BBA", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, K.V. Kuppam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u11001", "department": "BBA", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Alangayam, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u11002", "department": "BBA", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Jolarpet, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u11003", "department": "BBA", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Pernambut, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u11004", "department": "BBA", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Walajapet, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u11005", "department": "BBA", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Ambur, Vellore District" }
    ]
  }
}
what happened in student data. show me the perfect one with no error