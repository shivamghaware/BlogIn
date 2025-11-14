
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
