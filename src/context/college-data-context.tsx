
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  academicCalendarEvents as initialEventsData,
  timeTable as initialTimeTable,
  type CalendarEvent as RawCalendarEvent,
  type FullTimeTable,
  type ClassTimeTable,
} from '@/lib/mock-data';

export type CalendarEventWithId = RawCalendarEvent & { id: string };

type CollegeDataContextType = {
  events: CalendarEventWithId[];
  addEvent: (event: Omit<CalendarEventWithId, 'id'>) => void;
  updateEvent: (eventId: string, updatedEvent: Omit<CalendarEventWithId, 'id'>) => void;
  deleteEvent: (eventId: string) => void;
  timeTable: FullTimeTable;
  updateTimeTable: (department: string, year: string, newTimeTable: ClassTimeTable) => void;
};

const CollegeDataContext = createContext<CollegeDataContextType | undefined>(undefined);

export function CollegeDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEventWithId[]>(() => 
    initialEventsData.map((e, index) => ({ ...e, id: `event-${Date.now()}-${index}` }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  
  const [timeTable, setTimeTable] = useState<FullTimeTable>(initialTimeTable);

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
  
  const updateTimeTable = (department: string, year: string, newClassTimeTable: ClassTimeTable) => {
    setTimeTable(prev => ({
      ...prev,
      [department]: {
        ...(prev[department] || {}),
        [year]: newClassTimeTable,
      },
    }));
  };
  
  return (
    <CollegeDataContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, timeTable, updateTimeTable }}>
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
