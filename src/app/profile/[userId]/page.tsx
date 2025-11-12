import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/posts/PostCard';
import { getUser, getPosts } from '@/lib/data';
import { notFound } from 'next/navigation';

type UserProfilePageProps = {
    params: {
        userId: string;
    };
};

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const user = await getUser(params.userId);

  if (!user) {
    notFound();
  }
  
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
            <Button variant="outline" className="mt-4">
              Follow
            </Button>
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

// In a real app with a database, you would generate static paths like this:
// export async function generateStaticParams() {
//   const users = await getUsers();
//   return users.map((user) => ({
//     userId: user.id,
//   }));
// }
