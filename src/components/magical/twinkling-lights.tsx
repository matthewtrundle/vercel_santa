'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

interface TwinklingLightsProps {
  count?: number;
  className?: string;
}

const lightColors = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#FFD700', // Gold
  '#0000FF', // Blue
  '#FF69B4', // Pink
  '#FFA500', // Orange
];

export function TwinklingLights({
  count = 20,
  className = '',
}: TwinklingLightsProps): ReactElement {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${count * 50} 60`}
        className="w-full h-16"
        preserveAspectRatio="none"
      >
        {/* Wire */}
        <path
          d={`M 0 30 Q ${count * 25} 50 ${count * 50} 30`}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />

        {/* Light bulbs */}
        {Array.from({ length: count }).map((_, i) => {
          const x = (i + 0.5) * (100 / count);
          const color = lightColors[i % lightColors.length];
          const delay = i * 0.15;

          return (
            <motion.g
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                delay,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              {/* Bulb glow */}
              <circle
                cx={`${x}%`}
                cy="35"
                r="12"
                fill={color}
                opacity="0.3"
                filter="blur(4px)"
              />
              {/* Bulb */}
              <circle
                cx={`${x}%`}
                cy="35"
                r="6"
                fill={color}
              />
              {/* Bulb cap */}
              <rect
                x={`${x - 0.8}%`}
                y="26"
                width="1.6%"
                height="4"
                fill="#2a2a2a"
                rx="1"
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

interface SingleLightProps {
  color?: string;
  size?: number;
  delay?: number;
  className?: string;
}

export function SingleLight({
  color = '#FFD700',
  size = 8,
  delay = 0,
  className = '',
}: SingleLightProps): ReactElement {
  return (
    <motion.div
      className={`rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}`,
      }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
