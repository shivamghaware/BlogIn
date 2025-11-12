
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPostAction, suggestCategoriesAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bold, Italic, Heading2, Heading3, Heading4 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPost } from '@/lib/data';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/types';


const postFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  content: z.string().min(100, 'Content must be at least 100 characters long.'),
  tags: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

type PostCreatorProps = {
  post?: Post;
};


export function PostCreator({ post }: PostCreatorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      tags: post?.tags?.join(', ') || '',
    },
    mode: 'onChange',
  });

  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = `${prefix}${selectedText}${suffix}`;
    
    const updatedContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    form.setValue('content', updatedContent, { shouldValidate: true });

    textarea.focus();
    setTimeout(() => {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleSuggestCategories = async () => {
    const content = form.getValues('content');
    if (content.length < 100) {
      toast({
        title: 'Content too short',
        description: 'Please write at least 100 characters to get suggestions.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const result = await suggestCategoriesAction({ postContent: content });
      if (result.categories) {
        setSuggestions(result.categories);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not fetch suggestions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags') || '';
    const tagSet = new Set(currentTags.split(',').map(t => t.trim()).filter(Boolean));
    if (!tagSet.has(tag)) {
      tagSet.add(tag);
      form.setValue('tags', Array.from(tagSet).join(', '), { shouldValidate: true });
    }
  };

  const onSubmit = (data: PostFormValues) => {
    startTransition(() => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('tags', data.tags || '');
        if (post?.slug) {
            formData.append('slug', post.slug);
        }
        
        createPostAction(formData);

        toast({
            title: post ? "Post Updated!" : "Post Published!",
            description: post ? "Your changes have been saved." : "Your post is now live.",
        });
        
        // This will redirect to the new post if it's created, or the edited post
        // A more robust solution would get the returned slug from createPostAction
        router.push(post ? `/posts/${post.slug}` : `/`);
        router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h1 className="text-4xl font-bold font-headline">{post ? 'Edit Post' : 'Create a new post'}</h1>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Your post title" {...field} className="text-2xl h-14 p-4" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Content</FormLabel>
                <div className="flex items-center gap-1 border-b pb-2">
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => applyFormatting('## ', '')}><Heading2 className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => applyFormatting('### ', '')}><Heading3 className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => applyFormatting('#### ', '')}><Heading4 className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => applyFormatting('**', '**')}><Bold className="h-4 w-4" /></Button>
                    <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => applyFormatting('*', '*')}><Italic className="h-4 w-4" /></Button>
                </div>
              <FormControl>
                <Textarea
                  placeholder="Tell your story..."
                  {...field}
                  ref={textareaRef}
                  className="min-h-[400px] text-base leading-relaxed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
            <div className="flex items-center justify-between mb-2">
                <FormLabel className="text-lg">AI-Powered Suggestions</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestCategories} disabled={isLoadingSuggestions}>
                    <Sparkles className={`mr-2 h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
                    {isLoadingSuggestions ? 'Generating...' : 'Suggest Categories'}
                </Button>
            </div>
            {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-secondary/50">
                {suggestions.map((suggestion) => (
                    <button type="button" key={suggestion} onClick={() => addTag(suggestion)}>
                        <Badge variant="default" className="cursor-pointer text-sm font-normal">
                            + {suggestion}
                        </Badge>
                    </button>
                ))}
                </div>
            )}
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Technology, AI, Design (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Saving...' : post ? 'Save Changes' : 'Publish Post'}
        </Button>
      </form>
    </Form>
  );
}

