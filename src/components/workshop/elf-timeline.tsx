'use client';

import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import {
  Search,
  UserCircle,
  Gift,
  Scroll,
  Loader2,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';
import type { AgentStatus } from '@/types';

interface ElfStep {
  id: string;
  name: string;
  description: string;
  icon: typeof Search;
  emoji: string;
  behindTheScenes: string[];
}

const elfSteps: ElfStep[] = [
  {
    id: 'image',
    name: 'Image Elf',
    description: 'Analyzing the photo for clues...',
    icon: Search,
    emoji: '🔍',
    behindTheScenes: [
      'Uses GPT-4 Vision to analyze uploaded photos',
      'Detects interests from toys, clothing, room decor',
      'Identifies age-appropriate characteristics',
      'Extracts color preferences from clothing',
    ],
  },
  {
    id: 'profile',
    name: 'Profile Elf',
    description: 'Building the perfect profile...',
    icon: UserCircle,
    emoji: '📋',
    behindTheScenes: [
      'Combines your answers with photo insights',
      'Categorizes interests by type and priority',
      'Determines personality traits for better matches',
      'Sets appropriate gift categories and budget tier',
    ],
  },
  {
    id: 'gift-match',
    name: 'Gift Match Elf',
    description: 'Finding amazing gift matches...',
    icon: Gift,
    emoji: '🎁',
    behindTheScenes: [
      'Queries database of 450+ curated gifts',
      'AI scores each gift against the profile',
      'Ranks matches by relevance and age fit',
      'Generates personalized reasoning for each pick',
    ],
  },
  {
    id: 'narration',
    name: 'Narration Elf',
    description: "Writing Santa's personal note...",
    icon: Scroll,
    emoji: '✉️',
    behindTheScenes: [
      'Reviews all gift recommendations',
      'Crafts a personalized letter from Santa',
      'Explains why each gift was chosen',
      'Adds holiday magic and encouragement',
    ],
  },
];

interface ElfTimelineProps {
  statuses: Record<string, AgentStatus>;
  details?: Record<string, string>;
  className?: string;
}

export function ElfTimeline({
  statuses,
  details = {},
  className,
}: ElfTimelineProps): ReactElement {
  const [expandedElf, setExpandedElf] = useState<string | null>(null);

  return (
    <div className={cn('space-y-4', className)}>
      {elfSteps.map((elf, index) => {
        const status = statuses[elf.id] || 'pending';
        const detail = details[elf.id];
        const isActive = status === 'running';
        const isCompleted = status === 'completed';
        const isFailed = status === 'failed';
        const isExpanded = expandedElf === elf.id;

        return (
          <div
            key={elf.id}
            className={cn(
              'relative rounded-xl transition-all duration-300',
              isActive && 'bg-red-50 border-2 border-red-200',
              isCompleted && 'bg-green-50 border border-green-200',
              isFailed && 'bg-red-50 border border-red-300',
              !isActive && !isCompleted && !isFailed && 'bg-gray-50 border border-gray-200'
            )}
          >
            {/* Connector line */}
            {index < elfSteps.length - 1 && (
              <div
                className={cn(
                  'absolute left-[2.125rem] -bottom-4 w-0.5 h-4 z-10',
                  isCompleted ? 'bg-green-400' : 'bg-gray-200'
                )}
              />
            )}

            {/* Main row */}
            <div className="flex items-start gap-4 p-4">
              {/* Status indicator */}
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 transition-all',
                  isActive && 'bg-red-100 animate-pulse',
                  isCompleted && 'bg-green-100',
                  isFailed && 'bg-red-100',
                  !isActive && !isCompleted && !isFailed && 'bg-gray-100'
                )}
              >
                {isActive && (
                  <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                )}
                {isCompleted && <Check className="w-6 h-6 text-green-600" />}
                {isFailed && <AlertCircle className="w-6 h-6 text-red-600" />}
                {status === 'pending' && (
                  <span className="text-2xl">{elf.emoji}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={cn(
                      'font-semibold',
                      isActive && 'text-red-700',
                      isCompleted && 'text-green-700',
                      isFailed && 'text-red-700',
                      !isActive && !isCompleted && !isFailed && 'text-gray-500'
                    )}
                  >
                    {elf.name}
                  </h3>
                  {isActive && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Working...
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                      Done!
                    </span>
                  )}
                </div>

                {/* Current detail message */}
                <p
                  className={cn(
                    'text-sm',
                    isActive && 'text-red-600',
                    isCompleted && 'text-green-600',
                    isFailed && 'text-red-600',
                    !isActive && !isCompleted && !isFailed && 'text-gray-400'
                  )}
                >
                  {isFailed ? 'Something went wrong...' : (detail || elf.description)}
                </p>

                {/* Behind the scenes toggle */}
                {(isActive || isCompleted) && (
                  <button
                    onClick={() => setExpandedElf(isExpanded ? null : elf.id)}
                    className={cn(
                      'mt-2 flex items-center gap-1 text-xs font-medium transition-colors',
                      isActive && 'text-red-500 hover:text-red-700',
                      isCompleted && 'text-green-500 hover:text-green-700'
                    )}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Behind the scenes
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded behind-the-scenes section */}
            {isExpanded && (
              <div
                className={cn(
                  'px-4 pb-4 pt-0 ml-16',
                  isActive && 'text-red-600',
                  isCompleted && 'text-green-600'
                )}
              >
                <div className="bg-white/50 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-medium opacity-70 uppercase tracking-wide mb-2">
                    What {elf.name} does:
                  </p>
                  {elf.behindTheScenes.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
