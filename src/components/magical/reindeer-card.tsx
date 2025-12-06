'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';

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

// Unique scene backgrounds for each reindeer - like windows into other dimensions
function ReindeerScene({ animation }: { animation?: Reindeer['animation']; index: number }): ReactElement {
  switch (animation) {
    case 'glow':
      // Foggy night with glowing aurora
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 overflow-hidden">
          {/* Fog layers */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Stars */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ left: `${10 + i * 12}%`, top: `${10 + (i % 3) * 15}%` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          {/* Red glow from nose */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      );

    case 'speed':
      // Racing blur with speed lines
      return (
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 overflow-hidden">
          {/* Speed lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-white/60 rounded-full"
              style={{
                top: `${20 + i * 12}%`,
                left: '-20%',
                width: `${40 + i * 10}%`
              }}
              animate={{ x: ['0%', '150%'] }}
              transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity, ease: 'linear' }}
            />
          ))}
          {/* Blur effect */}
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>
      );

    case 'dance':
      // Dance floor with disco lights
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600 via-pink-500 to-purple-600 overflow-hidden">
          {/* Disco lights */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 rounded-full blur-lg"
              style={{
                left: `${10 + i * 20}%`,
                top: '20%',
                background: ['#FF69B4', '#00BFFF', '#FFD700', '#FF6347', '#9370DB'][i],
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                y: [0, 30, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          {/* Dance floor tiles */}
          <div className="absolute bottom-0 left-0 right-0 h-8 grid grid-cols-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="h-full"
                style={{ background: i % 2 === 0 ? '#fff' : '#ddd' }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
      );

    case 'prance':
      // Flower meadow with bouncing butterflies
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-green-300 via-emerald-400 to-green-500 overflow-hidden">
          {/* Grass */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-600" />
          {/* Flowers */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              style={{ left: `${5 + i * 16}%`, bottom: '10%' }}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
            >
              {['🌸', '🌼', '🌺', '🌷', '🌻', '💐'][i]}
            </motion.div>
          ))}
          {/* Butterflies */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute text-sm"
              style={{ left: `${20 + i * 25}%`, top: '30%' }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
              }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            >
              🦋
            </motion.div>
          ))}
        </div>
      );

    case 'think':
      // Night sky with constellations (map/navigation theme)
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M 20 20 L 40 35 L 70 25 L 90 45"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path
              d="M 60 60 L 80 50 L 100 70"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
            />
          </svg>
          {/* Stars */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full"
              style={{ left: `${(i * 11) % 90 + 5}%`, top: `${(i * 13) % 70 + 10}%` }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
          {/* Thought bubble */}
          <motion.div
            className="absolute top-2 right-2 text-2xl"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💭
          </motion.div>
        </div>
      );

    case 'sparkle':
      // Night sky with shooting stars and sparkle trails
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 overflow-hidden">
          {/* Stars background */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{ left: `${(i * 9) % 95}%`, top: `${(i * 11) % 80}%` }}
            />
          ))}
          {/* Shooting stars */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`shoot-${i}`}
              className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-white to-yellow-200"
              style={{ top: `${20 + i * 25}%`, right: '100%' }}
              animate={{ x: [0, 400], opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`spark-${i}`}
              className="absolute text-yellow-300"
              style={{ left: `${15 + i * 18}%`, top: `${20 + (i % 3) * 20}%` }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      );

    case 'hearts':
      // Romantic sunset with floating hearts
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500 overflow-hidden">
          {/* Sunset clouds */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-orange-200/50 to-transparent" />
          {/* Floating hearts */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-lg"
              style={{
                left: `${10 + i * 15}%`,
                bottom: '-10%',
              }}
              animate={{
                y: [0, -150],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.8],
              }}
              transition={{
                duration: 4,
                delay: i * 0.8,
                repeat: Infinity,
              }}
            >
              {['❤️', '💕', '💖', '💗', '💝', '💘'][i]}
            </motion.div>
          ))}
        </div>
      );

    case 'stomp':
      // Stormy mountain with thunder
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-800 overflow-hidden">
          {/* Mountains */}
          <svg className="absolute bottom-0 w-full h-3/4" viewBox="0 0 100 75" preserveAspectRatio="none">
            <polygon points="0,75 20,30 40,75" fill="#374151" />
            <polygon points="30,75 50,20 70,75" fill="#4B5563" />
            <polygon points="55,75 80,35 100,75" fill="#374151" />
          </svg>
          {/* Storm clouds */}
          <motion.div
            className="absolute top-5 left-1/4 w-20 h-10 bg-slate-500 rounded-full blur-sm"
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Lightning flash */}
          <motion.div
            className="absolute inset-0 bg-white"
            animate={{ opacity: [0, 0, 0, 0.5, 0, 0, 0, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 0.55, 0.6, 0.9, 1] }}
          />
          {/* Ground shake indicator */}
          <motion.div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-amber-600/50 rounded"
            animate={{ scaleX: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>
      );

    case 'electric':
      // Electric storm with lightning bolts
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
          {/* Electric arcs */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 bg-cyan-400"
              style={{
                left: `${20 + i * 20}%`,
                top: '20%',
                height: '60%',
                filter: 'blur(1px)',
              }}
              animate={{
                opacity: [0, 1, 0, 1, 0],
                scaleY: [0.8, 1.2, 0.9, 1.1, 0.8],
              }}
              transition={{ duration: 0.3, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
            />
          ))}
          {/* Electric sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`elec-${i}`}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 bg-cyan-500/10"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </div>
      );

    default:
      // Default gentle snowy scene
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent opacity-50 rounded-bl-full" />
      );
  }
}

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
      {/* Animated background scene - window into another dimension */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <ReindeerScene animation={reindeer.animation} index={index} />
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
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
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
