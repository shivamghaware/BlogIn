
import type { User, Post, Comment } from './types';

// Initial seed data
const initialUsers: User[] = [
  { id: 'user-1', name: 'Elena Petrova', email: 'elena@example.com', avatarUrl: 'https://picsum.photos/seed/201/80/80', bio: 'Writer, dreamer, and coffee enthusiast.', followersCount: 125, followingCount: 78 },
  { id: 'user-2', name: 'John Miles', email: 'john@example.com', avatarUrl: 'https://picsum.photos/seed/202/80/80', bio: 'Exploring the intersection of technology and creativity.', followersCount: 256, followingCount: 120 },
  { id: 'user-3', name: 'Mei Lin', email: 'mei@example.com', avatarUrl: 'https://picsum.photos/seed/203/80/80', bio: 'Lover of minimalist design and clean code.', followersCount: 512, followingCount: 32 },
];

const initialPosts: Post[] = [
  {
    slug: 'the-art-of-minimalism',
    title: 'The Art of Minimalism in Design and Life',
    content: `Minimalism is not just an aesthetic; it's a philosophy that can be applied to almost every aspect of our lives. From the way we design our homes to the way we structure our days, embracing minimalism can lead to a more focused and intentional existence.\n\n#### Declutter Your Space\nStart with your physical environment. A cluttered space often leads to a cluttered mind. Go through your belongings and ask yourself a simple question: "Does this bring me joy or serve a purpose?" If the answer is no, it might be time to let it go. This process isn't about deprivation, but about making room for what truly matters.\n\n#### Digital Minimalism\nIn today's hyper-connected world, our digital lives can be just as cluttered as our physical ones. Unsubscribe from newsletters you never read, delete apps you don't use, and be mindful of your time on social media. A digital detox can be incredibly refreshing and help you regain focus on your real-world priorities.\n\nThe journey to a minimalist lifestyle is a personal one, and it's not about following a strict set of rules. It's about finding what works for you and creating a life that is simpler, more meaningful, and free of excess.`,
    author: initialUsers[2],
    createdAt: '2024-05-15T10:00:00Z',
    tags: ['Design', 'Lifestyle', 'Minimalism'],
    imageUrl: 'https://picsum.photos/seed/102/800/600',
    imageHint: 'desk setup',
    likes: 128,
    commentsCount: 2,
  },
  {
    slug: 'exploring-the-unknown',
    title: 'Exploring the Unknown: A Journey into Generative AI',
    content: `Generative AI is transforming the creative landscape. From art and music to writing and code, AI models are now capable of producing novel content that is often indistinguishable from human-created work.\n\n#### How it Works\nAt its core, generative AI learns patterns from vast amounts of data. When given a prompt, it uses this knowledge to generate new data that conforms to the learned patterns. This could be generating an image from a text description, composing a piece of music in a certain style, or even writing a poem.\n\n#### The Future is Collaborative\nInstead of viewing AI as a replacement for human creativity, we should see it as a powerful new tool. The most exciting possibilities lie in the collaboration between humans and AI. Artists can use AI to generate new ideas, writers can use it to overcome writer's block, and developers can use it to accelerate their workflow.\n\nThe era of generative AI is just beginning, and the possibilities are limitless. It's a new frontier for creativity, and I, for one, am excited to see where it takes us.`,
    author: initialUsers[1],
    createdAt: '2024-05-14T14:30:00Z',
    tags: ['Technology', 'AI', 'Future'],
    imageUrl: 'https://picsum.photos/seed/101/800/600',
    imageHint: 'abstract architecture',
    likes: 256,
    commentsCount: 1,
  },
   {
    slug: 'a-walk-in-nature',
    title: 'The Unseen Benefits of a Simple Walk in Nature',
    content: `In our fast-paced lives, we often underestimate the profound impact of simple activities. Taking a walk in nature is one such activity. It costs nothing, requires no special equipment, and its benefits are immense.\n\n#### Mental Clarity\nStepping away from screens and into the natural world allows our minds to reset. The gentle sounds of birds, the rustling of leaves, and the fresh air can reduce stress and anxiety, improve our mood, and boost our creative thinking. Studies have shown that even a short walk in a park can have significant mental health benefits.\n\n#### Physical Well-being\nWalking is a fantastic form of low-impact exercise. It strengthens our hearts, improves circulation, and helps maintain a healthy weight. When we walk on natural, uneven terrain, we also improve our balance and proprioception.\n\n#### A Deeper Connection\nSpending time in nature helps us reconnect with the world around us and our place within it. It fosters a sense of wonder and appreciation for the environment. So, next time you feel overwhelmed, consider lacing up your shoes and heading out for a walk. You might be surprised at what you find.`,
    author: initialUsers[0],
    createdAt: '2024-05-12T09:00:00Z',
    tags: ['Health', 'Wellness', 'Nature'],
    imageUrl: 'https://picsum.photos/seed/103/800/600',
    imageHint: 'nature landscape',
    likes: 98,
    commentsCount: 0,
  },
];

const initialComments: Record<string, Comment[]> = {
  'the-art-of-minimalism': [
    { id: 'comment-1', text: 'Great article! This is the inspiration I needed to declutter my workspace.', author: initialUsers[0], createdAt: '2024-05-15T11:00:00Z' },
    { id: 'comment-2', text: 'Digital minimalism is something I\'ve been trying to practice. It\'s tough but so rewarding.', author: initialUsers[1], createdAt: '2024-05-15T12:30:00Z' },
  ],
  'exploring-the-unknown': [
    { id: 'comment-3', text: 'Fascinating read! The idea of human-AI collaboration is so exciting.', author: initialUsers[2], createdAt: '2024-05-14T15:00:00Z' },
  ],
  'a-walk-in-nature': [],
};

// Helper to safely access localStorage
const getLocalStorage = (key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        return defaultValue;
    }
}

const setLocalStorage = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }
}

// Initialize data if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem('users')) {
    setLocalStorage('users', initialUsers);
    setLocalStorage('posts', initialPosts);
    setLocalStorage('comments', initialComments);
}

// Simulated API calls
export async function getPosts(): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalStorage('posts', initialPosts)), 50);
  });
}

export async function getPost(slug: string): Promise<Post | undefined> {
    return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getLocalStorage('posts', initialPosts);
      const post = posts.find((p: Post) => p.slug === slug);
      if (post) {
        const comments = getLocalStorage('comments', initialComments);
        post.commentsCount = (comments[slug] || []).length;
      }
      resolve(post)
    }, 50);
  });
}

export async function getComments(slug: string): Promise<Comment[]> {
    return new Promise((resolve) => {
    const comments = getLocalStorage('comments', initialComments);
    setTimeout(() => resolve(comments[slug] || []), 50);
  });
}

export async function getMe(): Promise<User | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getLocalStorage('currentUser', null));
        }, 50);
    });
}

export async function loginUser(email: string): Promise<User | null> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getLocalStorage('users', initialUsers);
            const user = users.find((u: User) => u.email === email);
            if (user) {
                setLocalStorage('currentUser', user);
                resolve(user);
            } else {
                resolve(null);
            }
        }, 50);
    });
}

export async function signupUser(name: string, email: string): Promise<User> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const users = getLocalStorage('users', initialUsers);
            const newUser: User = {
                id: `user-${Date.now()}`,
                name,
                email,
                avatarUrl: `https://picsum.photos/seed/${Math.random()}/80/80`,
                bio: 'New user',
                followersCount: 0,
                followingCount: 0,
            };
            const updatedUsers = [...users, newUser];
            setLocalStorage('users', updatedUsers);
            setLocalStorage('currentUser', newUser);
            resolve(newUser);
        }, 50);
    });
}

export async function logoutUser() {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('currentUser');
            }
            resolve();
        }, 50);
    });
}

export async function updateUser(updatedUser: User): Promise<User> {
    return new Promise((resolve) => {
        setTimeout(() => {
            let users = getLocalStorage('users', initialUsers);
            const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                setLocalStorage('users', users);
                const currentUser = getLocalStorage('currentUser', null);
                if(currentUser && currentUser.id === updatedUser.id) {
                    setLocalStorage('currentUser', updatedUser);
                }
            }
            resolve(updatedUser);
        }, 50);
    });
}


export async function getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getLocalStorage('users', initialUsers)), 50);
    });
}
  
export async function getUser(id: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
        const users = getLocalStorage('users', initialUsers);
        resolve(users.find((u: User) => u.id === id))
    }, 50);
  });
}
