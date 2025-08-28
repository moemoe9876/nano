import { GenerationPage } from '@/components/generation-page';
import Header from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <GenerationPage />
      </div>
    </main>
  );
}