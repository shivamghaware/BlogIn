# BlogIn: A Modern Blogging Platform

BlogIn is a feature-rich, modern blogging platform built with Next.js, React, and Google's Genkit. It provides a clean, intuitive interface for writers to create and share their stories, and for readers to discover, engage with, and follow their favorite authors. The application is designed to be performant, aesthetically pleasing, and highly interactive.

For a visual representation of the project architecture, please see the [UML Diagrams](uml.md).

## Key Features

- **User Authentication**: Secure sign-up and login functionality.
- **Profile Management**: Users can create and edit their profiles, including name, bio, and avatar.
- **Post Creation & Editing**: A rich text editor allows users to write, edit, and publish posts with markdown-style formatting.
- **AI-Powered Suggestions**: Utilizes Genkit to provide AI-driven category suggestions for new posts based on their content.
- **Interactive Feed**: A dynamic homepage that displays all posts and allows filtering by tags.
- **Post Interaction**: Users can like, save (bookmark), and comment on posts.
- **User Profiles**: Comprehensive profile pages that display a user's posts, comments, likes, saved posts, followers, and following lists.
- **Social Features**: Users can follow and unfollow other authors.
- **Global Search**: A powerful command menu (`Cmd+K` or `Ctrl+K`) to search for posts, users, and topics across the entire application.
- **Theming**: Light and dark mode support, customizable by the user.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (for AI-powered features)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation

## Project Structure

The project follows a standard Next.js App Router structure. Here are the key directories:

- **`src/app/`**: Contains all the routes and pages of the application.
  - **`layout.tsx`**: The main root layout for the entire application.
  - **`page.tsx`**: The homepage/main feed.
  - **`/p/[slug]/`**: The dynamic route for viewing a single post.
  - **`/profile/`**: User profile pages, including editing and viewing other users' profiles.
  - **`/new-post/`**: The page for creating a new blog post.
  - **`/login/` & `/signup/`**: Authentication pages.

- **`src/components/`**: Contains all the reusable React components.
  - **`/auth/`**: Components related to user authentication (login, signup, user navigation).
  - **`/posts/`**: Components for creating, viewing, and listing posts.
  - **`/comments/`**: Components for the comment section and form.
  - **`/layout/`**: Core layout components like the header and global search.
  - **`/ui/`**: Auto-generated ShadCN UI components.

- **`src/lib/`**: Contains application-wide libraries, utilities, and data handling logic.
  - **`data.ts`**: Simulates a backend database using `localStorage`. It manages all data for users, posts, and comments.
  - **`actions.ts`**: Server Actions for handling form submissions like creating and updating posts.
  - **`types.ts`**: Defines the core TypeScript types used throughout the application.
  - **`utils.ts`**: Utility functions, including the `cn` function for merging Tailwind classes.

- **`src/ai/`**: Contains all the Genkit-related code for AI features.
  - **`genkit.ts`**: Initializes and configures the Genkit AI instance.
  - **`/flows/`**: Defines the AI flows, such as the one for suggesting post categories.

## Data Simulation

This application uses the browser's `localStorage` to simulate a persistent database (`src/lib/data.ts`). This allows for a fully interactive, multi-user experience without requiring a real backend. All data related to users, posts, comments, likes, and follows is stored and retrieved from `localStorage`, and the application uses custom events to ensure state is synchronized across different browser tabs and components.
