import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";

export default function StudentLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader userType="Student" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
