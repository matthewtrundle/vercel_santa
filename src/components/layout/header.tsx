'use client';

import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { Gift, Scroll, Snowflake, Sparkles, TreePine, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Hook to fetch beta features flag
function useBetaFeatures() {
  const [isBeta, setIsBeta] = useState(false);

  useEffect(() => {
    fetch('/api/flags/beta-features')
      .then((res) => res.json())
      .then((data) => setIsBeta(data.enabled ?? false))
      .catch(() => setIsBeta(false));
  }, []);

  return isBeta;
}

interface HeaderProps {
  sessionId?: string;
}

export function Header({ sessionId }: HeaderProps): ReactElement {
  const pathname = usePathname();
  const isBeta = useBetaFeatures();

  const isActive = (path: string) => pathname === path;
  const isWorkshop = pathname.startsWith('/workshop');

  return (
    <header className="sticky top-0 z-50 overflow-hidden">
      {/* Festive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-green-700" />

      {/* Snow/frost overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      {/* Candy cane stripe accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-red-200 to-white opacity-60" />

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Christmas styling */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {/* Glowing santa hat icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg shadow-red-900/30 border-2 border-white/30">
                <Gift className="w-5 h-5 text-white" />
              </div>
              {/* Sparkle accent */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </motion.div>
            </motion.div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg drop-shadow-md">
                  Santa&apos;s Workshop
                </span>
                {isBeta && (
                  <motion.span
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-purple-500 text-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <FlaskConical className="w-3 h-3" />
                    BETA
                  </motion.span>
                )}
              </div>
              <span className="block text-xs text-red-200 -mt-0.5">
                AI Gift Finder
              </span>
            </div>
          </Link>

          {/* Navigation with Christmas theming */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-base font-bold font-display transition-all',
                isActive('/')
                  ? 'bg-white/25 text-white shadow-inner'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              )}
            >
              <TreePine className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/how-it-works"
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-base font-bold font-display transition-all',
                isActive('/how-it-works')
                  ? 'bg-white/25 text-white shadow-inner'
                  : 'text-white/90 hover:bg-white/15 hover:text-white'
              )}
            >
              <Snowflake className="w-5 h-5" />
              <span className="hidden sm:inline">How It Works</span>
            </Link>

            {/* Santa List link - only show if we have a session */}
            {sessionId && (
              <Link
                href={`/workshop/${sessionId}/results`}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 rounded-full text-base font-bold font-display transition-all',
                  pathname.includes('/results')
                    ? 'bg-white/25 text-white shadow-inner'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'
                )}
              >
                <Scroll className="w-5 h-5" />
                <span className="hidden sm:inline">My List</span>
              </Link>
            )}

            {/* CTA - Start button with festive styling */}
            {!isWorkshop && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/workshop/start"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-base font-bold font-display bg-gradient-to-r from-amber-400 to-yellow-500 text-red-900 hover:from-amber-300 hover:to-yellow-400 transition-all ml-2 shadow-lg shadow-amber-900/30 border border-amber-300/50"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="hidden sm:inline">Find Gifts</span>
                </Link>
              </motion.div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
