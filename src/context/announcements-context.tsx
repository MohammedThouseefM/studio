'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { announcements as initialAnnouncements, type Announcement } from '@/lib/mock-data';

type AnnouncementsContextType = {
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;
};

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const addAnnouncement = (title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: `${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };
  
  return (
    <AnnouncementsContext.Provider value={{ announcements, addAnnouncement, deleteAnnouncement }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  }
  return context;
}
