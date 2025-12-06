'use client';

import type { ReactElement } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { FadeInSection } from '@/components/magical/parallax-section';
import { SingleLight } from '@/components/magical/twinkling-lights';

export function WorkshopIntro(): ReactElement {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const buildingY = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  return (
    <section
      id="workshop"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white to-red-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <FadeInSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the{' '}
            <span className="text-festive">North Pole</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step inside Santa&apos;s magical workshop where our AI elves work
            tirelessly to find the perfect gifts for every child!
          </p>
        </FadeInSection>

        {/* Workshop Building */}
        <motion.div
          className="relative max-w-3xl mx-auto"
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

            {/* Snow ground */}
            <ellipse cx="300" cy="380" rx="280" ry="30" fill="#E8F4F8" />

            {/* Main building */}
            <g>
              {/* Building body */}
              <rect x="120" y="180" width="360" height="180" fill="#8B4513" rx="5" />

              {/* Roof */}
              <path
                d="M100 180 L300 60 L500 180 Z"
                fill="#C41E3A"
              />
              {/* Roof snow */}
              <path
                d="M110 175 L300 65 L490 175"
                stroke="white"
                strokeWidth="15"
                fill="none"
                strokeLinecap="round"
              />

              {/* Chimney */}
              <rect x="380" y="80" width="40" height="70" fill="#8B0000" />
              <rect x="375" y="75" width="50" height="10" fill="#5D3A1A" />
              {/* Chimney smoke */}
              <motion.g
                animate={{ y: [-5, -20], opacity: [0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <circle cx="400" cy="60" r="10" fill="#ccc" opacity="0.6" />
                <circle cx="395" cy="45" r="8" fill="#ccc" opacity="0.4" />
                <circle cx="405" cy="30" r="6" fill="#ccc" opacity="0.2" />
              </motion.g>

              {/* Windows with lights */}
              {[
                { x: 150, y: 200 },
                { x: 250, y: 200 },
                { x: 350, y: 200 },
                { x: 450, y: 200 },
                { x: 150, y: 280 },
                { x: 450, y: 280 },
              ].map((pos, i) => (
                <g key={i}>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width="50"
                    height="60"
                    fill="#FFE4B5"
                    stroke="#5D3A1A"
                    strokeWidth="4"
                    rx="3"
                  />
                  {/* Window panes */}
                  <line
                    x1={pos.x + 25}
                    y1={pos.y}
                    x2={pos.x + 25}
                    y2={pos.y + 60}
                    stroke="#5D3A1A"
                    strokeWidth="2"
                  />
                  <line
                    x1={pos.x}
                    y1={pos.y + 30}
                    x2={pos.x + 50}
                    y2={pos.y + 30}
                    stroke="#5D3A1A"
                    strokeWidth="2"
                  />
                  {/* Warm glow */}
                  <motion.rect
                    x={pos.x + 2}
                    y={pos.y + 2}
                    width="46"
                    height="56"
                    fill="#FFA500"
                    opacity="0.3"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    rx="2"
                  />
                </g>
              ))}

              {/* Door */}
              <rect x="275" y="260" width="50" height="100" fill="#5D3A1A" rx="3" />
              <rect x="280" y="265" width="40" height="50" fill="#8B4513" rx="2" />
              <circle cx="310" cy="310" r="4" fill="#FFD700" />
              {/* Door wreath */}
              <circle cx="300" cy="280" r="12" fill="none" stroke="#228B22" strokeWidth="6" />
              <circle cx="300" cy="270" r="3" fill="#C41E3A" />

              {/* Sign */}
              <g transform="translate(220, 140)">
                <rect x="0" y="0" width="160" height="30" fill="#5D3A1A" rx="3" />
                <text x="80" y="22" textAnchor="middle" fill="#FFD700" fontSize="14" fontWeight="bold">
                  SANTA&apos;S WORKSHOP
                </text>
              </g>
            </g>

            {/* Snow piles */}
            <ellipse cx="100" cy="370" rx="60" ry="20" fill="white" />
            <ellipse cx="500" cy="370" rx="50" ry="15" fill="white" />

            {/* Christmas trees */}
            <g transform="translate(50, 280)">
              <polygon points="30,0 0,80 60,80" fill="#228B22" />
              <polygon points="30,20 5,80 55,80" fill="#1a6b1a" />
              <rect x="25" y="80" width="10" height="20" fill="#5D3A1A" />
            </g>
            <g transform="translate(490, 290)">
              <polygon points="25,0 0,70 50,70" fill="#228B22" />
              <polygon points="25,15 5,70 45,70" fill="#1a6b1a" />
              <rect x="20" y="70" width="10" height="15" fill="#5D3A1A" />
            </g>
          </svg>

          {/* Twinkling string lights on building */}
          <div className="absolute top-[42%] left-[18%] flex gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SingleLight
                key={i}
                color={
                  ['#FF0000', '#00FF00', '#FFD700', '#0000FF'][i % 4]
                }
                size={6}
                delay={i * 0.2}
              />
            ))}
          </div>
        </motion.div>

        {/* How it works steps */}
        <FadeInSection delay={0.3} className="mt-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Share a Photo',
                description:
                  'Upload a photo and our AI elves will spot interests and personality clues.',
                icon: '📸',
              },
              {
                step: '2',
                title: 'Answer Questions',
                description:
                  'Tell us about age, interests, and budget. The more we know, the better!',
                icon: '✨',
              },
              {
                step: '3',
                title: 'Get Perfect Gifts',
                description:
                  'Receive personalized recommendations with a letter from Santa!',
                icon: '🎁',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center p-6 bg-white rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
