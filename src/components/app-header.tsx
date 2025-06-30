'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, School, User, UserCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AppHeaderProps = {
  userType: 'Student' | 'Teacher';
};

export function AppHeader({ userType }: AppHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  const goToProfile = () => {
    router.push('/student/profile');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:px-8 flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <School className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary sm:inline-block">AttendEase</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/100x100.png`} alt="User avatar" data-ai-hint="user avatar" className="object-cover" />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userType === 'Student' ? 'Student' : 'Teacher'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userType === 'Student' ? 'student@example.com' : 'teacher@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userType === 'Student' && (
                <DropdownMenuItem onClick={goToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
