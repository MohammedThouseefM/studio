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
      { "full_name": "Arjun Mehta", "email": "arjun.mehta@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 2, "registration_number": "36623u09007", "department": "BCA", "year": "2nd", "date_of_birth": "14-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "23 Mehta Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Divya Nair", "email": "divya.nair@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 3, "registration_number": "36623u09008", "department": "BCA", "year": "2nd", "date_of_birth": "25-04-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "89 Nair Gardens, Jolarpet, Vellore District" },
      { "full_name": "Karthik Iyer", "email": "karthik.iyer@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 4, "registration_number": "36623u09009", "department": "BCA", "year": "2nd", "date_of_birth": "30-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "67 Iyer Street, Alangayam, Vellore District" },
      { "full_name": "Meera Joshi", "email": "meera.joshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 5, "registration_number": "36623u09010", "department": "BCA", "year": "2nd", "date_of_birth": "08-06-2002", "gender": "female", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Joshi Nagar, Melvisharam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Sanjay Gupta", "email": "sanjay.gupta@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 1, "registration_number": "36623u09011", "department": "BCA", "year": "3rd", "date_of_birth": "19-02-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "78 Gupta Complex, Pernambut, Vellore District" },
      { "full_name": "Aanya Khanna", "email": "aanya.khanna@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 2, "registration_number": "36623u09012", "department": "BCA", "year": "3rd", "date_of_birth": "14-09-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "23 Khanna Residency, Sathuvachari, Vellore District" },
      { "full_name": "Vedant Malhotra", "email": "vedant.malhotra@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 3, "registration_number": "36623u09013", "department": "BCA", "year": "3rd", "date_of_birth": "25-04-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "45 Malhotra Enclave, Viruthampet, Vellore District" },
      { "full_name": "Myra Chatterjee", "email": "myra.chat@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 4, "registration_number": "36623u09014", "department": "BCA", "year": "3rd", "date_of_birth": "30-11-2001", "gender": "female", "current_semester": "5th", "academic_year": "2023-2026", "address": "67 Chatterjee Lane, Pallikonda, Vellore District" },
      { "full_name": "Kabir Bedi", "email": "kabir.bedi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 5, "registration_number": "36623u09015", "department": "BCA", "year": "3rd", "date_of_birth": "08-06-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "34 Bedi Nagar, Kaniyambadi, Vellore District" }
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
      { "full_name": "Abdullah Khan Pathan", "email": "abdullah.pathan@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u08007", "department": "BSc", "year": "2nd", "date_of_birth": "22-08-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "78 Pathan Street, Ambur, Vellore District" },
      { "full_name": "Armaan Mohammed Siddique", "email": "armaan.siddique@example.com", "phone_number": "0987654321", "father_phone_number": "9876543210", "roll_number": 3, "registration_number": "36623u08008", "department": "BSc", "year": "2nd", "date_of_birth": "03-12-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "34 Siddique Plaza, Vaniyambadi, Vellore District" },
      { "full_name": "Rehan Ahmed Qureshi", "email": "rehan.qureshi@example.com", "phone_number": "9876543210", "father_phone_number": "8765432109", "roll_number": 4, "registration_number": "36623u08009", "department": "BSc", "year": "2nd", "date_of_birth": "19-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "12 Qureshi Nagar, Pernambut, Vellore District" },
      { "full_name": "Saifuddin Ibrahim Khan", "email": "saifuddin.khan@example.com", "phone_number": "8765432109", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u08010", "department": "BSc", "year": "2nd", "date_of_birth": "27-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "90 Khan Residency, Walajapet, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Asif Hussain", "email": "asif.hussain@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u08011", "department": "BSc", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Hussain Complex, Katpadi, Vellore District" },
      { "full_name": "Abdul Hameed Khan", "email": "hameed.khan@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u08012", "department": "BSc", "year": "3rd", "date_of_birth": "15-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Khan Mansion, Gudiyatham, Vellore District" },
      { "full_name": "Zubair Ahmed Siddiqui", "email": "zubair.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u08013", "department": "BSc", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Arakkonam, Vellore District" },
      { "full_name": "Faisal Mohammed Rahman", "email": "faisal.rahman@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u08014", "department": "BSc", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Rahman Colony, Ambur, Vellore District" },
      { "full_name": "Shahid Akhtar Malik", "email": "shahid.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u08015", "department": "BSc", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Vaniyambadi, Vellore District" }
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
      { "full_name": "Abdul Sami Sheikh", "email": "sami.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u10007", "department": "BCom", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, K.V. Kuppam, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543210", "roll_number": 3, "registration_number": "36623u10008", "department": "BCom", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Alangayam, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543210", "father_phone_number": "8765432109", "roll_number": 4, "registration_number": "36623u10009", "department": "BCom", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Jolarpet, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432109", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u10010", "department": "BCom", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, Pernambut, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u10011", "department": "BCom", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Walajapet, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u10012", "department": "BCom", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Ambur, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u10013", "department": "BCom", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Vaniyambadi, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u10014", "department": "BCom", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Gudiyatham, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u10015", "department": "BCom", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Arakkonam, Vellore District" }
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
      { "full_name": "Abdul Samad Sheikh", "email": "samad.sheikh@example.com", "phone_number": "1098765432", "father_phone_number": "0987654321", "roll_number": 2, "registration_number": "36623u11007", "department": "BBA", "year": "2nd", "date_of_birth": "28-09-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "43 Sheikh Plaza, Viruthampet, Vellore District" },
      { "full_name": "Zaid Ahmed Qureshi", "email": "zaid.qureshi@example.com", "phone_number": "0987654321", "father_phone_number": "9876543210", "roll_number": 3, "registration_number": "36623u11008", "department": "BBA", "year": "2nd", "date_of_birth": "12-02-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "19 Qureshi Street, Nemili, Vellore District" },
      { "full_name": "Fahad Mohammed Siddiqui", "email": "fahad.siddiqui@example.com", "phone_number": "9876543210", "father_phone_number": "8765432109", "roll_number": 4, "registration_number": "36623u11009", "department": "BBA", "year": "2nd", "date_of_birth": "05-11-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "81 Siddiqui Nagar, Natrampalli, Vellore District" },
      { "full_name": "Saad Abdullah Malik", "email": "saad.malik@example.com", "phone_number": "8765432109", "father_phone_number": "7654321098", "roll_number": 5, "registration_number": "36623u11010", "department": "BBA", "year": "2nd", "date_of_birth": "24-04-2002", "gender": "male", "current_semester": "3rd", "academic_year": "2023-2025", "address": "52 Malik Colony, K.V. Kuppam, Vellore District" }
    ],
    "3rd_year": [
      { "full_name": "Mohammed Faizan Khan", "email": "faizan.khan@example.com", "phone_number": "7654321098", "father_phone_number": "6543210987", "roll_number": 1, "registration_number": "36623u11011", "department": "BBA", "year": "3rd", "date_of_birth": "08-03-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "25 Khan Towers, Alangayam, Vellore District" },
      { "full_name": "Abdul Basit Sheikh", "email": "basit.sheikh@example.com", "phone_number": "6543210987", "father_phone_number": "5432109876", "roll_number": 2, "registration_number": "36623u11012", "department": "BBA", "year": "3rd", "date_of_birth": "17-07-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "42 Sheikh Residency, Jolarpet, Vellore District" },
      { "full_name": "Usman Ahmed Siddiqui", "email": "usman.siddiqui@example.com", "phone_number": "5432109876", "father_phone_number": "4321098765", "roll_number": 3, "registration_number": "36623u11013", "department": "BBA", "year": "3rd", "date_of_birth": "22-11-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "17 Siddiqui Lane, Pernambut, Vellore District" },
      { "full_name": "Tariq Mohammed Qureshi", "email": "tariq.qureshi@example.com", "phone_number": "4321098765", "father_phone_number": "3210987654", "roll_number": 4, "registration_number": "36623u11014", "department": "BBA", "year": "3rd", "date_of_birth": "30-05-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "39 Qureshi Colony, Walajapet, Vellore District" },
      { "full_name": "Imran Akhtar Malik", "email": "imran.malik@example.com", "phone_number": "3210987654", "father_phone_number": "2109876543", "roll_number": 5, "registration_number": "36623u11015", "department": "BBA", "year": "3rd", "date_of_birth": "12-09-2001", "gender": "male", "current_semester": "5th", "academic_year": "2023-2026", "address": "63 Malik Street, Ambur, Vellore District" }
    ]
  }
};

const transformYear = (year: string): string => {
    switch (year) {
        case '1st_year': return '1st Year';
        case '2nd_year': return '2nd Year';
        case '3rd_year': return '3rd Year';
        default: return year;
    }
}

const transformDept = (dept: string): string => {
    if (dept.toLowerCase() === 'bsc') return 'BSC';
    return dept;
}


const parseStudents = (data: any): Student[] => {
    const allStudents: Student[] = [];
    for (const dept in data) {
        for (const year in data[dept]) {
            data[dept][year].forEach((s: any) => {
                const [day, month, yearOfBirth] = s.date_of_birth.split('-');
                allStudents.push({
                    id: s.registration_number,
                    rollNumber: String(s.roll_number),
                    name: s.full_name,
                    dob: `${yearOfBirth}-${month}-${day}`, // Convert to YYYY-MM-DD
                    university_number: s.registration_number,
                    department: transformDept(s.department),
                    year: transformYear(year),
                    email: s.email,
                    phone: s.phone_number,
                    fatherContactNumber: s.father_phone_number,
                    photoUrl: '',
                    gender: s.gender.charAt(0).toUpperCase() + s.gender.slice(1),
                    currentSemester: s.current_semester,
                    academicYear: s.academic_year,
                    address: s.address,
                });
            });
        }
    }
    return allStudents;
}

export const students: Student[] = parseStudents(rawStudentData);


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
  { date: '2024-07-01', studentId: '36623u09001', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623u09002', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623u09003', attendanceStatus: 'absent' as const },
  { date: '2024-07-01', studentId: '36623u08001', attendanceStatus: 'present' as const },
  { date: '2024-07-01', studentId: '36623u08002', attendanceStatus: 'present' as const },
  // Week 2
  { date: '2024-07-08', studentId: '36623u09001', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623u09002', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623u09003', attendanceStatus: 'present' as const },
  { date: '2024-07-08', studentId: '36623u08001', attendanceStatus: 'absent' as const },
  { date: '2024-07-08', studentId: '36623u08002', attendanceStatus: 'present' as const },
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
    studentId: '36623u09002',
    studentName: 'Priya Sharma',
    department: 'BCA',
    year: '1st Year',
    startDate: '2024-07-29',
    endDate: '2024-07-30',
    reason: 'Family function.',
    status: 'approved',
  },
  {
    id: 'leave-2',
    studentId: '36623u08007',
    studentName: 'Abdullah Khan Pathan',
    department: 'BSC',
    year: '2nd Year',
    startDate: '2024-08-01',
    endDate: '2024-08-01',
    reason: 'Medical appointment.',
    status: 'pending',
  },
   {
    id: 'leave-3',
    studentId: '36623u09003',
    studentName: 'Rahul Kumar',
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
    { id: 'fb-1', sessionId: 'session-2', studentId: '36623u09007', subject: 'Algorithms', rating: 4, comment: 'The professor explains concepts very clearly.' },
    { id: 'fb-2', sessionId: 'session-2', studentId: '36623u09008', subject: 'Algorithms', rating: 5, comment: 'Great examples and practical sessions.' },
    { id: 'fb-3', sessionId: 'session-2', studentId: '36623u09007', subject: 'Data Structures', rating: 3, comment: 'Could use more real-world examples.' },
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
  '36623u09001': [
    { semester: '1st', totalFee: 25000, paid: 25000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
    { semester: '2nd', totalFee: 25000, paid: 15000, balance: 10000, status: 'Pending', dueDate: '2025-01-15' },
  ],
  '36623u09002': [
    { semester: '1st', totalFee: 25000, paid: 25000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
  ],
  '36623u08007': [
     { semester: '3rd', totalFee: 22000, paid: 22000, balance: 0, status: 'Paid', dueDate: '2024-08-15' },
     { semester: '4th', totalFee: 22000, paid: 0, balance: 22000, status: 'Pending', dueDate: '2025-01-15' },
  ],
  '36623u09011': [
     { semester: '5th', totalFee: 28000, paid: 10000, balance: 18000, status: 'Overdue', dueDate: '2024-07-15' },
  ],
};

export const studentResults: StudentResults = {
  '36623u09012': [
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
  '36623u09013': [
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
