'use client';

import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ReindeerScene } from './reindeer-scenes';

// Hook to fetch the reindeer animations flag with timeout
function useReindeerAnimations() {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch('/api/flags/reindeer-animations', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => setEnhanced(data.enhanced ?? false))
      .catch(() => setEnhanced(false))
      .finally(() => clearTimeout(timeoutId));

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return enhanced;
}

export interface Reindeer {
  name: string;
  role: string;
  fact: string;
  specialPower: string;
  color?: string;
  animation?: 'glow' | 'speed' | 'dance' | 'prance' | 'think' | 'sparkle' | 'hearts' | 'stomp' | 'electric';
}

export const REINDEER_DATA: Reindeer[] = [
  {
    name: 'Rudolph',
    role: 'Lead Navigator',
    fact: 'His glowing red nose lights the way through the foggiest nights!',
    specialPower: 'Nose that glows bright enough to guide the sleigh',
    color: '#FF0000',
    animation: 'glow',
  },
  {
    name: 'Dasher',
    role: 'Speed Champion',
    fact: 'The fastest reindeer - can circle the globe in record time!',
    specialPower: 'Supersonic speed',
    animation: 'speed',
  },
  {
    name: 'Dancer',
    role: 'Aerial Acrobat',
    fact: 'Performs incredible mid-air maneuvers to avoid obstacles!',
    specialPower: 'Perfect balance and grace',
    animation: 'dance',
  },
  {
    name: 'Prancer',
    role: 'Morale Booster',
    fact: 'Keeps the team spirits high with their cheerful energy!',
    specialPower: 'Spreads joy and enthusiasm',
    animation: 'prance',
  },
  {
    name: 'Vixen',
    role: 'Strategist',
    fact: 'The clever one who plans the most efficient routes!',
    specialPower: 'Quick thinking and problem solving',
    animation: 'think',
  },
  {
    name: 'Comet',
    role: 'Streak of Light',
    fact: 'Leaves a beautiful trail of sparkles across the sky!',
    specialPower: 'Creates magical star trails',
    animation: 'sparkle',
  },
  {
    name: 'Cupid',
    role: 'Heart of the Team',
    fact: 'Brings love and warmth to every delivery!',
    specialPower: 'Spreads love and kindness',
    animation: 'hearts',
  },
  {
    name: 'Donner',
    role: 'Thunder Power',
    fact: 'The strongest reindeer - can pull through any storm!',
    specialPower: 'Incredible strength',
    animation: 'stomp',
  },
  {
    name: 'Blitzen',
    role: 'Lightning Fast',
    fact: 'Creates dazzling lightning effects with their antlers!',
    specialPower: 'Electric energy',
    animation: 'electric',
  },
];

interface ReindeerCardProps {
  reindeer: Reindeer;
  index?: number;
  className?: string;
}

export function ReindeerCard({
  reindeer,
  index = 0,
  className = '',
}: ReindeerCardProps): ReactElement {
  const isRudolph = reindeer.name === 'Rudolph';
  const enhancedAnimations = useReindeerAnimations();

  // Animation variants based on flag
  const hoverAnimation = enhancedAnimations
    ? { scale: 1.08, y: -10, rotate: [-1, 1, -1, 0], transition: { rotate: { repeat: 2, duration: 0.2 } } }
    : { scale: 1.03, y: -5 };

  const bobAnimation = enhancedAnimations
    ? { y: [-4, 4, -4], rotate: [-2, 2, -2] }
    : { y: [-2, 2, -2] };

  const bobTransition = enhancedAnimations
    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 3, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg p-6 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={hoverAnimation}
    >
      {/* Animated background scene - window into another dimension */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <ReindeerScene animation={reindeer.animation} />
      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent rounded-2xl" />

      {/* Reindeer SVG */}
      <div className="relative z-10 flex justify-center mb-4">
        <svg
          width="120"
          height="100"
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and filters */}
          <defs>
            {/* Fur gradient - warm brown tones */}
            <linearGradient id={`furGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A67C52" />
              <stop offset="50%" stopColor="#8B6914" />
              <stop offset="100%" stopColor="#6B4423" />
            </linearGradient>

            {/* Lighter fur for belly/face */}
            <linearGradient id={`lightFurGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C4A574" />
              <stop offset="100%" stopColor="#A67C52" />
            </linearGradient>

            {/* Antler gradient */}
            <linearGradient id={`antlerGrad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="50%" stopColor="#6B5344" />
              <stop offset="100%" stopColor="#4A3728" />
            </linearGradient>

            {/* Rudolph's nose glow */}
            <radialGradient id="noseGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF0000" />
              <stop offset="60%" stopColor="#CC0000" />
              <stop offset="100%" stopColor="#990000" />
            </radialGradient>

            {/* Soft shadow filter */}
            <filter id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.2" />
            </filter>

            {/* Glow filter for Rudolph */}
            <filter id="redGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main reindeer group with gentle bobbing */}
          <motion.g
            animate={bobAnimation}
            transition={bobTransition}
            filter={`url(#shadow-${index})`}
          >
            {/* Back legs */}
            <motion.g
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              style={{ transformOrigin: '35px 65px' }}
            >
              <path
                d="M32 65 L30 82 Q30 86 28 86 L32 86 Q34 86 34 82 L36 65"
                fill={`url(#furGrad-${index})`}
                stroke="#5D3A1A"
                strokeWidth="0.5"
              />
              {/* Hoof */}
              <ellipse cx="30" cy="87" rx="4" ry="2" fill="#2a2a2a" />
            </motion.g>

            <motion.g
              animate={{ rotate: [4, -4, 4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              style={{ transformOrigin: '48px 65px' }}
            >
              <path
                d="M45 65 L43 82 Q43 86 41 86 L45 86 Q47 86 47 82 L49 65"
                fill={`url(#furGrad-${index})`}
                stroke="#5D3A1A"
                strokeWidth="0.5"
              />
              <ellipse cx="43" cy="87" rx="4" ry="2" fill="#2a2a2a" />
            </motion.g>

            {/* Front legs */}
            <motion.g
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '58px 62px' }}
            >
              <path
                d="M55 62 L53 80 Q53 84 51 84 L55 84 Q57 84 57 80 L59 62"
                fill={`url(#furGrad-${index})`}
                stroke="#5D3A1A"
                strokeWidth="0.5"
              />
              <ellipse cx="53" cy="85" rx="4" ry="2" fill="#2a2a2a" />
            </motion.g>

            <motion.g
              animate={{ rotate: [4, -4, 4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '70px 62px' }}
            >
              <path
                d="M67 62 L65 80 Q65 84 63 84 L67 84 Q69 84 69 80 L71 62"
                fill={`url(#furGrad-${index})`}
                stroke="#5D3A1A"
                strokeWidth="0.5"
              />
              <ellipse cx="65" cy="85" rx="4" ry="2" fill="#2a2a2a" />
            </motion.g>

            {/* Body - organic oval shape */}
            <ellipse
              cx="52"
              cy="55"
              rx="32"
              ry="18"
              fill={`url(#furGrad-${index})`}
              stroke="#5D3A1A"
              strokeWidth="0.5"
            />

            {/* Belly highlight */}
            <ellipse
              cx="50"
              cy="60"
              rx="20"
              ry="10"
              fill={`url(#lightFurGrad-${index})`}
              opacity="0.6"
            />

            {/* Tail */}
            <motion.path
              d="M20 50 Q15 48 18 45 Q22 42 20 50"
              fill={`url(#lightFurGrad-${index})`}
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{ transformOrigin: '20px 48px' }}
            />

            {/* Neck */}
            <path
              d="M75 50 Q82 42 85 35"
              stroke={`url(#furGrad-${index})`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head */}
            <ellipse
              cx="90"
              cy="30"
              rx="16"
              ry="14"
              fill={`url(#furGrad-${index})`}
              stroke="#5D3A1A"
              strokeWidth="0.5"
            />

            {/* Muzzle/snout */}
            <ellipse
              cx="103"
              cy="35"
              rx="8"
              ry="6"
              fill={`url(#lightFurGrad-${index})`}
              stroke="#5D3A1A"
              strokeWidth="0.5"
            />

            {/* Ears */}
            <motion.ellipse
              cx="80"
              cy="18"
              rx="4"
              ry="8"
              fill={`url(#furGrad-${index})`}
              stroke="#5D3A1A"
              strokeWidth="0.5"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: '80px 22px' }}
            />
            <ellipse cx="80" cy="18" rx="2" ry="5" fill="#D4A574" opacity="0.6" />

            <motion.ellipse
              cx="100"
              cy="18"
              rx="4"
              ry="8"
              fill={`url(#furGrad-${index})`}
              stroke="#5D3A1A"
              strokeWidth="0.5"
              animate={{ rotate: [5, -5, 5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              style={{ transformOrigin: '100px 22px' }}
            />
            <ellipse cx="100" cy="18" rx="2" ry="5" fill="#D4A574" opacity="0.6" />

            {/* Antlers */}
            <g stroke={`url(#antlerGrad-${index})`} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Left antler */}
              <path d="M82 15 Q78 8 75 2" />
              <path d="M78 10 Q73 8 70 10" />
              <path d="M76 5 Q72 2 68 5" />

              {/* Right antler */}
              <path d="M98 15 Q102 8 105 2" />
              <path d="M102 10 Q107 8 110 10" />
              <path d="M104 5 Q108 2 112 5" />
            </g>

            {/* Eye */}
            <motion.g
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
            >
              <ellipse cx="93" cy="28" rx="4" ry="5" fill="#2a2a2a" />
              <ellipse cx="94" cy="26" rx="1.5" ry="2" fill="white" />
            </motion.g>

            {/* Eyebrow for expression */}
            <path
              d="M89 22 Q93 20 97 22"
              stroke="#5D3A1A"
              strokeWidth="1"
              fill="none"
            />

            {/* Nose */}
            {isRudolph ? (
              <motion.g filter="url(#redGlow)">
                <motion.circle
                  cx="110"
                  cy="36"
                  r="6"
                  fill="url(#noseGlow)"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                {/* Nose shine */}
                <circle cx="108" cy="34" r="2" fill="white" opacity="0.5" />
              </motion.g>
            ) : (
              <g>
                <ellipse cx="110" cy="36" rx="4" ry="3" fill="#2a2a2a" />
                <ellipse cx="108" cy="35" rx="1" ry="0.8" fill="#444" />
              </g>
            )}

            {/* Mouth - subtle smile */}
            <path
              d="M105 40 Q108 42 111 40"
              stroke="#5D3A1A"
              strokeWidth="1"
              fill="none"
            />

            {/* Chest fluff */}
            <path
              d="M72 45 Q75 52 72 58"
              stroke={`url(#lightFurGrad-${index})`}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Sparkles for Rudolph */}
          {isRudolph && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 8],
                    y: [0, -10 - i * 5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <path
                    d={`M${115 + i * 3} ${30 - i * 2} l2 0 l-2 2 l-2 -2 z`}
                    fill="#FFD700"
                  />
                </motion.g>
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Info */}
      <div className="relative z-10 text-center">
        <h3 className="font-bold text-xl text-gray-900 mb-1">
          {reindeer.name}
          {isRudolph && <span className="ml-2 text-red-500">*</span>}
        </h3>
        <p
          className="text-sm font-semibold mb-2"
          style={{ color: reindeer.color || '#228B22' }}
        >
          {reindeer.role}
        </p>
        <p className="text-sm text-gray-600 mb-3">{reindeer.fact}</p>
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-full">
          <span className="text-amber-600 text-xs font-medium">
            {reindeer.specialPower}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function ReindeerMini({
  reindeer,
  className = '',
}: {
  reindeer: Reindeer;
  className?: string;
}): ReactElement {
  const isRudolph = reindeer.name === 'Rudolph';

  return (
    <motion.div
      className={`flex items-center gap-3 p-3 bg-white/80 backdrop-blur rounded-xl ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
        {isRudolph ? (
          <motion.div
            className="w-4 h-4 rounded-full bg-red-500"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{ boxShadow: '0 0 10px #FF0000' }}
          />
        ) : (
          <span className="text-2xl">🦌</span>
        )}
      </div>
      <div>
        <p className="font-semibold text-gray-900">{reindeer.name}</p>
        <p className="text-xs text-gray-500">{reindeer.role}</p>
      </div>
    </motion.div>
  );
}
