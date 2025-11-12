import { PostCard } from "@/components/posts/PostCard";
import { getPosts } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const posts = await getPosts();
  const allTags = [...new Set(posts.flatMap((post) => post.tags))];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter">Stay curious.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </header>

        <div className="border-b pb-8">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-4">Trending topics</h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm font-normal cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-16">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
