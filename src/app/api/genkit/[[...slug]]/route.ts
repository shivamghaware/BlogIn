/**
 * @fileoverview This file serves as the entry point for all Genkit AI-related API requests
 * when deploying to Vercel. It is responsible for starting the Genkit flow server and
 * handling all incoming requests to the `/api/genkit` endpoint.
 */

// Import the `startFlowsServer` function from the Genkit Next.js integration package.
// This function is designed to run Genkit flows in a Next.js environment, particularly
// for serverless function deployments on platforms like Vercel.
import { startFlowsServer } from '@genkit-ai/nextjs';

// Import the main AI configuration from the `genkit.ts` file. This ensures that all the
// defined plugins, models, and flows are available to the server.
import '@/ai/genkit';

// Start the flows server and export the `GET` and `POST` handlers. These handlers
// will process all incoming GET and POST requests to the `/api/genkit` endpoint,
// allowing the application to interact with the Genkit AI flows.
export const { GET, POST } = startFlowsServer();
