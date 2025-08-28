'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptInput } from '@/components/ui/prompt-input';

interface TextToImageTabProps {
    handleSubmit: (prompt: string) => void;
    isLoading: boolean;
}

export function TextToImageTab({ handleSubmit, isLoading }: TextToImageTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Text-to-Image Generation</CardTitle>
            </CardHeader>
            <CardContent>
                <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
}
