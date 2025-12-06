import Link from 'next/link';
import { Gift, TreePine, Snowflake } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background snowflakes */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <Snowflake className="absolute top-10 left-10 w-8 h-8 text-blue-400" />
        <Snowflake className="absolute top-20 right-20 w-6 h-6 text-blue-400" />
        <Snowflake className="absolute bottom-20 left-1/4 w-10 h-10 text-blue-400" />
        <Snowflake className="absolute top-1/3 right-10 w-7 h-7 text-blue-400" />
      </div>
      <div className="max-w-md w-full text-center relative">
        <div className="text-8xl mb-4">🎅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          Looks like this page got lost in the snow! Let&apos;s get you back to
          Santa&apos;s Workshop.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              <TreePine className="w-4 h-4 mr-2" />
              Back to Workshop
            </Button>
          </Link>
          <Link href="/workshop/start">
            <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
              <Gift className="w-4 h-4 mr-2" />
              Find Gifts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
