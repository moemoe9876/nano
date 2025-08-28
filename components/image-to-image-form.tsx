'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { PromptInput } from '@/components/ui/prompt-input';

interface ImageToImageFormProps {
  onSubmit: (prompt: string, imageFile: File) => void;
  isLoading: boolean;
}

export function ImageToImageForm({ onSubmit, isLoading }: ImageToImageFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = (prompt: string) => {
    if (imageFile) {
      onSubmit(prompt, imageFile);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUpload onImageUpload={handleImageUpload} />
      {imageFile && <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />}
    </div>
  );
}
