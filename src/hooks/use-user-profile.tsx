
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Post, Comment } from '@/lib/types';
import { getMe, getPosts, getUsers, getAllComments } from '@/lib/data';
import { STORAGE_EVENT } from '@/lib/constants';

export function useUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const me = await getMe();
    if (!me) {
      router.push('/login');
      return;
    }
    setUser(me);

    const [allPosts, allUsers, allComments] = await Promise.all([getPosts(), getUsers(), getAllComments()]);

    setUserPosts(allPosts.filter((post) => post.author.id === me.id));
    
    const likedPostSlugs = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const savedPostSlugs = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    
    setLikedPosts(allPosts.filter(post => likedPostSlugs.includes(post.slug)));
    setSavedPosts(allPosts.filter(post => savedPostSlugs.includes(post.slug)));

    setUserComments(allComments.filter(comment => comment.author.id === me.id));

    const followerIds = JSON.parse(localStorage.getItem(`followedBy-${me.id}`) || '[]');
    setFollowers(allUsers.filter(u => followerIds.includes(u.id)));

    const followingIds = JSON.parse(localStorage.getItem('followedUsers') || '[]');
    setFollowing(allUsers.filter(u => followingIds.includes(u.id)));
  }, [router]);

  useEffect(() => {
    fetchData();

    window.addEventListener(STORAGE_EVENT, fetchData);
    window.addEventListener('logout', fetchData);

    return () => {
      window.removeEventListener(STORAGE_EVENT, fetchData);
      window.removeEventListener('logout', fetchData);
    };
  }, [fetchData]);

  const handlePostDelete = (slug: string) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.slug !== slug));
  };

  return { user, userPosts, likedPosts, savedPosts, userComments, followers, following, handlePostDelete };
}
