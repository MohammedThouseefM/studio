
import { students, teachers, type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string): Student | null {
  const user = students.find(u => u.university_number === id);
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

export function validateTeacher(id:string, pass: string): Teacher | null {
  const user = teachers.find(u => u.id === id);
  if (user && user.password === pass) {
    return user;
  }
  return null;
}
