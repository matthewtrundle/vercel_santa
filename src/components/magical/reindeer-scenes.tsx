'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import type { Reindeer } from './reindeer-card';

interface ReindeerSceneProps {
  animation?: Reindeer['animation'];
}

/**
 * Animated background scenes for reindeer cards.
 * Each animation type creates a unique visual effect like windows into other dimensions.
 */
export function ReindeerScene({ animation }: ReindeerSceneProps): ReactElement {
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
