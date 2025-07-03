
import { students, teachers, type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string): Student | null {
  // Student ID is the university number, password is the DOB in YYYY-MM-DD format.
  const user = students.find(u => u.university_number === id);
  if (user && user.dob === pass) {
    return user;
  }
  return null;
}

export function validateTeacher(id:string, pass: string): Teacher | null {
  const user = teachers.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }
  return null;
}
