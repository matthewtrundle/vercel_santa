'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Heart, Gift, Mail, Snowflake, Star, Users, Sparkles } from 'lucide-react';
import { WavyDivider } from '@/components/organic/snow-drift';

// Footer stats with Lucide icons
const FOOTER_STATS = [
  { icon: Gift, value: '2B+', label: 'Gifts Delivered' },
  { icon: Users, value: '10K+', label: 'Elves Working' },
  { icon: Star, value: '9', label: 'Magic Reindeer' },
  { icon: Sparkles, value: '100%', label: 'Joy Guaranteed' },
];

export function MagicalFooter(): ReactElement {
  return (
    <footer className="relative bg-gradient-to-b from-purple-100 via-purple-50 to-white overflow-hidden">
      {/* Organic wavy top divider */}
      <WavyDivider className="absolute top-0 left-0 right-0" color="fill-purple-100" />

      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Main footer content - asymmetric layout */}
        <div className="flex flex-wrap justify-center gap-12 mb-12">
          {/* Brand - tilted organic card */}
          <motion.div
            className="text-center md:text-left max-w-xs organic-blob-1 bg-white/60 p-6"
            style={{ transform: 'rotate(-1deg)' }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start mb-4"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 organic-blob-2 flex items-center justify-center"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="w-6 h-6 text-red-600" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900">
                Santa&apos;s Workshop
              </span>
            </motion.div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Where AI magic meets holiday joy! Our team of enchanted elves use
              the latest technology to find perfect gifts for everyone.
            </p>
          </motion.div>

          {/* Quick Links - organic list */}
          <motion.div
            className="text-center"
            style={{ transform: 'rotate(1deg)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-gray-900 mb-4 wavy-underline inline-block">Explore</h3>
            <nav className="space-y-2 mt-4">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#workshop', label: 'How It Works' },
                { href: '#elves', label: 'Meet the Elves' },
                { href: '#reindeer', label: 'Reindeer Team' },
                { href: '#inventory', label: 'Gift Categories' },
              ].map((link, i) => (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 8, scale: 1.05 }}
                  style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
                >
                  <Link
                    href={link.href}
                    className="block text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* North Pole Address - organic card */}
          <motion.div
            className="text-center md:text-right max-w-xs organic-blob-3 bg-white/60 p-6"
            style={{ transform: 'rotate(2deg)' }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-gray-900 mb-4">Visit Us</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p>Santa&apos;s Workshop</p>
              <p>1 Candy Cane Lane</p>
              <p>North Pole, Arctic Circle 00001</p>
              <motion.p
                className="flex items-center gap-2 justify-center md:justify-end mt-4"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-4 h-4 text-red-500" />
                santa@northpole.com
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Fun stats - organic scattered layout */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 py-8 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {FOOTER_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                style={{
                  transform: `rotate(${(i % 3) - 1}deg)`,
                  marginTop: i % 2 === 0 ? '0' : '12px',
                }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 mb-2 ${
                    i % 4 === 0 ? 'organic-blob-1' : i % 4 === 1 ? 'organic-blob-2' : i % 4 === 2 ? 'organic-blob-3' : 'organic-blob-4'
                  }`}
                  style={{
                    background: i % 2 === 0
                      ? 'linear-gradient(135deg, #fee2e2, #fecaca)'
                      : 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                  }}
                  animate={{ y: [-2, 2, -2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Icon className={`w-6 h-6 ${i % 2 === 0 ? 'text-red-600' : 'text-green-600'}`} />
                </motion.div>
                <span className="text-2xl font-bold text-gray-900 block">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom bar - organic styling */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500 py-6 border-t border-gray-200/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.p
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and AI magic at the North Pole
          </motion.p>
          <motion.p
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Powered by Vercel AI Gateway
          </motion.p>
        </motion.div>

        {/* Decorative snowflakes - Lucide icons with organic movement */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-20">
          {[15, 35, 55, 75, 25, 45, 65, 85].map((bottomPos, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + i * 11}%`,
                bottom: `${bottomPos}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              <Snowflake className={`w-${4 + (i % 3)} h-${4 + (i % 3)} text-blue-400`} />
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}
