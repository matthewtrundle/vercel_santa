'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/magical/parallax-section';
import { GiftCategoryCard, GIFT_CATEGORIES, FloatingGifts } from '@/components/magical/gift-box-animation';

export function InventoryPreview(): ReactElement {
  return (
    <section
      id="inventory"
      className="relative py-24 bg-gradient-to-b from-indigo-100 to-purple-100 overflow-hidden"
    >
      {/* Floating gifts background */}
      <FloatingGifts />

      <div className="container mx-auto px-4 relative z-10">
        <FadeInSection className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-purple-700 text-sm font-medium">
              Gift Warehouse
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Santa&apos;s <span className="text-festive">Gift Inventory</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the magical categories in Santa&apos;s warehouse! Our AI
            elves will find the perfect matches from these amazing collections.
          </p>
        </FadeInSection>

        {/* Gift categories */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto mb-16">
          {GIFT_CATEGORIES.map((category, i) => (
            <StaggerItem key={category.name}>
              <GiftCategoryCard category={category} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats */}
        <FadeInSection delay={0.3}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10M+', label: 'Gifts Ready', icon: '🎁' },
                { value: '200+', label: 'Categories', icon: '📦' },
                { value: '99.9%', label: 'Match Rate', icon: '🎯' },
                { value: '24/7', label: 'Elf Shifts', icon: '⏰' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                >
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeInSection>

        {/* Scrolling gift showcase */}
        <div className="mt-16 overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...Array(20)].map((_, i) => {
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
              ];
              const gift = gifts[i % gifts.length];

              return (
                <div
                  key={i}
                  className="flex-shrink-0 w-32 p-4 bg-white rounded-xl shadow-md text-center"
                >
                  <div className="text-3xl mb-2">{gift.emoji}</div>
                  <div className="text-xs font-medium text-gray-600">
                    {gift.name}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
