
'use client';

import type { Post, Comment, User } from '@/lib/types';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { CommentSection } from '@/components/comments/CommentSection';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getMe } from '@/lib/data';

type PostViewProps = {
  post: Post;
  comments: Comment[];
};

export default function PostView({ post, comments: initialComments }: PostViewProps) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserAndStatus() {
      const me = await getMe();
      setCurrentUser(me);

      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      setIsBookmarked(savedPosts.includes(post.slug));

      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const postIsLiked = likedPosts.includes(post.slug);
      setIsLiked(postIsLiked);

      const initialLikeCount = post.likes;
      const storedLikeCount = parseInt(localStorage.getItem(`like-count-${post.slug}`) || initialLikeCount.toString(), 10);
      
      if (postIsLiked && storedLikeCount === initialLikeCount) {
          setLikeCount(initialLikeCount + 1);
      } else {
          setLikeCount(storedLikeCount);
      }
      
      if (me && post.author.id !== me.id) {
        const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
        setIsFollowing(followedUsers.includes(post.author.id));
      }
    }
    fetchUserAndStatus();
  }, [post.slug, post.likes, post.author.id]);


  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  };
  
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
          newLikeCount = likeCount - 1;
      }
      
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
      localStorage.setItem(`like-count-${post.slug}`, newLikeCount.toString());
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);

      toast({
          title: newIsLiked ? 'Liked!' : 'Unliked',
      });
  }

  const handleFollowToggle = () => {
    const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
    const newIsFollowing = !isFollowing;

    if (newIsFollowing) {
        followedUsers.push(post.author.id);
    } else {
        const index = followedUsers.indexOf(post.author.id);
        if (index > -1) {
            followedUsers.splice(index, 1);
        }
    }

    localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
    setIsFollowing(newIsFollowing);

    toast({
        title: newIsFollowing ? `Followed ${post.author.name}` : `Unfollowed ${post.author.name}`,
    });
  };

  const handleCommentSubmit = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };
  
  const isOwnPost = currentUser?.id === post.author.id;

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
          {!isOwnPost && (
            <Button variant={isFollowing ? 'default' : 'outline'} onClick={handleFollowToggle}>
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </div>
      </header>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 py-2 border-y mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className='flex items-center gap-2'>
                <Button variant="ghost" size="sm" className='text-muted-foreground' onClick={handleLike}>
                    <Heart className={cn("mr-2 h-4 w-4", isLiked && 'fill-destructive text-destructive')} /> {likeCount}
                </Button>
                <a href="#comments">
                  <Button variant="ghost" size="sm" className='text-muted-foreground'>
                      <MessageCircle className="mr-2 h-4 w-4" /> {comments.length}
                  </Button>
                </a>
            </div>
            <div>
                 <Button variant="ghost" size="icon" className='text-muted-foreground' onClick={handleBookmark}>
                    <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-primary text-primary')} />
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

      <div id="comments">
        <CommentSection comments={comments} onCommentSubmit={handleCommentSubmit} />
      </div>
    </article>
  );
}
