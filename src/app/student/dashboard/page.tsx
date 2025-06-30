import { Announcements } from "@/components/announcements";
import { StudentAttendanceSummary } from "@/components/student-attendance-summary";

export default function StudentDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StudentAttendanceSummary />
        </div>
        <div className="lg:col-span-1">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
