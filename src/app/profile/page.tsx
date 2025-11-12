
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { getMe, getPosts } from '@/lib/data';
import { Pen } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await getMe();
  const allPosts = await getPosts();
  const userPosts = allPosts.filter((post) => post.author.id === user.id);

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
          <h2 className="text-2xl font-bold font-headline mb-6">Your Posts</h2>
          {userPosts.length > 0 ? (
            <div className="grid gap-16">
              {userPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven&apos;t written any posts yet.</p>
                <Button variant="link" className="mt-2">
                    <a href="/new-post">Write your first post</a>
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
