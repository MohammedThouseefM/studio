'use client';

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { AppHeader } from "@/components/app-header";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useToast } from "@/hooks/use-toast";

export default function TeacherLayout({ children }: PropsWithChildren) {
  const isOnline = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    const syncOfflineData = async () => {
      try {
        const pendingKeysJson = localStorage.getItem('pending-attendance-syncs');
        if (!pendingKeysJson) return;

        const pendingKeys: string[] = JSON.parse(pendingKeysJson);
        if (pendingKeys.length === 0) return;

        toast({
          title: 'Reconnected to Internet',
          description: `Syncing ${pendingKeys.length} offline attendance record(s)...`,
        });

        // In a real app, this would loop through keys and make API calls.
        // For this demo, we'll just log the data and clear localStorage.
        let successCount = 0;
        for (const key of pendingKeys) {
          const data = localStorage.getItem(key);
          if (data) {
            console.log(`[SYNCING] Data for key ${key}:`, JSON.parse(data));
            // Simulate successful sync by removing the item
            localStorage.removeItem(key);
            successCount++;
          }
        }

        // Clear the list of pending syncs
        localStorage.removeItem('pending-attendance-syncs');

        toast({
          title: 'Sync Complete!',
          description: `${successCount} offline record(s) have been successfully synced.`,
        });
      } catch (error) {
        console.error("Failed to sync offline data:", error);
        toast({
          variant: "destructive",
          title: 'Sync Failed',
          description: 'There was an error syncing your offline data.',
        });
      }
    };

    if (isOnline) {
      syncOfflineData();
    }
  }, [isOnline, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader userType="Teacher" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
