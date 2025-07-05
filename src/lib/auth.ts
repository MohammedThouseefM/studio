
import { type Student, type Teacher } from './mock-data';
import { format } from 'date-fns';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  const user = studentList.find(u => u.university_number === id);
  
  if (user) {
    // The stored DOB is YYYY-MM-DD. The password input is dd-MM-yyyy.
    // We must format the stored DOB to match the password format for comparison.
    try {
        const formattedDob = format(new Date(user.dob), 'dd-MM-yyyy');
        if (formattedDob === pass) {
            return user.isActive ? user : 'inactive';
        }
    } catch (e) {
        // Fallback for any potential date format errors
        if (user.dob === pass) {
            return user.isActive ? user : 'inactive';
        }
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
