
import { type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  // Student ID check should be case-insensitive
  const user = studentList.find(u => u.university_number.toLowerCase() === id.toLowerCase());
  
  if (user) {
    try {
      // Stored DOB is 'YYYY-MM-DD'
      const [storedYear, storedMonth, storedDay] = user.dob.split('-').map(Number);

      // Input password is 'dd-MM-yyyy'
      const passParts = pass.split('-');
      if (passParts.length !== 3) return null;

      const [inputDay, inputMonth, inputYear] = passParts.map(Number);
      
      // Check if parts are valid numbers before comparison
      if (isNaN(inputDay) || isNaN(inputMonth) || isNaN(inputYear)) return null;

      if (storedYear === inputYear && storedMonth === inputMonth && storedDay === inputDay) {
        return user.isActive ? user : 'inactive';
      }
    } catch (e) {
      console.error("Error validating student password date:", e);
      return null;
    }
  }
  
  return null;
}

export function validateTeacher(id:string, pass: string, teacherList: Teacher[]): Teacher | 'inactive' | null {
  // Teacher ID check should be case-insensitive.
  const user = teacherList.find(u => u.id.toLowerCase() === id.toLowerCase());

  if (user) {
    if (user.password === pass) {
      return user.isActive ? user : 'inactive';
    }
  }
  
  return null;
}
