
import { useState, useEffect, useCallback } from 'react';
import { getPosts } from "@/lib/data";
import type { Post } from '@/lib/types';
import { POPSTATE_EVENT } from '@/lib/constants';

export function usePosts(tagFromUrl: string | null) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    const posts = await getPosts();
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setAllPosts(posts);
    const tags = [...new Set(posts.flatMap((post) => post.tags))];
    setAllTags(tags);
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener(POPSTATE_EVENT, fetchData);
    return () => {
        window.removeEventListener(POPSTATE_EVENT, fetchData);
    }
  }, [fetchData]);

  useEffect(() => {
    if (tagFromUrl) {
      setFilteredPosts(allPosts.filter(post => post.tags.includes(tagFromUrl)));
    } else {
      setFilteredPosts(allPosts);
    }
  }, [tagFromUrl, allPosts]);

  return { allPosts, filteredPosts, allTags };
}
