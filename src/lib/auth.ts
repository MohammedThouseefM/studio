
import { type Student, type Teacher, students as initialStudents, teachers as initialTeachers } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | null {
  // Check the live list first, which includes new students from the session.
  let user = studentList.find(u => u.university_number === id);
  if (user && user.dob === pass) {
    return user;
  }

  // FALLBACK: If not found, check against the initial hardcoded list.
  // This is a safety net in case the live list from storage is corrupted.
  user = initialStudents.find(u => u.university_number === id);
  if (user && user.dob === pass) {
    return user;
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | null {
  // First, check the list provided from the context (which may include new teachers)
  let user = teacherList.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }

  // FALLBACK: If not found in the live list (e.g., if storage is cleared),
  // check against the initial hardcoded list of teachers.
  // This ensures the default admin accounts always work.
  user = initialTeachers.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }
  
  return null;
}
