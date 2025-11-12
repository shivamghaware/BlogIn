
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import Link from 'next/link';

const signupFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
}).refine(data => data.password, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


type SignupFormValues = z.infer<typeof signupFormSchema>;

export function SignupForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  function onSubmit(data: SignupFormValues) {
    startTransition(() => {
      // In a real app, you would handle user registration here.
      // This is just a simulation.
      toast({
        title: 'Account Created',
        description: "You've successfully signed up!",
      });
      // For now, we'll just show a toast and redirect.
       window.location.href = '/';
    });
  }

  return (
    <Card>
        <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                              <Input placeholder="name@example.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                              <Input placeholder="********" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                </CardContent>
                <CardFooter className="flex flex-col">
                    <Button type="submit" disabled={isPending} className="w-full">
                        {isPending ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="underline">
                            Sign In
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
