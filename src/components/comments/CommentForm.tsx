
'use client';

import { useState } from 'react';
import type { User, Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type CommentFormProps = {
  currentUser: User;
  onCommentSubmit: (newComment: Comment) => void;
};

export function CommentForm({ currentUser, onCommentSubmit }: CommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') {
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: currentUser,
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would send this to a server
    onCommentSubmit(newComment);
    setCommentText('');

    toast({
      title: 'Comment posted!',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
            <Avatar>
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <Textarea
                    placeholder="What are your thoughts?"
                    className="mb-2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" disabled={!commentText.trim()}>Respond</Button>
            </div>
        </div>
    </form>
  );
}
