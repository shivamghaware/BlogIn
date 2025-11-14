
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from "@/components/posts/PostCard";
import { getPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function HomePageContent() {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get('tag');

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const posts = await getPosts();
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setAllPosts(posts);
    const tags = [...new Set(posts.flatMap((post) => post.tags))];
    setAllTags(tags);
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('storage', fetchData);
    return () => window.removeEventListener('storage', fetchData);
  }, [fetchData]);

  useEffect(() => {
    if (tagFromUrl) {
      setActiveTag(tagFromUrl);
      setFilteredPosts(allPosts.filter(post => post.tags.includes(tagFromUrl)));
    } else {
      setActiveTag(null);
      setFilteredPosts(allPosts);
    }
  }, [tagFromUrl, allPosts]);


  const handleTagClick = (tag: string) => {
    const current = new URL(window.location.href);
    if (activeTag === tag) {
      current.searchParams.delete('tag');
    } else {
      current.searchParams.set('tag', tag);
    }
    window.history.pushState({}, '', current.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  
  const clearFilter = () => {
    const current = new URL(window.location.href);
    current.searchParams.delete('tag');
    window.history.pushState({}, '', current.toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
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

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
