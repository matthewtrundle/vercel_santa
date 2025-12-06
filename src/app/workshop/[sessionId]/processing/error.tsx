'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProcessingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Processing page error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            The Elves Need a Moment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Our AI elves encountered a hiccup while analyzing your request.
            Let&apos;s give them another try!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Processing
            </Button>
            <Link href="/workshop/start">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-left mt-6 p-4 bg-gray-50 rounded-lg">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error details (dev only)
              </summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
