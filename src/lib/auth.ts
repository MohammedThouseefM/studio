
'use server';

import { studentUsers, teacherUsers as teachers } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export async function validateStudent(id: string, pass: string): Promise<boolean> {
  // Student ID is the university number, password is the DOB in YYYY-MM-DD format.
  const user = studentUsers.find(u => u.id === id);
  return !!user && user.password === pass;
}

export async function validateTeacher(id:string, pass: string): Promise<boolean> {
  const user = teachers.find(u => u.id === id);
  return !!user && user.password === pass;
}
