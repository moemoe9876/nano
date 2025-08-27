# Product Requirements Document: Nano Banana Image Generation App

## Overview
This application leverages Google's Gemini 2.5 Flash Image model (codename: nano-banana) to provide a comprehensive text-to-image and image-to-image generation tool with advanced masking capabilities. The app allows users to generate images from text prompts, edit existing images, and perform targeted modifications using a brush-based masking tool.

## Core Features

### 1. Text-to-Image Generation
- Generate high-quality images from natural language prompts
- Support for various styles, subjects, and compositions
- Real-time preview and iterative refinement

### 2. Image-to-Image Editing
- Upload existing images for modification
- Maintain character consistency across edits
- Support for style transfer and content manipulation

### 3. Mask-Based Editing (Inpainting)
- Interactive brush tool for selecting edit regions
- Precise masking with adjustable brush size and opacity
- Natural language prompts for masked area modification
- Seamless integration with existing image content

### 4. Advanced Capabilities
- Multi-image blending and composition
- Character consistency for storytelling
- World knowledge integration for contextual generation
- High-quality output with state-of-the-art visual fidelity

## API Integration Details

### Gemini 2.5 Flash Image API Documentation

#### Authentication
- **API Key**: Obtain from Google AI Studio (`https://aistudio.google.com/apikey`)
- **Header**: `x-goog-api-key: YOUR_GEMINI_API_KEY`
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/`

#### Available Models
- **gemini-2.5-flash-image-preview**: Native text-to-image and multimodal image generation
- **gemini-2.5-flash-image-edit-preview**: Advanced image editing and inpainting
- **imagen-4**: Standalone high-fidelity image generation model

#### Text-to-Image Generation
**Endpoint**: `POST /v1beta/models/gemini-2.5-flash-image-preview:generateImage`

**Request Format**:
```json
{
  "prompt": {"text": "A futuristic city skyline at sunset"},
  "imageConfig": {
    "resolution": "1024x1024",
    "format": "PNG"
  },
  "n": 1
}
```

**Python Example**:
```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

prompt = "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme"

response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=[prompt],
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

#### Image-to-Image Editing
**Endpoint**: `POST /v1beta/models/gemini-2.5-flash-image-preview:generateImage`

**Request Format**:
```json
{
  "prompt": {"text": "Add neon signs to this street scene"},
  "initImage": {"uri": "gs://my-bucket/input.png"},
  "imageConfig": {
    "resolution": "1024x1024",
    "format": "PNG"
  },
  "n": 1
}
```

**Python Example**:
```python
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

client = genai.Client()

prompt = "Create a picture of my cat eating a nano-banana in a fancy restaurant under the Gemini constellation"

image = Image.open("/path/to/cat_image.png")

response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents=[prompt, image],
)

for part in response.candidates[0].content.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = Image.open(BytesIO(part.inline_data.data))
        image.save("generated_image.png")
```

#### Mask-Based Inpainting
**Endpoint**: `POST /v1beta/models/gemini-2.5-flash-image-edit-preview:generateImage`

**Request Format**:
```json
{
  "prompt": {"text": "Replace the car with a vintage model"},
  "initImage": {"uri": "gs://my-bucket/street.png"},
  "maskImage": {"uri": "gs://my-bucket/street_mask.png"},
  "imageConfig": {
    "resolution": "1024x1024",
    "format": "PNG"
  }
}
```

#### JavaScript/Node.js Example
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage(prompt, imagePath = null) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

  const imageParts = [];
  if (imagePath) {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    imageParts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Image
      }
    });
  }

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const imageResponse = response.text();

  return imageResponse;
}
```

#### cURL Examples

**Text-to-Image**:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateImage" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": {"text": "A serene mountain lake at dawn"},
    "imageConfig": {"resolution": "1024x1024", "format": "PNG"},
    "n": 1
  }'
```

**Image-to-Image**:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateImage" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "prompt": {"text": "Add neon signs to this street scene"},
    "initImage": {"uri": "gs://my-bucket/input.png"},
    "imageConfig": {"resolution": "1024x1024", "format": "PNG"},
    "n": 1
  }'
```

#### Response Format
All responses follow this structure:
```json
{
  "images": [
    {
      "mimeType": "image/png",
      "data": "iVBORw0KGgoAAAANS..."
    }
  ]
}
```

#### Pricing (August 2025)
- **Text-to-Image & Image-to-Image**: $0.10 per 1024×1024 image
- **Inpainting/Masking**: $0.12 per 1024×1024 image
- **Token-based pricing**: $30 per 1 million tokens (1290 tokens per image)

#### Limitations
- Best performance with: EN, es-MX, ja-JP, zh-CN, hi-IN
- No audio/video input support
- Maximum 3 input images recommended
- All images include SynthID watermark
- Uploading images of children not supported in EEA, CH, and UK

#### Best Practices
- Be hyper-specific in prompts
- Use step-by-step instructions for complex scenes
- Iterate and refine with follow-up prompts
- Use semantic negative prompts instead of just exclusions
- Control camera angles with photographic terms

## User Experience Requirements

### Interface Design
- Clean, modern UI using ShadCN components
- Intuitive drag-and-drop image upload
- Interactive canvas for mask creation
- Real-time brush tool with size/opacity controls
- Prompt input with suggestions and history
- Gallery view for generated images
- Export options (PNG, JPEG, WebP)

### Workflow
1. **Text-to-Image**: Enter prompt → Generate → Preview → Download
2. **Image-to-Image**: Upload image → Enter edit prompt → Generate → Preview → Download
3. **Masking**: Upload image → Draw mask → Enter prompt for masked area → Generate → Preview → Download

### Performance Requirements
- Fast generation times (< 10 seconds per image)
- Responsive UI with loading states
- Offline capability for mask creation
- Batch processing support

## Implementation Plan

## Backend Setup
- [ ] Step 1: Install Gemini API client and image processing libraries
  - **Task**: Set up Next.js API routes with necessary dependencies and implement core API functions
  - **Files**:
    - `package.json`: Add @google/generative-ai, sharp, canvas, @google/generativelanguage
    - `app/api/generate/route.ts`: Main generation endpoint with Gemini API integration
    - `app/api/edit/route.ts`: Image editing endpoint
    - `app/api/mask/route.ts`: Mask-based editing endpoint
    - `lib/gemini-client.ts`: Gemini API client wrapper functions
  - **Step Dependencies**: None
  - **User Instructions**: Run `pnpm install @google/generative-ai sharp canvas @google/generativelanguage`

**Gemini API Client Implementation** (`lib/gemini-client.ts`):
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerativeLanguageClient } from '@google/generativelanguage';
import sharp from 'sharp';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const client = new GenerativeLanguageClient();

export interface GenerateImageOptions {
  prompt: string;
  imagePath?: string;
  maskPath?: string;
  width?: number;
  height?: number;
  format?: 'PNG' | 'JPEG' | 'WEBP';
}

export async function generateImage(options: GenerateImageOptions) {
  const { prompt, imagePath, maskPath, width = 1024, height = 1024, format = 'PNG' } = options;

  try {
    let requestBody: any = {
      prompt: { text: prompt },
      imageConfig: {
        resolution: `${width}x${height}`,
        format: format
      },
      n: 1
    };

    if (imagePath) {
      // Convert image to base64
      const imageBuffer = await sharp(imagePath).png().toBuffer();
      const base64Image = imageBuffer.toString('base64');

      requestBody.initImage = {
        mimeType: 'image/png',
        data: base64Image
      };
    }

    if (maskPath) {
      // Use edit model for masking
      const maskBuffer = await sharp(maskPath).png().toBuffer();
      const base64Mask = maskBuffer.toString('base64');

      requestBody.maskImage = {
        mimeType: 'image/png',
        data: base64Mask
      };

      // Use edit model for masking operations
      const response = await client.generateImage({
        model: 'gemini-2.5-flash-image-edit-preview',
        ...requestBody
      });

      return response.images[0];
    } else {
      // Use standard model for generation/editing
      const model = imagePath ? 'gemini-2.5-flash-image-preview' : 'gemini-2.5-flash-image-preview';
      const response = await client.generateImage({
        model: model,
        ...requestBody
      });

      return response.images[0];
    }
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

export async function textToImage(prompt: string, options?: Partial<GenerateImageOptions>) {
  return generateImage({ prompt, ...options });
}

export async function imageToImage(prompt: string, imagePath: string, options?: Partial<GenerateImageOptions>) {
  return generateImage({ prompt, imagePath, ...options });
}

export async function inpaintImage(prompt: string, imagePath: string, maskPath: string, options?: Partial<GenerateImageOptions>) {
  return generateImage({ prompt, imagePath, maskPath, ...options });
}
```

**API Route Implementation** (`app/api/generate/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { textToImage } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const { prompt, width = 1024, height = 1024, format = 'PNG' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const imageData = await textToImage(prompt, { width, height, format });

    return NextResponse.json({
      success: true,
      image: {
        data: imageData.data,
        mimeType: imageData.mimeType
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
```

**Image Edit API Route** (`app/api/edit/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { imageToImage } from '@/lib/gemini-client';
import sharp from 'sharp';

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

    // Save temporarily (in production, use cloud storage)
    const tempPath = `/tmp/${Date.now()}.png`;
    await sharp(imageBuffer).png().toFile(tempPath);

    const imageData = await imageToImage(prompt, tempPath);

    // Clean up temp file
    require('fs').unlinkSync(tempPath);

    return NextResponse.json({
      success: true,
      image: {
        data: imageData.data,
        mimeType: imageData.mimeType
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
}
```

**Mask API Route** (`app/api/mask/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { inpaintImage } from '@/lib/gemini-client';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File;
    const maskFile = formData.get('mask') as File;

    if (!prompt || !imageFile || !maskFile) {
      return NextResponse.json({ error: 'Prompt, image, and mask are required' }, { status: 400 });
    }

    // Convert files to buffers
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer = Buffer.from(await maskFile.arrayBuffer());

    // Save temporarily
    const tempImagePath = `/tmp/${Date.now()}_image.png`;
    const tempMaskPath = `/tmp/${Date.now()}_mask.png`;

    await sharp(imageBuffer).png().toFile(tempImagePath);
    await sharp(maskBuffer).png().toFile(tempMaskPath);

    const imageData = await inpaintImage(prompt, tempImagePath, tempMaskPath);

    // Clean up temp files
    const fs = require('fs');
    fs.unlinkSync(tempImagePath);
    fs.unlinkSync(tempMaskPath);

    return NextResponse.json({
      success: true,
      image: {
        data: imageData.data,
        mimeType: imageData.mimeType
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process masked image' },
      { status: 500 }
    );
  }
}
```

## Frontend Components
- [ ] Step 2: Create core UI components using ShadCN
  - **Task**: Build reusable components for image upload, canvas, and controls
  - **Files**:
    - `components/ui/image-upload.tsx`: Drag-and-drop upload component
    - `components/ui/canvas-editor.tsx`: Interactive canvas for masking
    - `components/ui/prompt-input.tsx`: Text input with suggestions
    - `components/ui/image-gallery.tsx`: Display generated images
    - `components/ui/brush-controls.tsx`: Brush size and opacity controls
  - **Step Dependencies**: Backend Setup
  - **User Instructions**: Use ShadCN CLI to add button, input, card, and dialog components

## Main Application Page
- [ ] Step 3: Implement main application interface
  - **Task**: Create the primary user interface integrating all components
  - **Files**:
    - `app/page.tsx`: Main application page with layout and state management
    - `app/globals.css`: Update styles for canvas and image display
    - `lib/image-utils.ts`: Utility functions for image processing
  - **Step Dependencies**: Frontend Components
  - **User Instructions**: Replace default Next.js content with the image generation interface

## API Integration
- [ ] Step 4: Connect frontend to backend APIs
  - **Task**: Implement API calls for text-to-image, image-to-image, and masking
  - **Files**:
    - `lib/api-client.ts`: API client functions
    - `hooks/use-image-generation.ts`: Custom hook for generation logic
    - `hooks/use-canvas.ts`: Custom hook for canvas interactions
  - **Step Dependencies**: Main Application Page
  - **User Instructions**: Set up environment variables for Gemini API key

## Masking Functionality
- [ ] Step 5: Implement brush tool and mask creation
  - **Task**: Add interactive masking capabilities with canvas drawing
  - **Files**:
    - `components/ui/mask-canvas.tsx`: Specialized canvas for mask creation
    - `lib/mask-utils.ts`: Functions for mask processing and conversion
    - `hooks/use-mask.ts`: Hook for mask state management
  - **Step Dependencies**: API Integration
  - **User Instructions**: Test mask creation with sample images

## Testing and Optimization
- [ ] Step 6: Test all features and optimize performance
  - **Task**: Comprehensive testing of all generation modes and UI optimization
  - **Files**:
    - `app/test/page.tsx`: Test page for all features (optional)
    - Performance optimizations in existing files
  - **Step Dependencies**: Masking Functionality
  - **User Instructions**: Test with various prompts and image types, optimize loading states

## Deployment Preparation
- [ ] Step 7: Prepare for deployment and demo
  - **Task**: Final polish, error handling, and documentation
  - **Files**:
    - `README.md`: Update with setup and usage instructions
    - Environment configuration
  - **Step Dependencies**: Testing and Optimization
  - **User Instructions**: Set up Gemini API key and test deployment

## Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with ShadCN UI components
- **State Management**: React hooks and context
- **Image Processing**: HTML5 Canvas API
- **File Handling**: Native File API

### Backend Architecture
- **Runtime**: Next.js API routes (Node.js)
- **AI Model**: Google Gemini 2.5 Flash Image
- **Image Processing**: Sharp library
- **Authentication**: API key-based (for demo purposes)

### Data Flow
1. User uploads image or enters prompt
2. Frontend processes input (canvas for masks, text for prompts)
3. API call to Gemini with processed data
4. Backend receives generated image
5. Frontend displays result with download options

## Security Considerations
- API key protection (environment variables)
- Input validation for prompts and images
- Rate limiting for API calls
- CORS configuration for frontend-backend communication

## Success Metrics
- Image generation success rate > 95%
- Average generation time < 10 seconds
- User satisfaction with mask accuracy > 90%
- Intuitive UI with minimal learning curve

## Future Enhancements
- User accounts and image history
- Batch processing capabilities
- Advanced style controls
- Integration with other AI models
- Mobile app development