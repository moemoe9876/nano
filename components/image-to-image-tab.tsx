'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { PromptInput } from '@/components/ui/prompt-input';

interface ImageToImageTabProps {
    handleSubmit: (prompt: string) => void;
    isLoading: boolean;
    handleImageUpload: (file: File) => void;
    imagePreview: string | null;
}

export function ImageToImageTab({ handleSubmit, isLoading, handleImageUpload, imagePreview }: ImageToImageTabProps) {
    return (
        <Card className="rounded-2xl shadow-lg border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-balance text-white">
            Image-to-Image Editing
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-6">
          <ImageUpload onImageUpload={handleImageUpload} />
          {imagePreview && <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />}
        </CardContent>
      </Card>
    );
}
