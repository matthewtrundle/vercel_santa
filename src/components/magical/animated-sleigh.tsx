'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

interface AnimatedSleighProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 180, height: 100 },
  md: { width: 300, height: 160 },
  lg: { width: 480, height: 250 },
};

export function AnimatedSleigh({
  className = '',
  size = 'md',
}: AnimatedSleighProps): ReactElement {
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ x: '-100%' }}
      animate={{ x: '100vw' }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 480 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definitions for gradients and filters */}
        <defs>
          {/* Sleigh body gradient */}
          <linearGradient id="sleighGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Gold metallic gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Reindeer fur gradient */}
          <linearGradient id="furGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>

          {/* Gift bag gradient */}
          <linearGradient id="bagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Glow filter for Rudolph's nose */}
          <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Sparkle glow */}
          <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Stars in background */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={50 + i * 55}
            cy={20 + (i % 3) * 15}
            r={1.5}
            fill="white"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}

        {/* Reindeer team */}
        <motion.g
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Lead reindeer (Rudolph) */}
          <g transform="translate(15, 70)">
            {/* Body with gradient */}
            <ellipse cx="35" cy="30" rx="28" ry="18" fill="url(#furGradient)" />
            {/* Belly highlight */}
            <ellipse cx="35" cy="35" rx="20" ry="10" fill="#B8860B" opacity="0.3" />
            {/* Head */}
            <circle cx="62" cy="22" r="14" fill="url(#furGradient)" />
            {/* Inner ear */}
            <ellipse cx="52" cy="12" rx="3" ry="6" fill="#A0522D" />
            <ellipse cx="52" cy="12" rx="2" ry="4" fill="#DEB887" opacity="0.5" />
            {/* Eye */}
            <circle cx="67" cy="18" r="3" fill="#1a1a1a" />
            <circle cx="68" cy="17" r="1" fill="white" />
            {/* Antlers - more detailed */}
            <path d="M52 10 L48 -5 L44 2 L40 -10 L38 -5" stroke="#5D3A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M60 10 L64 -5 L68 2 L72 -10 L74 -5" stroke="#5D3A1A" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Rudolph's glowing nose */}
            <motion.g filter="url(#redGlow)">
              <motion.circle
                cx="74"
                cy="24"
                r="6"
                fill="#EF4444"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </motion.g>
            {/* Nose highlight */}
            <circle cx="72" cy="22" r="2" fill="#FCA5A5" opacity="0.6" />
            {/* Harness */}
            <path d="M20 25 Q 35 20 50 25" stroke="#DC2626" strokeWidth="3" fill="none" />
            <circle cx="35" cy="22" r="4" fill="url(#goldGradient)" />
            {/* Animated legs */}
            <motion.g
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 0.25, repeat: Infinity }}
              style={{ transformOrigin: '25px 42px' }}
            >
              <rect x="20" y="42" width="5" height="22" fill="#5D3A1A" rx="2" />
              <ellipse cx="22.5" cy="64" rx="4" ry="2" fill="#3D2512" />
            </motion.g>
            <motion.g
              animate={{ rotate: [8, -8, 8] }}
              transition={{ duration: 0.25, repeat: Infinity }}
              style={{ transformOrigin: '45px 42px' }}
            >
              <rect x="42" y="42" width="5" height="22" fill="#5D3A1A" rx="2" />
              <ellipse cx="44.5" cy="64" rx="4" ry="2" fill="#3D2512" />
            </motion.g>
          </g>

          {/* Second reindeer pair */}
          <g transform="translate(95, 75)">
            <ellipse cx="25" cy="25" rx="22" ry="14" fill="url(#furGradient)" />
            <circle cx="46" cy="18" r="11" fill="url(#furGradient)" />
            <path d="M40 10 L37 0 L34 5" stroke="#5D3A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M50 10 L53 0 L56 5" stroke="#5D3A1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="52" cy="20" r="3" fill="#2a2a2a" />
            <path d="M10 20 Q 25 15 40 20" stroke="#DC2626" strokeWidth="2.5" fill="none" />
            <motion.g
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 0.25, repeat: Infinity, delay: 0.05 }}
              style={{ transformOrigin: '18px 35px' }}
            >
              <rect x="14" y="35" width="4" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>
            <motion.g
              animate={{ rotate: [6, -6, 6] }}
              transition={{ duration: 0.25, repeat: Infinity, delay: 0.05 }}
              style={{ transformOrigin: '35px 35px' }}
            >
              <rect x="32" y="35" width="4" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>
          </g>

          {/* Third reindeer (partial, behind) */}
          <g transform="translate(145, 80)" opacity="0.85">
            <ellipse cx="20" cy="20" rx="18" ry="12" fill="#8B4513" />
            <circle cx="38" cy="15" r="9" fill="#8B4513" />
            <path d="M33 8 L31 0" stroke="#5D3A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M42 8 L44 0" stroke="#5D3A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </motion.g>

        {/* Reins - curved and connected */}
        <path
          d="M 90 95 Q 140 105 190 115"
          stroke="#8B4513"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="8,4"
        />
        <path
          d="M 150 100 Q 175 108 190 115"
          stroke="#8B4513"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="8,4"
        />

        {/* Main sleigh group */}
        <motion.g
          filter="url(#shadow)"
          animate={{ y: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '320px 150px' }}
        >
          {/* Sleigh body - enhanced */}
          <path
            d="M 190 105 Q 215 80 280 80 L 400 80 Q 445 80 455 115 L 455 150 Q 445 175 395 175 L 230 175 Q 185 175 180 140 Z"
            fill="url(#sleighGradient)"
            stroke="#7F1D1D"
            strokeWidth="3"
          />

          {/* Sleigh interior shadow */}
          <path
            d="M 200 110 Q 220 90 280 90 L 390 90 Q 425 90 435 115 L 435 145 Q 428 165 390 165 L 240 165 Q 205 165 195 140 Z"
            fill="#991B1B"
            opacity="0.4"
          />

          {/* Gold trim - top */}
          <path
            d="M 195 110 Q 220 88 280 88 L 395 88 Q 430 88 440 110"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Gold trim - decorative swirls */}
          <path
            d="M 210 130 Q 220 120 235 130 Q 250 140 265 130"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Sleigh side panel decoration */}
          <rect x="250" y="120" width="120" height="35" rx="5" fill="#7F1D1D" opacity="0.5" />
          <path
            d="M 260 137 L 280 127 L 300 137 L 320 127 L 340 137 L 360 127"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
          />

          {/* Sleigh runner - enhanced */}
          <motion.g
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            <path
              d="M 165 185 Q 190 210 240 205 L 420 205 Q 470 205 480 180"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Runner curl */}
            <path
              d="M 165 185 Q 150 170 165 155 Q 175 145 180 155"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Runner highlight */}
            <path
              d="M 175 185 Q 195 205 240 200 L 410 200"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="2"
              opacity="0.6"
            />
          </motion.g>

          {/* Gift sack - enhanced */}
          <ellipse cx="380" cy="105" rx="50" ry="40" fill="url(#bagGradient)" />
          <ellipse cx="380" cy="100" rx="45" ry="35" fill="#92400E" />
          {/* Sack tie */}
          <path
            d="M 345 65 Q 380 45 415 65"
            fill="none"
            stroke="#78350F"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Sack highlight */}
          <ellipse cx="365" cy="90" rx="15" ry="20" fill="#A0522D" opacity="0.4" />

          {/* Gifts peeking out - more detailed */}
          <g>
            <rect x="355" y="70" width="18" height="18" fill="#EC4899" rx="3" />
            <path d="M 355 79 L 373 79 M 364 70 L 364 88" stroke="#FDF2F8" strokeWidth="3" />
            <rect x="377" y="62" width="15" height="15" fill="#06B6D4" rx="3" />
            <path d="M 377 69.5 L 392 69.5 M 384.5 62 L 384.5 77" stroke="#ECFEFF" strokeWidth="2" />
            <rect x="395" y="72" width="12" height="12" fill="#FBBF24" rx="2" />
            <path d="M 395 78 L 407 78 M 401 72 L 401 84" stroke="#FEF3C7" strokeWidth="2" />
          </g>

          {/* Santa - more detailed */}
          <g transform="translate(230, 55)">
            {/* Body */}
            <ellipse cx="35" cy="60" rx="30" ry="35" fill="#DC2626" />
            {/* Coat trim */}
            <ellipse cx="35" cy="85" rx="28" ry="8" fill="white" />
            {/* Belt */}
            <rect x="10" y="55" width="50" height="10" fill="#1a1a1a" />
            <rect x="28" y="52" width="14" height="16" rx="2" fill="url(#goldGradient)" />
            {/* Head */}
            <circle cx="35" cy="18" r="20" fill="#FFDAB9" />
            {/* Cheeks */}
            <circle cx="25" cy="22" r="5" fill="#FCA5A5" opacity="0.5" />
            <circle cx="45" cy="22" r="5" fill="#FCA5A5" opacity="0.5" />
            {/* Eyes */}
            <circle cx="28" cy="15" r="2" fill="#1a1a1a" />
            <circle cx="42" cy="15" r="2" fill="#1a1a1a" />
            {/* Nose */}
            <circle cx="35" cy="22" r="4" fill="#E57373" />
            {/* Hat */}
            <path
              d="M 15 15 Q 35 -20 60 12 L 55 22 L 15 22 Z"
              fill="#DC2626"
            />
            {/* Hat trim */}
            <rect x="10" y="20" width="50" height="8" fill="white" rx="4" />
            {/* Hat pom-pom */}
            <motion.circle
              cx="62"
              cy="8"
              r="8"
              fill="white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Beard */}
            <ellipse cx="35" cy="38" rx="18" ry="15" fill="white" />
            <ellipse cx="35" cy="45" rx="12" ry="10" fill="#F5F5F5" />
            {/* Arm waving */}
            <motion.g
              animate={{ rotate: [-5, 15, -5] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ transformOrigin: '60px 50px' }}
            >
              <ellipse cx="72" cy="45" rx="12" ry="8" fill="#DC2626" />
              <circle cx="82" cy="42" r="6" fill="#FFDAB9" />
            </motion.g>
          </g>
        </motion.g>

        {/* Enhanced sparkle trail */}
        {[...Array(12)].map((_, i) => (
          <motion.g key={`sparkle-${i}`}>
            <motion.circle
              cx={175 - i * 12}
              cy={175 + Math.sin(i * 0.8) * 15}
              r={5 - i * 0.3}
              fill="#FCD34D"
              filter="url(#sparkleGlow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.2,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            />
            {/* Tiny star shapes */}
            {i % 2 === 0 && (
              <motion.path
                d={`M ${170 - i * 12} ${185 + Math.cos(i) * 10} l 2 -5 l 2 5 l -5 -3 l 6 0 z`}
                fill="#FDE68A"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0], rotate: [0, 180, 360] }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              />
            )}
          </motion.g>
        ))}

        {/* Snow particles */}
        {[...Array(6)].map((_, i) => (
          <motion.circle
            key={`snow-${i}`}
            cx={100 + i * 70}
            cy={30}
            r={2}
            fill="white"
            opacity={0.8}
            initial={{ y: 0 }}
            animate={{ y: 220, x: [0, 10, -10, 0] }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

export function FloatingSleigh({ className = '' }: { className?: string }): ReactElement {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [-15, 15, -15],
        rotate: [-3, 3, -3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <AnimatedSleigh size="lg" />
    </motion.div>
  );
}

export function StaticSleighIllustration({ className = '' }: { className?: string }): ReactElement {
  return (
    <div className={className}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-md mx-auto"
      >
        <defs>
          <linearGradient id="staticSleighGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="staticGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>

        {/* Simple elegant sleigh */}
        <path
          d="M 80 80 Q 100 60 150 60 L 300 60 Q 340 60 350 90 L 350 120 Q 340 145 300 145 L 120 145 Q 85 145 75 115 Z"
          fill="url(#staticSleighGrad)"
          stroke="#7F1D1D"
          strokeWidth="2"
        />
        <path
          d="M 60 155 Q 80 180 130 175 L 320 175 Q 370 175 380 150"
          fill="none"
          stroke="url(#staticGoldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 60 155 Q 45 140 60 125"
          fill="none"
          stroke="url(#staticGoldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Gift hint */}
        <rect x="260" y="75" width="30" height="30" fill="#EC4899" rx="4" />
        <path d="M 260 90 L 290 90 M 275 75 L 275 105" stroke="white" strokeWidth="3" />
      </svg>
    </div>
  );
}
