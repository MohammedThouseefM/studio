'use server';

import { predictAttendance, type AttendancePredictionInput } from '@/ai/flows/attendance-prediction';
import { generateDefaulterReport } from '@/ai/flows/defaulter-report-flow';
import { students, previousAttendanceData } from '@/lib/mock-data';

export async function getAttendancePrediction(input: AttendancePredictionInput) {
  try {
    const predictions = await predictAttendance(input);
    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error in GenAI prediction:', error);
    return { success: false, error: 'Failed to get attendance prediction.' };
  }
}

export async function getDefaulterReport() {
    try {
        const report = await generateDefaulterReport({
            students: students.map(({id, name, rollNumber, department, year}) => ({id, name, rollNumber, department, year})),
            attendanceData: previousAttendanceData,
            threshold: 75,
        });
        return { success: true, data: report };
    } catch (error) {
        console.error('Error generating defaulter report:', error);
        return { success: false, error: 'Failed to generate defaulter report.' };
    }
}
