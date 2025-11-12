import { PostCreator } from "@/components/posts/PostCreator";

export default function NewPostPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
            <PostCreator />
        </div>
    </div>
  );
}
