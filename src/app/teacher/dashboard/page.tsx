import { Announcements } from "@/components/announcements";
import { StudentSearch } from "@/components/student-search";
import { TeacherAttendanceSelector } from "@/components/teacher-attendance-selector";
import { TeacherManagementPanel } from "@/components/teacher-management-panel";

export default function TeacherDashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <StudentSearch />
          <TeacherAttendanceSelector />
          <TeacherManagementPanel />
        </div>
        <div className="lg:col-span-1">
          <Announcements />
        </div>
      </div>
    </div>
  );
}
