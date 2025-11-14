# Developer Documentation

This document provides instructions for setting up and running this project in a development environment.

## Getting Started

First, install the project dependencies using npm:

```bash
npm install
```

## Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

This will start the Next.js application in development mode with Turbopack. By default, the application will be available at `http://localhost:9002`.

You can also specify a different port:
```bash
npm run dev -- --port 3000
```

## Building for Production

To create a production build of the application, run:

```bash
npm run build
```

After building, you can start the production server with:

```bash
npm run start
```

## Scripts

This project includes several other scripts to help with development:

- `npm run lint`: Runs Next.js's built-in ESLint configuration to check for code quality and style issues.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
- `npm run genkit:dev`: Starts the Genkit development server for the AI features.
- `npm run genkit:watch`: Starts the Genkit development server in watch mode.

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Genkit](https://firebase.google.com/docs/genkit) - for AI features
- [Shadcn/ui](https://ui.shadcn.com/) - UI Components

## Project Structure

The project follows a standard Next.js `src` directory structure:

- `src/app`: Contains all the routes for the application. Each folder represents a URL segment.
- `src/components`: Contains all the reusable React components. It is further divided into:
  - `auth`: Components related to user authentication (login, signup, etc.).
  - `comments`: Components for displaying and creating comments.
  - `icons`: SVG icons.
  - `layout`: Components that define the overall structure of the site (header, containers, etc.).
  - `posts`: Components related to posts (cards, creator, view).
  - `ui`: General-purpose UI components from Shadcn/ui (buttons, inputs, etc.).
  - `users`: Components for displaying user information.
- `src/hooks`: Custom React hooks for managing state and side effects.
- `src/lib`: Contains the core business logic, data fetching, and utility functions.
  - `actions.ts`: Server-side actions that can be called from client components.
  - `constants.ts`: Application-wide constants.
  - `data.ts`: Functions for fetching and manipulating data.
  - `types.ts`: TypeScript type definitions for the data models.
  - `utils.ts`: Utility functions.
- `src/ai`: Contains the Genkit AI flows and related code.
- `public`: Static assets that are publicly accessible.

## Implementation Patterns

### Server-Side vs. Client-Side Rendering

This project uses a mix of React Server Components (RSC) and Client Components. By default, all components in the `app` directory are Server Components. To use client-side features like `useState` and `useEffect`, you must mark a component with the `'use client'` directive at the top of the file.

### Data Fetching

Data fetching is primarily done in Server Components using the functions in `src/lib/data.ts`. This allows for efficient data fetching on the server, reducing the amount of data that needs to be sent to the client.

### State Management

For client-side state management, we use a combination of React's built-in `useState` and `useReducer` hooks, along with custom hooks in the `src/hooks` directory for more complex state.

## Adding a New Feature

Here's a step-by-step guide to adding a new feature, using a hypothetical "like a comment" feature as an example:

1.  **Update the Data Model**: If the new feature requires changes to the data model, start by updating the types in `src/lib/types.ts`. For our example, we might add a `likes` array to the `Comment` type:

    ```typescript
    // src/lib/types.ts
    export type Comment = {
      id: string;
      // ... other fields
      likes: string[]; // Array of user IDs
    };
    ```

2.  **Add a Data Manipulation Function**: Create a function in `src/lib/data.ts` to handle the data manipulation for the new feature. This function will be called from a Server Action or a client-side component.

    ```typescript
    // src/lib/data.ts
    export async function likeComment(commentId: string, userId: string) {
      // ... logic to update the comment in the database
    }
    ```

3.  **Create a Server Action** (Optional): If the data manipulation needs to be triggered from a client component, create a Server Action in `src/lib/actions.ts`.

    ```typescript
    // src/lib/actions.ts
    'use server';

    import { likeComment } from './data';

    export async function likeCommentAction(commentId: string, userId: string) {
      await likeComment(commentId, userId);
      // ... revalidate the path or return data
    }
    ```

4.  **Create a New UI Component**: Create a new component in `src/components` that uses the new data and functionality. For our example, we would create a `LikeButton` component.

    ```tsx
    // src/components/comments/LikeButton.tsx
    'use client';

    import { likeCommentAction } from '@/lib/actions';
    import { useTransition } from 'react';

    export function LikeButton({ comment, userId }: { comment: Comment, userId: string }) {
      const [isPending, startTransition] = useTransition();

      const handleLike = () => {
        startTransition(async () => {
          await likeCommentAction(comment.id, userId);
        });
      };

      return (
        <button onClick={handleLike} disabled={isPending}>
          {/* ... button content */}
        </button>
      );
    }
    ```

5.  **Integrate the New Component**: Finally, integrate the new component into the appropriate page or component in the `src/app` directory.

## Code Style and Conventions

- **Styling**: We use Tailwind CSS for styling. Please use the utility classes directly in your components.
- **UI Components**: We use Shadcn/ui for our UI components. Please use the components from `src/components/ui` whenever possible.
- **Linting**: We use ESLint to enforce code style. Please run `npm run lint` before committing your code.
- **Type Checking**: We use TypeScript for type safety. Please run `npm run typecheck` before committing your code.

## Codebase Navigation and Updation

This section provides a guide to navigating the codebase and understanding how to update it.

### Data Flow

The primary data flow in the application is as follows:

1.  **Data Fetching**: Data is fetched from `localStorage` in the `src/lib/data.ts` file.
2.  **Server Components**: Pages in the `src/app` directory are primarily Server Components that fetch data using the functions from `src/lib/data.ts`.
3.  **Client Components**: Client Components are used for interactive UI and are marked with `'use client'`. They receive data as props from Server Components or fetch it using custom hooks.
4.  **Custom Hooks**: Custom hooks in `src/hooks` encapsulate complex client-side logic and state management.

### Example: Updating a User Profile

Let's walk through the process of updating a user's profile:

1.  **The UI**: The user interacts with the `EditProfileForm` component (`src/components/auth/EditProfileForm.tsx`).
2.  **The Form**: This component uses `react-hook-form` to manage the form state and validation.
3.  **The Action**: On form submission, the `updateUser` function from `src/lib/data.ts` is called. This function updates the user's data in `localStorage`.

    ```typescript
    // src/lib/data.ts
    export async function updateUser(updatedUser: User): Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let users = getLocalStorage('users', []);
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
    ```

### Example: Viewing a Post

1.  **The Route**: The user navigates to `/p/[slug]`, which corresponds to the `src/app/p/[slug]/page.tsx` file.
2.  **The Page**: This page uses the `usePostView` hook to get the post and comments.

    ```tsx
    // src/app/p/[slug]/page.tsx
    'use client';

    import { notFound } from 'next/navigation';
    import PostView from '@/components/posts/PostView';
    import { usePostView } from '@/hooks/use-post-view';
    import { MainContainer } from '@/components/layout/MainContainer';

    export default function PostPage() {
      const { post, comments } = usePostView();

      if (post === undefined) {
        return (
            <MainContainer>
                <div className="text-center">Loading post...</div>
            </MainContainer>
        );
      }

      if (post === null) {
        notFound();
      }

      return (
        <MainContainer>
          <PostView post={post} comments={comments} />
        </MainContainer>
      );
    }
    ```

### Updating Documents in Firestore

To update some fields of a document without overwriting the entire document, use the following language-specific `update()` methods:

#### Web

Use the `updateDoc()` method:

```javascript
import { doc, updateDoc } from "firebase/firestore";

const washingtonRef = doc(db, "cities", "DC");

// Set the "capital" field of the city 'DC'
await updateDoc(washingtonRef, {
  capital: true
});
```

[Learn more](//firebase.google.com/docs/web/learn-more#modular-version) about the tree-shakeable modular Web API and its advantages over the namespaced API.

```javascript
var docRef = db.collection('objects').doc('some-id');

// Update the timestamp field with the value from the server
var updateTimestamp = docRef.update({
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
});
```

##### Swift

**Note:** This product is not available on watchOS and App Clip targets.

```swift
do {
  try await db.collection("objects").document("some-id").updateData([
    "lastUpdated": FieldValue.serverTimestamp(),
  ])
  print("Document successfully updated")
} catch {
  print("Error updating document: \(error)")
}
```
