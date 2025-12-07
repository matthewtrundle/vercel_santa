'use server';

import { db } from '@/db';
import { sessions, kidProfiles, analyticsEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Session } from '@/db/schema';
import {
  checkFeatureGate,
  getExperiment,
  logEvent,
  FEATURE_GATES,
  EXPERIMENTS,
  type StatsigUser,
} from '@/lib/statsig';

export async function createSession(): Promise<Session> {
  const [session] = await db
    .insert(sessions)
    .values({
      status: 'created',
    })
    .returning();

  return session;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  return session ?? null;
}

export async function updateSessionStatus(
  sessionId: string,
  status: Session['status']
): Promise<Session | null> {
  const [session] = await db
    .update(sessions)
    .set({
      status,
      updatedAt: new Date(),
      ...(status === 'completed' ? { completedAt: new Date() } : {}),
    })
    .where(eq(sessions.id, sessionId))
    .returning();

  return session ?? null;
}

export async function updateSessionPhoto(
  sessionId: string,
  photoUrl: string
): Promise<Session | null> {
  const [session] = await db
    .update(sessions)
    .set({
      photoUrl,
      status: 'photo_uploaded',
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, sessionId))
    .returning();

  revalidatePath(`/workshop/${sessionId}`);
  return session ?? null;
}

export async function startWorkshopSession(): Promise<void> {
  const session = await createSession();
  redirect(`/workshop/${session.id}/upload`);
}

export async function getSessionWithProfile(sessionId: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) return null;

  const [profile] = await db
    .select()
    .from(kidProfiles)
    .where(eq(kidProfiles.sessionId, sessionId))
    .limit(1);

  return {
    session,
    profile: profile ?? null,
  };
}

export async function updateSessionNicePoints(
  sessionId: string,
  nicePoints: number
): Promise<Session | null> {
  const [existingSession] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!existingSession) return null;

  const currentMetadata = (existingSession.metadata as Record<string, unknown>) || {};

  const [session] = await db
    .update(sessions)
    .set({
      metadata: {
        ...currentMetadata,
        nicePoints,
        nicePointsRevealedAt: new Date().toISOString(),
      },
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, sessionId))
    .returning();

  // Track the spin result for analytics
  await db.insert(analyticsEvents).values({
    sessionId,
    eventType: 'spin_completed',
    eventData: {
      nicePoints,
      pointsRange: nicePoints <= 200 ? '0-200' :
                   nicePoints <= 400 ? '201-400' :
                   nicePoints <= 600 ? '401-600' :
                   nicePoints <= 800 ? '601-800' : '801-1000',
    },
  });

  revalidatePath(`/workshop/${sessionId}`);
  return session ?? null;
}

export async function getSessionNicePoints(sessionId: string): Promise<number | null> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) return null;

  const metadata = session.metadata as Record<string, unknown> | null;
  return (metadata?.nicePoints as number) ?? null;
}

/**
 * Helper to create a Statsig user from a session ID.
 * Use this to check feature flags for the current user/session.
 */
function getStatsigUser(sessionId: string): StatsigUser {
  return {
    userID: sessionId,
    custom: {
      platform: 'web',
    },
  };
}

/**
 * Get feature flags for a session.
 * Returns an object with all feature flags relevant to the workshop.
 *
 * Example usage:
 * ```ts
 * const flags = await getSessionFeatureFlags(sessionId);
 * if (flags.betaFeatures) {
 *   // Show beta UI
 * }
 * ```
 */
export async function getSessionFeatureFlags(sessionId: string): Promise<{
  betaFeatures: boolean;
  newReindeerAnimations: boolean;
  aiModelUpgrade: boolean;
}> {
  const user = getStatsigUser(sessionId);

  const [betaFeatures, newReindeerAnimations, aiModelUpgrade] = await Promise.all([
    checkFeatureGate(FEATURE_GATES.BETA_FEATURES, user),
    checkFeatureGate(FEATURE_GATES.NEW_REINDEER_ANIMATIONS, user),
    checkFeatureGate(FEATURE_GATES.AI_MODEL_UPGRADE, user),
  ]);

  return {
    betaFeatures,
    newReindeerAnimations,
    aiModelUpgrade,
  };
}

/**
 * Get experiment values for a session.
 * Use this to get A/B test variants.
 *
 * Example usage:
 * ```ts
 * const experiments = await getSessionExperiments(sessionId);
 * const algorithm = experiments.recommendationAlgorithm?.variant || 'default';
 * ```
 */
export async function getSessionExperiments(sessionId: string): Promise<{
  recommendationAlgorithm: Record<string, unknown>;
  workshopLayout: Record<string, unknown>;
}> {
  const user = getStatsigUser(sessionId);

  const [recommendationAlgorithm, workshopLayout] = await Promise.all([
    getExperiment(EXPERIMENTS.RECOMMENDATION_ALGORITHM, user),
    getExperiment(EXPERIMENTS.WORKSHOP_LAYOUT, user),
  ]);

  return {
    recommendationAlgorithm,
    workshopLayout,
  };
}

/**
 * Track an analytics event in Statsig.
 * Use this to log custom events for experiment analysis.
 *
 * Example usage:
 * ```ts
 * await trackSessionEvent(sessionId, 'gift_selected', '123', { category: 'toys' });
 * ```
 */
export async function trackSessionEvent(
  sessionId: string,
  eventName: string,
  value?: string | number,
  metadata?: Record<string, string>
): Promise<void> {
  const user = getStatsigUser(sessionId);
  await logEvent(user, eventName, value, metadata);
}
