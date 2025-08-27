import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);



export interface GenerateImageOptions {
  prompt: string;
  imagePath?: string;
}

export interface ImageData {
  data: string;
  mimeType: string;
}

async function fileToGenerativePart(path: string, mimeType: string): Promise<Part> {
  // This function is only used server-side, so we conditionally import fs
  if (typeof window === 'undefined') {
    const fs = await import('fs/promises');
    const data = await fs.readFile(path);
    return {
      inlineData: {
        data: data.toString('base64'),
        mimeType,
      },
    };
  }
  throw new Error('fileToGenerativePart can only be used server-side');
}

export async function generateImage(options: GenerateImageOptions): Promise<ImageData> {
  const { prompt, imagePath } = options;

  try {
    const modelName = 'gemini-2.5-flash-image-preview';

    const model = genAI.getGenerativeModel({ model: modelName });

    const contentParts: (string | Part)[] = [prompt];

    if (imagePath) {
      contentParts.push(await fileToGenerativePart(imagePath, 'image/png'));
    }

    console.log(`🎨 Generating image with model: ${modelName}`);
    console.log(`📝 Final prompt: ${prompt.substring(0, 200)}...`);

    const result = await model.generateContent(contentParts);
    const response = result.response;

    // Debug: log the full response structure
    console.log('🔍 Raw API response structure:', JSON.stringify({
      candidates: response.candidates?.length || 0,
      promptFeedback: !!response.promptFeedback,
      usageMetadata: !!response.usageMetadata
    }));

    if (!response.candidates || response.candidates.length === 0) {
        console.error('❌ No candidates in response');
        throw new Error("No candidates returned from the model. The prompt may have been filtered or blocked.");
    }

    const firstCandidate = response.candidates[0];
    console.log('🔍 First candidate structure:', JSON.stringify({
      finishReason: firstCandidate.finishReason,
      contentParts: firstCandidate.content?.parts?.length || 0,
      safetyRatings: firstCandidate.safetyRatings?.length || 0
    }));

    if (firstCandidate.finishReason === 'SAFETY') {
        throw new Error("Image generation was blocked due to safety filters. Please try a different prompt.");
    }

    if (!firstCandidate.content || !firstCandidate.content.parts) {
        throw new Error("No content parts found in the response.");
    }

    // Look for image data in the response parts
    const imagePart = firstCandidate.content.parts.find(part => {
      console.log('🔍 Checking part:', JSON.stringify({
        hasInlineData: !!part.inlineData,
        hasText: !!part.text,
        mimeType: part.inlineData?.mimeType
      }));
      return part.inlineData && part.inlineData.mimeType?.startsWith('image/');
    });

    if (!imagePart || !imagePart.inlineData) {
        // Check if there's any text response that might indicate an error
        const textParts = firstCandidate.content.parts.filter(part => part.text);
        if (textParts.length > 0) {
            console.log('📝 Text responses found:', textParts.map(p => p.text));
        }
        
        throw new Error("No image data found in the response. The model may not support image generation or the prompt was rejected.");
    }

    console.log('✅ Image generated successfully');
    return {
        data: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || 'image/png',
    };

  } catch (error) {
    console.error('💥 Error generating image:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your GEMINI_API_KEY environment variable.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      }
      if (error.message.includes('500')) {
        throw new Error('Google\'s servers are temporarily unavailable. Please try again in a few moments.');
      }
      if (error.message.includes('safety') || error.message.includes('blocked')) {
        throw new Error('Image generation was blocked due to content filters. Please try a different prompt.');
      }
    }
    
    throw error;
  }
}


export async function textToImage(prompt: string, options?: Partial<GenerateImageOptions>) {
  return generateImage({ prompt, ...options });
}

export async function imageToImage(prompt:string, imagePath: string, options?: Partial<GenerateImageOptions>) {
  return generateImage({ prompt, imagePath, ...options });
}

export async function improvePrompt(prompt: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  const fullPrompt = `You are an expert at writing image generation prompts. Take this basic prompt: "${prompt}"

Rewrite it as a single, detailed image generation prompt that includes:
- Specific visual details (subject appearance, clothing, expressions)
- Setting and environment details
- Lighting and mood
- Camera angle and composition
- Art style or photographic details

Return ONLY the improved prompt, no explanations or additional text.

Improved prompt:`;
  
    try {
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const improvedText = response.text().trim();
      
      // Extract just the prompt if there's any extra text
      const lines = improvedText.split('\n');
      const promptLine = lines.find(line => 
        line.length > 10 && 
        !line.toLowerCase().includes('improved prompt:') &&
        !line.toLowerCase().includes('here is') &&
        !line.toLowerCase().includes('here\'s')
      ) || lines[lines.length - 1];
      
      return promptLine.trim();
    } catch (error) {
      console.error('Error improving prompt:', error);
      return prompt; // Fallback to original prompt
    }
}

export async function generateImageWithImprovedPrompt(options: GenerateImageOptions) {
  const { prompt, imagePath } = options;

  // For text-to-image, improve the prompt first
  if (!imagePath) {
    console.log('🤖 Improving prompt with Gemini 2.5 Pro...');
    console.log('   Original prompt:', prompt);

    const improvedPrompt = await improvePrompt(prompt);

    console.log('   Improved prompt:', improvedPrompt);
    console.log('✅ Prompt improvement completed\n');

    // Generate image with the improved prompt
    const imageResult = await generateImage({
      prompt: improvedPrompt,
      imagePath
    });

    return {
      data: imageResult.data,
      mimeType: imageResult.mimeType,
      prompt: improvedPrompt,
    };
  } else {
    // For image-to-image, use the original prompt directly
    // The model needs to see the uploaded image to understand the context
    console.log('🖼️ Processing image-to-image generation...');
    console.log('   Original prompt:', prompt);
    console.log('   Using uploaded image for context');

    const imageResult = await generateImage({
      prompt,
      imagePath
    });

    return {
      data: imageResult.data,
      mimeType: imageResult.mimeType,
      prompt: prompt, // Return original prompt since we didn't improve it
    };
  }
}

export async function textToImageWithImprovement(prompt: string, options?: Partial<GenerateImageOptions>) {
  return generateImageWithImprovedPrompt({ prompt, ...options });
}

export async function imageToImageWithImprovement(prompt: string, imagePath: string, options?: Partial<GenerateImageOptions>) {
  return generateImageWithImprovedPrompt({ prompt, imagePath, ...options });
}

// Frontend API functions for client-side use
export async function generateTextToImage(prompt: string): Promise<ImageData> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate image');
  }

  const result = await response.json();
  return result.image;
}

export async function generateImageToImage(prompt: string, image: File): Promise<ImageData> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('image', image);

  const response = await fetch('/api/edit', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to edit image');
  }

  const result = await response.json();
  return result.image;
}
