'use client';

import type { ReactElement, ChangeEvent, DragEvent } from 'react';
import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  sessionId: string;
  onUploadComplete: (url: string) => void;
  onError: (error: string) => void;
}

export function UploadDropzone({
  sessionId,
  onUploadComplete,
  onError,
}: UploadDropzoneProps): ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
      if (!validTypes.includes(file.type)) {
        onError('Please upload a JPG, PNG, or WebP image.');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        onError('File too large. Maximum size is 10MB.');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`/api/upload?sessionId=${sessionId}`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        onUploadComplete(data.url);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Upload failed');
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [sessionId, onUploadComplete, onError]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload photo"
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-green-500 bg-white">
          <div className="aspect-square relative">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {isUploading ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Uploading...</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'aspect-square rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
            'flex flex-col items-center justify-center gap-4 p-8',
            isDragging
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50/50'
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
          aria-label="Click or drag to upload a photo"
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
              isDragging ? 'bg-red-100' : 'bg-gray-100'
            )}
          >
            {isDragging ? (
              <ImageIcon className="w-8 h-8 text-red-600" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>

          <div className="text-center">
            <p className="font-medium text-gray-700">
              {isDragging ? 'Drop your photo here' : 'Upload a photo'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG, or WebP • Max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
