
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { getUser, getPosts, getMe } from '@/lib/data';
import type { Post, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';

type UserProfilePageProps = {
    params: {
        userId: string;
    };
};

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = params;
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const fetchedUser = await getUser(userId);
      if (!fetchedUser) {
        // This will trigger the not-found page. We can't use notFound() directly in useEffect.
        // A better approach in a real app would be to handle this state in the UI.
        setUser(null); 
        return;
      }
      setUser(fetchedUser);

      const me = await getMe();
      setCurrentUser(me);

      const allPosts = await getPosts();
      setUserPosts(allPosts.filter((post) => post.author.id === fetchedUser.id));

      if (me && fetchedUser.id !== me.id) {
          const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
          setIsFollowing(followedUsers.includes(fetchedUser.id));
      }
    }
    fetchData();
  }, [userId]);


  const handleFollowToggle = () => {
    if (!user) return;

    const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
    const newIsFollowing = !isFollowing;

    if (newIsFollowing) {
        followedUsers.push(user.id);
    } else {
        const index = followedUsers.indexOf(user.id);
        if (index > -1) {
            followedUsers.splice(index, 1);
        }
    }

    localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
    setIsFollowing(newIsFollowing);

    toast({
        title: newIsFollowing ? `Followed ${user.name}` : `Unfollowed ${user.name}`,
    });
  };

  if (user === null) {
      // In a real app, you might show a loading skeleton here
      return <div>Loading profile...</div>;
  }
  
  if (user === undefined) {
      notFound();
  }


  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  };
  
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col items-center md:flex-row md:items-start gap-8 py-12">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-4xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold font-headline">{user.name}</h1>
            <p className="mt-2 text-muted-foreground">{user.email}</p>
            <p className="mt-4 max-w-xl text-lg">{user.bio}</p>
            {!isOwnProfile && (
                <Button variant={isFollowing ? 'default' : 'outline'} className="mt-4" onClick={handleFollowToggle}>
                    {isFollowing ? 'Following' : 'Follow'}
                </Button>
            )}
          </div>
        </header>

        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold font-headline mb-6">Posts by {user.name.split(' ')[0]}</h2>
          {userPosts.length > 0 ? (
            <div className="grid gap-16">
              {userPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">{user.name} hasn't written any posts yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
