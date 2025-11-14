
'use client';

import { useState, useTransition, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { savePost } from '@/lib/data';
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

  const addTag = (tag: string) => {
    const currentTags = form.getValues('tags') || '';
    const tagSet = new Set(currentTags.split(',').map(t => t.trim()).filter(Boolean));
    if (!tagSet.has(tag)) {
      tagSet.add(tag);
      form.setValue('tags', Array.from(tagSet).join(', '), { shouldValidate: true });
    }
  };

  const onSubmit = (data: PostFormValues) => {
    startTransition(async () => {
      try {
        const { slug } = await savePost({
            title: data.title,
            content: data.content,
            tags: data.tags || '',
            slug: post?.slug,
        });

        toast({
            title: post ? "Post Updated!" : "Post Published!",
            description: post ? "Your changes have been saved." : "Your post is now live.",
        });
        
        router.push(`/p/${slug}`);
        router.refresh();

      } catch (error: any) {
         toast({
            title: "Error",
            description: error.message || "Something went wrong.",
            variant: "destructive",
        });
      }
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
