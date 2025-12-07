'use client';

import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { motion } from 'motion/react';
import { Gift, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChristmasCountdown } from '@/components/magical/christmas-countdown';
import { AnimatedSleigh } from '@/components/magical/animated-sleigh';
import { FloatingBlobs } from '@/components/organic/blob-shape';
import { FloatingOrnaments } from '@/components/organic/scattered-decorations';
import { trackJourneyStarted } from '@/lib/analytics';

interface HeroSectionProps {
  onStartJourney: () => void;
}

// Pre-generate star positions - varied sizes for organic feel
const STAR_COUNT = 60;
function generateStarPositions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 13 + 5) % 65}%`,
    size: 1 + (i % 3), // Varied sizes: 1, 2, or 3px
    duration: 2 + (i % 4),
    delay: (i % 7) * 0.3,
  }));
}

const starPositions = generateStarPositions(STAR_COUNT);

export function HeroSection({ onStartJourney }: HeroSectionProps): ReactElement {
  const handleStartJourney = useCallback(() => {
    trackJourneyStarted('hero');
    onStartJourney();
  }, [onStartJourney]);

  return (
    <section
      id="hero"
      className="relative min-h-screen night-sky-gradient overflow-hidden flex flex-col"
    >
      {/* Organic blob backgrounds */}
      <FloatingBlobs className="opacity-20" />

      {/* Aurora overlay - organic shape */}
      <motion.div
        className="absolute inset-0 aurora-gradient opacity-40"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(147, 112, 219, 0.3) 0%, rgba(0, 191, 255, 0.2) 50%, rgba(144, 238, 144, 0.2) 100%)',
            'linear-gradient(225deg, rgba(144, 238, 144, 0.2) 0%, rgba(147, 112, 219, 0.3) 50%, rgba(0, 191, 255, 0.2) 100%)',
            'linear-gradient(135deg, rgba(147, 112, 219, 0.3) 0%, rgba(0, 191, 255, 0.2) 50%, rgba(144, 238, 144, 0.2) 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Stars - varied sizes */}
      <div className="absolute inset-0">
        {starPositions.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Floating ornaments */}
      <FloatingOrnaments />

      {/* Flying sleigh */}
      <div className="absolute top-20 left-0 w-full">
        <AnimatedSleigh size="lg" />
      </div>

      {/* Main content - asymmetric layout */}
      <div className="flex-1 flex items-center z-10 px-4 pt-20">
        <div className="container mx-auto">
          {/* Asymmetric grid layout */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left side - offset content */}
            <div className="lg:col-span-7 lg:col-start-1 text-center lg:text-left">
              {/* Badge - tilted */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -5 }}
                animate={{ opacity: 1, x: 0, rotate: -2 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 organic-blob-2"
              >
                <motion.span
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-yellow-400 text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
                <span className="text-white/90 text-sm font-medium">
                  Powered by Vercel AI Gateway
                </span>
              </motion.div>

              {/* Title - staggered words */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 mb-2"
                >
                  Welcome to
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30, rotate: -3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="block text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-green-400 bg-clip-text text-transparent"
                  style={{ display: 'inline-block' }}
                >
                  Santa&apos;s Workshop
                </motion.span>
              </motion.div>

              {/* Subtitle - organic shape background */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative mb-10"
              >
                <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Let our magical AI elves help you find the{' '}
                  <span className="text-amber-300 font-semibold wavy-underline">
                    perfect gifts
                  </span>
                  ! Upload a photo, answer a few questions, and watch the magic happen.
                </p>
              </motion.div>

              {/* CTA Button - playful tilt */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                className="inline-block"
              >
                <Button
                  size="xl"
                  onClick={handleStartJourney}
                  className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-2xl shadow-red-500/40 organic-blob-1 px-8 py-6 text-lg"
                >
                  <Gift className="mr-3 h-6 w-6" />
                  Begin Your Magical Journey
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </div>

            {/* Right side - Countdown with organic positioning */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="lg:col-span-5 lg:col-start-8 hidden lg:block"
            >
              <div className="transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <ChristmasCountdown />
              </div>
            </motion.div>
          </div>

          {/* Mobile countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 lg:hidden"
          >
            <ChristmasCountdown />
          </motion.div>
        </div>
      </div>

      {/* Organic snow ground - multiple layered waves */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Back layer - softer wave */}
        <svg
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80 C 200 120 400 40 600 100 C 800 160 1000 60 1200 120 C 1400 180 1440 100 1440 100 L 1440 200 L 0 200 Z"
            fill="rgba(255,250,250,0.3)"
          />
        </svg>

        {/* Middle layer */}
        <svg
          viewBox="0 0 1440 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 C 150 30 300 90 500 50 C 700 10 850 80 1000 40 C 1150 0 1300 70 1440 30 L 1440 150 L 0 150 Z"
            fill="rgba(255,250,250,0.6)"
          />
        </svg>

        {/* Front layer - main snow */}
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50 C 120 80 240 20 400 60 C 560 100 680 30 800 70 C 920 110 1080 40 1200 80 C 1320 120 1440 60 1440 60 L 1440 120 L 0 120 Z"
            fill="#FFFAFA"
          />
        </svg>
      </div>

      {/* Scroll indicator - organic bounce */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <a
          href="#workshop"
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors group"
        >
          <span className="text-sm mb-2 group-hover:text-amber-300 transition-colors">
            Scroll to explore
          </span>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
