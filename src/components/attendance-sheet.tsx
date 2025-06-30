
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Wand2, Loader2, CheckCircle, XCircle } from 'lucide-react';

import { getAttendancePrediction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { previousAttendanceData, students, type Student } from '@/lib/mock-data';

type AttendanceStatus = 'present' | 'absent';
type AttendanceState = Record<string, { status: AttendanceStatus; isPredicted: boolean }>;

type AttendanceSheetProps = {
  classDetails: {
    department: string;
    year: string;
    subject: string; // This is the 'hour' from the selector
    date: string;
  };
};

export function AttendanceSheet({ classDetails }: AttendanceSheetProps) {
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const initialState: AttendanceState = {};
    students.forEach((student) => {
      initialState[student.id] = { status: 'present', isPredicted: false };
    });
    setAttendance(initialState);
  }, []);

  const handleStatusChange = (studentId: string, newStatus: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { status: newStatus ? 'present' : 'absent', isPredicted: false },
    }));
  };
  
  const handlePrediction = () => {
    startTransition(async () => {
      const result = await getAttendancePrediction({
        ...classDetails,
        previousAttendanceData,
      });

      if (result.success && result.data) {
        toast({
          title: 'Prediction Complete',
          description: 'AI-powered attendance suggestions have been applied.',
        });
        const newAttendanceState: AttendanceState = { ...attendance };
        result.data.forEach((prediction) => {
          if (newAttendanceState[prediction.studentId]) {
            newAttendanceState[prediction.studentId] = {
              status: prediction.predictedStatus,
              isPredicted: true,
            };
          }
        });
        setAttendance(newAttendanceState);
      } else {
        toast({
          variant: 'destructive',
          title: 'Prediction Failed',
          description: result.error || 'An unknown error occurred.',
        });
      }
    });
  };

  const handleSave = () => {
    // Mock save
    console.log('Saving attendance:', attendance);
    toast({
      title: 'Attendance Saved!',
      description: 'The attendance has been successfully recorded.',
    });
  };

  const getStudentById = (id: string): Student | undefined => students.find(s => s.id === id);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Attendance for {classDetails.subject}</CardTitle>
            <CardDescription>
              {classDetails.department} - {classDetails.year} | Date: {classDetails.date}
            </CardDescription>
          </div>
          <Button onClick={handlePrediction} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Predict Attendance
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Mark Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.keys(attendance).length > 0 ? (
                Object.entries(attendance).map(([studentId, { status, isPredicted }]) => {
                  const student = getStudentById(studentId);
                  return student ? (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        {status === 'present' ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" /> Present
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" /> Absent
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           {isPredicted && <Wand2 className="h-4 w-4 text-accent" title="AI Suggestion" />}
                          <Switch
                            checked={status === 'present'}
                            onCheckedChange={(checked) => handleStatusChange(student.id, checked)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null;
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading students...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Save Attendance</Button>
        </div>
      </CardContent>
    </Card>
  );
}
