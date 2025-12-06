'use client';

import type { ReactElement } from 'react';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Zap, Package, Sparkles } from 'lucide-react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { WavyDivider } from '@/components/organic/snow-drift';
import { RibbonBanner, StockingCard } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';
import { AnimatedSleigh } from '@/components/magical/animated-sleigh';

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

        {/* Animated Sleigh - same as hero section for consistency */}
        <motion.div
          className="relative h-64 mb-16 flex items-center justify-center overflow-hidden"
          style={{ x: sleighX }}
        >
          <AnimatedSleigh size="lg" />
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
