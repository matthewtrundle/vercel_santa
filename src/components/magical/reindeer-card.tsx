'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

export interface Reindeer {
  name: string;
  role: string;
  fact: string;
  specialPower: string;
  color?: string;
}

export const REINDEER_DATA: Reindeer[] = [
  {
    name: 'Rudolph',
    role: 'Lead Navigator',
    fact: 'His glowing red nose lights the way through the foggiest nights!',
    specialPower: 'Nose that glows bright enough to guide the sleigh',
    color: '#FF0000',
  },
  {
    name: 'Dasher',
    role: 'Speed Champion',
    fact: 'The fastest reindeer - can circle the globe in record time!',
    specialPower: 'Supersonic speed',
  },
  {
    name: 'Dancer',
    role: 'Aerial Acrobat',
    fact: 'Performs incredible mid-air maneuvers to avoid obstacles!',
    specialPower: 'Perfect balance and grace',
  },
  {
    name: 'Prancer',
    role: 'Morale Booster',
    fact: 'Keeps the team spirits high with their cheerful energy!',
    specialPower: 'Spreads joy and enthusiasm',
  },
  {
    name: 'Vixen',
    role: 'Strategist',
    fact: 'The clever one who plans the most efficient routes!',
    specialPower: 'Quick thinking and problem solving',
  },
  {
    name: 'Comet',
    role: 'Streak of Light',
    fact: 'Leaves a beautiful trail of sparkles across the sky!',
    specialPower: 'Creates magical star trails',
  },
  {
    name: 'Cupid',
    role: 'Heart of the Team',
    fact: 'Brings love and warmth to every delivery!',
    specialPower: 'Spreads love and kindness',
  },
  {
    name: 'Donner',
    role: 'Thunder Power',
    fact: 'The strongest reindeer - can pull through any storm!',
    specialPower: 'Incredible strength',
  },
  {
    name: 'Blitzen',
    role: 'Lightning Fast',
    fact: 'Creates dazzling lightning effects with their antlers!',
    specialPower: 'Electric energy',
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

  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg p-6 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-transparent rounded-bl-full opacity-50" />

      {/* Reindeer SVG */}
      <div className="flex justify-center mb-4">
        <svg
          width="100"
          height="80"
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body */}
          <motion.g
            animate={{ y: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ellipse cx="50" cy="50" rx="30" ry="20" fill="#8B4513" />

            {/* Head */}
            <circle cx="75" cy="35" r="15" fill="#A0522D" />

            {/* Ears */}
            <ellipse cx="65" cy="22" rx="4" ry="7" fill="#A0522D" />
            <ellipse cx="85" cy="22" rx="4" ry="7" fill="#A0522D" />

            {/* Antlers */}
            <g stroke="#5D3A1A" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M68 18 L65 5 L60 10" />
              <path d="M65 5 L62 0" />
              <path d="M82 18 L85 5 L90 10" />
              <path d="M85 5 L88 0" />
            </g>

            {/* Eye */}
            <motion.circle
              cx="78"
              cy="32"
              r="3"
              fill="#2a2a2a"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            />
            <circle cx="79" cy="31" r="1" fill="white" />

            {/* Nose */}
            {isRudolph ? (
              <motion.g>
                <motion.circle
                  cx="88"
                  cy="38"
                  r="6"
                  fill="#FF0000"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle
                  cx="88"
                  cy="38"
                  r="12"
                  fill="#FF0000"
                  opacity="0.3"
                  animate={{ r: [12, 16, 12], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.g>
            ) : (
              <circle cx="88" cy="38" r="4" fill="#2a2a2a" />
            )}

            {/* Legs */}
            <motion.g
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ transformOrigin: '35px 60px' }}
            >
              <rect x="30" y="60" width="5" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>
            <motion.g
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ transformOrigin: '45px 60px' }}
            >
              <rect x="42" y="60" width="5" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>
            <motion.g
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: '55px 60px' }}
            >
              <rect x="52" y="60" width="5" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>
            <motion.g
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: '65px 60px' }}
            >
              <rect x="62" y="60" width="5" height="18" fill="#5D3A1A" rx="2" />
            </motion.g>

            {/* Tail */}
            <motion.ellipse
              cx="20"
              cy="45"
              rx="5"
              ry="3"
              fill="#A0522D"
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ transformOrigin: '22px 45px' }}
            />
          </motion.g>
        </svg>
      </div>

      {/* Info */}
      <div className="text-center">
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
            ⚡ {reindeer.specialPower}
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
