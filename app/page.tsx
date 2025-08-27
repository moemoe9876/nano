'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';
import { PromptInput } from '@/components/ui/prompt-input';
import { ImageGallery } from '@/components/ui/image-gallery';
import { ApiKeyInput } from '@/components/ui/api-key-input';
import { useImageGeneration } from '@/hooks/use-image-generation';

type GenerationMode = 'text-to-image' | 'image-to-image';

export default function Home() {
  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  const { images, isLoading, error, generate } = useImageGeneration();

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (prompt: string) => {
    if (!apiKey) {
      alert('Please enter your Google AI API key first.');
      return;
    }
    generate(mode, prompt, imageFile || undefined, apiKey);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold tracking-tighter">Nano Banana</h1>
          <p className="text-muted-foreground mt-2">AI Image Generation Studio</p>
        </header>

        <ApiKeyInput onApiKeyChange={setApiKey} />

        <div className="max-w-4xl mx-auto">
          <Tabs value={mode} onValueChange={(value) => setMode(value as GenerationMode)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text-to-image">Text-to-Image</TabsTrigger>
              <TabsTrigger value="image-to-image">Image-to-Image</TabsTrigger>
            </TabsList>

            <TabsContent value="text-to-image" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Text-to-Image Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="image-to-image" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Image-to-Image Editing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload onImageUpload={handleImageUpload} />
                  {imagePreview && <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {error && <p className="text-destructive text-center mt-4">{error}</p>}

          <section className="mt-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Generated Images</h2>
              <ImageGallery images={images} />
          </section>
        </div>
      </div>
    </main>
  );
}
