# Nano Banana - AI Image Generation Studio

This is a web application named "Nano Banana" that functions as an AI Image Generation Studio. It's built using Next.js and React.

## Core Functionalities

*   **Text-to-Image Generation:** Users can enter a text prompt to generate an image. The application uses Google's Gemini AI to create the image. It also has a feature to "improve" the user's prompt for better results.
*   **Image-to-Image Editing:** Users can upload an image and provide a text prompt to modify or edit that image, again using the Gemini AI.
*   **API Key Management:** Users need to provide their own Google AI API key to use the generation features.

## Technical Stack

*   **Framework:** Next.js (v15.5.2)
*   **Language:** TypeScript (v5)
*   **UI Library:** React (v19.1.0)
*   **AI Model:** Google Gemini (v0.24.1)
*   **Styling:** Tailwind CSS (v4)
*   **Package Manager:** pnpm

The application has a user interface with tabs to switch between "Text-to-Image" and "Image-to-Image" modes, an input for the API key, a prompt input field, an image upload component, and a gallery to display the generated images.

## Project Structure

The project is structured as a standard Next.js application with the `app` directory.

*   `app/page.tsx`: The main entry point of the application's UI.
*   `app/layout.tsx`: The root layout of the application.
*   `app/api/`: Contains the API routes for image generation and editing.
    *   `generate/route.ts`: Handles text-to-image generation.
    *   `edit/route.ts`: Handles image-to-image editing.
*   `components/`: Contains the reusable UI components.
*   `hooks/`: Contains custom React hooks, such as `use-image-generation.ts` for managing image generation state.
*   `lib/`: Contains the core logic for interacting with the Gemini API (`gemini-client.ts`).
*   `public/`: Contains static assets.

## How to run the application

1.  Install dependencies: `pnpm install`
2.  Run the development server: `pnpm dev`
3.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to contribute

The main logic for image generation is located in `lib/gemini-client.ts`. The frontend components are in `components/ui/` and the main page is `app/page.tsx`. The backend API routes are in `app/api/`.
