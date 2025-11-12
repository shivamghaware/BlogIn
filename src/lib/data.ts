import type { User, Post, Comment } from './types';

const users: User[] = [
  { id: 'user-1', name: 'Elena Petrova', email: 'elena@example.com', avatarUrl: 'https://picsum.photos/seed/201/40/40', bio: 'Writer, dreamer, and coffee enthusiast.' },
  { id: 'user-2', name: 'John Miles', email: 'john@example.com', avatarUrl: 'https://picsum.photos/seed/202/40/40', bio: 'Exploring the intersection of technology and creativity.' },
  { id: 'user-3', name: 'Mei Lin', email: 'mei@example.com', avatarUrl: 'https://picsum.photos/seed/203/40/40', bio: 'Lover of minimalist design and clean code.' },
];

const posts: Post[] = [
  {
    slug: 'the-art-of-minimalism',
    title: 'The Art of Minimalism in Design and Life',
    content: `
Minimalism is not just an aesthetic; it's a philosophy that can be applied to almost every aspect of our lives. From the way we design our homes to the way we structure our days, embracing minimalism can lead to a more focused and intentional existence.

### Declutter Your Space

Start with your physical environment. A cluttered space often leads to a cluttered mind. Go through your belongings and ask yourself a simple question: "Does this bring me joy or serve a purpose?" If the answer is no, it might be time to let it go. This process isn't about deprivation, but about making room for what truly matters.

### Digital Minimalism

In today's hyper-connected world, our digital lives can be just as cluttered as our physical ones. Unsubscribe from newsletters you never read, delete apps you don't use, and be mindful of your time on social media. A digital detox can be incredibly refreshing and help you regain focus on your real-world priorities.

The journey to a minimalist lifestyle is a personal one, and it's not about following a strict set of rules. It's about finding what works for you and creating a life that is simpler, more meaningful, and free of excess.
    `,
    author: users[2],
    createdAt: '2024-05-15T10:00:00Z',
    tags: ['Design', 'Lifestyle', 'Minimalism'],
    imageUrl: 'https://picsum.photos/seed/102/800/600',
    imageHint: 'desk setup',
    likes: 128,
    commentsCount: 12,
  },
  {
    slug: 'exploring-the-unknown',
    title: 'Exploring the Unknown: A Journey into Generative AI',
    content: `
Generative AI is transforming the creative landscape. From art and music to writing and code, AI models are now capable of producing novel content that is often indistinguishable from human-created work.

### How it Works

At its core, generative AI learns patterns from vast amounts of data. When given a prompt, it uses this knowledge to generate new data that conforms to the learned patterns. This could be generating an image from a text description, composing a piece of music in a certain style, or even writing a poem.

### The Future is Collaborative

Instead of viewing AI as a replacement for human creativity, we should see it as a powerful new tool. The most exciting possibilities lie in the collaboration between humans and AI. Artists can use AI to generate new ideas, writers can use it to overcome writer's block, and developers can use it to accelerate their workflow.

The era of generative AI is just beginning, and the possibilities are limitless. It's a new frontier for creativity, and I, for one, am excited to see where it takes us.
    `,
    author: users[1],
    createdAt: '2024-05-14T14:30:00Z',
    tags: ['Technology', 'AI', 'Future'],
    imageUrl: 'https://picsum.photos/seed/101/800/600',
    imageHint: 'abstract architecture',
    likes: 256,
    commentsCount: 28,
  },
   {
    slug: 'a-walk-in-nature',
    title: 'The Unseen Benefits of a Simple Walk in Nature',
    content: `
In our fast-paced lives, we often underestimate the profound impact of simple activities. Taking a walk in nature is one such activity. It costs nothing, requires no special equipment, and its benefits are immense.

### Mental Clarity

Stepping away from screens and into the natural world allows our minds to reset. The gentle sounds of birds, the rustling of leaves, and the fresh air can reduce stress and anxiety, improve our mood, and boost our creative thinking. Studies have shown that even a short walk in a park can have significant mental health benefits.

### Physical Well-being

Walking is a fantastic form of low-impact exercise. It strengthens our hearts, improves circulation, and helps maintain a healthy weight. When we walk on natural, uneven terrain, we also improve our balance and proprioception.

### A Deeper Connection

Spending time in nature helps us reconnect with the world around us and our place within it. It fosters a sense of wonder and appreciation for the environment. So, next time you feel overwhelmed, consider lacing up your shoes and heading out for a walk. You might be surprised at what you find.
    `,
    author: users[0],
    createdAt: '2024-05-12T09:00:00Z',
    tags: ['Health', 'Wellness', 'Nature'],
    imageUrl: 'https://picsum.photos/seed/103/800/600',
    imageHint: 'nature landscape',
    likes: 98,
    commentsCount: 8,
  },
];

const comments: Record<string, Comment[]> = {
  'the-art-of-minimalism': [
    { id: 'comment-1', text: 'Great article! This is the inspiration I needed to declutter my workspace.', author: users[0], createdAt: '2024-05-15T11:00:00Z' },
    { id: 'comment-2', text: 'Digital minimalism is something I\'ve been trying to practice. It\'s tough but so rewarding.', author: users[1], createdAt: '2024-05-15T12:30:00Z' },
  ],
  'exploring-the-unknown': [
    { id: 'comment-3', text: 'Fascinating read! The idea of human-AI collaboration is so exciting.', author: users[2], createdAt: '2024-05-14T15:00:00Z' },
  ],
  'a-walk-in-nature': [],
};

// Simulate API calls
export async function getPosts(): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(posts), 50);
  });
}

export async function getPost(slug: string): Promise<Post | undefined> {
    return new Promise((resolve) => {
    setTimeout(() => resolve(posts.find((p) => p.slug === slug)), 50);
  });
}

export async function getComments(slug: string): Promise<Comment[]> {
    return new Promise((resolve) => {
    setTimeout(() => resolve(comments[slug] || []), 50);
  });
}

export async function getMe(): Promise<User> {
    return new Promise((resolve) => {
    setTimeout(() => resolve(users[0]), 50);
  });
}

export async function getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(users), 50);
    });
  }
  
export async function getUser(id: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(users.find((u) => u.id === id)), 50);
  });
}
