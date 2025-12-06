'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Gift, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ListError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('List page error:', error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            List Not Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">
            We couldn&apos;t load this gift list. It may have been removed or
            there might be a temporary issue.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Create Your List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
