
// This is a server-only file
import { db } from './firebase';
import { 
  type Student, students as mockStudents,
  type Teacher, teachers as mockTeachers,
} from './mock-data';

/**
 * A generic seeder function that checks if a collection is empty,
 * and if so, populates it with initial data from a mock file.
 * @param collectionName The name of the Firestore collection.
 * @param data The array of mock data to seed.
 * @param idField The key in the data object to use as the document ID.
 * @returns An array of data from Firestore.
 */
async function seedCollection<T>(collectionName: string, data: T[], idField: keyof T): Promise<T[]> {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();
  
  if (snapshot.empty) {
    console.log(`Seeding '${collectionName}' collection...`);
    const batch = db.batch();
    data.forEach(item => {
      const docId = String(item[idField]);
      if (docId) {
        const docRef = collectionRef.doc(docId);
        batch.set(docRef, item);
      }
    });
    await batch.commit();
    console.log(`'${collectionName}' collection seeded.`);
    return data;
  }
  
  return snapshot.docs.map(doc => doc.data() as T);
}

export async function getStudents(): Promise<Student[]> {
  return await seedCollection<Student>('students', mockStudents, 'id');
}

export async function getTeachers(): Promise<Teacher[]> {
  return await seedCollection<Teacher>('teachers', mockTeachers, 'id');
}
