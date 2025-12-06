'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { Gift, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChristmasCountdown } from '@/components/magical/christmas-countdown';
import { AnimatedSleigh } from '@/components/magical/animated-sleigh';
import { TwinklingLights } from '@/components/magical/twinkling-lights';

interface HeroSectionProps {
  onStartJourney: () => void;
}

// Pre-generate star positions to avoid calling Math.random during render
const STAR_COUNT = 50;
function generateStarPositions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 13 + 5) % 60}%`,
    duration: 2 + (i % 3),
    delay: (i % 5) * 0.4,
  }));
}

const starPositions = generateStarPositions(STAR_COUNT);

export function HeroSection({ onStartJourney }: HeroSectionProps): ReactElement {
  return (
    <section
      id="hero"
      className="relative min-h-screen night-sky-gradient overflow-hidden flex flex-col"
    >
      {/* Aurora overlay */}
      <div className="absolute inset-0 aurora-gradient opacity-30" />

      {/* Stars */}
      <div className="absolute inset-0">
        {starPositions.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Flying sleigh */}
      <div className="absolute top-20 left-0 w-full">
        <AnimatedSleigh size="lg" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center z-10 px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <span className="text-yellow-400">⭐</span>
            <span className="text-white/90 text-sm font-medium">
              Powered by AI Magic
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
              Santa&apos;s Workshop
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Let our magical AI elves help you find the perfect gifts! Upload a
            photo, answer a few questions, and watch the magic happen.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="mb-12"
          >
            <Button
              size="xl"
              onClick={onStartJourney}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/30 animate-float"
            >
              <Gift className="mr-2 h-5 w-5" />
              Begin Your Magical Journey
            </Button>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <ChristmasCountdown />
          </motion.div>
        </div>
      </div>

      {/* Twinkling lights at bottom */}
      <div className="absolute bottom-32 left-0 right-0">
        <TwinklingLights count={30} />
      </div>

      {/* Snow ground wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 Q 180 20 360 60 T 720 60 T 1080 60 T 1440 60 V 120 H 0 Z"
            fill="white"
          />
          <path
            d="M0 80 Q 180 50 360 80 T 720 80 T 1080 80 T 1440 80 V 120 H 0 Z"
            fill="#FFFAFA"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a
          href="#workshop"
          className="flex flex-col items-center text-white/60 hover:text-white transition-colors"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
}
