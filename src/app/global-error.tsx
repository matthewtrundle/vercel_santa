'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">&#127877;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Santa&apos;s Workshop is Taking a Break
          </h1>
          <p className="text-gray-600 mb-6">
            Even the North Pole needs a moment sometimes. Our elves are working
            to fix this!
          </p>
          <button
            onClick={reset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
