'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/UserNav';
import { PenSquare } from 'lucide-react';

export default function Header() {
  // In a real app, you'd get the user session here
  const user = true; // Placeholder for logged-in state

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-5 w-auto text-foreground" />
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/new-post">
            <Button variant="ghost" size="sm">
              <PenSquare className="mr-2 h-4 w-4" />
              Write
            </Button>
          </Link>
          {user ? (
            <UserNav />
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
