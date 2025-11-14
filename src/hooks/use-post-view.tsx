
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPost, getComments } from '@/lib/data';
import { Post, Comment } from '@/lib/types';

export function usePostView() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      const [postData, commentsData] = await Promise.all([
        getPost(slug),
        getComments(slug)
      ]);
      setPost(postData);
      setComments(commentsData);
    }
    fetchData();
  }, [slug]);

  return { post, comments };
}
