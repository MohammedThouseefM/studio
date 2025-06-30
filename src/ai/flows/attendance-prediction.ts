// attendance-prediction.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting student attendance based on previous weeks' data.
 *
 * - predictAttendance - Predicts attendance markings based on historical data.
 * - AttendancePredictionInput - The input type for the predictAttendance function.
 * - AttendancePredictionOutput - The return type for the predictAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendancePredictionInputSchema = z.object({
  department: z.string().describe('The department of the class.'),
  year: z.string().describe('The year of the class (e.g., 1st, 2nd, 3rd).'),
  subject: z.string().describe('The subject for which to predict attendance.'),
  date: z.string().describe('The date for which to predict attendance (YYYY-MM-DD).'),
  previousAttendanceData: z.array(
    z.object({
      date: z.string().describe('Date of the previous attendance record (YYYY-MM-DD).'),
      studentId: z.string().describe('Student ID.'),
      attendanceStatus: z.enum(['present', 'absent']).describe('Attendance status (present or absent).'),
    })
  ).describe('Array of previous attendance records for the class.'),
});
export type AttendancePredictionInput = z.infer<typeof AttendancePredictionInputSchema>;

const AttendancePredictionOutputSchema = z.array(
  z.object({
    studentId: z.string().describe('Student ID.'),
    predictedStatus: z.enum(['present', 'absent']).describe('Predicted attendance status (present or absent).'),
    confidence: z.number().describe('Confidence level of the prediction (0 to 1).'),
  })
).describe('Array of predicted attendance statuses for each student.');
export type AttendancePredictionOutput = z.infer<typeof AttendancePredictionOutputSchema>;

export async function predictAttendance(input: AttendancePredictionInput): Promise<AttendancePredictionOutput> {
  return predictAttendanceFlow(input);
}

const predictAttendancePrompt = ai.definePrompt({
  name: 'predictAttendancePrompt',
  input: {schema: AttendancePredictionInputSchema},
  output: {schema: AttendancePredictionOutputSchema},
  prompt: `You are an AI assistant designed to predict student attendance based on historical data.

  Given the following information, predict the attendance status (present or absent) for each student on {{date}} for the subject {{subject}} in the {{year}} year of the {{department}} department. Also provide the confidence level of the prediction.

  Previous Attendance Data:
  {{#each previousAttendanceData}}
  - Date: {{date}}, Student ID: {{studentId}}, Status: {{attendanceStatus}}
  {{/each}}

  The output should be a JSON array of objects, where each object has the following keys:
  - studentId: The student ID.
  - predictedStatus: The predicted attendance status (present or absent).
  - confidence: The confidence level of the prediction (0 to 1).

  Ensure that the output is a valid JSON array.
  `, 
});

const predictAttendanceFlow = ai.defineFlow(
  {
    name: 'predictAttendanceFlow',
    inputSchema: AttendancePredictionInputSchema,
    outputSchema: AttendancePredictionOutputSchema,
  },
  async input => {
    const {output} = await predictAttendancePrompt(input);
    return output!;
  }
);
