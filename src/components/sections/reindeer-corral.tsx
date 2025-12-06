'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { ReindeerCard, REINDEER_DATA } from '@/components/magical/reindeer-card';

export function ReindeerCorral(): ReactElement {
  return (
    <section
      id="reindeer"
      className="relative py-24 bg-gradient-to-b from-blue-50 to-indigo-100 overflow-hidden"
    >
      {/* Starry background decoration - pre-generated positions */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 30 }, (_, i) => ({
          id: i,
          left: `${(i * 17 + 3) % 100}%`,
          top: `${(i * 13 + 7) % 100}%`,
          duration: 2 + (i % 3),
          delay: (i % 5) * 0.4,
        })).map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: star.left,
              top: star.top,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
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
          <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🦌</span>
            <span className="text-amber-700 text-sm font-medium">
              The Flying Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet the <span className="text-festive">Reindeer</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Santa&apos;s magical flying reindeer team! Each one has special
            powers that help deliver gifts around the world on Christmas Eve.
          </p>
        </FadeInSection>

        {/* Reindeer in formation - Rudolph leads */}
        <div className="max-w-6xl mx-auto">
          {/* Rudolph - front and center */}
          <FadeInSection className="flex justify-center mb-8">
            <ReindeerCard
              reindeer={REINDEER_DATA[0]}
              index={0}
              className="w-full max-w-sm"
            />
          </FadeInSection>

          {/* Second row - 2 reindeer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {REINDEER_DATA.slice(1, 3).map((reindeer, i) => (
              <ReindeerCard
                key={reindeer.name}
                reindeer={reindeer}
                index={i + 1}
              />
            ))}
          </div>

          {/* Third row - 2 reindeer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {REINDEER_DATA.slice(3, 5).map((reindeer, i) => (
              <ReindeerCard
                key={reindeer.name}
                reindeer={reindeer}
                index={i + 3}
              />
            ))}
          </div>

          {/* Fourth row - 2 reindeer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {REINDEER_DATA.slice(5, 7).map((reindeer, i) => (
              <ReindeerCard
                key={reindeer.name}
                reindeer={reindeer}
                index={i + 5}
              />
            ))}
          </div>

          {/* Fifth row - 2 reindeer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {REINDEER_DATA.slice(7, 9).map((reindeer, i) => (
              <ReindeerCard
                key={reindeer.name}
                reindeer={reindeer}
                index={i + 7}
              />
            ))}
          </div>
        </div>

        {/* Fun facts */}
        <FadeInSection delay={0.3} className="mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Reindeer Care at the North Pole
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🥕',
                  title: 'Magic Carrots',
                  fact: 'Our reindeer eat special magic carrots grown in the enchanted garden!',
                },
                {
                  icon: '❄️',
                  title: 'Snow Baths',
                  fact: 'Daily snow baths keep their coats shiny and flight-ready!',
                },
                {
                  icon: '🌟',
                  title: 'Stardust Training',
                  fact: 'They practice flying through stardust clouds every night!',
                },
                {
                  icon: '💤',
                  title: 'Cozy Stables',
                  fact: 'Each reindeer has their own heated stable with a name plaque!',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.fact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
