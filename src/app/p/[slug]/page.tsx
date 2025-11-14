
'use client';

import { notFound } from 'next/navigation';
import PostView from '@/components/posts/PostView';
import { usePostView } from '@/hooks/use-post-view';
import { MainContainer } from '@/components/layout/MainContainer';

export default function PostPage() {
  const { post, comments } = usePostView();

  if (post === undefined) {
    return (
        <MainContainer>
            <div className="text-center">Loading post...</div>
        </MainContainer>
    );
  }

  if (post === null) {
    notFound();
  }

  return (
    <MainContainer>
      <PostView post={post} comments={comments} />
    </MainContainer>
  );
}
