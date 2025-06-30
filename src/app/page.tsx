
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building, GraduationCap, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { validateStudent, validateTeacher } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateStudent(studentId, studentPassword);
    if (isValid) {
      router.push('/student/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid Student ID or Password.',
      });
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateTeacher(teacherId, teacherPassword);
    if (isValid) {
      router.push('/teacher/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid Staff ID or Password.',
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <School className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold text-primary font-headline">AttendEase</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">
                <GraduationCap className="mr-2 h-4 w-4" /> Student
              </TabsTrigger>
              <TabsTrigger value="teacher">
                <Building className="mr-2 h-4 w-4" /> Teacher
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <form onSubmit={handleStudentLogin}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-id">Student ID (University Number)</Label>
                    <Input
                      id="student-id"
                      placeholder="Enter your university number"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password (Roll No.)</Label>
                    <Input 
                      id="student-password" 
                      type="password" 
                      placeholder="Enter your roll number"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)} 
                      required />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Login as Student
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="teacher">
              <form onSubmit={handleTeacherLogin}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-id">Staff ID</Label>
                    <Input
                      id="teacher-id"
                      placeholder="Enter your staff ID"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <Input 
                      id="teacher-password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Login as Teacher
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
