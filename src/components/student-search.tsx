'use client';

import { useState, useMemo } from 'react';
import { User, BarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { students, collegeData, previousAttendanceData, studentAttendance, type Student } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StudentAttendanceSummary } from './student-attendance-summary';
import { Button } from './ui/button';

// Helper function to calculate attendance
const calculateAttendancePercentage = (studentId: string) => {
  const studentRecords = previousAttendanceData.filter(record => record.studentId === studentId);
  if (studentRecords.length === 0) {
    return 0;
  }
  const presentCount = studentRecords.filter(record => record.attendanceStatus === 'present').length;
  return Math.round((presentCount / studentRecords.length) * 100);
};

export function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [attendanceRange, setAttendanceRange] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchTerm && !department && !year && !attendanceRange) {
      return [];
    }
    
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        !searchTerm ||
        student.name.toLowerCase().includes(searchLower) ||
        student.rollNumber.toLowerCase().includes(searchLower) ||
        student.university_number.toLowerCase().includes(searchLower);

      const matchesDepartment = !department || student.department === department;
      const matchesYear = !year || student.year === year;

      const matchesAttendance = (() => {
        if (!attendanceRange) return true;
        const attendance = calculateAttendancePercentage(student.id);
        if (attendanceRange === "0") {
            return attendance === 0;
        }
        if (attendanceRange === 'all') return true;
        const [min, max] = attendanceRange.split('-').map(Number);
        return attendance >= min && attendance <= max;
      })();

      return matchesSearchTerm && matchesDepartment && matchesYear && matchesAttendance;
    });
  }, [searchTerm, department, year, attendanceRange]);

  const attendanceRanges = [
    { label: "All Attendance", value: "all" },
    { label: "Long Absentees (0%)", value: "0" },
    { label: "1% - 20%", value: "1-20" },
    { label: "21% - 40%", value: "21-40" },
    { label: "41% - 60%", value: "41-60" },
    { label: "61% - 75%", value: "61-75" },
    { label: "76% - 100%", value: "76-100" },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Search</CardTitle>
          <CardDescription>Find a student by name, roll number, or university number, and filter by class.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="student-search">Search Student</Label>
              <Input
                id="student-search"
                placeholder="Enter name, roll no, or university no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Department</Label>
                <Select value={department} onValueChange={(value) => setDepartment(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {collegeData.departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Year</Label>
                <Select value={year} onValueChange={(value) => setYear(value === 'all' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {collegeData.years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                  <Label>Attendance Range</Label>
                  <Select value={attendanceRange} onValueChange={(value) => setAttendanceRange(value === 'all' ? '' : value)}>
                      <SelectTrigger>
                          <SelectValue placeholder="Filter by Attendance" />
                      </SelectTrigger>
                      <SelectContent>
                          {attendanceRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                              {range.label}
                          </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {searchTerm || department || year || attendanceRange ? (
              filteredStudents.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredStudents.map(student => {
                    const attendance = calculateAttendancePercentage(student.id);
                    return (
                      <Card key={student.id} className="flex flex-col justify-between">
                        <div>
                            <CardHeader className="flex flex-row items-center gap-4 p-4">
                                <Avatar className="h-12 w-12 border">
                                <AvatarImage src={student.photoUrl || `https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="student portrait" />
                                <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                                <div>
                                <CardTitle className="text-lg">{student.name}</CardTitle>
                                <CardDescription>{student.university_number}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm pt-0 p-4">
                                <p><strong>Roll No:</strong> {student.rollNumber}</p>
                                <p><strong>Class:</strong> {student.department} - {student.year}</p>
                                <div>
                                <div className="flex justify-between mb-1">
                                    <p className="font-medium">Overall Attendance</p>
                                    <p className="text-muted-foreground">{attendance}%</p>
                                </div>
                                <Progress value={attendance} />
                                </div>
                            </CardContent>
                        </div>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full" onClick={() => setSelectedStudent(student)}>
                                <BarChart className="mr-2 h-4 w-4" />
                                View Full Attendance Report
                            </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No students found matching your criteria.</p>
              )
            ) : (
              <p className="text-center text-muted-foreground py-8">Enter a search term or select a filter to find students.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedStudent} onOpenChange={(isOpen) => !isOpen && setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
                <DialogTitle>Full Attendance Report for {selectedStudent?.name}</DialogTitle>
                <DialogDescription>
                    {selectedStudent?.department} - {selectedStudent?.year} | Roll No: {selectedStudent?.rollNumber}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4">
                <StudentAttendanceSummary attendanceData={studentAttendance} />
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
