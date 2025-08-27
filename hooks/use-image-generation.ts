'use client';

import { useState } from 'react';
import {
  generateTextToImage,
  generateImageToImage,
  ImageData,
} from '@/lib/gemini-client';

type GenerationMode = 'text-to-image' | 'image-to-image';

export function useImageGeneration() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (
    mode: GenerationMode,
    prompt: string,
    image?: File,
    apiKey?: string
  ) => {
    if (!apiKey) {
      setError('API key is required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let newImage: ImageData;
      if (mode === 'text-to-image') {
        newImage = await generateTextToImage(prompt, apiKey);
      } else if (mode === 'image-to-image' && image) {
        newImage = await generateImageToImage(prompt, image, apiKey);
      } else {
        throw new Error('Invalid generation mode or missing assets.');
      }
      setImages((prev) => [...prev, newImage]);
    } catch (err: unknown) {
      // Safely extract message from unknown error
      let message = 'An unknown error occurred';
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { images, isLoading, error, generate };
}
