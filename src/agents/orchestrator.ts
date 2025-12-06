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

export async function runAgentPipeline(
  sessionId: string,
  onEvent?: (event: AgentEvent) => void
): Promise<OrchestratorResult> {
  const emit = (event: Omit<AgentEvent, 'timestamp'>) => {
    onEvent?.({ ...event, timestamp: Date.now() });
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
    emit({ type: 'status', agentId: 'image', status: 'running' });
    await updateAgentRun(imageRun.id, { status: 'running', startedAt: new Date() });

    const imageStartTime = Date.now();

    if (session.photoUrl) {
      try {
        imageOutput = await runImageElf({
          imageUrl: session.photoUrl,
          sessionId,
        });

        await updateAgentRun(imageRun.id, {
          status: 'completed',
          output: imageOutput as unknown as Record<string, unknown>,
          completedAt: new Date(),
          durationMs: Date.now() - imageStartTime,
        });

        emit({ type: 'output', agentId: 'image', data: imageOutput });
        emit({ type: 'status', agentId: 'image', status: 'completed' });
      } catch (error) {
        console.error('Image Elf failed:', error);
        await updateAgentRun(imageRun.id, {
          status: 'completed',
          error: 'Image analysis skipped',
          completedAt: new Date(),
          durationMs: Date.now() - imageStartTime,
        });
        emit({ type: 'status', agentId: 'image', status: 'completed' });
      }
    } else {
      // No photo - skip image analysis
      await updateAgentRun(imageRun.id, {
        status: 'completed',
        output: { skipped: true },
        completedAt: new Date(),
        durationMs: Date.now() - imageStartTime,
      });
      emit({ type: 'status', agentId: 'image', status: 'completed' });
    }

    // ===== STEP 2: Profile Elf =====
    const profileRun = await createAgentRun(sessionId, 'profile');
    emit({ type: 'status', agentId: 'profile', status: 'running' });
    await updateAgentRun(profileRun.id, { status: 'running', startedAt: new Date() });

    const profileStartTime = Date.now();

    const profileOutput = await runProfileElf({
      formData,
      imageAnalysis: imageOutput,
      sessionId,
    });

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

    emit({ type: 'output', agentId: 'profile', data: profileOutput });
    emit({ type: 'status', agentId: 'profile', status: 'completed' });

    // ===== STEP 3: Gift Match Elf =====
    const giftMatchRun = await createAgentRun(sessionId, 'gift-match');
    emit({ type: 'status', agentId: 'gift-match', status: 'running' });
    await updateAgentRun(giftMatchRun.id, { status: 'running', startedAt: new Date() });

    const giftMatchStartTime = Date.now();

    const giftMatchOutput = await runGiftMatchElf({
      profile: profileOutput.profile,
      sessionId,
    });

    await updateAgentRun(giftMatchRun.id, {
      status: 'completed',
      output: { count: giftMatchOutput.recommendations.length },
      completedAt: new Date(),
      durationMs: Date.now() - giftMatchStartTime,
    });

    // Save recommendations to database
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

    emit({ type: 'output', agentId: 'gift-match', data: giftMatchOutput });
    emit({ type: 'status', agentId: 'gift-match', status: 'completed' });

    // ===== STEP 4: Narration Elf =====
    const narrationRun = await createAgentRun(sessionId, 'narration');
    emit({ type: 'status', agentId: 'narration', status: 'running' });
    await updateAgentRun(narrationRun.id, { status: 'running', startedAt: new Date() });

    const narrationStartTime = Date.now();

    const santaNote = await runNarrationElf({
      profile: profileOutput.profile,
      recommendations: giftMatchOutput.recommendations,
      sessionId,
    });

    await updateAgentRun(narrationRun.id, {
      status: 'completed',
      output: { noteLength: santaNote.length },
      completedAt: new Date(),
      durationMs: Date.now() - narrationStartTime,
    });

    // Create Santa list with the note
    await db.insert(santaLists).values({
      sessionId,
      name: `${profileOutput.profile.name}'s Gift List`,
      santaNote,
      isPublic: false,
    });

    emit({ type: 'output', agentId: 'narration', data: { notePreview: santaNote.slice(0, 100) } });
    emit({ type: 'status', agentId: 'narration', status: 'completed' });

    // ===== Complete =====
    await db
      .update(sessions)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    emit({ type: 'complete', agentId: 'narration' });

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

    emit({
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
