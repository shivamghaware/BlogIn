
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
import Link from 'next/link';
import { Command as CommandPrimitive } from 'cmdk';

type GlobalSearchProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CommandItemLink = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & { href: string }
>(({ href, ...props }, ref) => {
  const router = useRouter();
  return (
    <Link href={href} passHref legacyBehavior>
      <CommandPrimitive.Item
        ref={ref}
        {...props}
        onSelect={(value) => {
          props.onSelect?.(value);
          router.push(href);
        }}
      />
    </Link>
  );
});
CommandItemLink.displayName = 'CommandItemLink';


export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
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
      if (open) {
        const allPosts = await getPosts();
        const allUsers = await getUsers();
        setPosts(allPosts);
        setUsers(allUsers);
      }
    }
    fetchAllData();
  }, [open]);

  const handleSelect = () => {
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for posts or users..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Posts">
          {posts.map((post) => (
            <CommandItemLink
              key={post.slug}
              href={`/posts/${post.slug}`}
              value={`post-${post.slug}-${post.title}`}
              onSelect={handleSelect}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>{post.title}</span>
            </CommandItemLink>
          ))}
        </CommandGroup>
        <CommandGroup heading="Users">
          {users.map((user) => (
            <CommandItemLink
              key={user.id}
              href={`/profile/${user.id}`}
              value={`user-${user.id}-${user.name}`}
              onSelect={handleSelect}
            >
              <User className="mr-2 h-4 w-4" />
              <span>{user.name}</span>
            </CommandItemLink>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
