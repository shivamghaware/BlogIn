
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/auth/UserNav';
import { PenSquare, Search, Menu, X } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { useEffect, useState } from 'react';
import { getMe } from '@/lib/data';
import type { User } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchUser() {
      const user = await getMe();
      setCurrentUser(user);
    }
    fetchUser();

    const handleStorageChange = () => {
        fetchUser();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleStorageChange);
    }
  }, []);

  const handleMobileLinkClick = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-5 w-auto text-foreground" />
          </Link>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
             <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="flex items-center"
            >
              <Search className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Search</span>
            </Button>
            <div className='hidden sm:flex items-center space-x-2'>
              <Link href="/new-post">
                <Button variant="ghost" size="sm">
                  <PenSquare className="mr-2 h-4 w-4" />
                  Write
                </Button>
              </Link>
            </div>
            
            {currentUser === undefined && <div className="h-8 w-9 rounded-md bg-muted animate-pulse" />}
            {currentUser !== undefined && <UserNav />}


            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="sm:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className='p-4'>
                  <nav className="flex flex-col gap-4">
                    <button onClick={() => handleMobileLinkClick('/')} className="text-left font-medium">Home</button>
                    <button onClick={() => handleMobileLinkClick('/new-post')} className="text-left font-medium">Write</button>
                    {currentUser ? (
                      <>
                        <button onClick={() => handleMobileLinkClick('/profile')} className="text-left font-medium">Profile</button>
                        <button onClick={() => handleMobileLinkClick('/settings')} className="text-left font-medium">Settings</button>
                      </>
                    ) : (
                      <button onClick={() => handleMobileLinkClick('/login')} className="text-left font-medium">Sign In</button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
