'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { Carrot, Snowflake, Sparkles, Moon } from 'lucide-react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { ReindeerCard, REINDEER_DATA } from '@/components/magical/reindeer-card';
import { WavyDivider, TornEdge } from '@/components/organic/snow-drift';
import { RibbonBanner, GiftTagCard } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';

// Playful tilts for V-formation
const TILTS_LEADER = [0];
const TILTS_PAIRS = [[-3, 3], [-2, 2], [-3, 3], [-2, 2]];

// Fun facts with Lucide icons
const REINDEER_FACTS = [
  {
    title: 'Magic Carrots',
    fact: 'Our reindeer eat special magic carrots grown in the enchanted garden!',
    icon: Carrot,
    color: 'red' as const,
    tilt: -2,
  },
  {
    title: 'Snow Baths',
    fact: 'Daily snow baths keep their coats shiny and flight-ready!',
    icon: Snowflake,
    color: 'green' as const,
    tilt: 3,
  },
  {
    title: 'Stardust Training',
    fact: 'They practice flying through stardust clouds every night!',
    icon: Sparkles,
    color: 'gold' as const,
    tilt: -1,
  },
  {
    title: 'Cozy Stables',
    fact: 'Each reindeer has their own heated stable with a name plaque!',
    icon: Moon,
    color: 'white' as const,
    tilt: 2,
  },
];

export function ReindeerCorral(): ReactElement {
  return (
    <section
      id="reindeer"
      className="relative py-24 bg-gradient-to-b from-blue-50 via-indigo-50/70 to-purple-50 overflow-hidden"
    >
      {/* Scattered star decorations */}
      <ScatteredDecorations density="medium" types={['star', 'snowflake']} />

      {/* Torn edge top divider - organic paper effect */}
      <TornEdge className="absolute top-0 left-0 right-0" color="fill-white" position="top" />

      {/* Starry background with varied sizes */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 40 }, (_, i) => ({
          id: i,
          left: `${(i * 17 + 3) % 100}%`,
          top: `${(i * 13 + 7) % 85}%`,
          size: 1 + (i % 3),
          duration: 2 + (i % 4),
          delay: (i % 7) * 0.3,
        })).map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          {/* Ribbon banner */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <RibbonBanner color="gold">
              The Flying Team
            </RibbonBanner>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet the <span className="text-festive wavy-underline">Reindeer</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Santa&apos;s magical flying reindeer team! Each one has special
            powers that help deliver gifts around the world on Christmas Eve.
          </p>
        </FadeInSection>

        {/* Reindeer in V-formation with organic tilts */}
        <div className="max-w-6xl mx-auto">
          {/* Rudolph - front and center, slight glow */}
          <FadeInSection className="flex justify-center mb-10">
            <motion.div
              className="relative"
              style={{ transform: `rotate(${TILTS_LEADER[0]}deg)` }}
              whileHover={{ scale: 1.03, rotate: 0 }}
            >
              {/* Leader glow effect */}
              <div className="absolute inset-0 bg-red-400/20 rounded-3xl blur-xl" />
              <ReindeerCard
                reindeer={REINDEER_DATA[0]}
                index={0}
                className="w-full max-w-sm relative"
              />
            </motion.div>
          </FadeInSection>

          {/* Pair rows with staggered tilts */}
          {[
            REINDEER_DATA.slice(1, 3),
            REINDEER_DATA.slice(3, 5),
            REINDEER_DATA.slice(5, 7),
            REINDEER_DATA.slice(7, 9),
          ].map((pair, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-col md:flex-row justify-center gap-8 max-w-3xl mx-auto mb-8"
            >
              {pair.map((reindeer, i) => (
                <motion.div
                  key={reindeer.name}
                  className="flex-1"
                  style={{
                    transform: `rotate(${TILTS_PAIRS[rowIndex][i]}deg)`,
                    marginTop: rowIndex % 2 === 0 ? (i === 0 ? '0' : '12px') : (i === 0 ? '12px' : '0'),
                  }}
                  whileHover={{ rotate: 0, scale: 1.02, y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ReindeerCard
                    reindeer={reindeer}
                    index={rowIndex * 2 + i + 1}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Fun facts - Gift tag cards scattered */}
        <FadeInSection delay={0.3} className="mt-20">
          <motion.h3
            className="text-2xl font-bold text-center text-gray-900 mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Reindeer Care at the North Pole
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {REINDEER_FACTS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30, rotate: item.tilt }}
                  whileInView={{ opacity: 1, y: 0, rotate: item.tilt }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  whileHover={{ rotate: 0, scale: 1.05 }}
                >
                  <GiftTagCard color={item.color} tilt={item.tilt}>
                    <div className="text-center">
                      <motion.div
                        className="inline-flex items-center justify-center w-12 h-12 mb-3 organic-blob-2"
                        style={{
                          background:
                            item.color === 'red'
                              ? 'linear-gradient(135deg, #fee2e2, #fecaca)'
                              : item.color === 'green'
                                ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                                : item.color === 'gold'
                                  ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                  : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                        }}
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            item.color === 'red'
                              ? 'text-red-600'
                              : item.color === 'green'
                                ? 'text-green-600'
                                : item.color === 'gold'
                                  ? 'text-amber-600'
                                  : 'text-gray-600'
                          }`}
                        />
                      </motion.div>
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.fact}</p>
                    </div>
                  </GiftTagCard>
                </motion.div>
              );
            })}
          </div>
        </FadeInSection>
      </div>

      {/* Bottom wavy divider */}
      <WavyDivider
        className="absolute bottom-0 left-0 right-0"
        color="fill-green-50"
        height={100}
      />
    </section>
  );
}
