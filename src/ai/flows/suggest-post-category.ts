'use server';

/**
 * @fileOverview An AI agent that suggests relevant categories or tags for a blog post based on its content.
 *
 * - suggestPostCategory - A function that suggests categories for a given blog post.
 * - SuggestPostCategoryInput - The input type for the suggestPostCategory function.
 * - SuggestPostCategoryOutput - The return type for the suggestPostCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPostCategoryInputSchema = z.object({
  postContent: z
    .string()
    .describe('The content of the blog post for which to suggest categories.'),
});
export type SuggestPostCategoryInput = z.infer<typeof SuggestPostCategoryInputSchema>;

const SuggestPostCategoryOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested categories or tags for the blog post.'),
});
export type SuggestPostCategoryOutput = z.infer<typeof SuggestPostCategoryOutputSchema>;

export async function suggestPostCategory(
  input: SuggestPostCategoryInput
): Promise<SuggestPostCategoryOutput> {
  return suggestPostCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPostCategoryPrompt',
  input: {schema: SuggestPostCategoryInputSchema},
  output: {schema: SuggestPostCategoryOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant categories or tags for a blog post based on its content.

  Suggest a maximum of 5 categories or tags.

  Post Content: {{{postContent}}}

  Categories:`,
});

const suggestPostCategoryFlow = ai.defineFlow(
  {
    name: 'suggestPostCategoryFlow',
    inputSchema: SuggestPostCategoryInputSchema,
    outputSchema: SuggestPostCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
