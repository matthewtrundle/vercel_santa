'use client';

import type { ReactElement } from 'react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeInSection } from '@/components/magical/parallax-section';

export function SleighSection(): ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sleighX = useTransform(scrollYProgress, [0, 1], ['-100%', '50%']);
  const cloudsY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <section
      id="sleigh"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-green-50 to-blue-50 overflow-hidden"
    >
      {/* Parallax clouds */}
      <motion.div className="absolute inset-0" style={{ y: cloudsY }}>
        <div className="absolute top-10 left-[10%] w-32 h-16 bg-white/60 rounded-full blur-xl" />
        <div className="absolute top-20 left-[30%] w-48 h-20 bg-white/50 rounded-full blur-xl" />
        <div className="absolute top-5 right-[20%] w-40 h-18 bg-white/55 rounded-full blur-xl" />
        <div className="absolute top-32 right-[10%] w-36 h-14 bg-white/45 rounded-full blur-xl" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🛷</span>
            <span className="text-red-700 text-sm font-medium">
              The Magic Vehicle
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive">Sleigh</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The legendary sleigh that travels around the entire world in just
            one magical night!
          </p>
        </FadeInSection>

        {/* Animated Sleigh */}
        <motion.div
          className="relative h-64 mb-16"
          style={{ x: sleighX }}
        >
          <svg
            viewBox="0 0 500 200"
            className="w-full max-w-2xl h-full mx-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sleigh body */}
            <motion.g
              animate={{ y: [-5, 5, -5], rotate: [-1, 1, -1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '250px 100px' }}
            >
              {/* Main body */}
              <path
                d="M 100 80 Q 120 60 200 60 L 380 60 Q 420 60 430 90 L 430 120 Q 420 140 380 140 L 150 140 Q 100 140 90 110 Z"
                fill="#C41E3A"
                stroke="#8B0000"
                strokeWidth="3"
              />

              {/* Gold trim */}
              <path
                d="M 110 85 Q 130 70 200 70 L 375 70 Q 405 70 415 90"
                fill="none"
                stroke="#FFD700"
                strokeWidth="4"
              />

              {/* Front curl */}
              <path
                d="M 90 120 Q 70 140 80 160 Q 90 170 110 165"
                fill="none"
                stroke="#FFD700"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Back */}
              <path
                d="M 420 80 Q 450 60 470 80 Q 480 100 460 120"
                fill="#C41E3A"
                stroke="#8B0000"
                strokeWidth="3"
              />

              {/* Runner */}
              <motion.path
                d="M 80 160 Q 100 180 180 175 L 400 175 Q 450 175 470 150"
                fill="none"
                stroke="#FFD700"
                strokeWidth="8"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Gift bag */}
              <ellipse cx="350" cy="75" rx="50" ry="40" fill="#8B4513" />
              <path
                d="M 310 45 Q 350 20 390 45"
                fill="none"
                stroke="#8B4513"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Gifts peeking out */}
              <rect x="320" y="50" width="20" height="20" fill="#FF69B4" rx="3" />
              <rect x="345" y="45" width="18" height="18" fill="#00CED1" rx="3" />
              <rect x="370" y="55" width="15" height="15" fill="#FFD700" rx="3" />

              {/* Santa */}
              <g transform="translate(180, 30)">
                <ellipse cx="40" cy="60" rx="35" ry="40" fill="#C41E3A" />
                <circle cx="40" cy="15" r="25" fill="#FFE4C4" />
                <path d="M 15 15 Q 40 -20 70 10 L 65 25 L 15 25 Z" fill="#C41E3A" />
                <circle cx="72" cy="5" r="10" fill="white" />
                <rect x="10" y="22" width="60" height="8" fill="white" rx="3" />
                <ellipse cx="40" cy="35" rx="20" ry="15" fill="white" />
              </g>
            </motion.g>

            {/* Magic trail */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.circle
                key={i}
                cx={80 - i * 15}
                cy={170 + Math.sin(i) * 5}
                r={5 - i * 0.5}
                fill="#FFD700"
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Sleigh facts */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: '⚡',
              title: 'Magic Speed',
              fact: 'Can travel faster than the speed of light using Christmas magic!',
              color: 'from-yellow-100 to-orange-100',
            },
            {
              icon: '🎒',
              title: 'Infinite Space',
              fact: 'The gift bag holds billions of presents through magic expansion!',
              color: 'from-purple-100 to-pink-100',
            },
            {
              icon: '✨',
              title: 'Never Breaks',
              fact: 'Made from enchanted wood that repairs itself instantly!',
              color: 'from-blue-100 to-cyan-100',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-center shadow-lg`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {item.icon}
              </motion.div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.fact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
