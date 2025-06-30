'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Calendar as DayPicker } from '@/components/ui/calendar';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCollegeData, type CalendarEventWithId } from '@/context/college-data-context';

const eventColors = {
  holiday: 'bg-green-500',
  exam: 'bg-red-500',
  assignment: 'bg-blue-500',
  event: 'bg-purple-500',
};

export function AcademicCalendar() {
  const { events } = useCollegeData();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  
  const eventsByDate = events.reduce((acc, event) => {
    const date = event.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEventWithId[]>);

  const selectedDayEvents = selectedDay ? eventsByDate[format(selectedDay, 'yyyy-MM-dd')] || [] : [];

  const modifiers = {
    event: Object.keys(eventsByDate).map(dateStr => parseISO(dateStr)),
  };

  const modifiersClassNames = {
    event: 'has-event',
  };

  const EventCell = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateStr];
    
    if (dayEvents) {
      return (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {dayEvents.slice(0,3).map((event, i) => (
            <div key={i} className={cn('h-1.5 w-1.5 rounded-full', eventColors[event.type])} />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar /> Academic Calendar
        </CardTitle>
        <CardDescription>
          View important dates, events, and deadlines. Click a date to see details.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
           <style>{`
            .has-event {
              position: relative;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={setSelectedDay}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            components={{
              DayContent: EventCell,
            }}
            className="rounded-md border not-prose"
          />
           <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500"></span> Exam</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-500"></span> Assignment</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500"></span> Holiday</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-purple-500"></span> Event</div>
           </div>
        </div>
        <div className="md:col-span-1">
          <h3 className="font-semibold text-lg mb-4">
            Events for {selectedDay ? format(selectedDay, 'PPP') : '...'}
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {selectedDayEvents.length > 0 ? (
              selectedDayEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-md border bg-card-foreground/5 flex items-start gap-3">
                   <span className={cn('mt-1 h-4 w-4 shrink-0 rounded-full', eventColors[event.type])} />
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No events on this day.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
