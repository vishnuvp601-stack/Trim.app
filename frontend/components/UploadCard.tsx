'use client';

import { useState, useRef } from 'react';
import { Upload, Check, Download, FileUp, FileText, Clock, AlertCircle } from 'lucide-react';

type UploadState = 'idle' | 'uploading' | 'success';

interface UploadCardProps {
  onFileSelect?: (file: File) => void;
  onStateChange?: (state: 'idle' | 'uploading' | 'success') => void;
}

export default function UploadCard({ onFileSelect, onStateChange }: UploadCardProps) {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [conversionTime, setConversionTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const uploadStartTimeRef = useRef<number>(0);

  const getPresignedUrl = async (file: File) => {
    try {
      setErrorMessage(null);
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Upload preparation failed: ${errorMsg}`);
      console.error('Presigned URL error:', error);
      throw error;
    }
  };

  const uploadToSupabase = async (
    file: File,
    presignedUrl: string
  ) => {
    try {
      setErrorMessage(null);
      
      // Create XMLHttpRequest for upload progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(Math.floor(percentComplete));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            resolve({ success: true });
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'));
        });

        xhr.open('PUT', presignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Upload failed: ${errorMsg}`);
      console.error('Upload error:', error);
      throw error;
    }
  };

  const simulateConversion = (conversionId: string) => {
    return new Promise((resolve) => {
      let currentProgress = 50;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 30;
        if (currentProgress > 100) {
          currentProgress = 100;
          clearInterval(interval);
          const timeTaken = (Date.now() - uploadStartTimeRef.current) / 1000;
          setConversionTime(Math.round(timeTaken));
          setProgress(100);
          resolve({ conversionId });
        } else {
          setProgress(Math.floor(currentProgress));
        }
      }, 300);
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Validate file type (PPT, DOC)
    const validTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid PPT, PPTX, DOC, or DOCX file');
      return;
    }

    try {
      setErrorMessage(null);
      setFileName(file.name);
      setFileSize(file.size);
      setUploadedFile(file);
      uploadStartTimeRef.current = Date.now();
      updateState('uploading');
      onFileSelect?.(file);

      // Get presigned URL and conversion ID
      const { presignedUrl, conversionId } = await getPresignedUrl(file);
      setConversionId(conversionId);
      setProgress(5); // Show some progress while getting URL

      // Upload file to Supabase Storage directly
      await uploadToSupabase(file, presignedUrl);

      // Simulate conversion processing
      await simulateConversion(conversionId);
      updateState('success');
    } catch (error) {
      console.error('File processing error:', error);
      updateState('idle');
      setProgress(0);
      setFileName('');
      setFileSize(0);
      setUploadedFile(null);
      setConversionId(null);
    }
  };



  const handleReset = () => {
    updateState('idle');
    setProgress(0);
    setFileName('');
    setFileSize(0);
    setConversionTime(0);
    setUploadedFile(null);
    setConversionId(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (!uploadedFile) return;
    
    // Create a valid PDF file structure
    // This is a placeholder - in Phase 2, this will be the actual converted PDF from server
    const pdfContent = `%PDF-1.4
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>
endobj
4 0 obj
<</Length 500>>
stream
BT
/F1 24 Tf
50 750 Td
(File Converted Successfully) Tj
ET
BT
/F1 12 Tf
50 700 Td
(Original File: ${fileName}) Tj
ET
BT
/F1 12 Tf
50 680 Td
(Conversion Time: ${conversionTime}s) Tj
ET
endstream
endobj
5 0 obj
<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000059 00000 n 
0000000118 00000 n 
0000000250 00000 n 
0000000800 00000 n 
trailer
<</Size 6/Root 1 0 R>>
startxref
880
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // When idle, show centered upload. When uploading/success, show 2-column layout
  if (state === 'idle') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-400/50 rounded-lg animate-slide-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-red-200 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <div
          className={`glass-card-hover p-12 text-center cursor-pointer transition-all duration-150 ${
            isDragging ? 'border-white/40 bg-glass-lighter shadow-2xl scale-105' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-glass bg-white/10 border border-white/20">
              <Upload className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">
            Drop your file here
          </h2>
          <p className="text-white/60 text-sm mb-6">or click to browse</p>
          <p className="text-white/40 text-xs">
            Supported: PPT, PPTX, DOC, DOCX
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,.doc,.docx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>
    );
  }

  // 2-column layout when uploading or success
  return (
    <div className="w-full max-w-6xl">
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-400/50 rounded-lg animate-slide-up">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-red-200 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* ========== LEFT COLUMN: UPLOAD SECTION ========== */}
      <div>
        <div
          className={`glass-card-hover p-12 text-center cursor-pointer transition-all duration-150 ${
            isDragging ? 'border-white/40 bg-glass-lighter shadow-2xl scale-105' : ''
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClickUpload}
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-glass bg-white/10 border border-white/20">
              <Upload className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2">
            Upload Another File
          </h2>
          <p className="text-white/60 text-sm mb-6">or click to browse</p>
          <p className="text-white/40 text-xs">
            Supported: PPT, PPTX, DOC, DOCX
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,.doc,.docx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* ========== RIGHT COLUMN: STATUS SECTIONS ========== */}
      <div className="space-y-6">
        {/* ========== PROGRESS BAR SECTION ========== */}
        {(state === 'uploading' || state === 'success') && (
          <div className="glass-card p-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <FileUp className={`w-6 h-6 ${state === 'success' ? 'text-emerald-400' : 'text-blue-400 animate-spin-slow'}`} strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-white">
                {state === 'success' ? 'Conversion Complete' : 'Converting...'}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20 mb-4">
              <div
                className="h-full bg-gradient-to-r from-white/40 to-white/60 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-white/50 text-sm text-center">{progress}% complete</p>
          </div>
        )}

        {/* ========== FILE INFO SECTION ========== */}
        {(state === 'uploading' || state === 'success') && fileName && (
          <div className="glass-card p-6 animate-slide-up">
            <h4 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">File Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span className="text-white/70 text-sm">File Name</span>
                </div>
                <span className="text-white font-medium text-sm">{fileName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">File Size</span>
                <span className="text-white font-medium text-sm">{formatFileSize(fileSize)}</span>
              </div>
              {state === 'success' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/70 text-sm">Conversion Time</span>
                  </div>
                  <span className="text-white font-medium text-sm">{conversionTime}s</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== STATUS/NOTIFICATIONS SECTION ========== */}
        {state === 'success' && (
          <div className="glass-card p-6 bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-400/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <h4 className="text-white font-semibold mb-1">Success!</h4>
                <p className="text-emerald-200 text-sm">Your file has been successfully converted to PDF and is ready for download.</p>
              </div>
            </div>
          </div>
        )}

        {/* ========== DOWNLOAD SECTION (Only when success) ========== */}
        {state === 'success' && (
          <div className="glass-card p-8 bg-gradient-to-br from-green-900/30 to-emerald-800/30 border-green-400/40 animate-slide-up">
            <div className="flex flex-col gap-4">
              <button
                onClick={handleDownload}
                className="glass-button-primary flex items-center justify-center gap-2 w-full"
              >
                <Download className="w-5 h-5" strokeWidth={1.5} />
                Download PDF
              </button>
              <button
                onClick={handleReset}
                className="glass-button w-full"
              >
                Convert Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


