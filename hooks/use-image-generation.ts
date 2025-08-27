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
    image?: File
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      let newImage: ImageData;
      if (mode === 'text-to-image') {
        newImage = await generateTextToImage(prompt);
      } else if (mode === 'image-to-image' && image) {
        newImage = await generateImageToImage(prompt, image);
      } else {
        throw new Error('Invalid generation mode or missing assets.');
      }
      setImages((prev) => [...prev, newImage]);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { images, isLoading, error, generate };
}
