'use client';

import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';
import { Check, Upload, ClipboardList, Sparkles, Gift } from 'lucide-react';

export type WorkshopStep = 'upload' | 'questions' | 'processing' | 'results';

interface Step {
  id: WorkshopStep;
  label: string;
  icon: typeof Upload;
}

const steps: Step[] = [
  { id: 'upload', label: 'Upload Photo', icon: Upload },
  { id: 'questions', label: 'Tell Us More', icon: ClipboardList },
  { id: 'processing', label: 'Elf Magic', icon: Sparkles },
  { id: 'results', label: 'Gift Ideas', icon: Gift },
];

interface ProgressStepperProps {
  currentStep: WorkshopStep;
  className?: string;
}

function getStepIndex(step: WorkshopStep): number {
  return steps.findIndex((s) => s.id === step);
}

export function ProgressStepper({
  currentStep,
  className,
}: ProgressStepperProps): ReactElement {
  const currentIndex = getStepIndex(currentStep);

  return (
    <nav aria-label="Workshop progress" className={cn('w-full', className)}>
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    isCompleted && 'bg-green-600 border-green-600 text-white',
                    isCurrent && 'bg-red-600 border-red-600 text-white',
                    isPending && 'bg-white border-gray-300 text-gray-400'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <step.icon className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center hidden sm:block',
                    isCompleted && 'text-green-600',
                    isCurrent && 'text-red-600',
                    isPending && 'text-gray-400'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300',
                    index < currentIndex ? 'bg-green-600' : 'bg-gray-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
