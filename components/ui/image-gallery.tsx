"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download } from 'lucide-react';

interface ImageGalleryProps {
  images: { data: string; mimeType: string }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const downloadImage = (imageData: string, mimeType: string) => {
    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${imageData}`;
    const fileExtension = mimeType.split('/')[1] || 'png';
    link.download = `nano-banana-generated-${Date.now()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-muted-foreground/30">
        <p className="text-muted-foreground">Generated images will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          const imageUrl = `data:${image.mimeType};base64,${image.data}`;
          return (
            <Card key={index} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="outline" onClick={() => setSelectedImage(imageUrl)}>View</Button>
                    </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 justify-end">
                <Button variant="ghost" size="icon" onClick={() => downloadImage(image.data, image.mimeType)}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img src={selectedImage || undefined} alt="Enlarged preview" className="w-full h-auto rounded-md" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
