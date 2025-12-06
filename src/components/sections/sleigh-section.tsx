'use client';

import type { ReactElement } from 'react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Zap, Package, Sparkles } from 'lucide-react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { WavyDivider } from '@/components/organic/snow-drift';
import { RibbonBanner, StockingCard } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';

// Sleigh facts with Lucide icons
const SLEIGH_FACTS = [
  {
    title: 'Magic Speed',
    fact: 'Can travel faster than the speed of light using Christmas magic!',
    icon: Zap,
    color: 'red' as const,
    tilt: -2,
  },
  {
    title: 'Infinite Space',
    fact: 'The gift bag holds billions of presents through magic expansion!',
    icon: Package,
    color: 'green' as const,
    tilt: 3,
  },
  {
    title: 'Never Breaks',
    fact: 'Made from enchanted wood that repairs itself instantly!',
    icon: Sparkles,
    color: 'red' as const,
    tilt: -1,
  },
];

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
      className="relative py-24 bg-gradient-to-b from-green-50 via-cyan-50/50 to-blue-50 overflow-hidden"
    >
      {/* Scattered decorations */}
      <ScatteredDecorations density="sparse" types={['star', 'snowflake']} />

      {/* Top wavy divider */}
      <WavyDivider className="absolute top-0 left-0 right-0" color="fill-green-50" />

      {/* Parallax clouds - organic blob shapes */}
      <motion.div className="absolute inset-0" style={{ y: cloudsY }}>
        <motion.div
          className="absolute top-10 left-[10%] w-40 h-20 bg-white/60 organic-blob-1 blur-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-20 left-[30%] w-56 h-24 bg-white/50 organic-blob-2 blur-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-8 right-[20%] w-44 h-20 bg-white/55 organic-blob-3 blur-lg"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-32 right-[10%] w-36 h-16 bg-white/45 organic-blob-4 blur-lg"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          {/* Ribbon banner */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <RibbonBanner color="red">
              The Magic Vehicle
            </RibbonBanner>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive wavy-underline">Sleigh</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The legendary sleigh that travels around the entire world in just
            one magical night!
          </p>
        </FadeInSection>

        {/* Animated Sleigh with organic movement */}
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
              {/* Main body - more organic curves */}
              <path
                d="M 100 80 Q 115 55 200 55 Q 290 50 380 55 Q 425 55 435 90 Q 440 120 425 140 Q 400 150 380 145 L 150 145 Q 95 145 85 110 Q 80 90 100 80 Z"
                fill="#C41E3A"
                stroke="#8B0000"
                strokeWidth="3"
              />

              {/* Gold trim - wavy */}
              <path
                d="M 105 82 Q 125 65 200 62 Q 290 58 375 65 Q 410 68 420 88"
                fill="none"
                stroke="#FFD700"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Front curl - more organic */}
              <path
                d="M 85 115 Q 60 135 70 160 Q 80 175 105 172 Q 115 170 110 155"
                fill="none"
                stroke="#FFD700"
                strokeWidth="9"
                strokeLinecap="round"
              />

              {/* Back - organic curve */}
              <path
                d="M 425 78 Q 455 55 478 78 Q 490 105 465 125"
                fill="#C41E3A"
                stroke="#8B0000"
                strokeWidth="3"
              />

              {/* Runner - organic wave */}
              <motion.path
                d="M 75 162 Q 95 185 180 180 Q 300 178 400 180 Q 455 180 478 152"
                fill="none"
                stroke="#FFD700"
                strokeWidth="9"
                strokeLinecap="round"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Gift bag - organic blob shape */}
              <ellipse cx="350" cy="72" rx="52" ry="42" fill="#8B4513" />
              <path
                d="M 308 42 Q 350 15 392 42"
                fill="none"
                stroke="#8B4513"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Gifts peeking out - organic shapes */}
              <rect x="318" y="48" width="22" height="22" fill="#FF69B4" rx="5" transform="rotate(-5, 329, 59)" />
              <rect x="343" y="42" width="20" height="20" fill="#00CED1" rx="5" transform="rotate(3, 353, 52)" />
              <rect x="368" y="52" width="17" height="17" fill="#FFD700" rx="4" transform="rotate(-2, 376, 60)" />

              {/* Santa - more playful */}
              <g transform="translate(178, 28)">
                <ellipse cx="42" cy="62" rx="38" ry="42" fill="#C41E3A" />
                <circle cx="42" cy="14" r="26" fill="#FFE4C4" />
                <path d="M 14 14 Q 42 -22 74 10 L 68 26 L 14 26 Z" fill="#C41E3A" />
                <circle cx="76" cy="4" r="11" fill="white" />
                <rect x="8" y="22" width="64" height="9" fill="white" rx="4" />
                <ellipse cx="42" cy="36" rx="22" ry="16" fill="white" />
              </g>
            </motion.g>

            {/* Magic trail - varied sizes for organic feel */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.circle
                key={i}
                cx={75 - i * 12}
                cy={175 + Math.sin(i * 0.8) * 6}
                r={6 - i * 0.6}
                fill="#FFD700"
                animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.8,
                  delay: i * 0.12,
                  repeat: Infinity,
                }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Sleigh facts - Stocking cards scattered */}
        <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
          {SLEIGH_FACTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, rotate: item.tilt }}
                whileInView={{ opacity: 1, y: 0, rotate: item.tilt }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                whileHover={{ rotate: 0, scale: 1.05, y: -8 }}
                className="w-full max-w-[280px]"
                style={{ marginTop: i === 1 ? '24px' : '0' }}
              >
                <StockingCard color={item.color}>
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 mb-4 bg-white/20 rounded-full"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90">{item.fact}</p>
                  </div>
                </StockingCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom wavy divider */}
      <WavyDivider
        className="absolute bottom-0 left-0 right-0"
        color="fill-blue-50"
        height={90}
      />
    </section>
  );
}
