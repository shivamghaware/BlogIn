
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from "@/components/posts/PostCard";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePosts } from '@/hooks/use-posts';
import { POPSTATE_EVENT, TAG_SEARCH_PARAM } from '@/lib/constants';
import { MainContainer } from '@/components/layout/MainContainer';

function HomePageContent() {
  const searchParams = useSearchParams();
  const tagFromUrl = searchParams.get(TAG_SEARCH_PARAM);

  const { filteredPosts, allTags } = usePosts(tagFromUrl);

  const handleTagClick = (tag: string) => {
    const current = new URL(window.location.href);
    if (tagFromUrl === tag) {
      current.searchParams.delete(TAG_SEARCH_PARAM);
    } else {
      current.searchParams.set(TAG_SEARCH_PARAM, tag);
    }
    window.history.pushState({}, '', current.toString());
    window.dispatchEvent(new PopStateEvent(POPSTATE_EVENT));
  };
  
  const clearFilter = () => {
    const current = new URL(window.location.href);
    current.searchParams.delete(TAG_SEARCH_PARAM);
    window.history.pushState({}, '', current.toString());
    window.dispatchEvent(new PopStateEvent(POPSTATE_EVENT));
  }

  return (
    <MainContainer>
        <header className="py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter">Stay curious.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </header>

        <div className="border-b pb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">Trending topics</h2>
            {tagFromUrl && (
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
                variant={tagFromUrl === tag ? 'default' : 'secondary'} 
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
    </MainContainer>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
