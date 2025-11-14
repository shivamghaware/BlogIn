
'use client';

import type { Post } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Bookmark, MessageCircle, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { deletePost } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type PostCardProps = {
  post: Post;
  showAuthor?: boolean;
  onPostDelete?: (slug: string) => void;
};

export function PostCard({ post, showAuthor = true, onPostDelete }: PostCardProps) {
    const { toast } = useToast();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [isDeleting, startDeleteTransition] = useTransition();

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
        if (!name) return '';
        const [firstName, lastName] = name.split(' ');
        return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
    }
    const snippet = post.content.split('\n\n')[0].substring(0, 200) + '...';

    const handleBookmark = () => {
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

    const handleLike = () => {
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

    const handleDelete = () => {
        startDeleteTransition(async () => {
            try {
                await deletePost(post.slug);
                toast({
                    title: "Post Deleted",
                    description: "The post has been successfully deleted.",
                });
                if(onPostDelete) {
                    onPostDelete(post.slug);
                }
            } catch (error: any) {
                 toast({
                    title: "Error",
                    description: error.message || "Could not delete the post.",
                    variant: "destructive",
                });
            }
        });
    };

  return (
    <article className="group space-y-4">
       {showAuthor && (
         <div className="flex items-center gap-2 text-sm">
            <Link href={`/profile/${post.author.id}`} className="flex items-center gap-2">
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
       )}
        
        <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1">
                <Link href={`/p/${post.slug}`}>
                    <h2 className="text-2xl font-bold font-headline group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                </Link>
                <p className="mt-2 text-muted-foreground leading-relaxed">{snippet}</p>
            </div>
            <Link href={`/p/${post.slug}`} className="w-full md:w-48 lg:w-56 aspect-[4/3] relative shrink-0">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover rounded-md"
                    data-ai-hint={post.imageHint}
                />
            </Link>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
                {post.tags.map((tag) => (
                    <Link key={tag} href={`/?tag=${tag}`}>
                        <Badge variant="secondary" className="font-normal cursor-pointer hover:bg-accent/80">{tag}</Badge>
                    </Link>
                ))}
                <span className="text-sm text-muted-foreground hidden sm:inline">· 5 min read</span>
            </div>
            <div className="flex items-center gap-1">
                {onPostDelete && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" disabled={isDeleting}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this post.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleLike}>
                    <Heart className={cn('h-4 w-4', isLiked && 'fill-destructive text-destructive')} />
                </Button>
                <Link href={`/p/${post.slug}#comments`}>
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
