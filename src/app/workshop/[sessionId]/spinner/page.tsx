'use client';

import type { ReactElement } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';
import { NicePointsSpinner } from '@/components/workshop/nice-points-spinner';
import { updateSessionNicePoints } from '@/actions';

export default function SpinnerPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [showCoal, setShowCoal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch feature flag on mount
  useEffect(() => {
    async function fetchFlag() {
      try {
        // Use the Edge Config or default to false
        // For client-side, we'll use a simple API call or default
        const response = await fetch('/api/flags/spinner-coal');
        if (response.ok) {
          const data = await response.json();
          setShowCoal(data.showCoal ?? false);
        }
      } catch {
        // Default to no coal on error
        setShowCoal(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlag();
  }, []);

  const handleSpinComplete = useCallback(async (points: number) => {
    setIsSaving(true);

    try {
      await updateSessionNicePoints(sessionId, points);

      // Brief delay before navigation for UX
      setTimeout(() => {
        router.push(`/workshop/${sessionId}/processing`);
      }, 500);
    } catch (error) {
      console.error('Failed to save Nice Points:', error);
      // Still navigate even if save fails
      router.push(`/workshop/${sessionId}/processing`);
    }
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-12 h-12 text-amber-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 mb-4">
          <Star className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          The Naughty or Nice Reveal!
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Spin the wheel to discover how many Nice Points you&apos;ve earned.
          Use these points to unlock special gift recommendations!
        </p>
      </motion.div>

      {/* Spinner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <NicePointsSpinner
          showCoal={showCoal}
          onSpinComplete={handleSpinComplete}
        />
      </motion.div>

      {/* Saving indicator */}
      {isSaving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-amber-500" />
            </motion.div>
            <span className="font-medium">Recording your Nice Points...</span>
          </div>
        </motion.div>
      )}

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center"
      >
        <p className="text-green-700 text-sm">
          <span className="font-semibold">How it works:</span> Your Nice Points
          determine how many gifts you can add to your wish list. The nicer
          you&apos;ve been, the more points you earn!
        </p>
      </motion.div>
    </div>
  );
}
