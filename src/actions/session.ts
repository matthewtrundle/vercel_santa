'use server';

import { db } from '@/db';
import { sessions, kidProfiles } from '@/db/schema';
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
