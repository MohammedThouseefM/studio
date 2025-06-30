
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  academicCalendarEvents as initialEventsData,
  timeTable as initialTimeTable,
  collegeData as initialCollegeData,
  teachers as initialTeachers,
  type CalendarEvent as RawCalendarEvent,
  type FullTimeTable,
  type ClassTimeTable,
  type Teacher,
} from '@/lib/mock-data';

export type CalendarEventWithId = RawCalendarEvent & { id: string };

type CollegeDataContextType = {
  // Events
  events: CalendarEventWithId[];
  addEvent: (event: Omit<CalendarEventWithId, 'id'>) => void;
  updateEvent: (eventId: string, updatedEvent: Omit<CalendarEventWithId, 'id'>) => void;
  deleteEvent: (eventId: string) => void;
  // Timetable
  timeTable: FullTimeTable;
  updateTimeTable: (department: string, year: string, newTimeTable: ClassTimeTable) => void;
  // Academic Structure
  departments: string[];
  addDepartment: (department: string) => void;
  deleteDepartment: (department: string) => void;
  years: string[];
  addYear: (year: string) => void;
  deleteYear: (year: string) => void;
  hours: string[];
  addHour: (hour: string) => void;
  deleteHour: (hour: string) => void;
  // Teachers
  teachers: Teacher[];
  addTeacher: (name: string, id: string, password: string) => void;
  updateTeacherPassword: (teacherId: string, newPassword: string) => void;
  deleteTeacher: (teacherId: string) => void;
};

const CollegeDataContext = createContext<CollegeDataContextType | undefined>(undefined);

export function CollegeDataProvider({ children }: { children: ReactNode }) {
  // Event State
  const [events, setEvents] = useState<CalendarEventWithId[]>(() => 
    initialEventsData.map((e, index) => ({ ...e, id: `event-${Date.now()}-${index}` }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  
  // Timetable State
  const [timeTable, setTimeTable] = useState<FullTimeTable>(initialTimeTable);

  // Academic Structure State
  const [departments, setDepartments] = useState<string[]>(initialCollegeData.departments);
  const [years, setYears] = useState<string[]>(initialCollegeData.years);
  const [hours, setHours] = useState<string[]>(initialCollegeData.hours);

  // Teacher State
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);

  // Event functions
  const addEvent = (eventData: Omit<CalendarEventWithId, 'id'>) => {
    const newEvent: CalendarEventWithId = { 
      ...eventData, 
      id: `event-${Date.now()}` 
    };
    setEvents(prev => [newEvent, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  const updateEvent = (eventId: string, updatedEventData: Omit<CalendarEventWithId, 'id'>) => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...updatedEventData, id: eventId } : e))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  // Timetable functions
  const updateTimeTable = (department: string, year: string, newClassTimeTable: ClassTimeTable) => {
    setTimeTable(prev => ({
      ...prev,
      [department]: {
        ...(prev[department] || {}),
        [year]: newClassTimeTable,
      },
    }));
  };
  
  // Academic Structure functions
  const addDepartment = (department: string) => { if (department && !departments.includes(department)) setDepartments(prev => [...prev, department]); };
  const deleteDepartment = (department: string) => setDepartments(prev => prev.filter(d => d !== department));
  const addYear = (year: string) => { if (year && !years.includes(year)) setYears(prev => [...prev, year]); };
  const deleteYear = (year: string) => setYears(prev => prev.filter(y => y !== year));
  const addHour = (hour: string) => { if (hour && !hours.includes(hour)) setHours(prev => [...prev, hour]); };
  const deleteHour = (hour: string) => setHours(prev => prev.filter(h => h !== hour));

  // Teacher functions
  const addTeacher = (name: string, id: string, password: string) => {
    if (name && id && password && !teachers.some(t => t.id === id)) {
      setTeachers(prev => [...prev, { name, id, password }]);
    }
  };
  const updateTeacherPassword = (teacherId: string, newPassword: string) => {
    setTeachers(prev => prev.map(t => t.id === teacherId ? { ...t, password: newPassword } : t));
  };
  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const contextValue = { 
    events, addEvent, updateEvent, deleteEvent, 
    timeTable, updateTimeTable,
    departments, addDepartment, deleteDepartment,
    years, addYear, deleteYear,
    hours, addHour, deleteHour,
    teachers, addTeacher, updateTeacherPassword, deleteTeacher
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
