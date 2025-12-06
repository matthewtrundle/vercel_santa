'use client';

import type { ReactElement } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Camera, MessageSquare, Gift } from 'lucide-react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { SingleLight } from '@/components/magical/twinkling-lights';
import { WavyDivider } from '@/components/organic/snow-drift';
import { RibbonBanner, GiftTagCard } from '@/components/organic/gift-tag-card';
import { ScatteredDecorations } from '@/components/organic/scattered-decorations';

export function WorkshopIntro(): ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const buildingY = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  const steps = [
    {
      step: '1',
      title: 'Share a Photo',
      description:
        'Upload a photo and our AI elves will spot interests and personality clues.',
      icon: Camera,
      color: 'red' as const,
      tilt: -3,
    },
    {
      step: '2',
      title: 'Answer Questions',
      description:
        'Tell us about age, interests, and budget. The more we know, the better!',
      icon: MessageSquare,
      color: 'green' as const,
      tilt: 2,
    },
    {
      step: '3',
      title: 'Get Perfect Gifts',
      description:
        'Receive personalized recommendations with a letter from Santa!',
      icon: Gift,
      color: 'gold' as const,
      tilt: -2,
    },
  ];

  return (
    <section
      id="workshop"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white via-red-50/50 to-green-50/30 overflow-hidden"
    >
      {/* Scattered decorations */}
      <ScatteredDecorations density="sparse" types={['snowflake', 'star']} />

      {/* Top wave divider */}
      <WavyDivider className="absolute top-0 left-0 right-0" color="fill-white" />

      <div className="container mx-auto px-4">
        <FadeInSection className="text-center mb-16">
          {/* Ribbon banner heading */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <RibbonBanner color="green">
              Step Inside!
            </RibbonBanner>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the{' '}
            <span className="text-festive wavy-underline">North Pole</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Step inside Santa&apos;s magical workshop where our AI elves work
            tirelessly to find the perfect gifts for every child!
          </p>
        </FadeInSection>

        {/* Workshop Building - with organic shadow */}
        <motion.div
          className="relative max-w-3xl mx-auto organic-shadow-red"
          style={{ y: buildingY, opacity }}
        >
          <svg
            viewBox="0 0 600 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            {/* Sky/background */}
            <rect width="600" height="400" fill="transparent" />

            {/* Snow ground - organic shape */}
            <path
              d="M20 370 Q 100 360 200 375 T 400 365 T 580 375 L 580 400 L 20 400 Z"
              fill="#E8F4F8"
            />

            {/* Main building */}
            <g>
              {/* Building body - slightly organic corners */}
              <rect x="120" y="180" width="360" height="180" fill="#8B4513" rx="8" />

              {/* Roof - organic curve */}
              <path
                d="M90 185 Q 300 40 510 185"
                fill="none"
                stroke="#C41E3A"
                strokeWidth="40"
                strokeLinecap="round"
              />
              <path
                d="M100 180 L300 60 L500 180 Z"
                fill="#C41E3A"
              />
              {/* Roof snow - organic wave */}
              <path
                d="M95 175 Q 200 130 300 90 Q 400 130 505 175"
                stroke="white"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />

              {/* Chimney */}
              <rect x="380" y="80" width="40" height="70" fill="#8B0000" rx="3" />
              <rect x="375" y="75" width="50" height="10" fill="#5D3A1A" rx="2" />
              {/* Chimney smoke - organic puffs */}
              <motion.g
                animate={{ y: [-5, -25], opacity: [0.8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <ellipse cx="400" cy="55" rx="12" ry="10" fill="#ccc" opacity="0.6" />
                <ellipse cx="393" cy="38" rx="10" ry="8" fill="#ccc" opacity="0.4" />
                <ellipse cx="408" cy="22" rx="8" ry="6" fill="#ccc" opacity="0.2" />
              </motion.g>

              {/* Windows with lights - varied sizes */}
              {[
                { x: 145, y: 195, w: 55, h: 65 },
                { x: 245, y: 200, w: 50, h: 55 },
                { x: 345, y: 195, w: 55, h: 65 },
                { x: 445, y: 200, w: 50, h: 55 },
                { x: 145, y: 280, w: 50, h: 55 },
                { x: 445, y: 285, w: 50, h: 50 },
              ].map((pos, i) => (
                <g key={i}>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={pos.w}
                    height={pos.h}
                    fill="#FFE4B5"
                    stroke="#5D3A1A"
                    strokeWidth="4"
                    rx="5"
                  />
                  {/* Window panes */}
                  <line
                    x1={pos.x + pos.w / 2}
                    y1={pos.y}
                    x2={pos.x + pos.w / 2}
                    y2={pos.y + pos.h}
                    stroke="#5D3A1A"
                    strokeWidth="2"
                  />
                  <line
                    x1={pos.x}
                    y1={pos.y + pos.h / 2}
                    x2={pos.x + pos.w}
                    y2={pos.y + pos.h / 2}
                    stroke="#5D3A1A"
                    strokeWidth="2"
                  />
                  {/* Warm glow */}
                  <motion.rect
                    x={pos.x + 3}
                    y={pos.y + 3}
                    width={pos.w - 6}
                    height={pos.h - 6}
                    fill="#FFA500"
                    opacity="0.3"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
                    rx="3"
                  />
                </g>
              ))}

              {/* Door - organic arch */}
              <path
                d="M275 360 L275 280 Q300 255 325 280 L325 360 Z"
                fill="#5D3A1A"
              />
              <path
                d="M280 355 L280 285 Q300 265 320 285 L320 355 Z"
                fill="#8B4513"
              />
              <circle cx="312" cy="320" r="5" fill="#FFD700" />
              {/* Door wreath - organic */}
              <circle cx="300" cy="295" r="14" fill="none" stroke="#228B22" strokeWidth="7" />
              <circle cx="300" cy="283" r="4" fill="#C41E3A" />
              <circle cx="295" cy="287" r="3" fill="#C41E3A" />
              <circle cx="305" cy="287" r="3" fill="#C41E3A" />

              {/* Sign - at an angle */}
              <g transform="translate(220, 138) rotate(-2)">
                <rect x="0" y="0" width="160" height="32" fill="#5D3A1A" rx="4" />
                <text x="80" y="23" textAnchor="middle" fill="#FFD700" fontSize="14" fontWeight="bold">
                  SANTA&apos;S WORKSHOP
                </text>
              </g>
            </g>

            {/* Snow piles - organic shapes */}
            <ellipse cx="90" cy="372" rx="65" ry="22" fill="white" />
            <ellipse cx="510" cy="368" rx="55" ry="18" fill="white" />

            {/* Christmas trees - organic shapes */}
            <g transform="translate(45, 275)">
              <path d="M35,0 Q45,25 55,45 Q35,40 30,50 Q25,40 5,45 Q15,25 25,0 Z" fill="#228B22" />
              <path d="M32,15 Q40,35 48,55 Q32,50 30,58 Q28,50 12,55 Q20,35 28,15 Z" fill="#1a6b1a" />
              <rect x="27" y="78" width="12" height="22" fill="#5D3A1A" rx="2" />
            </g>
            <g transform="translate(495, 285)">
              <path d="M28,0 Q38,22 45,40 Q28,35 25,45 Q22,35 5,40 Q12,22 22,0 Z" fill="#228B22" />
              <path d="M26,12 Q34,30 40,48 Q26,44 25,52 Q24,44 10,48 Q16,30 24,12 Z" fill="#1a6b1a" />
              <rect x="22" y="68" width="10" height="18" fill="#5D3A1A" rx="2" />
            </g>
          </svg>

          {/* Twinkling string lights on building - curved path */}
          <div className="absolute top-[41%] left-[17%] flex gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                style={{ transform: `translateY(${Math.sin(i * 0.7) * 4}px)` }}
              >
                <SingleLight
                  color={
                    ['#FF0000', '#00FF00', '#FFD700', '#0066FF', '#FF6B6B'][i % 5]
                  }
                  size={7}
                  delay={i * 0.25}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it works steps - scattered layout with gift tag cards */}
        <FadeInSection delay={0.3} className="mt-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto scattered-layout">
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: item.tilt }}
                  whileInView={{ opacity: 1, y: 0, rotate: item.tilt }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, type: 'spring' }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="transform-gpu"
                >
                  <GiftTagCard color={item.color} tilt={item.tilt}>
                    <div className="text-center">
                      {/* Icon with organic blob background */}
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 mb-4 organic-blob-3"
                        style={{
                          background:
                            item.color === 'red'
                              ? 'linear-gradient(135deg, #fee2e2, #fecaca)'
                              : item.color === 'green'
                                ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                                : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        }}
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                      >
                        <Icon
                          className={`w-8 h-8 ${
                            item.color === 'red'
                              ? 'text-red-600'
                              : item.color === 'green'
                                ? 'text-green-600'
                                : 'text-amber-600'
                          }`}
                        />
                      </motion.div>

                      {/* Step number - organic badge */}
                      <div
                        className={`inline-flex items-center justify-center w-10 h-10 font-bold text-lg mb-3 text-white organic-blob-1 ${
                          item.color === 'red'
                            ? 'bg-red-600'
                            : item.color === 'green'
                              ? 'bg-green-600'
                              : 'bg-amber-500'
                        }`}
                      >
                        {item.step}
                      </div>

                      <h3 className="font-bold text-lg text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </GiftTagCard>
                </motion.div>
              );
            })}
          </div>
        </FadeInSection>
      </div>

      {/* Bottom wave divider */}
      <WavyDivider
        className="absolute bottom-0 left-0 right-0"
        color="fill-red-50"
        height={100}
      />
    </section>
  );
}
