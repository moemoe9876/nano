'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextToImageTab } from './text-to-image-tab';
import { ImageToImageTab } from './image-to-image-tab';

type GenerationMode = 'text-to-image' | 'image-to-image';

interface GenerationTabsProps {
    handleSubmit: (prompt: string) => void;
    isLoading: boolean;
    handleImageUpload: (file: File) => void;
    imagePreview: string | null;
    mode: GenerationMode;
    setMode: (mode: GenerationMode) => void;
}

export function GenerationTabs({ handleSubmit, isLoading, handleImageUpload, imagePreview, mode, setMode }: GenerationTabsProps) {
    return (
        <div className="max-w-4xl mx-auto">
            <Tabs value={mode} onValueChange={(value) => setMode(value as GenerationMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text-to-image">Text-to-Image</TabsTrigger>
                    <TabsTrigger value="image-to-image">Image-to-Image</TabsTrigger>
                </TabsList>

                <TabsContent value="text-to-image" className="mt-4">
                    <TextToImageTab handleSubmit={handleSubmit} isLoading={isLoading} />
                </TabsContent>

                <TabsContent value="image-to-image" className="mt-4">
                    <ImageToImageTab 
                        handleSubmit={handleSubmit} 
                        isLoading={isLoading} 
                        handleImageUpload={handleImageUpload} 
                        imagePreview={imagePreview} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
