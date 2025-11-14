
'use client';

import { getPost, getComments } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import PostView from '@/components/posts/PostView';
import { Post, Comment } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function PostPage() {
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

  if (post === undefined) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto text-center">Loading post...</div>
        </div>
    );
  }

  if (post === null) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <PostView post={post} comments={comments} />
      </div>
    </div>
  );
}
