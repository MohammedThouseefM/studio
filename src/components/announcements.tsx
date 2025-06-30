import { Megaphone } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { announcements } from '@/lib/mock-data';

export function Announcements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          <span>Announcements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-4 rounded-lg border bg-card-foreground/5">
              <h3 className="font-semibold">{announcement.title}</h3>
              <p className="text-sm text-muted-foreground">{announcement.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{announcement.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
