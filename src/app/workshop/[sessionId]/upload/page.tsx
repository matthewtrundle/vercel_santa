'use client';

import type { ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Camera, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/workshop/upload-dropzone';

export default function UploadPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = useCallback((url: string) => {
    setUploadedUrl(url);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setUploadedUrl(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (uploadedUrl) {
      router.push(`/workshop/${sessionId}/questions`);
    }
  }, [router, sessionId, uploadedUrl]);

  const handleSkip = useCallback(() => {
    router.push(`/workshop/${sessionId}/questions`);
  }, [router, sessionId]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <Camera className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload a Photo
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Share a photo of your child so our AI elves can spot interests and
          personality clues to help find the perfect gifts!
        </p>
      </div>

      {/* Dropzone */}
      <div className="mb-8">
        <UploadDropzone
          sessionId={sessionId}
          onUploadComplete={handleUploadComplete}
          onError={handleError}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Upload failed</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="font-medium text-blue-900 mb-2">Tips for best results</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Choose a clear, well-lit photo</li>
          <li>• Photos with toys, clothes, or room decor help our elves spot interests</li>
          <li>• Don&apos;t worry - the photo is only used for this session</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleContinue}
          disabled={!uploadedUrl}
          size="lg"
          className="order-1 sm:order-2"
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button
          onClick={handleSkip}
          variant="ghost"
          size="lg"
          className="order-2 sm:order-1"
        >
          Skip this step
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        Photo upload is optional. You can still get great recommendations!
      </p>
    </div>
  );
}
