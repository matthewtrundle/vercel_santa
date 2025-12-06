'use client';

import type { ReactElement, FormEvent } from 'react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Baby,
  CakeSlice,
  HeartHandshake,
  Coins,
  ScrollText,
  Sparkles,
  Star,
  GraduationCap,
  Palette,
  TreePine,
  Cpu,
  BookOpen,
  Gamepad2,
  Trophy,
  Music,
  Blocks,
  Puzzle,
  Car,
  Bird,
  FlaskConical,
  Paintbrush,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createOrUpdateProfile, type ProfileFormData } from '@/actions';
import { GIFT_CATEGORIES, type GiftCategory } from '@/types';

interface ModalQuestionFormProps {
  sessionId: string;
  onComplete: () => void;
  onBack: () => void;
}

type FormStep = 'name' | 'age' | 'interests' | 'budget' | 'notes';

const steps: FormStep[] = ['name', 'age', 'interests', 'budget', 'notes'];

const interestConfig: Record<GiftCategory, { icon: LucideIcon; label: string; color: string }> = {
  educational: { icon: GraduationCap, label: 'Learning', color: 'text-blue-600' },
  creative: { icon: Palette, label: 'Creative', color: 'text-pink-600' },
  outdoor: { icon: TreePine, label: 'Outdoor', color: 'text-green-600' },
  tech: { icon: Cpu, label: 'Tech', color: 'text-purple-600' },
  books: { icon: BookOpen, label: 'Books', color: 'text-amber-600' },
  games: { icon: Gamepad2, label: 'Games', color: 'text-indigo-600' },
  sports: { icon: Trophy, label: 'Sports', color: 'text-orange-600' },
  music: { icon: Music, label: 'Music', color: 'text-rose-600' },
  building: { icon: Blocks, label: 'Building', color: 'text-cyan-600' },
  dolls: { icon: Puzzle, label: 'Toys', color: 'text-fuchsia-600' },
  vehicles: { icon: Car, label: 'Vehicles', color: 'text-red-600' },
  animals: { icon: Bird, label: 'Animals', color: 'text-teal-600' },
  science: { icon: FlaskConical, label: 'Science', color: 'text-emerald-600' },
  art: { icon: Paintbrush, label: 'Art', color: 'text-violet-600' },
};

const stepIcons = {
  name: Baby,
  age: CakeSlice,
  interests: HeartHandshake,
  budget: Coins,
  notes: ScrollText,
};

export function ModalQuestionForm({
  sessionId,
  onComplete,
  onBack,
}: ModalQuestionFormProps): ReactElement {
  const [currentStep, setCurrentStep] = useState<FormStep>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high' | ''>('');
  const [specialNotes, setSpecialNotes] = useState('');

  const currentStepIndex = steps.indexOf(currentStep);
  const CurrentIcon = stepIcons[currentStep];

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'name':
        return name.trim().length > 0;
      case 'age':
        return typeof age === 'number' && age >= 0 && age <= 120;
      case 'interests':
        return interests.length > 0;
      case 'budget':
        return budget !== '';
      case 'notes':
        return true;
      default:
        return false;
    }
  }, [currentStep, name, age, interests, budget]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  }, [currentStepIndex]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      onBack();
    }
  }, [currentStepIndex, onBack]);

  const toggleInterest = useCallback((interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const formData: ProfileFormData = {
          name,
          age: age as number,
          interests,
          budget: budget as 'low' | 'medium' | 'high',
          specialNotes: specialNotes || undefined,
        };

        const result = await createOrUpdateProfile(sessionId, formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        onComplete();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to save. Please try again.'
        );
        setIsSubmitting(false);
      }
    },
    [sessionId, name, age, interests, budget, specialNotes, onComplete]
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex gap-1">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors',
                index <= currentStepIndex
                  ? 'bg-gradient-to-r from-red-500 to-green-500'
                  : 'bg-gray-200'
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="min-h-[280px]"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <CurrentIcon className="w-7 h-7 text-red-600" />
            </motion.div>
          </div>

          {/* Name step */}
          {currentStep === 'name' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Who is this gift for?</h2>
              <p className="text-gray-600 mb-6">
                This helps us personalize the recommendations!
              </p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter their name"
                className="text-center text-lg max-w-xs mx-auto"
                autoFocus
              />
            </div>
          )}

          {/* Age step */}
          {currentStep === 'age' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How old is {name || 'the recipient'}?</h2>
              <p className="text-gray-600 mb-6">
                We&apos;ll find age-appropriate gifts
              </p>
              <Input
                type="number"
                min={0}
                max={120}
                value={age}
                onChange={(e) =>
                  setAge(e.target.value ? parseInt(e.target.value, 10) : '')
                }
                placeholder="Age"
                className="text-center text-lg max-w-[120px] mx-auto"
                autoFocus
              />
            </div>
          )}

          {/* Interests step */}
          {currentStep === 'interests' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What does {name || 'the recipient'} love?</h2>
              <p className="text-gray-600 mb-4">Select all that apply</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {GIFT_CATEGORIES.map((category) => {
                  const { icon: Icon, label, color } = interestConfig[category];
                  const isSelected = interests.includes(category);
                  return (
                    <motion.button
                      key={category}
                      type="button"
                      onClick={() => toggleInterest(category)}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-xs flex flex-col items-center gap-1',
                        isSelected
                          ? 'border-red-600 bg-red-50 text-red-700 shadow-md'
                          : 'border-gray-200 hover:border-red-300 bg-white hover:shadow-sm'
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className={cn('w-6 h-6', isSelected ? 'text-red-600' : color)} />
                      <span className="font-medium">{label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Budget step - reframed as gift size */}
          {currentStep === 'budget' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How much holiday magic?</h2>
              <p className="text-gray-600 mb-6">
                Choose the size of gifts Santa should look for
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                {[
                  {
                    value: 'low' as const,
                    label: 'Stocking Stuffers',
                    description: 'Small treasures & surprises',
                    stars: 1,
                    color: 'from-green-400 to-green-600'
                  },
                  {
                    value: 'medium' as const,
                    label: 'Under the Tree',
                    description: 'Classic holiday gifts',
                    stars: 2,
                    color: 'from-amber-400 to-amber-600'
                  },
                  {
                    value: 'high' as const,
                    label: 'Extra Special',
                    description: 'Big wishes come true',
                    stars: 3,
                    color: 'from-red-400 to-red-600'
                  },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setBudget(option.value)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4',
                      budget === option.value
                        ? 'border-red-600 bg-gradient-to-r from-red-50 to-green-50 shadow-lg'
                        : 'border-gray-200 hover:border-red-300 bg-white hover:shadow-md'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center flex-shrink-0',
                      option.color
                    )}>
                      <div className="flex">
                        {Array.from({ length: option.stars }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-white fill-white" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold block text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.description}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Notes step */}
          {currentStep === 'notes' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Anything else?</h2>
              <p className="text-gray-600 mb-4">
                Optional: Add any special requests or things to avoid
              </p>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="E.g., 'Already has lots of LEGO' or 'Loves dinosaurs'"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-sm text-gray-400 mt-1">
                {specialNotes.length}/500 characters
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        {currentStep === 'notes' ? (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Sending to Elves...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 w-4 h-4" />
                Find Gifts
              </>
            )}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext} disabled={!canProceed()}>
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
