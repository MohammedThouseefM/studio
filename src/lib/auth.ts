
import { type Student, type Teacher, students as initialStudents, teachers as initialTeachers } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  let user = studentList.find(u => u.university_number === id);
  
  // Primary check against live data
  if (user) {
    if (user.dob === pass) {
      return user.isActive ? user : 'inactive';
    }
  }

  // Fallback check against initial data if not found in live data
  if (!user) {
    user = initialStudents.find(u => u.university_number === id);
    if (user && user.dob === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | 'inactive' | null {
  let user = teacherList.find(u => u.id === id);

  // Primary check against live data
  if (user) {
    if (user.password === pass) {
      return user.isActive ? user : 'inactive';
    }
  }

  // Fallback check against initial data if not found in live data
  if (!user) {
    user = initialTeachers.find(u => u.id === id);
    if (user && user.password === pass) {
        return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}
