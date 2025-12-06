'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ResultsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Results page error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            The elves ran into a problem loading your gift recommendations.
            Don&apos;t worry - your session is saved!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Start Over
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
