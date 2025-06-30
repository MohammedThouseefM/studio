'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { students } from "@/lib/mock-data";

export default function StudentProfilePage() {
  const router = useRouter();
  // In a real app, you would get the logged-in student's ID from a session
  // and fetch their specific data. For this demo, we'll use the first student.
  const student = students[0];

  if (!student) {
    return (
      <div className="container py-8 text-center">
        Student data not available.
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 text-center md:text-left">
            <Avatar className="h-24 w-24 border">
                <AvatarImage src={`https://placehold.co/200x200.png`} alt="Student avatar" data-ai-hint="student portrait" />
                <AvatarFallback>
                    <User className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-3xl">{student.name}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">{student.email}</CardDescription>
                <CardDescription className="text-sm text-muted-foreground mt-1">University Number: {student.university_number}</CardDescription>
            </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="font-medium">{student.rollNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{student.department}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{student.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{student.dob}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{student.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
