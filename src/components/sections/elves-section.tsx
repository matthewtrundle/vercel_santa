'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/magical/parallax-section';
import { AnimatedElf, AI_ELVES } from '@/components/magical/animated-elf';

interface TopElf {
  name: string;
  title: string;
  achievement: string;
  emoji: string;
}

const TOP_ELVES: TopElf[] = [
  {
    name: 'Sparkle',
    title: 'Master Toy Tester',
    achievement: 'Tested over 1 million toys this year!',
    emoji: '🧪',
  },
  {
    name: 'Tinker',
    title: 'Chief Invention Officer',
    achievement: 'Invented 500 new toy designs!',
    emoji: '🔧',
  },
  {
    name: 'Jingle',
    title: 'Head of Quality Control',
    achievement: '99.99% perfection rate!',
    emoji: '⭐',
  },
  {
    name: 'Twinkle',
    title: 'Wrapping Wizard',
    achievement: 'Can wrap 1000 gifts per hour!',
    emoji: '🎀',
  },
];

export function ElvesSection(): ReactElement {
  return (
    <section
      id="elves"
      className="relative py-24 bg-gradient-to-b from-red-50 to-green-50 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4">
        {/* AI Elves Section */}
        <FadeInSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-4">
            <span className="text-green-600 text-sm font-medium">
              Meet the Magic Makers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive">AI Elves</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our team of specialized AI elves work together in perfect harmony
            to find the most magical gifts for every child!
          </p>
        </FadeInSection>

        {/* AI Elves Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-20">
          {AI_ELVES.map((elf) => (
            <StaggerItem key={elf.name}>
              <AnimatedElf elf={elf} size="md" />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Top Elves of the Year */}
        <FadeInSection delay={0.2} className="mt-20">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2 mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🏆</span>
              <span className="text-yellow-700 text-sm font-medium">
                Hall of Fame
              </span>
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Elves of the Year
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              These exceptional elves have gone above and beyond to spread
              holiday joy!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {TOP_ELVES.map((elf, i) => (
              <motion.div
                key={elf.name}
                className="relative bg-white rounded-2xl shadow-lg p-6 text-center overflow-hidden"
                initial={{ opacity: 0, y: 30, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                {/* Rank badge */}
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    #{i + 1}
                  </div>
                </div>

                {/* Avatar */}
                <motion.div
                  className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-3xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  {elf.emoji}
                </motion.div>

                <h4 className="font-bold text-lg text-gray-900">{elf.name}</h4>
                <p className="text-sm text-green-600 font-medium mb-2">
                  {elf.title}
                </p>
                <p className="text-xs text-gray-500">{elf.achievement}</p>

                {/* Sparkle effects */}
                <motion.div
                  className="absolute -top-1 -left-1 text-yellow-400"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </motion.div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
