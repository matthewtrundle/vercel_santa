'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

interface AnimatedSleighProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { width: 150, height: 80 },
  md: { width: 250, height: 130 },
  lg: { width: 400, height: 200 },
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
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Reindeer silhouettes (leading) */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          {/* Lead reindeer (Rudolph) */}
          <g transform="translate(10, 60)">
            {/* Body */}
            <ellipse cx="30" cy="25" rx="25" ry="15" fill="#8B4513" />
            {/* Head */}
            <circle cx="55" cy="18" r="12" fill="#8B4513" />
            {/* Antlers */}
            <path d="M50 8 L45 -5 L42 0 L38 -8" stroke="#5D3A1A" strokeWidth="3" fill="none" />
            <path d="M58 8 L63 -5 L66 0 L70 -8" stroke="#5D3A1A" strokeWidth="3" fill="none" />
            {/* Red nose */}
            <motion.circle
              cx="65"
              cy="18"
              r="5"
              fill="#FF0000"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {/* Glow effect */}
            <motion.circle
              cx="65"
              cy="18"
              r="10"
              fill="#FF0000"
              opacity="0.3"
              animate={{ r: [10, 15, 10], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            {/* Legs */}
            <motion.g
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.3, repeat: Infinity }}
              style={{ transformOrigin: '30px 35px' }}
            >
              <rect x="15" y="35" width="4" height="20" fill="#5D3A1A" rx="2" />
              <rect x="40" y="35" width="4" height="20" fill="#5D3A1A" rx="2" />
            </motion.g>
          </g>

          {/* Second row of reindeer */}
          <g transform="translate(80, 65)">
            <ellipse cx="20" cy="20" rx="18" ry="12" fill="#A0522D" />
            <circle cx="38" cy="15" r="9" fill="#A0522D" />
            <path d="M35 7 L32 -3 L29 2" stroke="#5D3A1A" strokeWidth="2" fill="none" />
            <path d="M42 7 L45 -3 L48 2" stroke="#5D3A1A" strokeWidth="2" fill="none" />
            <motion.g
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              style={{ transformOrigin: '20px 28px' }}
            >
              <rect x="10" y="28" width="3" height="15" fill="#5D3A1A" rx="1" />
              <rect x="28" y="28" width="3" height="15" fill="#5D3A1A" rx="1" />
            </motion.g>
          </g>
        </motion.g>

        {/* Reins */}
        <path
          d="M 70 75 Q 120 85 160 95"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 130 80 Q 150 88 160 95"
          stroke="#8B4513"
          strokeWidth="2"
          fill="none"
        />

        {/* Sleigh body */}
        <motion.g
          animate={{ y: [-3, 3, -3], rotate: [-1, 1, -1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '280px 130px' }}
        >
          {/* Main sleigh body */}
          <path
            d="M 160 90 Q 180 70 240 70 L 340 70 Q 380 70 390 100 L 390 130 Q 380 150 340 150 L 200 150 Q 160 150 150 120 Z"
            fill="#C41E3A"
            stroke="#8B0000"
            strokeWidth="3"
          />

          {/* Gold trim */}
          <path
            d="M 165 95 Q 185 80 240 80 L 335 80 Q 365 80 375 100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
          />

          {/* Sleigh runner */}
          <motion.path
            d="M 140 160 Q 160 180 200 175 L 360 175 Q 400 175 410 155"
            fill="none"
            stroke="#FFD700"
            strokeWidth="6"
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />

          {/* Sleigh runner curl */}
          <motion.path
            d="M 140 160 Q 130 150 140 140"
            fill="none"
            stroke="#FFD700"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Gift sack */}
          <ellipse cx="320" cy="90" rx="45" ry="35" fill="#8B4513" />
          <path
            d="M 290 60 Q 320 40 350 60"
            fill="none"
            stroke="#8B4513"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Gifts peeking out */}
          <rect x="300" y="65" width="15" height="15" fill="#FF69B4" rx="2" />
          <rect x="320" y="60" width="12" height="12" fill="#00CED1" rx="2" />
          <rect x="335" y="68" width="10" height="10" fill="#FFD700" rx="2" />

          {/* Santa silhouette */}
          <g transform="translate(200, 50)">
            {/* Body */}
            <ellipse cx="30" cy="50" rx="25" ry="30" fill="#C41E3A" />
            {/* Head */}
            <circle cx="30" cy="15" r="18" fill="#FFE4C4" />
            {/* Hat */}
            <path
              d="M 15 15 Q 30 -15 50 10 L 45 20 L 15 20 Z"
              fill="#C41E3A"
            />
            <circle cx="52" cy="8" r="6" fill="white" />
            {/* Hat brim */}
            <rect x="10" y="18" width="40" height="5" fill="white" rx="2" />
            {/* Beard */}
            <ellipse cx="30" cy="30" rx="15" ry="12" fill="white" />
          </g>
        </motion.g>

        {/* Sparkle trail */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            cx={150 - i * 25}
            cy={140 + Math.sin(i) * 10}
            r={4 - i * 0.5}
            fill="#FFD700"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
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
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <AnimatedSleigh size="lg" />
    </motion.div>
  );
}
