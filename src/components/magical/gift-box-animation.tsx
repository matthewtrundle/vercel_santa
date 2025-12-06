'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

interface GiftBoxProps {
  color?: string;
  ribbonColor?: string;
  size?: 'sm' | 'md' | 'lg';
  isOpen?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 60,
  md: 100,
  lg: 150,
};

export function GiftBox({
  color = '#C41E3A',
  ribbonColor = '#FFD700',
  size = 'md',
  isOpen = false,
  className = '',
}: GiftBoxProps): ReactElement {
  const boxSize = sizeMap[size];

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      animate={isOpen ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <svg
        width={boxSize}
        height={boxSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Box lid */}
        <motion.g
          animate={
            isOpen
              ? { y: -20, rotate: -15, x: -10 }
              : { y: 0, rotate: 0, x: 0 }
          }
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '50px 30px' }}
        >
          <rect x="5" y="20" width="90" height="20" fill={color} rx="3" />
          {/* Lid ribbon horizontal */}
          <rect x="42" y="20" width="16" height="20" fill={ribbonColor} />
          {/* Bow */}
          <motion.g
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Left loop */}
            <ellipse cx="35" cy="18" rx="12" ry="8" fill={ribbonColor} />
            {/* Right loop */}
            <ellipse cx="65" cy="18" rx="12" ry="8" fill={ribbonColor} />
            {/* Center knot */}
            <circle cx="50" cy="18" r="6" fill={ribbonColor} />
            {/* Ribbon tails */}
            <path
              d="M44 22 Q38 35 32 30"
              stroke={ribbonColor}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M56 22 Q62 35 68 30"
              stroke={ribbonColor}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>
        </motion.g>

        {/* Box body */}
        <rect x="10" y="40" width="80" height="55" fill={color} rx="3" />
        {/* Ribbon vertical */}
        <rect x="42" y="40" width="16" height="55" fill={ribbonColor} />

        {/* Sparkles when open */}
        {isOpen && (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.circle
                key={i}
                cx={30 + i * 15}
                cy={30}
                r="3"
                fill="#FFD700"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [-10, -30],
                  x: [(i - 2) * 5, (i - 2) * 15],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </motion.div>
  );
}

interface GiftCategory {
  name: string;
  icon: string;
  color: string;
}

export const GIFT_CATEGORIES: GiftCategory[] = [
  { name: 'Toys', icon: '🧸', color: '#FF6B6B' },
  { name: 'Books', icon: '📚', color: '#4ECDC4' },
  { name: 'Games', icon: '🎮', color: '#9B59B6' },
  { name: 'Creative', icon: '🎨', color: '#FFE66D' },
  { name: 'Tech', icon: '🤖', color: '#3498DB' },
  { name: 'Outdoor', icon: '⚽', color: '#2ECC71' },
];

interface GiftCategoryCardProps {
  category: GiftCategory;
  index?: number;
  className?: string;
}

export function GiftCategoryCard({
  category,
  index = 0,
  className = '',
}: GiftCategoryCardProps): ReactElement {
  return (
    <motion.div
      className={`relative p-6 rounded-2xl bg-white shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundColor: category.color }}
      />

      <motion.div
        className="text-4xl mb-3"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {category.icon}
      </motion.div>

      <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>

      <GiftBox color={category.color} size="sm" className="absolute -bottom-2 -right-2 opacity-50" />
    </motion.div>
  );
}

export function FloatingGifts({ className = '' }: { className?: string }): ReactElement {
  const gifts = [
    { x: '10%', y: '20%', color: '#C41E3A', delay: 0 },
    { x: '80%', y: '15%', color: '#228B22', delay: 0.5 },
    { x: '20%', y: '70%', color: '#4169E1', delay: 1 },
    { x: '75%', y: '60%', color: '#FFD700', delay: 1.5 },
    { x: '50%', y: '40%', color: '#9370DB', delay: 2 },
  ];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {gifts.map((gift, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: gift.x, top: gift.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.8, 1, 0.8],
            y: [0, -20, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 4,
            delay: gift.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GiftBox color={gift.color} size="sm" />
        </motion.div>
      ))}
    </div>
  );
}
