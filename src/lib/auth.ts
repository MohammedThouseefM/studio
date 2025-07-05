import { type Student, type Teacher } from './mock-data';

// In a real app, passwords would be hashed. For this demo, we do a simple string comparison.
export function validateStudent(id: string, pass: string, studentList: Student[]): Student | 'inactive' | null {
  // Student ID check should be case-insensitive
  const user = studentList.find(u => u.university_number.toLowerCase() === id.toLowerCase());
  
  if (user) {
    // The stored DOB is in 'YYYY-MM-DD' format. The password input is in 'dd-MM-yyyy' format.
    // Instead of using new Date() which can have timezone issues, we'll reformat the input string.
    try {
        const passParts = pass.split('-');
        if (passParts.length === 3) {
            const [day, month, year] = passParts;
            // Ensure parts are valid before creating the string
            if (day && month && year && year.length === 4) {
                const formattedPassAsDob = `${year}-${month}-${day}`;
                if (user.dob === formattedPassAsDob) {
                    return user.isActive ? user : 'inactive';
                }
            }
        }
    } catch (e) {
        console.error("Error parsing date from password", e);
        // This catch block will likely not be hit with string splitting, but it's safe to keep.
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
