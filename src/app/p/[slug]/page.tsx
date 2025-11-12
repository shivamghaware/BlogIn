import { getPost, getComments } from '@/lib/data';
import { notFound } from 'next/navigation';
import PostView from '@/components/posts/PostView';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound();
  }
  const comments = await getComments(params.slug);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <PostView post={post} comments={comments} />
      </div>
    </div>
  );
}

// In a real app with a database, you would generate static paths like this:
// export async function generateStaticParams() {
//   const posts = await getPosts();
//   return posts.map((post) => ({
//     slug: post.slug,
//   }));
// }
