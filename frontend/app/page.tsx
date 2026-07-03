'use client';

import UploadCard from '@/components/UploadCard';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const handleFileSelect = (file: File) => {
    console.log('File selected:', file);
  };

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl animate-fade-in">
        {/* Main Upload Section */}
        <div className="mb-12">
          <UploadCard onFileSelect={handleFileSelect} />
        </div>


      </div>
      <ThemeToggle />
    </main>
  );
}
