'use server';

import { db } from '@/db';
import { agentRuns, sessions, kidProfiles, recommendations, santaLists } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { runImageElf } from './image-elf';
import { runProfileElf } from './profile-elf';
import { runGiftMatchElf } from './gift-match-elf';
import { runNarrationElf } from './narration-elf';
import type {
  AgentStatus,
  AgentEvent,
  ImageElfOutput,
  ProfileFormData,
} from '@/types';

export interface OrchestratorResult {
  success: boolean;
  error?: string;
  santaNote?: string;
  recommendationCount?: number;
}

async function createAgentRun(sessionId: string, agentName: string) {
  const [run] = await db
    .insert(agentRuns)
    .values({
      sessionId,
      agentName,
      status: 'pending',
    })
    .returning();
  return run;
}

async function updateAgentRun(
  runId: string,
  updates: {
    status: AgentStatus;
    output?: Record<string, unknown>;
    error?: string;
    durationMs?: number;
    startedAt?: Date;
    completedAt?: Date;
  }
) {
  await db
    .update(agentRuns)
    .set(updates)
    .where(eq(agentRuns.id, runId));
}

// Helper to add a delay for visual feedback
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Longer delays so users can actually see the agentic process
const DELAYS = {
  statusChange: 500,   // When an agent starts or completes
  detailMessage: 800,  // Between detail messages
  betweenAgents: 1200, // After one agent completes before next starts
};

export async function runAgentPipeline(
  sessionId: string,
  onEvent?: (event: AgentEvent) => Promise<void> | void
): Promise<OrchestratorResult> {
  // Emit events with delays to ensure streaming is visible
  const emit = async (event: Omit<AgentEvent, 'timestamp'>, delayMs: number = DELAYS.detailMessage) => {
    await onEvent?.({ ...event, timestamp: Date.now() });
    // Delay to ensure the event is visible on the client
    await delay(delayMs);
  };

  try {
    // Update session status to processing
    await db
      .update(sessions)
      .set({ status: 'processing', updatedAt: new Date() })
      .where(eq(sessions.id, sessionId));

    // Fetch session data
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionId))
      .limit(1);

    if (!session) {
      throw new Error('Session not found');
    }

    // Fetch profile data
    const [profile] = await db
      .select()
      .from(kidProfiles)
      .where(eq(kidProfiles.sessionId, sessionId))
      .limit(1);

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Build form data from profile
    const formData: ProfileFormData = {
      name: profile.name,
      age: profile.age,
      interests: (profile.interests as string[]) || [],
      budget: profile.budgetTier === 'budget' ? 'low' : profile.budgetTier === 'premium' ? 'high' : 'medium',
      specialNotes: profile.specialNotes || undefined,
    };

    // ===== STEP 1: Image Elf =====
    let imageOutput: ImageElfOutput | null = null;

    const imageRun = await createAgentRun(sessionId, 'image');
    await emit({ type: 'status', agentId: 'image', status: 'running' }, DELAYS.statusChange);
    await emit({ type: 'detail', agentId: 'image', detail: 'Loading uploaded photo...' });
    await updateAgentRun(imageRun.id, { status: 'running', startedAt: new Date() });

    const imageStartTime = Date.now();

    if (session.photoUrl) {
      try {
        await emit({ type: 'detail', agentId: 'image', detail: 'Running GPT-4 Vision analysis on photo...' });
        imageOutput = await runImageElf({
          imageUrl: session.photoUrl,
          sessionId,
        });

        await emit({ type: 'detail', agentId: 'image', detail: `Found ${imageOutput.visibleInterestsFromImage.length} interests in photo!` });

        await updateAgentRun(imageRun.id, {
          status: 'completed',
          output: imageOutput as unknown as Record<string, unknown>,
          completedAt: new Date(),
          durationMs: Date.now() - imageStartTime,
        });

        await emit({ type: 'output', agentId: 'image', data: imageOutput });
        await emit({ type: 'status', agentId: 'image', status: 'completed' }, DELAYS.betweenAgents);
      } catch (error) {
        console.error('Image Elf failed:', error);
        await emit({ type: 'detail', agentId: 'image', detail: 'Photo analysis skipped, using form data only' });
        await updateAgentRun(imageRun.id, {
          status: 'completed',
          error: 'Image analysis skipped',
          completedAt: new Date(),
          durationMs: Date.now() - imageStartTime,
        });
        await emit({ type: 'status', agentId: 'image', status: 'completed' }, DELAYS.betweenAgents);
      }
    } else {
      // No photo - skip image analysis
      await emit({ type: 'detail', agentId: 'image', detail: 'No photo uploaded, skipping visual analysis' });
      await updateAgentRun(imageRun.id, {
        status: 'completed',
        output: { skipped: true },
        completedAt: new Date(),
        durationMs: Date.now() - imageStartTime,
      });
      await emit({ type: 'status', agentId: 'image', status: 'completed' }, DELAYS.betweenAgents);
    }

    // ===== STEP 2: Profile Elf =====
    const profileRun = await createAgentRun(sessionId, 'profile');
    await emit({ type: 'status', agentId: 'profile', status: 'running' }, DELAYS.statusChange);
    await emit({ type: 'detail', agentId: 'profile', detail: 'Merging form data with image insights...' });
    await updateAgentRun(profileRun.id, { status: 'running', startedAt: new Date() });

    const profileStartTime = Date.now();

    await emit({ type: 'detail', agentId: 'profile', detail: 'AI analyzing personality traits and interests...' });
    const profileOutput = await runProfileElf({
      formData,
      imageAnalysis: imageOutput,
      sessionId,
    });

    await emit({ type: 'detail', agentId: 'profile', detail: `Identified ${profileOutput.profile.primaryInterests.length} primary interests` });

    await updateAgentRun(profileRun.id, {
      status: 'completed',
      output: profileOutput as unknown as Record<string, unknown>,
      completedAt: new Date(),
      durationMs: Date.now() - profileStartTime,
    });

    // Update kid profile with AI-derived data
    await db
      .update(kidProfiles)
      .set({
        ageGroup: profileOutput.profile.ageGroup,
        primaryInterests: profileOutput.profile.primaryInterests,
        secondaryInterests: profileOutput.profile.secondaryInterests,
        personalityTraits: profileOutput.profile.personalityTraits,
        giftCategories: profileOutput.profile.giftCategories,
        avoidCategories: profileOutput.profile.avoidCategories || [],
        imageAnalysis: imageOutput ? {
          estimatedAgeRange: imageOutput.estimatedAgeRange,
          visibleInterests: imageOutput.visibleInterestsFromImage,
          colorPreferences: imageOutput.colorPreferencesFromClothing,
          environmentClues: imageOutput.environmentClues,
          confidence: imageOutput.confidence,
        } : null,
        profileConfidence: String(profileOutput.confidence),
        updatedAt: new Date(),
      })
      .where(eq(kidProfiles.sessionId, sessionId));

    await emit({ type: 'output', agentId: 'profile', data: profileOutput });
    await emit({ type: 'status', agentId: 'profile', status: 'completed' }, DELAYS.betweenAgents);

    // ===== STEP 3: Gift Match Elf =====
    const giftMatchRun = await createAgentRun(sessionId, 'gift-match');
    await emit({ type: 'status', agentId: 'gift-match', status: 'running' }, DELAYS.statusChange);
    await emit({ type: 'detail', agentId: 'gift-match', detail: 'Searching gift inventory database...' });
    await updateAgentRun(giftMatchRun.id, { status: 'running', startedAt: new Date() });

    const giftMatchStartTime = Date.now();

    await emit({ type: 'detail', agentId: 'gift-match', detail: 'AI scoring and ranking potential matches...' });
    const giftMatchOutput = await runGiftMatchElf({
      profile: profileOutput.profile,
      sessionId,
    });

    await emit({ type: 'detail', agentId: 'gift-match', detail: `Found ${giftMatchOutput.recommendations.length} perfect gift matches!` });

    await updateAgentRun(giftMatchRun.id, {
      status: 'completed',
      output: { count: giftMatchOutput.recommendations.length },
      completedAt: new Date(),
      durationMs: Date.now() - giftMatchStartTime,
    });

    // Save recommendations to database
    await emit({ type: 'detail', agentId: 'gift-match', detail: 'Saving recommendations to your session...' });
    for (let i = 0; i < giftMatchOutput.recommendations.length; i++) {
      const rec = giftMatchOutput.recommendations[i];
      await db.insert(recommendations).values({
        sessionId,
        giftId: rec.gift.id,
        score: rec.score,
        reasoning: rec.reasoning,
        matchedInterests: rec.matchedInterests,
        rank: i + 1,
      });
    }

    await emit({ type: 'output', agentId: 'gift-match', data: giftMatchOutput });
    await emit({ type: 'status', agentId: 'gift-match', status: 'completed' }, DELAYS.betweenAgents);

    // ===== STEP 4: Narration Elf =====
    const narrationRun = await createAgentRun(sessionId, 'narration');
    await emit({ type: 'status', agentId: 'narration', status: 'running' }, DELAYS.statusChange);
    await emit({ type: 'detail', agentId: 'narration', detail: 'Gathering gift recommendations...' });
    await updateAgentRun(narrationRun.id, { status: 'running', startedAt: new Date() });

    const narrationStartTime = Date.now();

    await emit({ type: 'detail', agentId: 'narration', detail: 'Santa is writing a personalized letter...' });
    const santaNote = await runNarrationElf({
      profile: profileOutput.profile,
      recommendations: giftMatchOutput.recommendations,
      sessionId,
    });

    await emit({ type: 'detail', agentId: 'narration', detail: `Letter complete! ${santaNote.length} characters of holiday magic` });

    await updateAgentRun(narrationRun.id, {
      status: 'completed',
      output: { noteLength: santaNote.length },
      completedAt: new Date(),
      durationMs: Date.now() - narrationStartTime,
    });

    // Create Santa list with the note
    await emit({ type: 'detail', agentId: 'narration', detail: 'Creating your Santa List...' });
    await db.insert(santaLists).values({
      sessionId,
      name: `${profileOutput.profile.name}'s Gift List`,
      santaNote,
      isPublic: false,
    });

    await emit({ type: 'output', agentId: 'narration', data: { notePreview: santaNote.slice(0, 100) } });
    await emit({ type: 'status', agentId: 'narration', status: 'completed' }, DELAYS.statusChange);

    // ===== Complete =====
    await db
      .update(sessions)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    // Give users time to see the final state before transitioning
    await delay(2000);
    await emit({ type: 'complete', agentId: 'narration' });

    return {
      success: true,
      santaNote,
      recommendationCount: giftMatchOutput.recommendations.length,
    };
  } catch (error) {
    console.error('Agent pipeline error:', error);

    // Update session to failed
    await db
      .update(sessions)
      .set({ status: 'failed', updatedAt: new Date() })
      .where(eq(sessions.id, sessionId));

    await emit({
      type: 'error',
      agentId: 'image',
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
