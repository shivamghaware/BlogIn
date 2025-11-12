
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { getMe, getPosts } from '@/lib/data';
import { Pen, Heart, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import type { User, Post } from '@/lib/types';


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchData() {
      const me = await getMe();
      setUser(me);

      const posts = await getPosts();
      setAllPosts(posts);

      if (me) {
        setUserPosts(posts.filter((post) => post.author.id === me.id));
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (allPosts.length > 0) {
      const likedPostSlugs = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const savedPostSlugs = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      
      setLikedPosts(allPosts.filter(post => likedPostSlugs.includes(post.slug)));
      setSavedPosts(allPosts.filter(post => savedPostSlugs.includes(post.slug)));
    }
  }, [allPosts]);

  if (!user) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return firstName && lastName ? `${firstName[0]}${lastName[0]}` : name.substring(0, 2);
  };

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
            <Link href="/profile/edit">
                <Button variant="outline" className="mt-4">
                <Pen className="mr-2 h-4 w-4" />
                Edit Profile
                </Button>
            </Link>
          </div>
        </header>

        <div className="border-t pt-8">
            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="posts">Your Posts</TabsTrigger>
                    <TabsTrigger value="likes">
                        <Heart className="mr-2 h-4 w-4" />
                        Likes
                    </TabsTrigger>
                    <TabsTrigger value="saved">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Saved
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                    {userPosts.length > 0 ? (
                        <div className="grid gap-16">
                        {userPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven&apos;t written any posts yet.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/new-post">Write your first post</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="likes">
                    {likedPosts.length > 0 ? (
                            <div className="grid gap-16">
                            {likedPosts.map((post) => (
                                <PostCard key={post.slug} post={post} />
                            ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                                <p className="text-muted-foreground">You haven&apos;t liked any posts yet.</p>
                            </div>
                        )}
                </TabsContent>
                <TabsContent value="saved">
                {savedPosts.length > 0 ? (
                        <div className="grid gap-16">
                        {savedPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven&apos;t saved any posts yet.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
