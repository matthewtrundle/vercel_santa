'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

export interface ElfCharacter {
  name: string;
  role: string;
  tool: string;
  color: string;
  description: string;
}

export const AI_ELVES: ElfCharacter[] = [
  {
    name: 'Pixel',
    role: 'Image Elf',
    tool: 'magnifying-glass',
    color: '#FF6B6B',
    description: 'Uses magical vision to spot interests in photos',
  },
  {
    name: 'Scribe',
    role: 'Profile Elf',
    tool: 'clipboard',
    color: '#4ECDC4',
    description: 'Builds the perfect gift profile from clues',
  },
  {
    name: 'Matcher',
    role: 'Gift Match Elf',
    tool: 'gift',
    color: '#FFE66D',
    description: 'Finds amazing gift matches from the warehouse',
  },
  {
    name: 'Quill',
    role: 'Narration Elf',
    tool: 'scroll',
    color: '#95E1D3',
    description: "Writes Santa's personal letter for the recipient",
  },
];

interface AnimatedElfProps {
  elf: ElfCharacter;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { width: 80, height: 100 },
  md: { width: 120, height: 150 },
  lg: { width: 180, height: 220 },
};

export function AnimatedElf({
  elf,
  size = 'md',
  showDetails = true,
  className = '',
}: AnimatedElfProps): ReactElement {
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Elf body */}
        <motion.g
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Legs */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '60px 120px' }}
          >
            <rect x="45" y="105" width="12" height="30" fill="#228B22" rx="4" />
            <rect x="63" y="105" width="12" height="30" fill="#228B22" rx="4" />
            {/* Shoes */}
            <ellipse cx="51" cy="138" rx="10" ry="6" fill="#8B4513" />
            <ellipse cx="69" cy="138" rx="10" ry="6" fill="#8B4513" />
            {/* Shoe curls */}
            <motion.circle
              cx="41"
              cy="135"
              r="5"
              fill="#8B4513"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx="79"
              cy="135"
              r="5"
              fill="#8B4513"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.g>

          {/* Body/Tunic */}
          <path
            d="M40 70 L35 110 L85 110 L80 70 Z"
            fill={elf.color}
          />
          {/* Belt */}
          <rect x="35" y="90" width="50" height="8" fill="#2a2a2a" rx="2" />
          <rect x="55" y="88" width="10" height="12" fill="#FFD700" rx="2" />

          {/* Arms */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '35px 75px' }}
          >
            <rect x="20" y="70" width="15" height="8" fill={elf.color} rx="3" />
            <circle cx="18" cy="74" r="6" fill="#FFE4C4" />
          </motion.g>
          <motion.g
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '85px 75px' }}
          >
            <rect x="85" y="70" width="15" height="8" fill={elf.color} rx="3" />
            <circle cx="102" cy="74" r="6" fill="#FFE4C4" />
          </motion.g>

          {/* Head */}
          <circle cx="60" cy="50" r="25" fill="#FFE4C4" />

          {/* Ears (pointy) */}
          <path d="M32 45 L25 35 L35 50 Z" fill="#FFE4C4" />
          <path d="M88 45 L95 35 L85 50 Z" fill="#FFE4C4" />

          {/* Face */}
          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <circle cx="50" cy="48" r="4" fill="#2a2a2a" />
            <circle cx="70" cy="48" r="4" fill="#2a2a2a" />
          </motion.g>
          {/* Eye highlights */}
          <circle cx="51" cy="47" r="1.5" fill="white" />
          <circle cx="71" cy="47" r="1.5" fill="white" />

          {/* Rosy cheeks */}
          <circle cx="42" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />
          <circle cx="78" cy="55" r="5" fill="#FFB6C1" opacity="0.5" />

          {/* Smile */}
          <motion.path
            d="M50 58 Q60 68 70 58"
            stroke="#2a2a2a"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ d: ['M50 58 Q60 68 70 58', 'M50 60 Q60 65 70 60', 'M50 58 Q60 68 70 58'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Hat */}
          <path
            d="M35 35 L60 -5 L85 35 Z"
            fill={elf.color}
          />
          {/* Hat brim */}
          <ellipse cx="60" cy="35" rx="28" ry="8" fill={elf.color} />
          {/* Hat pom-pom */}
          <motion.circle
            cx="60"
            cy="-5"
            r="8"
            fill="white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Tool based on elf type */}
        <g transform="translate(95, 55)">
          {elf.tool === 'magnifying-glass' && (
            <motion.g
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="0" cy="0" r="10" stroke={elf.color} strokeWidth="3" fill="none" />
              <line x1="7" y1="7" x2="15" y2="15" stroke="#8B4513" strokeWidth="3" />
            </motion.g>
          )}
          {elf.tool === 'clipboard' && (
            <g>
              <rect x="-8" y="-12" width="16" height="20" fill="#8B4513" rx="2" />
              <rect x="-6" y="-8" width="12" height="14" fill="white" />
              <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#ccc" strokeWidth="1" />
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#ccc" strokeWidth="1" />
              <line x1="-4" y1="4" x2="2" y2="4" stroke="#ccc" strokeWidth="1" />
            </g>
          )}
          {elf.tool === 'gift' && (
            <motion.g
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <rect x="-10" y="-8" width="20" height="16" fill="#C41E3A" rx="2" />
              <rect x="-2" y="-12" width="4" height="20" fill="#FFD700" />
              <rect x="-10" y="-2" width="20" height="4" fill="#FFD700" />
              <path d="M-2 -12 Q-8 -16 -6 -12" stroke="#FFD700" strokeWidth="2" fill="none" />
              <path d="M2 -12 Q8 -16 6 -12" stroke="#FFD700" strokeWidth="2" fill="none" />
            </motion.g>
          )}
          {elf.tool === 'scroll' && (
            <g>
              <rect x="-6" y="-15" width="12" height="24" fill="#F5DEB3" rx="1" />
              <ellipse cx="-6" cy="-15" rx="3" ry="4" fill="#D2B48C" />
              <ellipse cx="-6" cy="9" rx="3" ry="4" fill="#D2B48C" />
              <line x1="-3" y1="-10" x2="3" y2="-10" stroke="#8B4513" strokeWidth="1" />
              <line x1="-3" y1="-5" x2="3" y2="-5" stroke="#8B4513" strokeWidth="1" />
              <line x1="-3" y1="0" x2="2" y2="0" stroke="#8B4513" strokeWidth="1" />
            </g>
          )}
        </g>
      </svg>

      {showDetails && (
        <div className="text-center mt-3">
          <h3 className="font-bold text-lg" style={{ color: elf.color }}>
            {elf.name}
          </h3>
          <p className="text-sm font-medium text-gray-700">{elf.role}</p>
          <p className="text-xs text-gray-500 mt-1 max-w-[150px]">
            {elf.description}
          </p>
        </div>
      )}
    </motion.div>
  );
}
