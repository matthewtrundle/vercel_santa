'use client';

import type { ReactElement } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Sparkles, Gift, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageInput } from '@/components/workshop/image-input';
import { ProcessingView } from '@/components/workshop/processing-view';
import { createSession } from '@/actions';
import type { AgentStatus, AgentEvent } from '@/types';
import { ModalQuestionForm } from './modal-question-form';

type JourneyStep = 'upload' | 'questions' | 'processing' | 'complete';

interface GiftJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FUN_FACTS = [
  "Our AI elves analyze over 1,000 gift options to find the perfect matches!",
  "Santa's Workshop uses advanced vision AI to understand interests and hobbies!",
  "Each gift recommendation is personally scored by our Gift Match Elf!",
  "The Narration Elf writes a unique letter personalized just for them!",
  "Our elves work in perfect harmony - like a well-oiled sleigh!",
];

export function GiftJourneyModal({
  isOpen,
  onClose,
}: GiftJourneyModalProps): ReactElement | null {
  const router = useRouter();
  const [step, setStep] = useState<JourneyStep>('upload');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);

  // Processing state
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    image: 'pending',
    profile: 'pending',
    'gift-match': 'pending',
    narration: 'pending',
  });
  const [details, setDetails] = useState<Record<string, string>>({});
  const [outputs, setOutputs] = useState<Record<string, unknown>>({});

  // Create session on mount
  useEffect(() => {
    if (isOpen && !sessionId && !isCreatingSession) {
      setIsCreatingSession(true);
      createSession()
        .then((session) => {
          if (session && session.id) {
            setSessionId(session.id);
          } else {
            setError('Failed to create session. Please try again.');
          }
        })
        .catch(() => {
          setError('Failed to create session. Please try again.');
        })
        .finally(() => {
          setIsCreatingSession(false);
        });
    }
  }, [isOpen, sessionId, isCreatingSession]);

  // Rotate fun facts during processing
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleUploadComplete = useCallback(() => {
    setHasUploaded(true);
    setError(null);
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setHasUploaded(false);
  }, []);

  const handleContinueToQuestions = useCallback(() => {
    setStep('questions');
  }, []);

  const handleQuestionsComplete = useCallback(async () => {
    if (!sessionId) return;

    setStep('processing');

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to start processing');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event: AgentEvent = JSON.parse(line.slice(6));

              if (event.type === 'status' && event.agentId && event.status) {
                setStatuses((prev) => ({
                  ...prev,
                  [event.agentId]: event.status!,
                }));
              }

              if (event.type === 'detail' && event.agentId && event.detail) {
                setDetails((prev) => ({
                  ...prev,
                  [event.agentId]: event.detail!,
                }));
              }

              if (event.type === 'output' && event.agentId && event.data) {
                setOutputs((prev) => ({
                  ...prev,
                  [event.agentId]: event.data,
                }));
              }

              if (event.type === 'error') {
                setError(event.error || 'An error occurred');
              }

              if (event.type === 'complete') {
                setStep('complete');
              }
            } catch (e) {
              console.error('Failed to parse SSE event:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Processing failed');
    }
  }, [sessionId]);

  const handleViewResults = useCallback(() => {
    if (sessionId) {
      router.push(`/workshop/${sessionId}/results`);
      onClose();
    }
  }, [sessionId, router, onClose]);

  const handleClose = useCallback(() => {
    // Reset state
    setStep('upload');
    setSessionId(null);
    setHasUploaded(false);
    setError(null);
    setStatuses({
      image: 'pending',
      profile: 'pending',
      'gift-match': 'pending',
      narration: 'pending',
    });
    setDetails({});
    setOutputs({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== 'processing' ? handleClose : undefined}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-red-50 rounded-2xl shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          {/* Close button */}
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait" initial={false}>
            {/* Loading session */}
            {isCreatingSession && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Loader2 className="w-10 h-10 animate-spin text-red-600 mx-auto mb-4" />
                <p className="text-gray-600">Preparing the magic...</p>
              </motion.div>
            )}

            {/* Upload Step */}
            {!isCreatingSession && step === 'upload' && sessionId && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4">
                    <Camera className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Share an Image
                  </h2>
                  <p className="text-gray-600">
                    Upload a photo or draw what you&apos;re looking for!
                  </p>
                </div>

                <ImageInput
                  sessionId={sessionId}
                  onComplete={handleUploadComplete}
                  onError={handleUploadError}
                />

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleContinueToQuestions}
                    disabled={!hasUploaded}
                    size="lg"
                  >
                    Continue
                    <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleContinueToQuestions}
                    variant="ghost"
                    size="lg"
                  >
                    Skip this step
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Questions Step */}
            {step === 'questions' && sessionId && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <ModalQuestionForm
                  sessionId={sessionId}
                  onComplete={handleQuestionsComplete}
                  onBack={() => setStep('upload')}
                />
              </motion.div>
            )}

            {/* Processing Step */}
            {step === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="py-4"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-8 h-8 text-red-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Santa&apos;s Elves Are Working!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Watch as our magical team finds the perfect gifts...
                  </p>
                </div>

                <ProcessingView
                  statuses={statuses}
                  details={details}
                  outputs={outputs}
                />

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-red-600 mb-3">{error}</p>
                    <Button
                      onClick={() => {
                        setError(null);
                        setStep('questions');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {!error && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-blue-700 mb-1 font-medium">
                      Did you know?
                    </p>
                    <motion.p
                      key={currentFact}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-blue-600 text-sm"
                    >
                      {FUN_FACTS[currentFact]}
                    </motion.p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Complete Step */}
            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <Gift className="w-12 h-12 text-green-600" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  Magic Complete!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-8"
                >
                  Your personalized gift recommendations are ready!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button onClick={handleViewResults} size="xl">
                    <Gift className="mr-2 w-5 h-5" />
                    View Your Gifts
                  </Button>
                </motion.div>

                {/* Celebration particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#228B22'][
                          i % 4
                        ],
                      }}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{
                        y: '-100%',
                        opacity: [0, 1, 0],
                        x: (Math.random() - 0.5) * 100,
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
