'use client';

import type { ReactElement, FormEvent } from 'react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  User,
  Cake,
  Heart,
  Star,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createOrUpdateProfile, type ProfileFormData } from '@/actions';
import { GIFT_CATEGORIES, type GiftCategory } from '@/types';

interface QuestionFormProps {
  sessionId: string;
  initialData?: Partial<ProfileFormData>;
}

type FormStep = 'name' | 'age' | 'interests' | 'budget' | 'notes';

const steps: FormStep[] = ['name', 'age', 'interests', 'budget', 'notes'];

const interestLabels: Record<GiftCategory, { emoji: string; label: string }> = {
  educational: { emoji: '📚', label: 'Educational' },
  creative: { emoji: '🎨', label: 'Creative' },
  outdoor: { emoji: '🌳', label: 'Outdoor' },
  tech: { emoji: '💻', label: 'Tech' },
  books: { emoji: '📖', label: 'Books' },
  games: { emoji: '🎮', label: 'Games' },
  sports: { emoji: '⚽', label: 'Sports' },
  music: { emoji: '🎵', label: 'Music' },
  building: { emoji: '🧱', label: 'Building' },
  dolls: { emoji: '🪆', label: 'Dolls' },
  vehicles: { emoji: '🚗', label: 'Vehicles' },
  animals: { emoji: '🐾', label: 'Animals' },
  science: { emoji: '🔬', label: 'Science' },
  art: { emoji: '🖼️', label: 'Art' },
};

export function QuestionForm({
  sessionId,
  initialData,
}: QuestionFormProps): ReactElement {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FormStep>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(initialData?.name ?? '');
  const [age, setAge] = useState<number | ''>(initialData?.age ?? '');
  const [interests, setInterests] = useState<string[]>(
    initialData?.interests ?? []
  );
  const [budget, setBudget] = useState<'low' | 'medium' | 'high' | ''>(
    initialData?.budget ?? ''
  );
  const [specialNotes, setSpecialNotes] = useState(
    initialData?.specialNotes ?? ''
  );

  const currentStepIndex = steps.indexOf(currentStep);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'name':
        return name.trim().length > 0;
      case 'age':
        return typeof age === 'number' && age >= 0 && age <= 18;
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
    }
  }, [currentStepIndex]);

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

        router.push(`/workshop/${sessionId}/spinner`);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to save. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionId, name, age, interests, budget, specialNotes, router]
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex gap-1">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                index <= currentStepIndex ? 'bg-red-600' : 'bg-gray-200'
              )}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {/* Name step */}
        {currentStep === 'name' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
              <User className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">What&apos;s their name?</h2>
            <p className="text-gray-600 mb-6">
              This helps us personalize Santa&apos;s message!
            </p>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter child's name"
              className="text-center text-lg max-w-xs mx-auto"
              autoFocus
            />
          </div>
        )}

        {/* Age step */}
        {currentStep === 'age' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
              <Cake className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">How old is {name}?</h2>
            <p className="text-gray-600 mb-6">
              We&apos;ll find age-appropriate gifts
            </p>
            <Input
              type="number"
              min={0}
              max={18}
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
              <Heart className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              What does {name} love?
            </h2>
            <p className="text-gray-600 mb-6">Select all that apply</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {GIFT_CATEGORIES.map((category) => {
                const { emoji, label } = interestLabels[category];
                const isSelected = interests.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleInterest(category)}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all text-sm',
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300 bg-white'
                    )}
                  >
                    <span className="text-xl block mb-1">{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Budget step */}
        {currentStep === 'budget' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mb-4">
              <Star className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Gift tier preference?</h2>
            <p className="text-gray-600 mb-6">
              Choose the Nice Points range for gifts
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              {[
                { value: 'low' as const, label: 'Stocking Stuffers', range: 'Under 25 Nice Points' },
                { value: 'medium' as const, label: 'Under the Tree', range: '25 - 75 Nice Points' },
                { value: 'high' as const, label: 'Special Surprise', range: '75+ Nice Points' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBudget(option.value)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-left',
                    budget === option.value
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200 hover:border-red-300 bg-white'
                  )}
                >
                  <span className="font-medium block">{option.label}</span>
                  <span className="text-sm text-gray-500">{option.range}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes step */}
        {currentStep === 'notes' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
              <MessageSquare className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Anything else?</h2>
            <p className="text-gray-600 mb-6">
              Optional: Add any special requests or things to avoid
            </p>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="E.g., 'Already has lots of LEGO' or 'Loves dinosaurs'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-400 mt-2">
              {specialNotes.length}/500 characters
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
        >
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
                Find Gifts
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
