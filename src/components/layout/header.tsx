'use client';

import type { ReactElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, ListChecks, Home, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sessionId?: string;
}

export function Header({ sessionId }: HeaderProps): ReactElement {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isWorkshop = pathname.startsWith('/workshop');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:animate-bounce">🎅</span>
            <span className="font-bold text-gray-900 hidden sm:inline">
              Santa&apos;s AI Workshop
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/')
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/how-it-works"
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive('/how-it-works')
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">How It Works</span>
            </Link>

            {/* Santa List link - only show if we have a session */}
            {sessionId && (
              <Link
                href={`/workshop/${sessionId}/results`}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.includes('/results')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <ListChecks className="w-4 h-4" />
                <span className="hidden sm:inline">My List</span>
              </Link>
            )}

            {/* CTA - Start button when not in workshop */}
            {!isWorkshop && (
              <Link
                href="/workshop/start"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors ml-2"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">Start</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
