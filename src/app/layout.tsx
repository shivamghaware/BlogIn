/**
 * @fileoverview This is the root layout for the entire application.
 * It sets up the basic HTML document structure, including the `<html>` and `<body>` tags,
 * and applies global styles, fonts, and theme providers. It ensures a consistent
 * layout and functionality across all pages.
 */

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import { ThemeProvider } from '@/components/theme-provider';
import { Analytics } from '@vercel/analytics/react';

// The `metadata` object defines the default metadata for the application,
// which is used by search engines and the browser to provide information about the page.
export const metadata: Metadata = {
  title: 'BlogIn',
  description: 'A modern platform for writers and readers.',
};

/**
 * The root layout component that wraps all pages in the application.
 * @param {object} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout component.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The `suppressHydrationWarning` prop is used to prevent warnings caused by the use of browser-specific
    // APIs on the server (e.g., in the ThemeProvider).
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for performance optimization. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Link to the Literata font from Google Fonts. */}
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        {/* The ThemeProvider manages the application's light and dark modes. */}
        <ThemeProvider
            attribute="class" // The attribute to modify on the `html` element (e.g., `class="dark"`).
            defaultTheme="system" // The default theme to use (can be "light", "dark", or "system").
            enableSystem // Enables the use of the user's system preference.
            disableTransitionOnChange // Disables transitions when the theme changes to prevent flickering.
        >
            <div className="flex flex-col min-h-screen">
                {/* The Header component is displayed at the top of every page. */}
                <Header />
                {/* The `main` element contains the primary content of the page. */}
                <main className="flex-grow">
                    {children}
                </main>
            </div>
            {/* The Toaster component is used to display toast notifications. */}
            <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
