'use server';

import { predictAttendance, type AttendancePredictionInput } from '@/ai/flows/attendance-prediction';

export async function getAttendancePrediction(input: AttendancePredictionInput) {
  try {
    const predictions = await predictAttendance(input);
    return { success: true, data: predictions };
  } catch (error) {
    console.error('Error in GenAI prediction:', error);
    return { success: false, error: 'Failed to get attendance prediction.' };
  }
}
