'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PromptInput } from '@/components/ui/prompt-input';

interface TextToImageTabProps {
    handleSubmit: (prompt: string) => void;
    isLoading: boolean;
}

export function TextToImageTab({ handleSubmit, isLoading }: TextToImageTabProps) {
    return (
        <Card className="rounded-2xl shadow-lg border-slate-800 bg-slate-900">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-balance text-white">Text-to-Image Generation</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
            </CardContent>
        </Card>
    );
}
