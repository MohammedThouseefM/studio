
import { type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  const user = studentList.find(u => u.university_number === id);
  
  if (user) {
    if (user.dob === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | 'inactive' | null {
  const user = teacherList.find(u => u.id === id);

  if (user) {
    if (user.password === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}
