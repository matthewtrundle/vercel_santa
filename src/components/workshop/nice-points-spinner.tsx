'use client';

import type { ReactElement } from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NicePointsSpinnerProps {
  showCoal: boolean;
  onSpinComplete: (points: number) => void;
  isSpinning?: boolean;
}

// Nice-only segments (no coal variant)
const NICE_SEGMENTS = [
  { points: 50, label: '50', color: 'from-green-400 to-green-500', emoji: '🌟' },
  { points: 75, label: '75', color: 'from-blue-400 to-blue-500', emoji: '✨' },
  { points: 100, label: '100', color: 'from-purple-400 to-purple-500', emoji: '🎄' },
  { points: 125, label: '125', color: 'from-pink-400 to-pink-500', emoji: '🎁' },
  { points: 150, label: '150', color: 'from-red-400 to-red-500', emoji: '❄️' },
  { points: 175, label: '175', color: 'from-amber-400 to-amber-500', emoji: '🔔' },
  { points: 200, label: '200', color: 'from-emerald-400 to-emerald-500', emoji: '⭐' },
  { points: 250, label: '250', color: 'from-yellow-400 to-yellow-500', emoji: '🎅' },
];

// Coal variant segments (includes coal as "naughty" outcome)
const COAL_SEGMENTS = [
  { points: 25, label: '25', color: 'from-gray-600 to-gray-700', emoji: '🪨' },
  { points: 50, label: '50', color: 'from-green-400 to-green-500', emoji: '🌟' },
  { points: 75, label: '75', color: 'from-blue-400 to-blue-500', emoji: '✨' },
  { points: 100, label: '100', color: 'from-purple-400 to-purple-500', emoji: '🎄' },
  { points: 125, label: '125', color: 'from-pink-400 to-pink-500', emoji: '🎁' },
  { points: 150, label: '150', color: 'from-red-400 to-red-500', emoji: '❄️' },
  { points: 200, label: '200', color: 'from-emerald-400 to-emerald-500', emoji: '⭐' },
  { points: 250, label: '250', color: 'from-yellow-400 to-yellow-500', emoji: '🎅' },
];

export function NicePointsSpinner({
  showCoal,
  onSpinComplete,
  isSpinning: externalSpinning,
}: NicePointsSpinnerProps): ReactElement {
  const segments = showCoal ? COAL_SEGMENTS : NICE_SEGMENTS;
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ points: number; emoji: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / segments.length;

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Random number of full rotations (3-5) plus random segment
    const fullRotations = 3 + Math.floor(Math.random() * 3);
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    const segmentRotation = randomSegmentIndex * segmentAngle;

    // Add some randomness within the segment
    const withinSegmentOffset = Math.random() * (segmentAngle * 0.6) + (segmentAngle * 0.2);

    const totalRotation = rotation + (fullRotations * 360) + segmentRotation + withinSegmentOffset;

    setRotation(totalRotation);

    // Calculate which segment we'll land on
    const normalizedRotation = totalRotation % 360;
    const landingIndex = Math.floor(normalizedRotation / segmentAngle);
    const landedSegment = segments[segments.length - 1 - landingIndex] || segments[0];

    // Show result after spin animation
    setTimeout(() => {
      setIsSpinning(false);
      setResult({ points: landedSegment.points, emoji: landedSegment.emoji });
      setShowResult(true);

      // Callback after a brief celebration
      setTimeout(() => {
        onSpinComplete(landedSegment.points);
      }, 2000);
    }, 4000);
  }, [isSpinning, rotation, segments, segmentAngle, onSpinComplete]);

  // Handle external spinning state
  useEffect(() => {
    if (externalSpinning && !isSpinning) {
      spin();
    }
  }, [externalSpinning, isSpinning, spin]);

  return (
    <div className="flex flex-col items-center">
      {/* Wheel container */}
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-600 drop-shadow-lg" />
        </div>

        {/* Spinning wheel */}
        <motion.div
          ref={wheelRef}
          className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-amber-400"
          animate={{ rotate: rotation }}
          transition={{
            duration: 4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="relative w-full h-full">
            {segments.map((segment, index) => {
              const startAngle = index * segmentAngle;
              const midAngle = startAngle + segmentAngle / 2;

              return (
                <div
                  key={`${segment.points}-${index}`}
                  className={cn(
                    'absolute w-full h-full origin-center',
                  )}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + segmentAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + segmentAngle - 90) * Math.PI / 180)}%)`,
                  }}
                >
                  <div className={cn('w-full h-full bg-gradient-to-br', segment.color)} />
                </div>
              );
            })}

            {/* Segment labels */}
            {segments.map((segment, index) => {
              const angle = (index * segmentAngle) + (segmentAngle / 2) - 90;
              const radius = 100; // distance from center in pixels
              const x = 50 + (radius / 160) * 50 * Math.cos(angle * Math.PI / 180);
              const y = 50 + (radius / 160) * 50 * Math.sin(angle * Math.PI / 180);

              return (
                <div
                  key={`label-${segment.points}-${index}`}
                  className="absolute text-white font-bold text-sm drop-shadow-md flex flex-col items-center"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                  }}
                >
                  <span className="text-lg">{segment.emoji}</span>
                  <span>{segment.label}</span>
                </div>
              );
            })}

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-600 shadow-lg flex items-center justify-center">
              <Star className="w-8 h-8 text-amber-800" />
            </div>
          </div>
        </motion.div>

        {/* Glow effect while spinning */}
        {isSpinning && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-red-400/20"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>

      {/* Spin button */}
      {!showResult && (
        <Button
          onClick={spin}
          disabled={isSpinning}
          size="lg"
          className={cn(
            'mt-8 text-lg px-8 py-6 rounded-full font-bold',
            'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
            'shadow-lg hover:shadow-xl transition-all',
            isSpinning && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSpinning ? (
            <>
              <Sparkles className="w-5 h-5 mr-2 animate-spin" />
              Revealing your fate...
            </>
          ) : (
            <>
              <Gift className="w-5 h-5 mr-2" />
              Spin the Wheel!
            </>
          )}
        </Button>
      )}

      {/* Result display */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              {result.emoji}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-2xl font-bold text-gray-800 mb-2">
                You earned{' '}
                <span className="text-3xl bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                  {result.points}
                </span>{' '}
                Nice Points!
              </p>
              <p className="text-gray-600">
                {result.points >= 150
                  ? "You've been very nice this year!"
                  : result.points >= 100
                  ? "Santa is pleased with you!"
                  : result.points >= 50
                  ? "There's still time to be nicer!"
                  : "Uh oh... better start being nice!"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
