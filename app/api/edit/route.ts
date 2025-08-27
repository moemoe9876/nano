import { NextRequest, NextResponse } from 'next/server';
import { imageToImageWithImprovement } from '@/lib/gemini-client';
import sharp from 'sharp';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File;

    if (!prompt || !imageFile) {
      return NextResponse.json({ error: 'Prompt and image are required' }, { status: 400 });
    }

    // Convert File to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Save temporarily
    const tempPath = path.join(os.tmpdir(), `${Date.now()}.png`);
    await sharp(imageBuffer).png().toFile(tempPath);

    // Use the improved workflow that handles image-to-image properly
    const result = await imageToImageWithImprovement(prompt, tempPath);

    // Clean up temp file
    await fs.unlink(tempPath);

    return NextResponse.json({
      success: true,
      image: {
        data: result.data,
        mimeType: result.mimeType
      },
      prompt: result.prompt
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
}
