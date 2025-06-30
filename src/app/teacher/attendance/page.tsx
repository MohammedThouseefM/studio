import { Suspense } from 'react';
import { AttendanceSheet } from '@/components/attendance-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function AttendanceSheetSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex justify-between items-center p-4 border rounded-md">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type AttendancePageProps = {
  searchParams: {
    dept?: string;
    year?: string;
    hour?: string;
    date?: string;
  };
};

export default function AttendancePage({ searchParams }: AttendancePageProps) {
  const { dept, year, hour, date } = searchParams;

  const classDetails = {
    department: dept || 'N/A',
    year: year || 'N/A',
    subject: hour || 'N/A', // Using hour as subject for backend
    date: date || 'N/A',
  };

  const isValid = dept && year && hour && date;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Attendance Sheet</h1>
      <Suspense fallback={<AttendanceSheetSkeleton />}>
        {isValid ? (
          <AttendanceSheet classDetails={classDetails} />
        ) : (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
            Invalid class details provided. Please go back to the dashboard and select a class.
          </div>
        )}
      </Suspense>
    </div>
  );
}
