'use client';

import type { ReactElement, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface GiftTagCardProps {
  children: ReactNode;
  className?: string;
  color?: 'red' | 'green' | 'gold' | 'white';
  tilt?: number;
  hover?: boolean;
}

const colorStyles = {
  red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
  green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  gold: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
  white: 'bg-gradient-to-br from-white to-gray-50 border-gray-200',
};

const holeColors = {
  red: 'border-red-300',
  green: 'border-green-300',
  gold: 'border-amber-300',
  white: 'border-gray-300',
};

export function GiftTagCard({
  children,
  className,
  color = 'white',
  tilt = 0,
  hover = true,
}: GiftTagCardProps): ReactElement {
  return (
    <motion.div
      className={cn(
        'relative border-2 shadow-lg',
        colorStyles[color],
        className
      )}
      style={{
        clipPath: 'polygon(0 8%, 50% 0, 100% 8%, 100% 100%, 0 100%)',
        transform: `rotate(${tilt}deg)`,
      }}
      whileHover={hover ? { scale: 1.02, rotate: tilt + 2 } : undefined}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* String hole */}
      <div
        className={cn(
          'absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-white/50',
          holeColors[color]
        )}
      />

      {/* Content */}
      <div className="pt-8 pb-6 px-6">
        {children}
      </div>
    </motion.div>
  );
}

// Ribbon banner for headings
interface RibbonBannerProps {
  children: ReactNode;
  className?: string;
  color?: 'red' | 'green' | 'gold';
}

const ribbonColors = {
  red: 'bg-gradient-to-r from-red-600 via-red-500 to-red-600',
  green: 'bg-gradient-to-r from-green-600 via-green-500 to-green-600',
  gold: 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500',
};

const ribbonEndColors = {
  red: 'border-t-red-700',
  green: 'border-t-green-700',
  gold: 'border-t-amber-600',
};

export function RibbonBanner({
  children,
  className,
  color = 'red',
}: RibbonBannerProps): ReactElement {
  return (
    <div className={cn('relative inline-block', className)}>
      {/* Left ribbon end */}
      <div
        className={cn(
          'absolute -left-4 top-0 w-0 h-0 border-t-[20px] border-r-[16px] border-r-transparent',
          ribbonEndColors[color]
        )}
      />
      <div
        className={cn(
          'absolute -left-4 bottom-0 w-4 h-3',
          ribbonColors[color],
          'opacity-80'
        )}
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
      />

      {/* Main ribbon */}
      <div
        className={cn(
          'px-8 py-2 text-white font-bold shadow-md',
          ribbonColors[color]
        )}
      >
        {children}
      </div>

      {/* Right ribbon end */}
      <div
        className={cn(
          'absolute -right-4 top-0 w-0 h-0 border-t-[20px] border-l-[16px] border-l-transparent',
          ribbonEndColors[color]
        )}
      />
      <div
        className={cn(
          'absolute -right-4 bottom-0 w-4 h-3',
          ribbonColors[color],
          'opacity-80'
        )}
        style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
      />
    </div>
  );
}

// Stocking shaped card
interface StockingCardProps {
  children: ReactNode;
  className?: string;
  color?: 'red' | 'green';
}

export function StockingCard({
  children,
  className,
  color = 'red',
}: StockingCardProps): ReactElement {
  const bgColor = color === 'red'
    ? 'bg-gradient-to-b from-red-500 to-red-600'
    : 'bg-gradient-to-b from-green-500 to-green-600';

  return (
    <div className={cn('relative', className)}>
      {/* Stocking cuff */}
      <div className="bg-white rounded-t-2xl p-4 border-b-4 border-gray-100">
        <div className="h-2 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full" />
      </div>

      {/* Stocking body */}
      <div
        className={cn('p-6 text-white', bgColor)}
        style={{
          borderRadius: '0 0 40% 20% / 0 0 30% 20%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Ornament shaped badge
interface OrnamentBadgeProps {
  children: ReactNode;
  className?: string;
  color?: 'red' | 'green' | 'gold' | 'blue';
}

const ornamentColors = {
  red: 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200',
  green: 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-200',
  gold: 'bg-gradient-to-br from-amber-300 to-amber-500 shadow-amber-200',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200',
};

export function OrnamentBadge({
  children,
  className,
  color = 'red',
}: OrnamentBadgeProps): ReactElement {
  return (
    <motion.div
      className={cn('relative inline-flex flex-col items-center', className)}
      whileHover={{ rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.5 }}
    >
      {/* Ornament cap */}
      <div className="w-6 h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-full" />

      {/* Hook */}
      <div className="w-4 h-4 border-2 border-gray-400 rounded-full -mt-1 bg-transparent" />

      {/* Ornament ball */}
      <div
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center text-white font-bold shadow-lg -mt-2',
          ornamentColors[color]
        )}
      >
        {/* Shine effect */}
        <div className="absolute top-2 left-3 w-4 h-4 bg-white/30 rounded-full blur-sm" />
        {children}
      </div>
    </motion.div>
  );
}
