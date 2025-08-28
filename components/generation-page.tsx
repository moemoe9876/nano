'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextToImageForm } from '@/components/text-to-image-form';
import { ImageToImageForm } from '@/components/image-to-image-form';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { ImageGallery } from '@/components/ui/image-gallery';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GenerationMode = 'text-to-image' | 'image-to-image';

export function GenerationPage() {
  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const { images, isLoading, error, generate } = useImageGeneration();

  const handleSubmit = (prompt: string, imageFile?: File) => {
    if (!apiKey) {
      setIsApiKeyDialogOpen(true);
      return;
    }
    generate(mode, prompt, imageFile, apiKey);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => setIsApiKeyDialogOpen(true)}>
          Set API Key
        </Button>
      </div>

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
              <TextToImageForm onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image-to-image" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Image-to-Image Editing</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageToImageForm onSubmit={(prompt, file) => handleSubmit(prompt, file)} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && <p className="text-destructive text-center mt-4">{error}</p>}

      <section className="mt-12">
        <h2 className="text-3xl font-bold tracking-tighter mb-4">Generated Images</h2>
        <ImageGallery images={images} />
      </section>

      <ApiKeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
        onApiKeySubmit={setApiKey}
      />
    </div>
  );
}
