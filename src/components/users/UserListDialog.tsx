
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';
import Link from 'next/link';

type UserListDialogProps = {
  users: User[];
  title: string;
  children: React.ReactNode;
};

const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
};

export function UserListDialog({ users, title, children }: UserListDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/profile/${user.id}`} className="font-semibold hover:underline">
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{user.bio?.substring(0,30)}...</p>
                  </div>
                </div>
                <Link href={`/profile/${user.id}`}>
                    <Button variant="outline" size="sm">
                    View
                    </Button>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No users to display.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
