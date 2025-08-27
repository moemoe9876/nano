import { NextRequest, NextResponse } from 'next/server';
import { generateImageWithImprovedPrompt } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const result = await generateImageWithImprovedPrompt({ prompt }, apiKey);

    return NextResponse.json({
      success: true,
      image: {
        data: result.data,
        mimeType: result.mimeType,
      },
      prompt: result.prompt,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

