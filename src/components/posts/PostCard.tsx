import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Bookmark, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
    }
    const snippet = post.content.split('\n\n')[0].substring(0, 150) + '...';

  return (
    <article className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
            <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{post.author.name}</span>
          <span className="text-muted-foreground">·</span>
          <time dateTime={post.createdAt} className="text-muted-foreground">
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </time>
        </div>
        <Link href={`/posts/${post.slug}`} className="block group mt-2">
          <h2 className="text-2xl font-bold font-headline group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">{snippet}</p>
        </Link>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                 {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>
                ))}
                <span className="text-sm text-muted-foreground">· 5 min read</span>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <Bookmark className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
      <Link href={`/posts/${post.slug}`} className="block w-full md:w-48 lg:w-56 aspect-[4/3] relative shrink-0">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover rounded-md"
            data-ai-hint={post.imageHint}
          />
      </Link>
    </article>
  );
}
