'use client';

import { useState, useMemo } from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { students, collegeData, previousAttendanceData } from '@/lib/mock-data';

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

  const filteredStudents = useMemo(() => {
    if (!searchTerm && !department && !year) {
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

      return matchesSearchTerm && matchesDepartment && matchesYear;
    });
  }, [searchTerm, department, year]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Search</CardTitle>
        <CardDescription>Find a student by name, roll number, or university number, and filter by class.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <Label htmlFor="student-search">Search Student</Label>
            <Input
              id="student-search"
              placeholder="Enter name, roll no, or university no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
        </div>

        <div className="space-y-4">
          {searchTerm || department || year ? (
            filteredStudents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredStudents.map(student => {
                  const attendance = calculateAttendancePercentage(student.id);
                  return (
                    <Card key={student.id} className="flex flex-col">
                      <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <Avatar className="h-12 w-12 border">
                           <AvatarImage src={`https://placehold.co/100x100.png`} alt={student.name} data-ai-hint="student portrait" />
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
                        <p><strong>Email:</strong> {student.email}</p>
                        <div>
                          <div className="flex justify-between mb-1">
                             <p className="font-medium">Attendance</p>
                             <p className="text-muted-foreground">{attendance}%</p>
                          </div>
                           <Progress value={attendance} />
                        </div>
                      </CardContent>
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
  );
}
