import Link from 'next/link';
import { Gift, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl mb-4">&#127877;</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the snow! Let&apos;s get you back to
          Santa&apos;s Workshop.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/workshop/start">
            <Button size="lg" variant="outline">
              <Gift className="w-4 h-4 mr-2" />
              Start Gift Search
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
