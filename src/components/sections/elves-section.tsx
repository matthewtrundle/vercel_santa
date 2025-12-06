'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { Trophy, FlaskConical, Wrench, Star, Ribbon } from 'lucide-react';
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/magical/parallax-section';
import { AnimatedElf, AI_ELVES } from '@/components/magical/animated-elf';
import { WavyDivider } from '@/components/organic/snow-drift';
import { RibbonBanner, OrnamentBadge } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';
import { FloatingBlobs } from '@/components/organic/blob-shape';

interface TopElf {
  name: string;
  title: string;
  achievement: string;
  icon: typeof FlaskConical;
  color: 'red' | 'green' | 'gold' | 'blue';
}

const TOP_ELVES: TopElf[] = [
  {
    name: 'Sparkle',
    title: 'Master Toy Tester',
    achievement: 'Tested over 1 million toys this year!',
    icon: FlaskConical,
    color: 'green',
  },
  {
    name: 'Tinker',
    title: 'Chief Invention Officer',
    achievement: 'Invented 500 new toy designs!',
    icon: Wrench,
    color: 'red',
  },
  {
    name: 'Jingle',
    title: 'Head of Quality Control',
    achievement: '99.99% perfection rate!',
    icon: Star,
    color: 'gold',
  },
  {
    name: 'Twinkle',
    title: 'Wrapping Wizard',
    achievement: 'Can wrap 1000 gifts per hour!',
    icon: Ribbon,
    color: 'blue',
  },
];

// Playful tilts for scattered layout
const TILTS = [-3, 2, -2, 3];

export function ElvesSection(): ReactElement {
  return (
    <section
      id="elves"
      className="relative py-24 bg-gradient-to-b from-red-50 via-green-50/50 to-white overflow-hidden"
    >
      {/* Organic blob backgrounds */}
      <FloatingBlobs className="opacity-15" />

      {/* Scattered decorations */}
      <ScatteredDecorations density="sparse" types={['star', 'candyCane']} />

      {/* Top wavy divider */}
      <WavyDivider className="absolute top-0 left-0 right-0" color="fill-red-50" />

      <div className="container mx-auto px-4">
        {/* Workshop Elves Section */}
        <FadeInSection className="text-center mb-16">
          {/* Ribbon banner heading */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <RibbonBanner color="green">
              Meet the Magic Makers
            </RibbonBanner>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive wavy-underline">Helper Elves</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            These four magical elves have worked at the North Pole for centuries,
            each with a special gift for finding the perfect presents!
          </p>
        </FadeInSection>

        {/* AI Elves - Scattered organic layout */}
        <StaggerContainer className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto mb-20">
          {AI_ELVES.map((elf, i) => (
            <StaggerItem key={elf.name}>
              <motion.div
                style={{ transform: `rotate(${TILTS[i % 4]}deg)` }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <AnimatedElf elf={elf} size="md" />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Top Elves of the Year */}
        <FadeInSection delay={0.2} className="mt-20">
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="w-10 h-10 text-amber-500" />
              </motion.div>
              <span className="text-2xl font-bold text-amber-600 organic-blob-2 bg-amber-100 px-4 py-2">
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

          {/* Ornament badges - organic scattered layout */}
          <div className="flex flex-wrap justify-center gap-10 max-w-4xl mx-auto">
            {TOP_ELVES.map((elf, i) => {
              const Icon = elf.icon;
              return (
                <motion.div
                  key={elf.name}
                  initial={{ opacity: 0, y: 40, rotate: TILTS[i] }}
                  whileInView={{ opacity: 1, y: 0, rotate: TILTS[i] }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: 'spring' }}
                  whileHover={{ rotate: 0, y: -10 }}
                  className="flex flex-col items-center"
                  style={{ marginTop: i % 2 === 0 ? '0' : '20px' }}
                >
                  {/* Rank ribbon */}
                  <motion.div
                    className="absolute -top-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    #{i + 1}
                  </motion.div>

                  <OrnamentBadge color={elf.color}>
                    <Icon className="w-8 h-8" />
                  </OrnamentBadge>

                  <div className="mt-4 text-center">
                    <h4 className="font-bold text-lg text-gray-900">{elf.name}</h4>
                    <p className="text-sm text-green-600 font-medium mb-1">
                      {elf.title}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[150px]">
                      {elf.achievement}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </FadeInSection>
      </div>

      {/* Bottom wavy divider */}
      <WavyDivider
        className="absolute bottom-0 left-0 right-0"
        color="fill-white"
        height={80}
      />
    </section>
  );
}
