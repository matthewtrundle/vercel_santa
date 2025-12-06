'use client';

import type { ReactElement } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Heart, Gift, Mail } from 'lucide-react';

export function MagicalFooter(): ReactElement {
  return (
    <footer className="relative bg-gradient-to-b from-purple-100 to-white overflow-hidden">
      {/* Snow wave top */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q 360 60 720 30 T 1440 30 V 60 H 0 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 pt-24">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="text-4xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎅
              </motion.span>
              <span className="text-2xl font-bold text-gray-900">
                Santa&apos;s Workshop
              </span>
            </motion.div>
            <p className="text-gray-600 text-sm">
              Where AI magic meets holiday joy! Our team of enchanted elves use
              the latest technology to find perfect gifts for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-4">Explore</h3>
            <nav className="space-y-2">
              {[
                { href: '#hero', label: 'Home' },
                { href: '#workshop', label: 'How It Works' },
                { href: '#elves', label: 'Meet the Elves' },
                { href: '#reindeer', label: 'Reindeer Team' },
                { href: '#inventory', label: 'Gift Categories' },
              ].map((link) => (
                <motion.div key={link.href} whileHover={{ x: 5 }}>
                  <Link
                    href={link.href}
                    className="block text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* North Pole Address */}
          <div className="text-center md:text-right">
            <h3 className="font-bold text-gray-900 mb-4">Visit Us</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p>Santa&apos;s Workshop</p>
              <p>1 Candy Cane Lane</p>
              <p>North Pole, Arctic Circle 00001</p>
              <p className="flex items-center gap-2 justify-center md:justify-end mt-3">
                <Mail className="w-4 h-4" />
                santa@northpole.com
              </p>
            </div>
          </div>
        </div>

        {/* Fun stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-200 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { icon: '🎁', value: '2B+', label: 'Gifts Delivered' },
            { icon: '🧝', value: '10K+', label: 'Elves Working' },
            { icon: '🦌', value: '9', label: 'Magic Reindeer' },
            { icon: '⭐', value: '100%', label: 'Joy Guaranteed' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.span
                className="text-3xl block mb-1"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                {stat.icon}
              </motion.span>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-sm text-gray-500 block">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and AI magic at the North Pole
          </p>
          <p className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            ⭐ Powered by Vercel AI Gateway
          </p>
        </div>

        {/* Decorative snowflakes */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-20">
          {[15, 35, 55, 75, 25, 45, 65, 85, 30, 60].map((bottomPos, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${10 + i * 10}%`,
                bottom: `${bottomPos}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 360],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              ❄️
            </motion.div>
          ))}
        </div>
      </div>
    </footer>
  );
}
