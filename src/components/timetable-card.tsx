import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { timeTable } from '@/lib/mock-data';

export function TimetableCard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = timeTable[today as keyof typeof timeTable] || timeTable['Monday'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          <span>Today's Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaySchedule.slice(0, 3).map((subject, index) => (
             <div key={index} className="text-sm p-2 rounded-md bg-card-foreground/5">
                <span className="font-medium">{`Hour ${index + 1}: `}</span>
                <span className="text-muted-foreground">{subject}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/student/timetable">
            View Full Timetable <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
