'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { ElfTimeline } from '@/components/workshop/elf-timeline';
import { Button } from '@/components/ui/button';
import type { AgentStatus, AgentEvent } from '@/types';

const FUN_FACTS = [
  "Our AI elves analyze over 1,000 gift options to find the perfect matches!",
  "Santa's Workshop uses advanced vision AI to understand your child's interests!",
  "Each gift recommendation is personally scored by our Gift Match Elf!",
  "The Narration Elf writes a unique letter just for your child!",
  "Our elves work in perfect harmony - like a well-oiled sleigh!",
];

export default function ProcessingPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const hasStarted = useRef(false);
  const [currentFact, setCurrentFact] = useState(0);

  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    image: 'pending',
    profile: 'pending',
    'gift-match': 'pending',
    narration: 'pending',
  });

  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const startProcessing = useCallback(async () => {
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

        // Parse SSE events
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

              if (event.type === 'error') {
                setError(event.error || 'An error occurred');
              }

              if (event.type === 'complete') {
                setIsComplete(true);
                // Navigate to results after a brief delay
                setTimeout(() => {
                  router.push(`/workshop/${sessionId}/results`);
                }, 1500);
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
  }, [sessionId, router]);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasStarted.current) return;
    hasStarted.current = true;

    startProcessing();
  }, [startProcessing]);

  const handleRetry = () => {
    setError(null);
    setStatuses({
      image: 'pending',
      profile: 'pending',
      'gift-match': 'pending',
      narration: 'pending',
    });
    hasStarted.current = false;
    startProcessing();
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4">
          <Sparkles className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isComplete
            ? "All Done! Redirecting..."
            : error
              ? "Oops! Something Went Wrong"
              : "Santa's Elves Are Working!"}
        </h1>
        <p className="text-gray-600">
          {isComplete
            ? "Your personalized gift recommendations are ready!"
            : error
              ? "Don't worry, let's try again."
              : "Watch as our magical team finds the perfect gifts..."}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-700 mb-1">
                Processing Error
              </h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Elf Timeline */}
      <ElfTimeline statuses={statuses} />

      {/* Fun facts while waiting */}
      {!error && !isComplete && (
        <div className="mt-10 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm text-blue-700 mb-2 font-medium">
              Did you know?
            </p>
            <p className="text-blue-600 transition-opacity duration-500">
              {FUN_FACTS[currentFact]}
            </p>
          </div>
        </div>
      )}

      {/* Completion message */}
      {isComplete && (
        <div className="mt-10 text-center">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <p className="text-green-700 font-medium">
              Perfect matches found! Taking you to your results...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
