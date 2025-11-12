

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { getUser, getPosts, getMe, getUsers } from '@/lib/data';
import type { Post, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { notFound } from 'next/navigation';
import { UserListDialog } from '@/components/users/UserListDialog';
import Link from 'next/link';
import { Pen } from 'lucide-react';

type UserProfilePageProps = {
    params: {
        userId: string;
    };
};

export default function UserProfilePage({ params: { userId } }: UserProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  const getInitials = (name: string) => {
    if(!name) return '';
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  };
  
  const isOwnProfile = currentUser?.id === user?.id;

  const fetchData = useCallback(async () => {
    const [fetchedUser, me, allPostsData, allUsersData] = await Promise.all([
        getUser(userId),
        getMe(),
        getPosts(),
        getUsers()
    ]);

    if (!fetchedUser) {
      notFound();
      return;
    }
    setUser(fetchedUser);
    setCurrentUser(me);
    setUserPosts(allPostsData.filter((post) => post.author.id === fetchedUser.id));

    // Following state
    if (me && fetchedUser.id !== me.id) {
        const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
        setIsFollowing(followedUsers.includes(fetchedUser.id));
    }

    // Followers list for the displayed user
    const allFollowedRelations: Record<string, string[]> = allUsersData.reduce((acc, u) => {
        const followedBy = JSON.parse(localStorage.getItem(`followedBy-${u.id}`) || '[]');
        return {...acc, [u.id]: followedBy };
    }, {});

    const userFollowersIds = allFollowedRelations[fetchedUser.id] || [];
    setFollowers(allUsersData.filter(u => userFollowersIds.includes(u.id)));

    // Following list for the displayed user
    if (me && fetchedUser.id === me.id) {
        const userFollowingIds = JSON.parse(localStorage.getItem('followedUsers') || '[]');
        setFollowing(allUsersData.filter(u => userFollowingIds.includes(u.id)));
    } else {
        // This is tricky to simulate without a real backend. We'll assume we can't see other users' following lists.
        setFollowing([]);
    }
  }, [userId]);


  useEffect(() => {
    fetchData();
    window.addEventListener('storage', fetchData);
    window.addEventListener('logout', fetchData);

    return () => {
        window.removeEventListener('storage', fetchData);
        window.removeEventListener('logout', fetchData);
    }
  }, [fetchData]);


  const handleFollowToggle = () => {
    if (!user || !currentUser) {
        toast({ title: 'Please log in to follow users.', variant: 'destructive' });
        return;
    };
    if (currentUser.id === user.id) return;


    const followedUsersKey = 'followedUsers'; // Current user's following list
    const userFollowersKey = `followedBy-${user.id}`; // The displayed user's followers list

    let followedUsers: string[] = JSON.parse(localStorage.getItem(followedUsersKey) || '[]');
    let userFollowers: string[] = JSON.parse(localStorage.getItem(userFollowersKey) || '[]');
    
    const newIsFollowing = !isFollowing;

    if (newIsFollowing) {
        if (!followedUsers.includes(user.id)) followedUsers.push(user.id);
        if (!userFollowers.includes(currentUser.id)) userFollowers.push(currentUser.id);
    } else {
        followedUsers = followedUsers.filter(id => id !== user.id);
        userFollowers = userFollowers.filter(id => id !== currentUser.id);
    }

    localStorage.setItem(followedUsersKey, JSON.stringify(followedUsers));
    localStorage.setItem(userFollowersKey, JSON.stringify(userFollowers));
    
    setIsFollowing(newIsFollowing);

    if (newIsFollowing) {
      setFollowers(prev => [...prev, currentUser]);
    } else {
      setFollowers(prev => prev.filter(f => f.id !== currentUser.id));
    }
    
    window.dispatchEvent(new Event('storage'));

    toast({
        title: newIsFollowing ? `Followed ${user.name}` : `Unfollowed ${user.name}`,
    });
  };

  if (user === null) {
      return <div>Loading profile...</div>;
  }

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
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <UserListDialog title="Followers" users={followers}>
                <button className="text-center">
                  <p className="font-bold text-lg">{followers.length}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </button>
              </UserListDialog>
              <UserListDialog title="Following" users={following}>
                <button className="text-center">
                  <p className="font-bold text-lg">{following.length}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </button>
              </UserListDialog>
            </div>
            <p className="mt-4 max-w-xl text-lg">{user.bio}</p>
            {isOwnProfile ? (
                 <Link href="/profile/edit">
                    <Button variant="outline" className="mt-4">
                    <Pen className="mr-2 h-4 w-4" />
                    Edit Profile
                    </Button>
                </Link>
            ) : currentUser && (
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
