
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Search, User } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import type { Post, User as UserType } from '@/lib/types';
import { getPosts, getUsers } from '@/lib/data';

type GlobalSearchProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [users, setUsers] = React.useState<UserType[]>([]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  React.useEffect(() => {
    async function fetchAllData() {
      const allPosts = await getPosts();
      const allUsers = await getUsers();
      setPosts(allPosts);
      setUsers(allUsers);
    }
    fetchAllData();
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    onOpenChange(false);
    command();
  }, [onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for posts or users..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Posts">
          {posts.map((post) => (
            <CommandItem
              key={post.slug}
              value={`post-${post.slug}-${post.title}`}
              onSelect={() => {
                runCommand(() => router.push(`/posts/${post.slug}`));
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{post.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Users">
          {users.map((user) => (
            <CommandItem
              key={user.id}
              value={`user-${user.id}-${user.name}`}
              onSelect={() => {
                runCommand(() => router.push(`/profile/${user.id}`));
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{user.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
