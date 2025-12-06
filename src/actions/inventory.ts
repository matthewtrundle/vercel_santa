'use server';

import { db } from '@/db';
import { giftInventory, type NewGift, type Gift } from '@/db/schema';
import { eq, desc, ilike, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { BudgetTier } from '@/types';

const giftFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  ageGroups: z.array(z.string()).min(1, 'Select at least one age group'),
  priceRange: z.enum(['budget', 'moderate', 'premium']),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  affiliateUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export type GiftFormData = z.infer<typeof giftFormSchema>;

export async function getGifts(options?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ gifts: Gift[]; total: number }> {
  const { search = '', category = '', page = 1, limit = 20 } = options || {};
  const offset = (page - 1) * limit;

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(giftInventory.name, `%${search}%`),
        ilike(giftInventory.description, `%${search}%`)
      )
    );
  }

  if (category) {
    conditions.push(eq(giftInventory.category, category));
  }

  // Build query with conditions
  const gifts = await db
    .select()
    .from(giftInventory)
    .where(conditions.length > 0 ? sql`${conditions.reduce((acc, c) => sql`${acc} AND ${c}`)}` : undefined)
    .orderBy(desc(giftInventory.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(giftInventory)
    .where(conditions.length > 0 ? sql`${conditions.reduce((acc, c) => sql`${acc} AND ${c}`)}` : undefined);

  return {
    gifts: gifts as Gift[],
    total: countResult[0]?.count || 0,
  };
}

export async function getGiftById(id: string): Promise<Gift | null> {
  const [gift] = await db
    .select()
    .from(giftInventory)
    .where(eq(giftInventory.id, id))
    .limit(1);

  return (gift as Gift) || null;
}

export async function createGift(
  data: GiftFormData
): Promise<{ success: boolean; error?: string; gift?: Gift }> {
  const parsed = giftFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data',
    };
  }

  try {
    const giftData: NewGift = {
      name: parsed.data.name,
      description: parsed.data.description,
      category: parsed.data.category,
      ageGroups: parsed.data.ageGroups,
      priceRange: parsed.data.priceRange as BudgetTier,
      price: String(parsed.data.price),
      imageUrl: parsed.data.imageUrl || null,
      affiliateUrl: parsed.data.affiliateUrl || null,
      tags: parsed.data.tags || [],
      isActive: parsed.data.isActive,
    };

    const [gift] = await db.insert(giftInventory).values(giftData).returning();

    revalidatePath('/admin/inventory');

    return { success: true, gift: gift as Gift };
  } catch (error) {
    console.error('Failed to create gift:', error);
    return {
      success: false,
      error: 'Failed to create gift. Please try again.',
    };
  }
}

export async function updateGift(
  id: string,
  data: GiftFormData
): Promise<{ success: boolean; error?: string; gift?: Gift }> {
  const parsed = giftFormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data',
    };
  }

  try {
    const [gift] = await db
      .update(giftInventory)
      .set({
        name: parsed.data.name,
        description: parsed.data.description,
        category: parsed.data.category,
        ageGroups: parsed.data.ageGroups,
        priceRange: parsed.data.priceRange as BudgetTier,
        price: String(parsed.data.price),
        imageUrl: parsed.data.imageUrl || null,
        affiliateUrl: parsed.data.affiliateUrl || null,
        tags: parsed.data.tags || [],
        isActive: parsed.data.isActive,
      })
      .where(eq(giftInventory.id, id))
      .returning();

    revalidatePath('/admin/inventory');

    return { success: true, gift: gift as Gift };
  } catch (error) {
    console.error('Failed to update gift:', error);
    return {
      success: false,
      error: 'Failed to update gift. Please try again.',
    };
  }
}

export async function deleteGift(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(giftInventory).where(eq(giftInventory.id, id));

    revalidatePath('/admin/inventory');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete gift:', error);
    return {
      success: false,
      error: 'Failed to delete gift. It may be referenced by recommendations.',
    };
  }
}

export async function toggleGiftActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(giftInventory)
      .set({ isActive })
      .where(eq(giftInventory.id, id));

    revalidatePath('/admin/inventory');

    return { success: true };
  } catch (error) {
    console.error('Failed to toggle gift active status:', error);
    return {
      success: false,
      error: 'Failed to update gift status.',
    };
  }
}

export async function getGiftCategories(): Promise<string[]> {
  const result = await db
    .selectDistinct({ category: giftInventory.category })
    .from(giftInventory)
    .orderBy(giftInventory.category);

  return result.map((r) => r.category);
}

export async function getInventoryStats(): Promise<{
  total: number;
  active: number;
  byCategory: Record<string, number>;
  byPriceRange: Record<string, number>;
}> {
  const [totalResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(giftInventory);

  const [activeResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(giftInventory)
    .where(eq(giftInventory.isActive, true));

  const categoryResult = await db
    .select({
      category: giftInventory.category,
      count: sql<number>`count(*)::int`,
    })
    .from(giftInventory)
    .groupBy(giftInventory.category);

  const priceRangeResult = await db
    .select({
      priceRange: giftInventory.priceRange,
      count: sql<number>`count(*)::int`,
    })
    .from(giftInventory)
    .groupBy(giftInventory.priceRange);

  return {
    total: totalResult?.count || 0,
    active: activeResult?.count || 0,
    byCategory: Object.fromEntries(categoryResult.map((r) => [r.category, r.count])),
    byPriceRange: Object.fromEntries(priceRangeResult.map((r) => [r.priceRange, r.count])),
  };
}
