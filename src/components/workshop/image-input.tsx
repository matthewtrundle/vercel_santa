'use client';

import type { ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadDropzone } from './upload-dropzone';
import { DrawingCanvas } from './drawing-canvas';

type InputMode = 'select' | 'upload' | 'draw';

interface ImageInputProps {
  sessionId: string;
  onComplete: (url: string) => void;
  onError: (error: string) => void;
}

export function ImageInput({
  sessionId,
  onComplete,
  onError,
}: ImageInputProps): ReactElement {
  const [mode, setMode] = useState<InputMode>('select');

  const handleUploadComplete = useCallback(
    (url: string) => {
      onComplete(url);
    },
    [onComplete]
  );

  const handleDrawingSave = useCallback(
    async (dataUrl: string) => {
      try {
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        // Create a File from the blob
        const file = new File([blob], 'drawing.png', { type: 'image/png' });

        // Upload using the same endpoint
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(`/api/upload?sessionId=${sessionId}`, {
          method: 'POST',
          body: formData,
        });

        const data = await uploadResponse.json();

        if (!uploadResponse.ok || !data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        onComplete(data.url);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to save drawing');
      }
    },
    [sessionId, onComplete, onError]
  );

  const handleCancel = useCallback(() => {
    setMode('select');
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-center text-gray-600 mb-6">
              How would you like to share what you&apos;re looking for?
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Upload option */}
              <motion.button
                onClick={() => setMode('upload')}
                className={cn(
                  'p-6 rounded-xl border-2 border-gray-200 bg-white',
                  'hover:border-red-400 hover:bg-red-50/50 transition-all',
                  'flex flex-col items-center gap-3'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-red-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Upload Photo</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Use an existing image
                  </p>
                </div>
              </motion.button>

              {/* Draw option */}
              <motion.button
                onClick={() => setMode('draw')}
                className={cn(
                  'p-6 rounded-xl border-2 border-gray-200 bg-white',
                  'hover:border-red-400 hover:bg-red-50/50 transition-all',
                  'flex flex-col items-center gap-3'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Pencil className="w-7 h-7 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">Draw It</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sketch what you want
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
            >
              <span>&larr;</span> Back to options
            </button>
            <UploadDropzone
              sessionId={sessionId}
              onUploadComplete={handleUploadComplete}
              onError={onError}
            />
          </motion.div>
        )}

        {mode === 'draw' && (
          <motion.div
            key="draw"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
            >
              <span>&larr;</span> Back to options
            </button>
            <DrawingCanvas onSave={handleDrawingSave} onCancel={handleCancel} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
