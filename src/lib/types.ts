export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
};

export type Post = {
  slug: string;
  title: string;
  content: string;
  author: User;
  createdAt: string;
  tags: string[];
  imageUrl: string;
  imageHint: string;
  likes: number;
  commentsCount: number;
};

export type Comment = {
  id: string;
  text: string;
  author: User;
  createdAt: string;
};
