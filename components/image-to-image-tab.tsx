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
        <Card>
            <CardHeader>
                <CardTitle>Image-to-Image Editing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ImageUpload onImageUpload={handleImageUpload} />
                {imagePreview && <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />}
            </CardContent>
        </Card>
    );
}
