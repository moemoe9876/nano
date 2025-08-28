'use client';

import { PromptInput } from '@/components/ui/prompt-input';

interface TextToImageFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function TextToImageForm({ onSubmit, isLoading }: TextToImageFormProps) {
  return <PromptInput onSubmit={onSubmit} isLoading={isLoading} />;
}
