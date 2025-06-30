
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { School, Building, GraduationCap, Volume2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { validateStudent, validateTeacher } from '@/lib/auth';

export default function LandingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [studentId, setStudentId] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [fontSize, setFontSize] = useState('base');

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('text-sm', 'text-base', 'text-lg');
    // The text-base class is applied by default in tailwind, so we just need to handle sm and lg
    if (fontSize === 'sm') {
      html.classList.add('text-sm');
    } else if (fontSize === 'lg') {
      html.classList.add('text-lg');
    }
  }, [fontSize]);

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
  
  const handleScrollToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <School className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary">AttendEase University</h1>
              <p className="text-xs text-muted-foreground">Accredited Grade 'A' | Anytown, India</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <div className="flex items-center gap-1 rounded-full border bg-secondary p-1">
                <Button variant={fontSize === 'sm' ? 'default' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setFontSize('sm')} aria-label="Decrease font size">
                   A-
                </Button>
                <Button variant={fontSize === 'base' ? 'default' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setFontSize('base')} aria-label="Default font size">
                   A
                </Button>
                <Button variant={fontSize === 'lg' ? 'default' : 'ghost'} size="icon" className="h-7 w-7 rounded-full" onClick={() => setFontSize('lg')} aria-label="Increase font size">
                   A+
                </Button>
            </div>
            <Button variant="outline" size="icon" aria-label="Enable screen reader">
              <Volume2 className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                    <a href="#login-section" onClick={handleScrollToLogin}>Student Login</a>
                </Button>
                <Button asChild>
                    <a href="#login-section" onClick={handleScrollToLogin}>Teacher Login</a>
                </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Hero Section */}
        <section className="relative h-[60vh] w-full">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="University Campus"
            data-ai-hint="university campus"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
             <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">Excellence in Education</h2>
             <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
                Empowering the next generation of leaders through innovative teaching and research.
             </p>
          </div>
        </section>

        {/* 3. About Section */}
        <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl inline-block relative pb-2">
                        About Our University
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-primary rounded-full"></span>
                    </h2>
                    <p className="mt-8 text-lg/relaxed text-muted-foreground">
                        Founded in 1985, AttendEase University has been a beacon of knowledge and innovation for nearly four decades. Our mission is to provide a holistic education that not only imparts knowledge but also fosters critical thinking, creativity, and a sense of social responsibility.
                    </p>
                    <p className="mt-4 text-lg/relaxed text-muted-foreground">
                        With a diverse student body and a world-class faculty, we are proud of our numerous achievements in research, academia, and community service. We are committed to creating an environment where every student can thrive and achieve their full potential.
                    </p>
                </div>
            </div>
        </section>

        {/* Login Section */}
        <section id="login-section" className="py-16 sm:py-24 bg-muted/40">
           <div className="container mx-auto flex flex-col items-center justify-center p-4">
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
            </div>
        </section>
      </main>
      <footer className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} AttendEase University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
