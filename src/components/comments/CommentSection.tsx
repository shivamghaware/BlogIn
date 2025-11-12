
'use client';

import type { Comment, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { CommentForm } from './CommentForm';
import { useState, useEffect } from 'react';
import { getMe } from '@/lib/data';

type CommentSectionProps = {
  comments: Comment[];
  postSlug: string;
  onCommentSubmit: (newComment: Omit<Comment, 'id' | 'createdAt'>) => void;
};

export function CommentSection({ comments, postSlug, onCommentSubmit }: CommentSectionProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const user = await getMe();
      setCurrentUser(user);
    }
    fetchUser();
    
    window.addEventListener('storage', fetchUser);
    window.addEventListener('logout', fetchUser);

    return () => {
        window.removeEventListener('storage', fetchUser);
        window.removeEventListener('logout', fetchUser);
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '';
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  }
  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-6">
        Responses ({comments.length})
      </h2>

      <div className="mb-8">
        {currentUser ? (
          <CommentForm currentUser={currentUser} postSlug={postSlug} onCommentSubmit={onCommentSubmit} />
        ) : (
          <div className="p-4 border rounded-lg text-center text-muted-foreground">
            You must be logged in to comment.
          </div>
        )}
      </div>

      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-4">
            <Link href={`/profile/${comment.author.id}`}>
                <Avatar>
                <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Link href={`/profile/${comment.author.id}`} className="hover:underline">
                    <p className="font-semibold">{comment.author.name}</p>
                </Link>
                <time dateTime={comment.createdAt} className="text-sm text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                </time>
              </div>
              <p className="mt-1 text-muted-foreground">{comment.text}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <p>No responses yet.</p>
                <p>Be the first to share your thoughts!</p>
            </div>
        )}
      </div>
    </section>
  );
}
