import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AnnouncementsProvider } from '@/context/announcements-context';

export const metadata: Metadata = {
  title: 'AttendEase',
  description: 'Digital Attendance Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased bg-background">
        <AnnouncementsProvider>
          {children}
          <Toaster />
        </AnnouncementsProvider>
      </body>
    </html>
  );
}
