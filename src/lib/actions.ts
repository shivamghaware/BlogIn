'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { suggestPostCategory, SuggestPostCategoryInput, SuggestPostCategoryOutput } from '@/ai/flows/suggest-post-category';

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

// This is a placeholder for creating a post. In a real app, this would
// interact with your database.
export async function createPostAction(formData: FormData) {
  const title = formData.get('title');
  const content = formData.get('content');
  const tags = formData.get('tags');
  
  console.log('New Post:', { title, content, tags });

  // In a real app, you would save this to a database and then...
  // Revalidate the path to show the new post
  revalidatePath('/');
  // Redirect to the homepage
  redirect('/');
}
