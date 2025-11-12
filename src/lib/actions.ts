
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { suggestPostCategory, SuggestPostCategoryInput, SuggestPostCategoryOutput } from '@/ai/flows/suggest-post-category';
import { getPosts, getMe } from './data';
import type { Post } from './types';

export async function suggestCategoriesAction(
  input: SuggestPostCategoryInput
): Promise<SuggestPostCategoryOutput> {
  try {
    const result = await suggestPostCategory(input);
    return result;
  } catch (error) {
    console.error('Error suggesting categories:', error);
    return { categories: [] };
  }
}


export async function createPostAction(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const slug = formData.get('slug') as string | undefined;

    const me = await getMe();

    if (!me) {
        throw new Error('You must be logged in to create a post.');
    }

    const posts: Post[] = await getPosts();

    if (slug) {
        // Editing existing post
        const postIndex = posts.findIndex(p => p.slug === slug);
        if (postIndex !== -1 && posts[postIndex].author.id === me.id) {
            posts[postIndex] = {
                ...posts[postIndex],
                title,
                content,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            };
        } else {
             throw new Error('Post not found or you do not have permission to edit it.');
        }
    } else {
        // Creating new post
        const newSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const newPost: Post = {
            slug: newSlug,
            title,
            content,
            author: me,
            createdAt: new Date().toISOString(),
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            imageUrl: `https://picsum.photos/seed/${newSlug}/800/600`,
            imageHint: 'abstract',
            likes: 0,
            commentsCount: 0,
        };
        posts.unshift(newPost);
    }
  
    // In a real app, you would save this to a database.
    // For this simulation, we can't persist it server-side across requests.
    // The redirect and revalidation will show the change for the current user session
    // if the data source was persistent.

    revalidatePath('/');
    const postSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    revalidatePath(`/p/${postSlug}`);
    if (slug) {
        redirect(`/p/${slug}`);
    } else {
        redirect('/');
    }
}
