'use client';

import { useState } from 'react';
import UploadCard from '@/components/UploadCard';
import ThemeToggle from '@/components/ThemeToggle';

type UploadState = 'idle' | 'uploading' | 'success';

export default function Home() {
  const [uploadState, setUploadState] = useState<UploadState>('idle');

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
    // Placeholder for actual upload logic
    // Will integrate with Supabase presigned URLs in Phase 2
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl animate-fade-in">
        {/* Main Upload Section */}
        <div className="mb-12">
          <UploadCard onFileSelect={handleFileSelect} onStateChange={setUploadState} />
        </div>


      </div>
      <ThemeToggle />
    </main>
  );
}
