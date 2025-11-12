
'use client';

import { useState, useEffect } from 'react';
import { PostCard } from "@/components/posts/PostCard";
import { getPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import type { Post } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const posts = await getPosts();
      setAllPosts(posts);
      setFilteredPosts(posts);
      const tags = [...new Set(posts.flatMap((post) => post.tags))];
      setAllTags(tags);
    }
    fetchData();
  }, []);

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      // If the same tag is clicked again, reset the filter
      setActiveTag(null);
      setFilteredPosts(allPosts);
    } else {
      setActiveTag(tag);
      setFilteredPosts(allPosts.filter(post => post.tags.includes(tag)));
    }
  };
  
  const clearFilter = () => {
    setActiveTag(null);
    setFilteredPosts(allPosts);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter">Stay curious.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </header>

        <div className="border-b pb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Trending topics</h2>
            {activeTag && (
                <Button variant="ghost" size="sm" onClick={clearFilter} className="text-muted-foreground hover:text-foreground">
                    <X className="mr-2 h-4 w-4" />
                    Clear filter
                </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge 
                key={tag} 
                variant={activeTag === tag ? 'default' : 'secondary'} 
                className="text-sm font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-16">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
