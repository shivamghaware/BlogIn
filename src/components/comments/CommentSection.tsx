import type { Comment, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import Link from 'next/link';
import { CommentForm } from './CommentForm';

type CommentSectionProps = {
  comments: Comment[];
  onCommentSubmit: (newComment: Comment) => void;
};

// This would typically come from an authentication context
const currentUser: User = { 
  id: 'user-1', 
  name: 'Elena Petrova', 
  email: 'elena@example.com', 
  avatarUrl: 'https://picsum.photos/seed/201/40/40' 
};

export function CommentSection({ comments, onCommentSubmit }: CommentSectionProps) {
    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
    }
  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-6">
        Responses ({comments.length})
      </h2>

      <div className="mb-8">
        <CommentForm currentUser={currentUser} onCommentSubmit={onCommentSubmit} />
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
