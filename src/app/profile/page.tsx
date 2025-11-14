
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { Pen, Heart, Bookmark, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserListDialog } from '@/components/users/UserListDialog';
import { format } from 'date-fns';
import { useUserProfile } from '@/hooks/use-user-profile';
import { getInitials } from '@/lib/utils';
import { MainContainer } from '@/components/layout/MainContainer';

export default function ProfilePage() {
  const { user, userPosts, likedPosts, savedPosts, userComments, followers, following, handlePostDelete } = useUserProfile();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <MainContainer>
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
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="posts">Your Posts</TabsTrigger>
                     <TabsTrigger value="activity">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Activity
                    </TabsTrigger>
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
                            <PostCard 
                                key={post.slug} 
                                post={post} 
                                showAuthor={false} 
                                onPostDelete={handlePostDelete}
                            />
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
                 <TabsContent value="activity">
                    {userComments.length > 0 ? (
                        <div className="space-y-6">
                        {userComments.map((comment) => (
                           <div key={comment.id} className="p-4 border rounded-lg">
                             <p className="text-muted-foreground">{comment.text}</p>
                             <div className="text-sm text-muted-foreground mt-2">
                               <span>Commented on </span>
                               <Link href={`/p/${comment.postSlug}#comments`} className="underline hover:text-foreground">
                                 a post
                               </Link>
                               <span> · {format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                             </div>
                           </div>
                        ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You haven&apos;t commented on any posts yet.</p>
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
    </MainContainer>
  );
}
