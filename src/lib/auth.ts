
import { type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  // Student ID check should be case-insensitive
  const user = studentList.find(u => u.university_number.toLowerCase() === id.toLowerCase());
  
  if (user) {
    // Password (pass) and stored DOB (user.dob) are both expected in YYYY-MM-DD format.
    if (user.dob === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | 'inactive' | null {
  // Teacher ID check should be case-insensitive.
  const user = teacherList.find(u => u.id.toLowerCase() === id.toLowerCase());

  if (user) {
    // Password check is case-sensitive
    if (user.password === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}
