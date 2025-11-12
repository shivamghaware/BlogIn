
'use client';

import { PostCreator } from '@/components/posts/PostCreator';
import { getPost } from '@/lib/data';
import type { Post } from '@/lib/types';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      const fetchedPost = await getPost(slug);
      if (!fetchedPost) {
        setPost(null);
      } else {
        setPost(fetchedPost);
      }
    }
    fetchPost();
  }, [slug]);

  if (post === undefined) {
    return <div>Loading...</div>;
  }

  if (post === null) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <PostCreator post={post} />
      </div>
    </div>
  );
}
