

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  academicCalendarEvents as initialEventsData,
  timeTable as initialTimeTable,
  examTimeTable as initialExamTimeTable,
  collegeData as initialCollegeData,
  teachers as initialTeachers,
  students as initialStudents,
  pendingStudents as initialPendingStudents,
  leaveRequests as initialLeaveRequests,
  announcements as initialAnnouncements,
  auditLogs as initialAuditLogs,
  feedbackSessions as initialFeedbackSessions,
  feedbackData as initialFeedbackData,
  studentFeeDetails as initialStudentFeeDetails,
  type CalendarEvent as RawCalendarEvent,
  type FullTimeTable,
  type ClassTimeTable,
  type FullExamTimeTable,
  type Exam,
  type Teacher,
  type Student,
  type LeaveRequest,
  type Announcement,
  type AuditLog as AuditLogType,
  type FeedbackSession,
  type Feedback,
  type StudentFeeDetails,
  type SemesterFee,
} from '@/lib/mock-data';
import type { AttendanceState } from '@/components/attendance-sheet';
import { parseISO } from 'date-fns';

export type CalendarEventWithId = RawCalendarEvent & { id: string };
export type AuditLog = AuditLogType;
export type { SemesterFee };

type CollegeDataContextType = {
  // Events
  events: CalendarEventWithId[];
  addEvent: (event: Omit<CalendarEventWithId, 'id'>, user: string) => void;
  updateEvent: (eventId: string, updatedEvent: Omit<CalendarEventWithId, 'id'>, user: string) => void;
  deleteEvent: (eventId: string, eventTitle: string, user: string) => void;
  // Timetable
  timeTable: FullTimeTable;
  updateTimeTable: (department: string, year: string, newTimeTable: ClassTimeTable, user: string) => void;
  // Exam Timetable
  examTimeTable: FullExamTimeTable;
  updateExamTimeTable: (department: string, year: string, newExams: Exam[], user: string) => void;
  // Academic Structure
  departments: string[];
  addDepartment: (department: string, user: string) => void;
  deleteDepartment: (department: string, user: string) => void;
  years: string[];
  addYear: (year: string, user: string) => void;
  deleteYear: (year: string, user: string) => void;
  hours: string[];
  addHour: (hour: string, user: string) => void;
  deleteHour: (hour: string, user: string) => void;
  // Teachers
  teachers: Teacher[];
  addTeacher: (name: string, id: string, password: string, user: string) => void;
  updateTeacherPassword: (teacherId: string, newPassword: string, user: string) => void;
  deleteTeacher: (teacherId: string, user: string) => void;
  // Students
  students: Student[];
  addStudent: (student: Student, user: string) => void;
  updateStudent: (studentId: string, updatedStudent: Student, user: string) => void;
  deleteStudent: (studentId: string, user: string) => void;
  pendingStudents: Student[];
  addPendingStudent: (student: Student) => void;
  approveStudentRegistration: (studentId: string, user: string) => void;
  rejectStudentRegistration: (studentId: string, user: string) => void;
  updatePendingStudent: (studentId: string, updatedStudent: Student, user: string) => void;
  // Leave Requests
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (studentId: string, startDate: string, endDate: string, reason: string) => void;
  approveLeaveRequest: (requestId: string, user: string) => void;
  rejectLeaveRequest: (requestId: string, reason: string, user: string) => void;
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, user: string) => void;
  deleteAnnouncement: (id: string, user: string) => void;
  // Audit Logs
  auditLogs: AuditLog[];
  // Attendance
  saveAttendance: (classDetails: any, attendance: AttendanceState, user: string, isOnline: boolean) => void;
  // Feedback
  feedbackSessions: FeedbackSession[];
  feedbackData: Feedback[];
  submitFeedback: (sessionId: string, studentId: string, feedbacks: Array<{ subject: string; rating: number; comment?: string }>) => void;
  // Fee Details
  studentFeeDetails: StudentFeeDetails;
  updateStudentFeeDetails: (studentId: string, semester: string, updatedFee: Pick<SemesterFee, 'totalFee' | 'paid'>, user: string) => void;
};

const CollegeDataContext = createContext<CollegeDataContextType | undefined>(undefined);

export function CollegeDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEventWithId[]>(() => 
    initialEventsData.map((e, index) => ({ ...e, id: `event-${Date.now()}-${index}` }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [timeTable, setTimeTable] = useState<FullTimeTable>(initialTimeTable);
  const [examTimeTable, setExamTimeTable] = useState<FullExamTimeTable>(initialExamTimeTable);
  const [departments, setDepartments] = useState<string[]>(initialCollegeData.departments);
  const [years, setYears] = useState<string[]>(initialCollegeData.years);
  const [hours, setHours] = useState<string[]>(initialCollegeData.hours);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [pendingStudents, setPendingStudents] = useState<Student[]>(initialPendingStudents);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [feedbackSessions, setFeedbackSessions] = useState<FeedbackSession[]>(initialFeedbackSessions);
  const [feedbackData, setFeedbackData] = useState<Feedback[]>(initialFeedbackData);
  const [studentFeeDetails, setStudentFeeDetails] = useState<StudentFeeDetails>(initialStudentFeeDetails);

  const addAuditLog = (user: string, action: string, type: AuditLog['type']) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      user,
      action,
      type,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addEvent = (eventData: Omit<CalendarEventWithId, 'id'>, user: string) => {
    const newEvent: CalendarEventWithId = { ...eventData, id: `event-${Date.now()}` };
    setEvents(prev => [newEvent, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    addAuditLog(user, `Created event: "${eventData.title}"`, 'academic');
  };
  const updateEvent = (eventId: string, updatedEventData: Omit<CalendarEventWithId, 'id'>, user: string) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...updatedEventData, id: eventId } : e))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    addAuditLog(user, `Updated event: "${updatedEventData.title}"`, 'academic');
  };
  const deleteEvent = (eventId: string, eventTitle: string, user: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addAuditLog(user, `Deleted event: "${eventTitle}"`, 'academic');
  };
  
  const updateTimeTable = (department: string, year: string, newClassTimeTable: ClassTimeTable, user: string) => {
    setTimeTable(prev => ({ ...prev, [department]: { ...(prev[department] || {}), [year]: newClassTimeTable } }));
    addAuditLog(user, `Updated timetable for ${department} - ${year}`, 'academic');
  };
  
  const updateExamTimeTable = (department: string, year: string, newExams: Exam[], user: string) => {
      setExamTimeTable(prev => ({
        ...prev,
        [department]: {
          ...(prev[department] || {}),
          [year]: newExams,
        }
      }));
      addAuditLog(user, `Updated exam timetable for ${department} - ${year}`, 'academic');
    };

  const addDepartment = (department: string, user: string) => { 
    if (department && !departments.includes(department)) {
      setDepartments(prev => [...prev, department]); 
      addAuditLog(user, `Added new department: "${department}"`, 'academic');
    }
  };
  const deleteDepartment = (department: string, user: string) => { 
    setDepartments(prev => prev.filter(d => d !== department)); 
    addAuditLog(user, `Deleted department: "${department}"`, 'academic');
  };
  const addYear = (year: string, user: string) => { 
    if (year && !years.includes(year)) {
      setYears(prev => [...prev, year]);
      addAuditLog(user, `Added new year: "${year}"`, 'academic');
    }
  };
  const deleteYear = (year: string, user: string) => { 
    setYears(prev => prev.filter(y => y !== year));
    addAuditLog(user, `Deleted year: "${year}"`, 'academic');
  };
  const addHour = (hour: string, user: string) => { 
    if (hour && !hours.includes(hour)) {
      setHours(prev => [...prev, hour]);
      addAuditLog(user, `Added new class hour: "${hour}"`, 'academic');
    }
  };
  const deleteHour = (hour: string, user: string) => { 
    setHours(prev => prev.filter(h => h !== hour));
    addAuditLog(user, `Deleted class hour: "${hour}"`, 'academic');
  };

  const addTeacher = (name: string, id: string, password: string, user: string) => {
    if (name && id && password && !teachers.some(t => t.id === id)) {
      setTeachers(prev => [...prev, { name, id, password }]);
      addAuditLog(user, `Added new teacher: ${name} (ID: ${id})`, 'teacher');
    }
  };
  const updateTeacherPassword = (teacherId: string, newPassword: string, user: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if(teacher) {
        setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, password: newPassword } : t));
        addAuditLog(user, `Changed password for teacher: ${teacher.name} (ID: ${teacherId})`, 'teacher');
    }
  };
  const deleteTeacher = (teacherId: string, user: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if(teacher) {
        setTeachers(prev => prev.filter(t => t.id !== teacherId));
        addAuditLog(user, `Deleted teacher: ${teacher.name} (ID: ${teacherId})`, 'teacher');
    }
  };
  
  const addStudent = (student: Student, user: string) => {
    setStudents(prev => [student, ...prev]);
    addAuditLog(user, `Added new student: ${student.name} (ID: ${student.id})`, 'student');
  };
  const updateStudent = (studentId: string, updatedStudent: Student, user: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    addAuditLog(user, `Updated details for student: ${updatedStudent.name} (ID: ${studentId})`, 'student');
  };
  const deleteStudent = (studentId: string, user: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      addAuditLog(user, `Deleted student: ${student.name} (ID: ${studentId})`, 'student');
    }
  };

  const addPendingStudent = (student: Student) => {
    setPendingStudents(prev => [student, ...prev]);
  };
  const approveStudentRegistration = (studentId: string, user: string) => {
    const studentToApprove = pendingStudents.find(s => s.id === studentId);
    if (studentToApprove) {
      setStudents(prev => [studentToApprove, ...prev]);
      setPendingStudents(prev => prev.filter(s => s.id !== studentId));
      addAuditLog(user, `Approved registration for ${studentToApprove.name} (ID: ${studentId})`, 'student');
    }
  };
  const rejectStudentRegistration = (studentId: string, user: string) => {
    const studentToReject = pendingStudents.find(s => s.id === studentId);
    if(studentToReject) {
        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
        addAuditLog(user, `Rejected registration for ${studentToReject.name} (ID: ${studentId})`, 'student');
    }
  };
  const updatePendingStudent = (studentId: string, updatedStudent: Student, user: string) => {
    setPendingStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    addAuditLog(user, `Updated pending application for ${updatedStudent.name} (ID: ${studentId})`, 'student');
  };

  const addLeaveRequest = (studentId: string, startDate: string, endDate: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`, studentId, studentName: student.name, department: student.department,
      year: student.year, startDate, endDate, reason, status: 'pending',
    };
    setLeaveRequests(prev => [newRequest, ...prev]);
  };
  const approveLeaveRequest = (requestId: string, user: string) => {
    const request = leaveRequests.find(r => r.id === requestId);
    if(request) {
        setLeaveRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
        addAuditLog(user, `Approved leave request for ${request.studentName}`, 'leave');
    }
  };
  const rejectLeaveRequest = (requestId: string, reason: string, user: string) => {
    const request = leaveRequests.find(r => r.id === requestId);
    if(request) {
        setLeaveRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r));
        addAuditLog(user, `Rejected leave request for ${request.studentName}`, 'leave');
    }
  };

  const addAnnouncement = (title: string, content: string, user: string) => {
    const newAnnouncement: Announcement = {
      id: `${Date.now()}`, title, content, date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addAuditLog(user, `Posted announcement: "${title}"`, 'announcement');
  };
  const deleteAnnouncement = (id: string, user: string) => {
    const announcement = announcements.find(a => a.id === id);
    if (announcement) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      addAuditLog(user, `Deleted announcement: "${announcement.title}"`, 'announcement');
    }
  };

  const saveAttendance = (classDetails: any, attendance: AttendanceState, user: string, isOnline: boolean) => {
    if (isOnline) {
      addAuditLog(user, `Saved attendance for ${classDetails.department} - ${classDetails.year} (${classDetails.subject}) on ${classDetails.date}`, 'attendance');
    } else {
        const key = `offline-attendance-${classDetails.department}-${classDetails.year}-${classDetails.subject}-${classDetails.date}`;
        try {
            const pendingSyncs = JSON.parse(localStorage.getItem('pending-attendance-syncs') || '[]' );
            if (!pendingSyncs.includes(key)) {
                pendingSyncs.push(key);
                localStorage.setItem('pending-attendance-syncs', JSON.stringify(pendingSyncs));
            }
            localStorage.setItem(key, JSON.stringify({ classDetails, attendance, user }));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    }
  };
  
  const submitFeedback = (sessionId: string, studentId: string, feedbacks: Array<{ subject: string; rating: number; comment?: string }>) => {
    const newFeedbacks: Feedback[] = feedbacks.map((fb, index) => ({
        id: `fb-${Date.now()}-${index}`,
        sessionId,
        studentId,
        subject: fb.subject,
        rating: fb.rating,
        comment: fb.comment,
    }));
    setFeedbackData(prev => [...prev, ...newFeedbacks]);
    // NOTE: No audit log for anonymous feedback submission to protect student privacy.
  };

  const updateStudentFeeDetails = (studentId: string, semester: string, updatedFee: Pick<SemesterFee, 'totalFee' | 'paid'>, user: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudentFeeDetails(prev => {
        const studentFees = prev[studentId] ? [...prev[studentId]] : [];
        const updatedFees = studentFees.map(fee => {
            if (fee.semester === semester) {
                const newPaid = updatedFee.paid;
                const newTotal = updatedFee.totalFee;
                const balance = newTotal - newPaid;
                const status = balance <= 0 ? 'Paid' : (new Date() > parseISO(fee.dueDate) ? 'Overdue' : 'Pending');
                return { ...fee, totalFee: newTotal, paid: newPaid, balance, status };
            }
            return fee;
        });
        return { ...prev, [studentId]: updatedFees };
    });

    addAuditLog(user, `Updated fee for ${student.name} (Sem: ${semester}, Paid: ${updatedFee.paid}, Total: ${updatedFee.totalFee})`, 'student');
  };

  const contextValue = { 
    events, addEvent, updateEvent, deleteEvent, 
    timeTable, updateTimeTable,
    examTimeTable, updateExamTimeTable,
    departments, addDepartment, deleteDepartment,
    years, addYear, deleteYear,
    hours, addHour, deleteHour,
    teachers, addTeacher, updateTeacherPassword, deleteTeacher,
    students, addStudent, updateStudent, deleteStudent,
    pendingStudents, addPendingStudent, approveStudentRegistration, rejectStudentRegistration, updatePendingStudent,
    leaveRequests, addLeaveRequest, approveLeaveRequest, rejectLeaveRequest,
    announcements, addAnnouncement, deleteAnnouncement,
    auditLogs,
    saveAttendance,
    feedbackSessions,
    feedbackData,
    submitFeedback,
    studentFeeDetails,
    updateStudentFeeDetails,
  };

  return (
    <CollegeDataContext.Provider value={contextValue}>
      {children}
    </CollegeDataContext.Provider>
  );
}

export function useCollegeData() {
  const context = useContext(CollegeDataContext);
  if (context === undefined) {
    throw new Error('useCollegeData must be used within a CollegeDataProvider');
  }
  return context;
}
