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
} from 'lucide-react';
import type { AgentStatus } from '@/types';

interface ElfStep {
  id: string;
  name: string;
  description: string;
  icon: typeof Search;
  emoji: string;
}

const elfSteps: ElfStep[] = [
  {
    id: 'image',
    name: 'Image Elf',
    description: 'Analyzing the photo for clues...',
    icon: Search,
    emoji: '🔍',
  },
  {
    id: 'profile',
    name: 'Profile Elf',
    description: 'Building the perfect profile...',
    icon: UserCircle,
    emoji: '📋',
  },
  {
    id: 'gift-match',
    name: 'Gift Match Elf',
    description: 'Finding amazing gift matches...',
    icon: Gift,
    emoji: '🎁',
  },
  {
    id: 'narration',
    name: 'Narration Elf',
    description: "Writing Santa's personal note...",
    icon: Scroll,
    emoji: '✉️',
  },
];

interface ElfTimelineProps {
  statuses: Record<string, AgentStatus>;
  className?: string;
}

export function ElfTimeline({
  statuses,
  className,
}: ElfTimelineProps): ReactElement {
  return (
    <div className={cn('space-y-4', className)}>
      {elfSteps.map((elf, index) => {
        const status = statuses[elf.id] || 'pending';
        const isActive = status === 'running';
        const isCompleted = status === 'completed';
        const isFailed = status === 'failed';

        return (
          <div
            key={elf.id}
            className={cn(
              'relative flex items-start gap-4 p-4 rounded-xl transition-all duration-300',
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
                  'absolute left-[2.125rem] top-[4.5rem] w-0.5 h-4',
                  isCompleted ? 'bg-green-400' : 'bg-gray-200'
                )}
              />
            )}

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
              <p
                className={cn(
                  'text-sm',
                  isActive && 'text-red-600',
                  isCompleted && 'text-green-600',
                  isFailed && 'text-red-600',
                  !isActive && !isCompleted && !isFailed && 'text-gray-400'
                )}
              >
                {isFailed ? 'Something went wrong...' : elf.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
