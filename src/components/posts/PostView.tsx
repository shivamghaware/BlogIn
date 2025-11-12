import type { Post, Comment } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/comments/CommentSection';
import Link from 'next/link';

type PostViewProps = {
  post: Post;
  comments: Comment[];
};

export default function PostView({ post, comments }: PostViewProps) {
  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  };

  return (
    <article>
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold !leading-tight tracking-tighter mb-4">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4">
            <Link href={`/profile/${post.author.id}`}>
                <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                </Avatar>
            </Link>
          <div className="flex-1">
            <Link href={`/profile/${post.author.id}`} className="hover:underline">
                <p className="font-medium">{post.author.name}</p>
            </Link>
            <div className="text-sm text-muted-foreground">
              <span>5 min read</span>
              <span className="mx-1">·</span>
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </time>
            </div>
          </div>
          <Button variant="outline">Follow</Button>
        </div>
      </header>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-2 border-y mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Button variant="ghost" size="sm" className='text-muted-foreground'>
                    <Heart className="mr-2 h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className='text-muted-foreground'>
                    <MessageCircle className="mr-2 h-4 w-4" /> {post.commentsCount}
                </Button>
            </div>
            <div>
                 <Button variant="ghost" size="icon" className='text-muted-foreground'>
                    <Bookmark className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] mb-8">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          priority
          data-ai-hint={post.imageHint}
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground text-lg leading-relaxed font-body">
        {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
                 return <h3 key={index} className="font-headline font-bold text-2xl mt-8 mb-4">{paragraph.replace('### ', '')}</h3>
            }
            return <p key={index}>{paragraph}</p>
        })}
      </div>
      
      <div className="mt-12">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="mr-2 mb-2 text-sm font-normal">
            {tag}
          </Badge>
        ))}
      </div>

      <Separator className="my-12" />

      <CommentSection comments={comments} />
    </article>
  );
}
