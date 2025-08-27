import { NextRequest, NextResponse } from 'next/server';
import { imageToImageWithImprovement } from '@/lib/gemini-client';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File;
    const apiKey = formData.get('apiKey') as string;

    if (!prompt || !imageFile) {
      return NextResponse.json({ error: 'Prompt and image are required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }
    // Convert File to buffer and write directly to a temp file (no sharp used)
    // Convert File to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Determine file extension from uploaded file if possible
    const uploadedName = imageFile?.name || '';
    const mimeType = imageFile?.type || '';

    function mimeToExt(mime: string) {
      if (!mime) return 'png';
      if (mime === 'image/png') return 'png';
      if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg';
      if (mime === 'image/webp') return 'webp';
      if (mime === 'image/svg+xml') return 'svg';
      return 'png';
    }

    let ext = path.extname(uploadedName).replace('.', '');
    if (!ext) ext = mimeToExt(mimeType);

    // Save temporarily (write raw bytes directly — no image processing library used)
    const tempPath = path.join(os.tmpdir(), `${Date.now()}.${ext}`);
    await fs.writeFile(tempPath, imageBuffer);

    // Use the improved workflow that handles image-to-image properly
    const result = await imageToImageWithImprovement(prompt, tempPath, {}, apiKey);

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
