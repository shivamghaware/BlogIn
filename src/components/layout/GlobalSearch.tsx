
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Search, User, Tag } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GlobalSearchProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Filter = 'all' | 'topics' | 'posts' | 'users';

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState<Filter>('all');
  const router = useRouter();

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
        const allTags = [...new Set(allPosts.flatMap((post) => post.tags))];
        setPosts(allPosts);
        setUsers(allUsers);
        setTags(allTags);
      }
    }
    fetchAllData();
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href);
    onOpenChange(false);
  }

  const renderGroup = (groupFilter: Filter) => {
    if (filter !== 'all' && filter !== groupFilter) {
      return null;
    }
    switch (groupFilter) {
      case 'topics':
        return (
          <CommandGroup heading="Topics">
            {tags.map((tag) => (
              <CommandItem
                key={tag}
                value={`tag-${tag}`}
                onSelect={() => handleSelect(`/?tag=${encodeURIComponent(tag)}`)}
              >
                <Tag className="mr-2 h-4 w-4" />
                <span>{tag}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      case 'posts':
        return (
          <CommandGroup heading="Posts">
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                value={`post-${post.slug}-${post.title}`}
                onSelect={() => handleSelect(`/posts/${post.slug}`)}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>{post.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      case 'users':
        return (
          <CommandGroup heading="Users">
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={`user-${user.id}-${user.name}`}
                onSelect={() => handleSelect(`/profile/${user.id}`)}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{user.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      default:
        return null;
    }
  }
  
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for posts, users or topics..." />
       <div className="flex items-center gap-2 border-b px-3">
            {(['all', 'topics', 'posts', 'users'] as Filter[]).map((f) => (
                <Button
                key={f}
                variant={filter === f ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize h-8 text-sm"
                >
                {f}
                </Button>
            ))}
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {renderGroup('topics')}
        {renderGroup('posts')}
        {renderGroup('users')}
      </CommandList>
    </CommandDialog>
  );
}
