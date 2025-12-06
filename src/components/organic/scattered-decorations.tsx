'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

// Individual decoration items
const decorations = {
  snowflake: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0L12 24M0 12L24 12M3.5 3.5L20.5 20.5M20.5 3.5L3.5 20.5M12 4L10 6L12 8L14 6L12 4M12 16L10 18L12 20L14 18L12 16M4 12L6 10L8 12L6 14L4 12M16 12L18 10L20 12L18 14L16 12" strokeWidth="1" stroke="currentColor" fill="none" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
  ornament: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="14" r="8" />
      <rect x="10" y="2" width="4" height="4" rx="1" />
      <path d="M12 6L12 8" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  candyCane: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M14.5 3C14.5 3 18 3 18 6.5C18 10 14 10 14 10L14 21" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  holly: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <ellipse cx="8" cy="14" rx="5" ry="8" transform="rotate(-30 8 14)" className="fill-green-600" />
      <ellipse cx="16" cy="14" rx="5" ry="8" transform="rotate(30 16 14)" className="fill-green-600" />
      <circle cx="12" cy="8" r="2.5" className="fill-red-600" />
      <circle cx="10" cy="10" r="2" className="fill-red-600" />
      <circle cx="14" cy="10" r="2" className="fill-red-600" />
    </svg>
  ),
  giftBox: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <rect x="3" y="8" width="18" height="13" rx="1" className="fill-red-500" />
      <rect x="2" y="5" width="20" height="4" rx="1" className="fill-red-600" />
      <rect x="10.5" y="5" width="3" height="16" className="fill-amber-400" />
      <path d="M12 5C12 5 12 2 9 2C6 2 6 5 9 5" stroke="currentColor" strokeWidth="2" className="stroke-amber-400" fill="none" />
      <path d="M12 5C12 5 12 2 15 2C18 2 18 5 15 5" stroke="currentColor" strokeWidth="2" className="stroke-amber-400" fill="none" />
    </svg>
  ),
};

interface ScatteredDecorationsProps {
  className?: string;
  density?: 'sparse' | 'medium' | 'dense';
  types?: Array<keyof typeof decorations>;
  colors?: string[];
}

export function ScatteredDecorations({
  className,
  density = 'medium',
  types = ['snowflake', 'star', 'ornament'],
  colors = ['text-white/20', 'text-red-300/30', 'text-amber-300/30', 'text-blue-200/20'],
}: ScatteredDecorationsProps): ReactElement {
  const counts = { sparse: 8, medium: 15, dense: 25 };
  const count = counts[density];

  // Generate random positions - using seeded values for consistency
  const items = Array.from({ length: count }, (_, i) => {
    const seed = i * 7919; // Prime number for pseudo-randomness
    return {
      id: i,
      type: types[seed % types.length],
      x: ((seed * 13) % 100),
      y: ((seed * 17) % 100),
      size: 12 + ((seed * 23) % 24),
      rotation: (seed * 31) % 360,
      delay: (i * 0.2) % 3,
      color: colors[seed % colors.length],
    };
  });

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={cn('absolute', item.color)}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: item.size,
            height: item.size,
          }}
          initial={{ opacity: 0, scale: 0, rotate: item.rotation }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: item.rotation + 10,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { delay: item.delay, duration: 0.5 },
            scale: { delay: item.delay, duration: 0.5 },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            y: { duration: 3 + (item.id % 2), repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {decorations[item.type]}
        </motion.div>
      ))}
    </div>
  );
}

// Floating ornaments specifically for hero sections
interface FloatingOrnamentsProps {
  className?: string;
}

export function FloatingOrnaments({ className }: FloatingOrnamentsProps): ReactElement {
  const ornaments = [
    { x: 5, y: 20, size: 40, color: 'text-red-400', delay: 0 },
    { x: 90, y: 15, size: 32, color: 'text-green-500', delay: 0.5 },
    { x: 15, y: 70, size: 28, color: 'text-amber-400', delay: 1 },
    { x: 85, y: 60, size: 36, color: 'text-blue-400', delay: 1.5 },
    { x: 50, y: 85, size: 24, color: 'text-purple-400', delay: 2 },
    { x: 75, y: 35, size: 30, color: 'text-pink-400', delay: 0.3 },
  ];

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {ornaments.map((orn, i) => (
        <motion.div
          key={i}
          className={cn('absolute', orn.color)}
          style={{
            left: `${orn.x}%`,
            top: `${orn.y}%`,
            width: orn.size,
            height: orn.size,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: orn.delay },
            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: orn.delay },
          }}
        >
          {decorations.ornament}
        </motion.div>
      ))}
    </div>
  );
}
