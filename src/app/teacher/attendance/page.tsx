'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AttendanceSheet } from '@/components/attendance-sheet';
import { Button } from '@/components/ui/button';
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
  const router = useRouter();
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold">Attendance Sheet</h1>
      </div>

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
