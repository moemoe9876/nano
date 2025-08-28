'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ApiKeyInput } from '@/components/ui/api-key-input';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiKeySubmit: (apiKey: string) => void;
}

export function ApiKeyDialog({ open, onOpenChange, onApiKeySubmit }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = () => {
    onApiKeySubmit(apiKey);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your Google AI API Key</DialogTitle>
          <DialogDescription>
            You can get your API key from Google AI Studio.
          </DialogDescription>
        </DialogHeader>
        <ApiKeyInput onApiKeyChange={setApiKey} />
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
