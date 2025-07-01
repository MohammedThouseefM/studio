import { AcademicCalendarCard } from "@/components/academic-calendar-card";
import { Announcements } from "@/components/announcements";
import { DailyAttendanceCard } from "@/components/daily-attendance-card";
import { FeedbackCard } from "@/components/feedback-card";
import { LeaveRequestCard } from "@/components/leave-request-card";
import { MotivationalQuote } from "@/components/motivational-quote";
import { StudentAttendanceSummary } from "@/components/student-attendance-summary";
import { TimetableCard } from "@/components/timetable-card";
import { studentAttendance, students } from "@/lib/mock-data";

export default function StudentDashboardPage() {
  // In a real app, this would come from a user session
  const student = students[0];

  return (
    <div className="p-4 md:p-8">
       <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {student.name}!</h1>
        <p className="text-muted-foreground">
          {student.department} - {student.year} | Roll No: {student.rollNumber}
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <DailyAttendanceCard />
          <StudentAttendanceSummary attendanceData={studentAttendance} showLowAttendanceWarning={true} />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <MotivationalQuote />
          <FeedbackCard />
          <LeaveRequestCard />
          <AcademicCalendarCard />
          <TimetableCard />
          <Announcements />
        </div>
      </div>
    </div>
  );
}
