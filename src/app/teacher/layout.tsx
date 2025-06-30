import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";

export default function TeacherLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader userType="Teacher" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
