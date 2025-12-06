'use server';

import { db } from '@/db';
import { santaLists, santaListItems, giftInventory, kidProfiles, recommendations, analyticsEvents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Generate a unique share slug
function generateShareSlug(): string {
  return nanoid(10);
}

// Add a gift to the Santa list
export async function addToSantaList(
  sessionId: string,
  giftId: string,
  recommendationId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get or create the Santa list for this session
    let [santaList] = await db
      .select()
      .from(santaLists)
      .where(eq(santaLists.sessionId, sessionId))
      .limit(1);

    if (!santaList) {
      // Get profile name for list naming
      const [profile] = await db
        .select()
        .from(kidProfiles)
        .where(eq(kidProfiles.sessionId, sessionId))
        .limit(1);

      const listName = profile ? `${profile.name}'s Gift List` : 'Gift List';

      [santaList] = await db
        .insert(santaLists)
        .values({
          sessionId,
          name: listName,
          isPublic: false,
        })
        .returning();
    }

    // Check if item already in list
    const [existingItem] = await db
      .select()
      .from(santaListItems)
      .where(
        and(
          eq(santaListItems.listId, santaList.id),
          eq(santaListItems.giftId, giftId)
        )
      )
      .limit(1);

    if (existingItem) {
      return { success: true }; // Already added
    }

    // Add the item
    await db.insert(santaListItems).values({
      listId: santaList.id,
      giftId,
      recommendationId: recommendationId || null,
      priority: 0,
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding to Santa list:', error);
    return { success: false, error: 'Failed to add gift to list' };
  }
}

// Remove a gift from the Santa list
export async function removeFromSantaList(
  sessionId: string,
  giftId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const [santaList] = await db
      .select()
      .from(santaLists)
      .where(eq(santaLists.sessionId, sessionId))
      .limit(1);

    if (!santaList) {
      return { success: false, error: 'List not found' };
    }

    await db
      .delete(santaListItems)
      .where(
        and(
          eq(santaListItems.listId, santaList.id),
          eq(santaListItems.giftId, giftId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error('Error removing from Santa list:', error);
    return { success: false, error: 'Failed to remove gift from list' };
  }
}

// Get Santa list items for a session
export async function getSantaListItems(sessionId: string) {
  try {
    const [santaList] = await db
      .select()
      .from(santaLists)
      .where(eq(santaLists.sessionId, sessionId))
      .limit(1);

    if (!santaList) {
      return { items: [], listId: null };
    }

    const items = await db
      .select({
        id: santaListItems.id,
        giftId: santaListItems.giftId,
        notes: santaListItems.notes,
        priority: santaListItems.priority,
        isPurchased: santaListItems.isPurchased,
        gift: giftInventory,
      })
      .from(santaListItems)
      .innerJoin(giftInventory, eq(santaListItems.giftId, giftInventory.id))
      .where(eq(santaListItems.listId, santaList.id));

    return { items, listId: santaList.id };
  } catch (error) {
    console.error('Error getting Santa list:', error);
    return { items: [], listId: null };
  }
}

// Generate or get share URL for a list
export async function shareSantaList(
  sessionId: string
): Promise<{ success: boolean; shareUrl?: string; error?: string }> {
  try {
    const [santaList] = await db
      .select()
      .from(santaLists)
      .where(eq(santaLists.sessionId, sessionId))
      .limit(1);

    if (!santaList) {
      return { success: false, error: 'No list found to share' };
    }

    let shareSlug = santaList.shareSlug;

    // Generate share slug if doesn't exist
    if (!shareSlug) {
      shareSlug = generateShareSlug();
      await db
        .update(santaLists)
        .set({ shareSlug, isPublic: true, updatedAt: new Date() })
        .where(eq(santaLists.id, santaList.id));
    } else if (!santaList.isPublic) {
      // Make public if not already
      await db
        .update(santaLists)
        .set({ isPublic: true, updatedAt: new Date() })
        .where(eq(santaLists.id, santaList.id));
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/list/${shareSlug}`;

    // Track list share event
    await db.insert(analyticsEvents).values({
      sessionId: santaList.sessionId,
      eventType: 'list_shared',
      eventData: {
        listId: santaList.id,
        shareSlug,
      },
    });

    return { success: true, shareUrl };
  } catch (error) {
    console.error('Error sharing Santa list:', error);
    return { success: false, error: 'Failed to generate share link' };
  }
}

// Get public list by share slug
export async function getPublicSantaList(shareSlug: string) {
  try {
    const [santaList] = await db
      .select()
      .from(santaLists)
      .where(
        and(
          eq(santaLists.shareSlug, shareSlug),
          eq(santaLists.isPublic, true)
        )
      )
      .limit(1);

    if (!santaList) {
      return null;
    }

    // Get profile
    const [profile] = await db
      .select()
      .from(kidProfiles)
      .where(eq(kidProfiles.sessionId, santaList.sessionId))
      .limit(1);

    // Get items
    const items = await db
      .select({
        id: santaListItems.id,
        giftId: santaListItems.giftId,
        notes: santaListItems.notes,
        priority: santaListItems.priority,
        isPurchased: santaListItems.isPurchased,
        gift: giftInventory,
      })
      .from(santaListItems)
      .innerJoin(giftInventory, eq(santaListItems.giftId, giftInventory.id))
      .where(eq(santaListItems.listId, santaList.id));

    // Get recommendations for context
    const recs = await db
      .select({
        id: recommendations.id,
        giftId: recommendations.giftId,
        score: recommendations.score,
        reasoning: recommendations.reasoning,
      })
      .from(recommendations)
      .where(eq(recommendations.sessionId, santaList.sessionId));

    return {
      list: santaList,
      profile,
      items,
      recommendations: recs,
    };
  } catch (error) {
    console.error('Error getting public Santa list:', error);
    return null;
  }
}

// Toggle purchased status
export async function togglePurchased(
  itemId: string,
  isPurchased: boolean
): Promise<{ success: boolean }> {
  try {
    // Get item details for tracking
    const [item] = await db
      .select({
        id: santaListItems.id,
        giftId: santaListItems.giftId,
        listId: santaListItems.listId,
        giftName: giftInventory.name,
        price: giftInventory.price,
      })
      .from(santaListItems)
      .innerJoin(giftInventory, eq(santaListItems.giftId, giftInventory.id))
      .where(eq(santaListItems.id, itemId))
      .limit(1);

    await db
      .update(santaListItems)
      .set({ isPurchased })
      .where(eq(santaListItems.id, itemId));

    // Track purchase event
    if (item && isPurchased) {
      // Get sessionId from the list
      const [list] = await db
        .select({ sessionId: santaLists.sessionId })
        .from(santaLists)
        .where(eq(santaLists.id, item.listId))
        .limit(1);

      await db.insert(analyticsEvents).values({
        sessionId: list?.sessionId || null,
        eventType: 'item_purchased',
        eventData: {
          itemId: item.id,
          giftId: item.giftId,
          giftName: item.giftName,
          price: item.price,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling purchased status:', error);
    return { success: false };
  }
}
