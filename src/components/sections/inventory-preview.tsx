'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { Gift, Package, Target, Clock } from 'lucide-react';
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/magical/parallax-section';
import { GiftCategoryCard, GIFT_CATEGORIES, FloatingGifts } from '@/components/magical/gift-box-animation';
import { WavyDivider, TornEdge } from '@/components/organic/snow-drift';
import { RibbonBanner } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';

// Stats with Lucide icons
const STATS = [
  { value: '10M+', label: 'Gifts Ready', icon: Gift },
  { value: '200+', label: 'Categories', icon: Package },
  { value: '99.9%', label: 'Match Rate', icon: Target },
  { value: '24/7', label: 'Elf Shifts', icon: Clock },
];

// Tilts for scattered layout
const CATEGORY_TILTS = [-2, 3, -1, 2, -3, 1];

export function InventoryPreview(): ReactElement {
  return (
    <section
      id="inventory"
      className="relative py-24 bg-gradient-to-b from-blue-50 via-indigo-50/70 to-purple-100 overflow-hidden"
    >
      {/* Scattered decorations */}
      <ScatteredDecorations density="sparse" types={['ornament', 'candyCane']} />

      {/* Top torn edge divider */}
      <TornEdge className="absolute top-0 left-0 right-0" color="fill-blue-50" position="top" />

      {/* Floating gifts background */}
      <FloatingGifts />

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
              Gift Warehouse
            </RibbonBanner>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive wavy-underline">Gift Inventory</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore the magical categories in Santa&apos;s warehouse! Our AI
            elves will find the perfect matches from these amazing collections.
          </p>
        </FadeInSection>

        {/* Gift categories - scattered organic layout */}
        <StaggerContainer className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto mb-16">
          {GIFT_CATEGORIES.map((category, i) => (
            <StaggerItem key={category.name}>
              <motion.div
                style={{
                  transform: `rotate(${CATEGORY_TILTS[i % 6]}deg)`,
                  marginTop: i % 2 === 0 ? '0' : '16px',
                }}
                whileHover={{ rotate: 0, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-[140px] md:w-[160px]"
              >
                <GiftCategoryCard category={category} index={i} />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats - organic blob card */}
        <FadeInSection delay={0.3}>
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-8 max-w-4xl mx-auto shadow-lg organic-blob-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="text-center min-w-[100px]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-14 h-14 mb-3 organic-blob-3"
                      style={{
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      }}
                      animate={{ rotate: [0, 5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
                    >
                      <Icon className="w-7 h-7 text-amber-600" />
                    </motion.div>
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </FadeInSection>

        {/* Scrolling gift showcase - with organic card shapes */}
        <div className="mt-16 overflow-hidden">
          <motion.div
            className="flex gap-5"
            animate={{ x: [0, -1200] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(24)].map((_, i) => {
              const gifts = [
                { emoji: '🧸', name: 'Teddy Bear' },
                { emoji: '🎮', name: 'Game Console' },
                { emoji: '📚', name: 'Book Set' },
                { emoji: '🎨', name: 'Art Kit' },
                { emoji: '🤖', name: 'Robot Toy' },
                { emoji: '⚽', name: 'Sports Gear' },
                { emoji: '🎹', name: 'Keyboard' },
                { emoji: '🧩', name: 'Puzzle' },
                { emoji: '🚂', name: 'Train Set' },
                { emoji: '👗', name: 'Dress-up' },
                { emoji: '🎭', name: 'Costume' },
                { emoji: '🔭', name: 'Telescope' },
              ];
              const gift = gifts[i % gifts.length];
              const tilt = (i % 5) - 2; // -2 to 2 degrees

              return (
                <motion.div
                  key={i}
                  className={`flex-shrink-0 w-32 p-4 bg-white shadow-md text-center ${
                    i % 3 === 0 ? 'organic-blob-1' : i % 3 === 1 ? 'organic-blob-2' : 'organic-blob-3'
                  }`}
                  style={{ transform: `rotate(${tilt}deg)` }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                >
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  >
                    {gift.emoji}
                  </motion.div>
                  <div className="text-xs font-medium text-gray-600">
                    {gift.name}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Bottom wavy divider */}
      <WavyDivider
        className="absolute bottom-0 left-0 right-0"
        color="fill-purple-100"
        height={80}
      />
    </section>
  );
}
