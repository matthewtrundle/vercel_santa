'use server';

import { db } from '@/db';
import { sessions, kidProfiles, analyticsEvents } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { Session } from '@/db/schema';

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
