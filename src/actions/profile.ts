'use server';

import { db } from '@/db';
import { kidProfiles, sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { KidProfile, NewKidProfile, AgeGroupCategory, BudgetTier } from '@/types';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  age: z.number().int().min(0).max(120),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  budget: z.enum(['low', 'medium', 'high']),
  specialNotes: z.string().max(500).optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

function mapBudgetTier(budget: 'low' | 'medium' | 'high'): BudgetTier {
  const mapping: Record<string, BudgetTier> = {
    low: 'budget',
    medium: 'moderate',
    high: 'premium',
  };
  return mapping[budget];
}

function determineAgeGroup(age: number): AgeGroupCategory {
  if (age <= 3) return 'toddler';
  if (age <= 5) return 'preschool';
  if (age <= 9) return 'early_school';
  if (age <= 12) return 'tween';
  if (age <= 17) return 'teen';
  return 'adult';
}

export async function createOrUpdateProfile(
  sessionId: string,
  formData: ProfileFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = profileFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data',
    };
  }

  const { name, age, interests, budget, specialNotes } = parsed.data;

  try {
    // Check if profile already exists
    const [existing] = await db
      .select()
      .from(kidProfiles)
      .where(eq(kidProfiles.sessionId, sessionId))
      .limit(1);

    const profileData: Partial<NewKidProfile> = {
      sessionId,
      name,
      age,
      interests,
      budgetTier: mapBudgetTier(budget),
      specialNotes: specialNotes ?? null,
      ageGroup: determineAgeGroup(age),
      updatedAt: new Date(),
    };

    if (existing) {
      await db
        .update(kidProfiles)
        .set(profileData)
        .where(eq(kidProfiles.id, existing.id));
    } else {
      await db.insert(kidProfiles).values(profileData as NewKidProfile);
    }

    // Update session status
    await db
      .update(sessions)
      .set({
        status: 'profile_submitted',
        updatedAt: new Date(),
      })
      .where(eq(sessions.id, sessionId));

    revalidatePath(`/workshop/${sessionId}`);

    return { success: true };
  } catch (error) {
    console.error('Failed to save profile:', error);
    return {
      success: false,
      error: 'Failed to save profile. Please try again.',
    };
  }
}

export async function getProfile(sessionId: string): Promise<KidProfile | null> {
  const [profile] = await db
    .select()
    .from(kidProfiles)
    .where(eq(kidProfiles.sessionId, sessionId))
    .limit(1);

  return (profile as KidProfile) ?? null;
}

export async function submitProfileAndContinue(
  sessionId: string,
  formData: ProfileFormData
): Promise<void> {
  const result = await createOrUpdateProfile(sessionId, formData);

  if (!result.success) {
    throw new Error(result.error);
  }

  redirect(`/workshop/${sessionId}/processing`);
}
