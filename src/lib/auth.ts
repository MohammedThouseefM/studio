
import { type Student, type Teacher, teachers as initialTeachers } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | null {
  const user = studentList.find(u => u.university_number === id);
  if (user) {
    // User enters password as dd-mm-yyyy. Student DOB is stored as yyyy-mm-dd.
    const passParts = pass.split(/[-/]/);
    if (passParts.length === 3 && passParts[0].length === 2) {
      const day = passParts[0];
      const month = passParts[1];
      const year = passParts[2];
      const formattedPassForComparison = `${year}-${month}-${day}`;
      if (user.dob === formattedPassForComparison) {
        return user;
      }
    }
  }
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | null {
  // First, check the list provided from the context (which may include new teachers)
  let user = teacherList.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }

  // FALLBACK: If not found in the live list (or if the list is corrupt/empty),
  // check against the initial hardcoded list of teachers.
  // This ensures the default admin accounts always work.
  user = initialTeachers.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }
  
  return null;
}
