'use client';

import type { ReactElement } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User, Gift, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentStatus } from '@/types';

interface ProcessingViewProps {
  statuses: Record<string, AgentStatus>;
  details: Record<string, string>;
  outputs: Record<string, unknown>;
  className?: string;
}

interface ElfData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

const ELVES: ElfData[] = [
  {
    id: 'image',
    name: 'Vision Elf',
    emoji: '🔍',
    color: 'from-blue-400 to-blue-600',
    description: 'Analyzing your image...',
  },
  {
    id: 'profile',
    name: 'Profile Elf',
    emoji: '📋',
    color: 'from-purple-400 to-purple-600',
    description: 'Building the perfect profile...',
  },
  {
    id: 'gift-match',
    name: 'Gift Match Elf',
    emoji: '🎁',
    color: 'from-red-400 to-red-600',
    description: 'Finding amazing matches...',
  },
  {
    id: 'narration',
    name: 'Letter Elf',
    emoji: '✉️',
    color: 'from-green-400 to-green-600',
    description: "Writing Santa's note...",
  },
];

function ElfCard({ elf, status, detail }: { elf: ElfData; status: AgentStatus; detail?: string }): ReactElement {
  const isRunning = status === 'running';
  const isCompleted = status === 'completed';
  const isPending = status === 'pending';

  return (
    <motion.div
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all',
        isRunning && 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-200/50',
        isCompleted && 'border-green-400 bg-green-50',
        isPending && 'border-gray-200 bg-gray-50 opacity-50'
      )}
      animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 1.5, repeat: isRunning ? Infinity : 0 }}
    >
      <div className="flex items-center gap-3">
        {/* Elf avatar */}
        <motion.div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center text-2xl',
            `bg-gradient-to-br ${elf.color}`
          )}
          animate={isRunning ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isRunning ? Infinity : 0 }}
        >
          {isCompleted ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <span>{elf.emoji}</span>
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{elf.name}</h4>
            {isRunning && (
              <motion.div
                className="flex gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-yellow-500"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {detail || elf.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface ResultCardProps {
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
  delay?: number;
}

function ResultCard({ title, icon: Icon, children, delay = 0 }: ResultCardProps): ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-green-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-red-600" />
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}

export function ProcessingView({
  statuses,
  details,
  outputs,
  className,
}: ProcessingViewProps): ReactElement {
  // Extract data from outputs
  const imageOutput = outputs.image as { visibleInterestsFromImage?: string[]; colorPreferencesFromClothing?: string[] } | undefined;
  const profileOutput = outputs.profile as { profile?: { primaryInterests?: string[]; personalityTraits?: string[] } } | undefined;
  const giftMatchOutput = outputs['gift-match'] as { recommendations?: Array<{ gift: { name: string }; score: number }> } | undefined;
  const narrationOutput = outputs.narration as { notePreview?: string } | undefined;

  return (
    <div className={cn('grid md:grid-cols-2 gap-6', className)}>
      {/* Left column - Elves at work */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Elves at Work
        </h3>

        <div className="space-y-3">
          {ELVES.map((elf) => (
            <ElfCard
              key={elf.id}
              elf={elf}
              status={statuses[elf.id] || 'pending'}
              detail={details[elf.id]}
            />
          ))}
        </div>
      </div>

      {/* Right column - Real-time results */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-red-500" />
          Discoveries
        </h3>

        <AnimatePresence mode="popLayout">
          {/* Image analysis results */}
          {imageOutput && imageOutput.visibleInterestsFromImage && imageOutput.visibleInterestsFromImage.length > 0 && (
            <ResultCard title="Found in Image" icon={Sparkles} delay={0}>
              <div className="flex flex-wrap gap-2">
                {imageOutput.visibleInterestsFromImage.slice(0, 6).map((interest, i) => (
                  <motion.span
                    key={interest}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
              {imageOutput.colorPreferencesFromClothing && imageOutput.colorPreferencesFromClothing.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Colors:</span>
                  <div className="flex gap-1">
                    {imageOutput.colorPreferencesFromClothing.slice(0, 4).map((color, i) => (
                      <motion.div
                        key={color}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </ResultCard>
          )}

          {/* Profile results */}
          {profileOutput?.profile && (
            <ResultCard title="Profile Built" icon={User} delay={0.2}>
              {profileOutput.profile.primaryInterests && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500 block mb-1">Interests:</span>
                  <div className="flex flex-wrap gap-1">
                    {profileOutput.profile.primaryInterests.slice(0, 4).map((interest, i) => (
                      <motion.span
                        key={interest}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
              {profileOutput.profile.personalityTraits && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">Traits:</span>
                  <div className="flex flex-wrap gap-1">
                    {profileOutput.profile.personalityTraits.slice(0, 3).map((trait, i) => (
                      <motion.span
                        key={trait}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs"
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </ResultCard>
          )}

          {/* Gift matches */}
          {giftMatchOutput?.recommendations && giftMatchOutput.recommendations.length > 0 && (
            <ResultCard title="Gift Matches Found!" icon={Gift} delay={0.4}>
              <div className="space-y-2">
                {giftMatchOutput.recommendations.slice(0, 3).map((rec, i) => (
                  <motion.div
                    key={rec.gift.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {rec.gift.name}
                    </span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      {rec.score}% match
                    </span>
                  </motion.div>
                ))}
                {giftMatchOutput.recommendations.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{giftMatchOutput.recommendations.length - 3} more gifts found
                  </p>
                )}
              </div>
            </ResultCard>
          )}

          {/* Santa's note preview */}
          {narrationOutput?.notePreview && (
            <ResultCard title="Santa's Letter" icon={FileText} delay={0.6}>
              <p className="text-sm text-gray-600 italic line-clamp-3">
                &ldquo;{narrationOutput.notePreview}...&rdquo;
              </p>
            </ResultCard>
          )}

          {/* Empty state */}
          {!imageOutput && !profileOutput && !giftMatchOutput && !narrationOutput && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Results will appear here as elves work...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
