# Nano Banana - AI Image Generation Studio

A modern, full-stack AI image generation application built with Next.js, TypeScript, and Google's Generative AI. Create stunning images from text prompts or transform existing images with advanced AI capabilities.

## 🌟 Features

- **Text-to-Image Generation**: Create images from text descriptions using Google's Gemini AI
- **Image-to-Image Editing**: Transform existing images with custom prompts
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- **Real-time Generation**: See your images generate in real-time
- **Gallery View**: Browse and manage all your generated images
- **Canvas Integration**: Built-in canvas editor for image manipulation

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: Google Generative AI (Gemini)
- **Canvas**: Konva.js for image editing
- **Image Processing**: Sharp for image optimization
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 18+
- pnpm package manager
- Google AI API key (for image generation)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/moemoe9876/nano.git
   cd nano
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Usage

### Text-to-Image Generation
1. Select the "Text-to-Image" tab
2. Enter your creative prompt in the text field
3. Click "Generate" to create your image
4. View your generated image in the gallery below

### Image-to-Image Editing
1. Select the "Image-to-Image" tab
2. Upload an image using the image upload component
3. Enter a transformation prompt
4. Click "Generate" to transform your image
5. View the edited result in the gallery

## 📁 Project Structure

```
nano/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   └── ui/               # UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── gemini-client.ts  # Google AI integration
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔧 Configuration

### Google AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your `.env.local` file

### Customization
- Modify the UI theme in `app/globals.css`
- Add new generation modes in `hooks/use-image-generation.ts`
- Customize components in the `components/ui/` directory

## 📜 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Google Generative AI](https://ai.google.dev/) for the AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Built with ❤️ using Next.js and Google's Generative AI
