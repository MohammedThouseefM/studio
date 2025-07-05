
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collegeData as initialCollegeData,
  teachers as initialTeachers,
  students as initialStudents,
  timeTable as initialTimeTable,
  examTimeTable as initialExamTimeTable,
  academicCalendarEvents as initialEventsData,
  pendingStudents as initialPendingStudents,
  leaveRequests as initialLeaveRequests,
  announcements as initialAnnouncements,
  auditLogs as initialAuditLogs,
  feedbackSessions as initialFeedbackSessions,
  feedbackData as initialFeedbackData,
  studentFeeDetails as initialStudentFeeDetails,
  studentResults as initialStudentResults,
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
  type SubjectResult,
  type StudentResults,
} from '@/lib/mock-data';
import type { AttendanceState } from '@/components/attendance-sheet';
import { format, parseISO } from 'date-fns';

export type CalendarEventWithId = RawCalendarEvent & { id: string };
export type AuditLog = AuditLogType;
export type { SemesterFee };

const LOCAL_STORAGE_KEY = 'attend-ease-data-v2';

type CollegeState = {
  events: CalendarEventWithId[];
  timeTable: FullTimeTable;
  examTimeTable: FullExamTimeTable;
  departments: string[];
  years: string[];
  hours: string[];
  teachers: Teacher[];
  students: Student[];
  pendingStudents: Student[];
  leaveRequests: LeaveRequest[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  feedbackSessions: FeedbackSession[];
  feedbackData: Feedback[];
  studentFeeDetails: StudentFeeDetails;
  studentResults: StudentResults;
  currentUser: Student | Teacher | null;
};

const getInitialState = (): CollegeState => {
  return {
    events: initialEventsData.map((e, index) => ({ ...e, id: `event-${Date.now()}-${index}` })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    timeTable: initialTimeTable,
    examTimeTable: initialExamTimeTable,
    departments: initialCollegeData.departments,
    years: initialCollegeData.years,
    hours: initialCollegeData.hours,
    teachers: initialTeachers,
    students: initialStudents,
    pendingStudents: initialPendingStudents,
    leaveRequests: initialLeaveRequests,
    announcements: initialAnnouncements,
    auditLogs: initialAuditLogs,
    feedbackSessions: initialFeedbackSessions,
    feedbackData: initialFeedbackData,
    studentFeeDetails: initialStudentFeeDetails,
    studentResults: initialStudentResults,
    currentUser: null,
  };
};

type CollegeDataContextType = CollegeState & {
  isLoaded: boolean;
  setCurrentUser: (user: Student | Teacher | null) => void;
  logout: () => void;
  // Functions
  addEvent: (event: Omit<CalendarEventWithId, 'id'>, user: string) => void;
  updateEvent: (eventId: string, updatedEvent: Omit<CalendarEventWithId, 'id'>, user: string) => void;
  deleteEvent: (eventId: string, eventTitle: string, user: string) => void;
  updateTimeTable: (department: string, year: string, newTimeTable: ClassTimeTable, user: string) => void;
  updateExamTimeTable: (department: string, year: string, newExams: Exam[], user: string) => void;
  addDepartment: (department: string, user: string) => void;
  deleteDepartment: (department: string, user: string) => void;
  addYear: (year: string, user: string) => void;
  deleteYear: (year: string, user: string) => void;
  addHour: (hour: string, user: string) => void;
  deleteHour: (hour: string, user: string) => void;
  addTeacher: (name: string, id: string, password: string, user: string) => void;
  updateTeacherPassword: (teacherId: string, newPassword: string, user: string) => void;
  deleteTeacher: (teacherId: string, user: string) => void;
  toggleTeacherStatus: (teacherId: string, user: string) => void;
  addStudent: (student: Student, user: string) => void;
  updateStudent: (studentId: string, updatedStudent: Student, user: string) => void;
  deleteStudent: (studentId: string, user: string) => void;
  toggleStudentStatus: (studentId: string, user: string) => void;
  addPendingStudent: (student: Student) => void;
  approveStudentRegistration: (studentId: string, user: string) => void;
  rejectStudentRegistration: (studentId: string, user: string) => void;
  updatePendingStudent: (studentId: string, updatedStudent: Student, user: string) => void;
  addLeaveRequest: (studentId: string, startDate: string, endDate: string, reason: string) => void;
  approveLeaveRequest: (requestId: string, user: string) => void;
  rejectLeaveRequest: (requestId: string, reason: string, user: string) => void;
  addAnnouncement: (title: string, content: string, user: string) => void;
  deleteAnnouncement: (id: string, user: string) => void;
  saveAttendance: (classDetails: any, attendance: AttendanceState, user: string, isOnline: boolean) => void;
  submitFeedback: (sessionId: string, studentId: string, feedbacks: Array<{ subject: string; rating: number; comment?: string }>) => void;
  updateStudentFeeDetails: (studentId: string, semester: string, updatedFee: Pick<SemesterFee, 'totalFee' | 'paid'>, user: string) => void;
  updateStudentResults: (studentId: string, semester: string, subjectCode: string, updatedResult: Partial<SubjectResult>, user: string) => void;
};

const CollegeDataContext = createContext<CollegeDataContextType | undefined>(undefined);

export function CollegeDataProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<CollegeState>(getInitialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let finalState: CollegeState;
      try {
        const storedDataJSON = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedDataJSON) {
          const storedData = JSON.parse(storedDataJSON);
          const initialState = getInitialState();

          // Safely merge teachers: Start with initial teachers, update with stored data, add new ones
          const teacherMap = new Map<string, Teacher>(initialState.teachers.map(t => [t.id, t]));
          if (Array.isArray(storedData.teachers)) {
              storedData.teachers.forEach((teacher: Teacher) => {
                  teacherMap.set(teacher.id, { ...(teacherMap.get(teacher.id) || {}), ...teacher });
              });
          }

          // Safely merge students: Start with initial students, update with stored data, add new ones
          const studentMap = new Map<string, Student>(initialState.students.map(s => [s.id, s]));
          if (Array.isArray(storedData.students)) {
              storedData.students.forEach((student: Student) => {
                  studentMap.set(student.id, { ...(studentMap.get(student.id) || {}), ...student });
              });
          }
          
          finalState = {
            ...initialState, // Start with defaults
            ...storedData, // Apply stored dynamic data like events, logs, etc.
            teachers: Array.from(teacherMap.values()), // Use safely merged teachers
            students: Array.from(studentMap.values()), // Use safely merged students
          };

        } else {
          // No stored data, use fresh initial data.
          finalState = getInitialState();
        }
      } catch (error) {
        console.error('Failed to load or parse stored data, resetting.', error);
        finalState = getInitialState();
      }

      // Restore current user session from separate storage items
      const storedUserId = localStorage.getItem('currentUserId');
      const storedUserType = localStorage.getItem('currentUserType');
      if (storedUserId && storedUserType) {
          if (storedUserType === 'student') {
              finalState.currentUser = finalState.students.find(s => s.id === storedUserId) || null;
          } else {
              finalState.currentUser = finalState.teachers.find(t => t.id === storedUserId) || null;
          }
      } else {
          finalState.currentUser = null;
      }
      
      // Rehydrate Date objects from string representation in JSON
      if (finalState.auditLogs) {
          finalState.auditLogs = finalState.auditLogs.map((log: any) => ({...log, timestamp: new Date(log.timestamp)}));
      }

      setAppState(finalState);
      setIsLoaded(true);
    }
  }, []); // Run only once on mount

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      try {
        const stateToSave = { ...appState, currentUser: null }; // Don't save currentUser directly
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [appState, isLoaded]);

  const setCurrentUser = (user: Student | Teacher | null) => {
    setAppState(prev => ({ ...prev, currentUser: user }));
    if (user) {
        const isStudent = 'university_number' in user;
        localStorage.setItem('currentUserId', user.id);
        localStorage.setItem('currentUserType', isStudent ? 'student' : 'teacher');
    } else {
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserType');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addAuditLog = (user: string, action: string, type: AuditLog['type']) => {
    const newLog: AuditLog = { id: `log-${Date.now()}`, timestamp: new Date(), user, action, type };
    setAppState(prev => ({ ...prev, auditLogs: [newLog, ...prev.auditLogs] }));
  };
  
  const addEvent = (eventData: Omit<CalendarEventWithId, 'id'>, user: string) => {
    const newEvent: CalendarEventWithId = { ...eventData, id: `event-${Date.now()}` };
    setAppState(prev => ({ ...prev, events: [newEvent, ...prev.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
    addAuditLog(user, `Created event: "${eventData.title}"`, 'academic');
  };
  const updateEvent = (eventId: string, updatedEventData: Omit<CalendarEventWithId, 'id'>, user: string) => {
    setAppState(prev => ({ ...prev, events: prev.events.map(e => (e.id === eventId ? { ...updatedEventData, id: eventId } : e)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
    addAuditLog(user, `Updated event: "${updatedEventData.title}"`, 'academic');
  };
  const deleteEvent = (eventId: string, eventTitle: string, user: string) => {
    setAppState(prev => ({ ...prev, events: prev.events.filter(e => e.id !== eventId) }));
    addAuditLog(user, `Deleted event: "${eventTitle}"`, 'academic');
  };

  const updateTimeTable = (department: string, year: string, newClassTimeTable: ClassTimeTable, user: string) => {
    setAppState(prev => ({ ...prev, timeTable: { ...prev.timeTable, [department]: { ...(prev.timeTable[department] || {}), [year]: newClassTimeTable } } }));
    addAuditLog(user, `Updated timetable for ${department} - ${year}`, 'academic');
  };

  const updateExamTimeTable = (department: string, year: string, newExams: Exam[], user: string) => {
    setAppState(prev => ({ ...prev, examTimeTable: { ...prev.examTimeTable, [department]: { ...(prev.examTimeTable[department] || {}), [year]: newExams } } }));
    addAuditLog(user, `Updated exam timetable for ${department} - ${year}`, 'academic');
  };
  
  const addDepartment = (department: string, user: string) => { if (department && !appState.departments.includes(department)) { setAppState(prev => ({ ...prev, departments: [...prev.departments, department] })); addAuditLog(user, `Added new department: "${department}"`, 'academic'); } };
  const deleteDepartment = (department: string, user: string) => { setAppState(prev => ({ ...prev, departments: prev.departments.filter(d => d !== department) })); addAuditLog(user, `Deleted department: "${department}"`, 'academic'); };
  const addYear = (year: string, user: string) => { if (year && !appState.years.includes(year)) { setAppState(prev => ({ ...prev, years: [...prev.years, year] })); addAuditLog(user, `Added new year: "${year}"`, 'academic'); } };
  const deleteYear = (year: string, user: string) => { setAppState(prev => ({ ...prev, years: prev.years.filter(y => y !== year) })); addAuditLog(user, `Deleted year: "${year}"`, 'academic'); };
  const addHour = (hour: string, user: string) => { if (hour && !appState.hours.includes(hour)) { setAppState(prev => ({ ...prev, hours: [...prev.hours, hour] })); addAuditLog(user, `Added new class hour: "${hour}"`, 'academic'); } };
  const deleteHour = (hour: string, user: string) => { setAppState(prev => ({ ...prev, hours: prev.hours.filter(h => h !== hour) })); addAuditLog(user, `Deleted class hour: "${hour}"`, 'academic'); };

  const addTeacher = (name: string, id: string, password: string, user: string) => { if (name && id && password && !appState.teachers.some(t => t.id === id)) { setAppState(prev => ({ ...prev, teachers: [...prev.teachers, { name, id, password, isActive: true }] })); addAuditLog(user, `Added new teacher: ${name} (ID: ${id})`, 'teacher'); } };
  const updateTeacherPassword = (teacherId: string, newPassword: string, user: string) => { const teacher = appState.teachers.find(t => t.id === teacherId); if(teacher) { setAppState(prev => ({ ...prev, teachers: prev.teachers.map(t => t.id === teacherId ? { ...t, password: newPassword } : t) })); addAuditLog(user, `Changed password for teacher: ${teacher.name} (ID: ${teacherId})`, 'teacher'); } };
  const deleteTeacher = (teacherId: string, user: string) => { const teacher = appState.teachers.find(t => t.id === teacherId); if(teacher) { setAppState(prev => ({ ...prev, teachers: prev.teachers.filter(t => t.id !== teacherId) })); addAuditLog(user, `Deleted teacher: ${teacher.name} (ID: ${teacherId})`, 'teacher'); } };
  const toggleTeacherStatus = (teacherId: string, user: string) => { const teacher = appState.teachers.find(t => t.id === teacherId); if (teacher) { setAppState(prev => ({ ...prev, teachers: prev.teachers.map(t => t.id === teacherId ? { ...t, isActive: !t.isActive } : t) })); addAuditLog(user, `${teacher.isActive ? 'Deactivated' : 'Activated'} teacher: ${teacher.name} (ID: ${teacherId})`, 'teacher'); } };

  const addStudent = (student: Student, user: string) => { setAppState(prev => ({ ...prev, students: [student, ...prev.students] })); addAuditLog(user, `Added new student: ${student.name} (ID: ${student.id})`, 'student'); };
  const updateStudent = (studentId: string, updatedStudent: Student, user: string) => { setAppState(prev => ({ ...prev, students: prev.students.map(s => s.id === studentId ? updatedStudent : s) })); addAuditLog(user, `Updated details for student: ${updatedStudent.name} (ID: ${studentId})`, 'student'); };
  const deleteStudent = (studentId: string, user: string) => { const student = appState.students.find(s => s.id === studentId); if (student) { setAppState(prev => ({ ...prev, students: prev.students.filter(s => s.id !== studentId) })); addAuditLog(user, `Deleted student: ${student.name} (ID: ${studentId})`, 'student'); } };
  const toggleStudentStatus = (studentId: string, user: string) => { const student = appState.students.find(s => s.id === studentId); if (student) { setAppState(prev => ({ ...prev, students: prev.students.map(s => s.id === studentId ? { ...s, isActive: !s.isActive } : s) })); addAuditLog(user, `${student.isActive ? 'Deactivated' : 'Activated'} student: ${student.name} (ID: ${studentId})`, 'student'); } };
  
  const addPendingStudent = (student: Student) => { setAppState(prev => ({ ...prev, pendingStudents: [student, ...prev.pendingStudents] })); };
  const approveStudentRegistration = (studentId: string, user: string) => { const studentToApprove = appState.pendingStudents.find(s => s.id === studentId); if (studentToApprove) { setAppState(prev => ({ ...prev, students: [studentToApprove, ...prev.students], pendingStudents: prev.pendingStudents.filter(s => s.id !== studentId) })); addAuditLog(user, `Approved registration for ${studentToApprove.name} (ID: ${studentId})`, 'student'); } };
  const rejectStudentRegistration = (studentId: string, user: string) => { const studentToReject = appState.pendingStudents.find(s => s.id === studentId); if(studentToReject) { setAppState(prev => ({ ...prev, pendingStudents: prev.pendingStudents.filter(s => s.id !== studentId) })); addAuditLog(user, `Rejected registration for ${studentToReject.name} (ID: ${studentId})`, 'student'); } };
  const updatePendingStudent = (studentId: string, updatedStudent: Student, user: string) => { setAppState(prev => ({ ...prev, pendingStudents: prev.pendingStudents.map(s => s.id === studentId ? updatedStudent : s) })); addAuditLog(user, `Updated pending application for ${updatedStudent.name} (ID: ${studentId})`, 'student'); };

  const addLeaveRequest = (studentId: string, startDate: string, endDate: string, reason: string) => { const student = appState.students.find(s => s.id === studentId); if (!student) return; const newRequest: LeaveRequest = { id: `leave-${Date.now()}`, studentId, studentName: student.name, department: student.department, year: student.year, startDate, endDate, reason, status: 'pending' }; setAppState(prev => ({ ...prev, leaveRequests: [newRequest, ...prev.leaveRequests] })); };
  const approveLeaveRequest = (requestId: string, user: string) => { const request = appState.leaveRequests.find(r => r.id === requestId); if(request) { setAppState(prev => ({ ...prev, leaveRequests: prev.leaveRequests.map(r => r.id === requestId ? { ...r, status: 'approved' } : r) })); addAuditLog(user, `Approved leave request for ${request.studentName}`, 'leave'); } };
  const rejectLeaveRequest = (requestId: string, reason: string, user: string) => { const request = appState.leaveRequests.find(r => r.id === requestId); if(request) { setAppState(prev => ({ ...prev, leaveRequests: prev.leaveRequests.map(r => r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r) })); addAuditLog(user, `Rejected leave request for ${request.studentName}`, 'leave'); } };

  const addAnnouncement = (title: string, content: string, user: string) => { const newAnnouncement: Announcement = { id: `${Date.now()}`, title, content, date: format(new Date(), 'dd-MM-yyyy') }; setAppState(prev => ({ ...prev, announcements: [newAnnouncement, ...prev.announcements] })); addAuditLog(user, `Posted announcement: "${title}"`, 'announcement'); };
  const deleteAnnouncement = (id: string, user: string) => { const announcement = appState.announcements.find(a => a.id === id); if (announcement) { setAppState(prev => ({ ...prev, announcements: prev.announcements.filter(ann => ann.id !== id) })); addAuditLog(user, `Deleted announcement: "${announcement.title}"`, 'announcement'); } };

  const saveAttendance = (classDetails: any, attendance: AttendanceState, user: string, isOnline: boolean) => { if (isOnline) { addAuditLog(user, `Saved attendance for ${classDetails.department} - ${classDetails.year} (${classDetails.subject}) on ${classDetails.date}`, 'attendance'); } else { const key = `offline-attendance-${classDetails.department}-${classDetails.year}-${classDetails.subject}-${classDetails.date}`; try { const pendingSyncs = JSON.parse(localStorage.getItem('pending-attendance-syncs') || '[]' ); if (!pendingSyncs.includes(key)) { pendingSyncs.push(key); localStorage.setItem('pending-attendance-syncs', JSON.stringify(pendingSyncs)); } localStorage.setItem(key, JSON.stringify({ classDetails, attendance, user })); } catch (error) { console.error("Failed to save to localStorage", error); } } };
  
  const submitFeedback = (sessionId: string, studentId: string, feedbacks: Array<{ subject: string; rating: number; comment?: string }>) => { const newFeedbacks: Feedback[] = feedbacks.map((fb, index) => ({ id: `fb-${Date.now()}-${index}`, sessionId, studentId, subject: fb.subject, rating: fb.rating, comment: fb.comment })); setAppState(prev => ({ ...prev, feedbackData: [...prev.feedbackData, ...newFeedbacks] })); };

  const updateStudentFeeDetails = (studentId: string, semester: string, updatedFee: Pick<SemesterFee, 'totalFee' | 'paid'>, user: string) => { const student = appState.students.find(s => s.id === studentId); if (!student) return; setAppState(prev => { const studentFees = prev.studentFeeDetails[studentId] ? [...prev.studentFeeDetails[studentId]] : []; const updatedFees = studentFees.map(fee => { if (fee.semester === semester) { const newPaid = updatedFee.paid; const newTotal = updatedFee.totalFee; const balance = newTotal - newPaid; const status = balance <= 0 ? 'Paid' : (new Date() > parseISO(fee.dueDate) ? 'Overdue' : 'Pending'); return { ...fee, totalFee: newTotal, paid: newPaid, balance, status }; } return fee; }); return { ...prev, studentFeeDetails: { ...prev.studentFeeDetails, [studentId]: updatedFees } }; }); addAuditLog(user, `Updated fee for ${student.name} (Sem: ${semester}, Paid: ${updatedFee.paid}, Total: ${updatedFee.totalFee})`, 'student'); };
  
  const updateStudentResults = (studentId: string, semester: string, subjectCode: string, updatedResult: Partial<SubjectResult>, user: string) => { const student = appState.students.find(s => s.id === studentId); if (!student) return; setAppState(prev => { const studentSemesters = prev.studentResults[studentId] ? [...prev.studentResults[studentId]] : []; const updatedSemesters = studentSemesters.map(sem => { if (sem.semester === semester) { const updatedSubjects = sem.results.map(subj => { if (subj.subjectCode === subjectCode) { return { ...subj, ...updatedResult }; } return subj; }); return { ...sem, results: updatedSubjects }; } return sem; }); return { ...prev, studentResults: { ...prev.studentResults, [studentId]: updatedSemesters } }; }); addAuditLog(user, `Updated results for ${student.name} (Sem: ${semester}, Subject: ${subjectCode})`, 'student'); };
  
  const contextValue: CollegeDataContextType = { 
    ...appState,
    isLoaded,
    setCurrentUser,
    logout,
    addEvent, updateEvent, deleteEvent, 
    updateTimeTable,
    updateExamTimeTable,
    addDepartment, deleteDepartment,
    addYear, deleteYear,
    addHour, deleteHour,
    addTeacher, updateTeacherPassword, deleteTeacher, toggleTeacherStatus,
    addStudent, updateStudent, deleteStudent, toggleStudentStatus,
    addPendingStudent, approveStudentRegistration, rejectStudentRegistration, updatePendingStudent,
    addLeaveRequest, approveLeaveRequest, rejectLeaveRequest,
    addAnnouncement, deleteAnnouncement,
    saveAttendance,
    submitFeedback,
    updateStudentFeeDetails,
    updateStudentResults,
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
