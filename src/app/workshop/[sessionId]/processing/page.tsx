'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { ElfTimeline } from '@/components/workshop/elf-timeline';
import type { AgentStatus } from '@/types';

export default function ProcessingPage(): ReactElement {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const hasStarted = useRef(false);

  // For now, simulate the agent progression
  // This will be replaced with real streaming when we implement agents
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    image: 'pending',
    profile: 'pending',
    'gift-match': 'pending',
    narration: 'pending',
  });

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasStarted.current) return;
    hasStarted.current = true;

    const simulateAgentProgression = async () => {
      const agents = ['image', 'profile', 'gift-match', 'narration'];

      for (const agent of agents) {
        // Set to running
        setStatuses((prev) => ({ ...prev, [agent]: 'running' }));

        // Wait for "processing"
        await new Promise((resolve) =>
          setTimeout(resolve, 2000 + Math.random() * 1500)
        );

        // Set to completed
        setStatuses((prev) => ({ ...prev, [agent]: 'completed' }));

        // Small pause between agents
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Navigate to results after a brief delay
      setTimeout(() => {
        router.push(`/workshop/${sessionId}/results`);
      }, 1000);
    };

    simulateAgentProgression();
  }, [router, sessionId]);

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4">
          <Sparkles className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Santa&apos;s Elves Are Working!
        </h1>
        <p className="text-gray-600">
          Watch as our magical team finds the perfect gifts...
        </p>
      </div>

      {/* Elf Timeline */}
      <ElfTimeline statuses={statuses} />

      {/* Fun facts while waiting */}
      <div className="mt-10 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <p className="text-sm text-blue-700 mb-2 font-medium">Did you know?</p>
          <p className="text-blue-600">
            Our AI elves analyze over 1,000 gift options to find the perfect
            matches for your child! 🎁
          </p>
        </div>
      </div>
    </div>
  );
}
