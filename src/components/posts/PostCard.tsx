
'use client';

import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Bookmark, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
    const { toast } = useToast();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    useEffect(() => {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setIsBookmarked(savedPosts.includes(post.slug));
      setIsLiked(likedPosts.includes(post.slug));

      const storedLikeCount = localStorage.getItem(`like-count-${post.slug}`);
      if (storedLikeCount) {
        setLikeCount(parseInt(storedLikeCount, 10));
      } else {
        setLikeCount(post.likes);
      }
    }, [post.slug, post.likes]);

    const getInitials = (name: string) => {
        const [firstName, lastName] = name.split(' ');
        return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
    }
    const snippet = post.content.split('\n\n')[0].substring(0, 150) + '...';

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        const newIsBookmarked = !isBookmarked;
        if (newIsBookmarked) {
          savedPosts.push(post.slug);
        } else {
          const index = savedPosts.indexOf(post.slug);
          if (index > -1) {
            savedPosts.splice(index, 1);
          }
        }
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
        setIsBookmarked(newIsBookmarked);
        window.dispatchEvent(new Event('storage'));

        toast({
            title: newIsBookmarked ? 'Post saved!' : 'Post unsaved',
            description: newIsBookmarked ? 'You can find this post in your saved list.' : 'The post has been removed from your saved list.',
        });
    }

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
        const newIsLiked = !isLiked;
        let newLikeCount = likeCount;

        if (newIsLiked) {
            likedPosts.push(post.slug);
            newLikeCount = likeCount + 1;
        } else {
            const index = likedPosts.indexOf(post.slug);
            if (index > -1) {
                likedPosts.splice(index, 1);
            }
            newLikeCount = Math.max(0, likeCount - 1);
        }
        
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
        localStorage.setItem(`like-count-${post.slug}`, newLikeCount.toString());
        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);
        window.dispatchEvent(new Event('storage'));

        toast({
            title: newIsLiked ? 'Liked!' : 'Unliked',
        });
    }

  return (
     <article className="group">
        <div className="flex items-center gap-2 text-sm mb-2">
            <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2 relative z-10">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                    <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
                </Avatar>
                <span className="font-medium hover:underline">{post.author.name}</span>
            </Link>
            <span className="text-muted-foreground">·</span>
            <time dateTime={post.createdAt} className="text-muted-foreground">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </time>
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1">
                <div className="mt-2">
                    <h2 className="text-2xl font-bold font-headline group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{snippet}</p>
                </div>
            </div>
            <div className="w-full md:w-48 lg:w-56 aspect-[4/3] relative shrink-0">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover rounded-md"
                    data-ai-hint={post.imageHint}
                />
            </div>
          </div>
        </Link>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {post.tags.map((tag) => (
                    <Link href={`/?tag=${tag}`} key={tag}>
                        <Badge variant="secondary" className="font-normal">{tag}</Badge>
                    </Link>
                ))}
                <span className="text-sm text-muted-foreground">· 5 min read</span>
            </div>
            <div className="flex items-center gap-1 relative z-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleLike}>
                    <Heart className={cn('h-4 w-4', isLiked && 'fill-destructive text-destructive')} />
                </Button>
                <Link href={`/posts/${post.slug}#comments`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                    </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleBookmark}>
                    <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-primary text-primary')} />
                </Button>
            </div>
        </div>
    </article>
  );
}
