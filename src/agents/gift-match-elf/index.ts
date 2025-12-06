'use server';

import { generateText } from 'ai';
import { models } from '@/lib/ai';
import { db } from '@/db';
import { giftInventory } from '@/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import type {
  GiftMatchElfInput,
  GiftMatchElfOutput,
  ScoredRecommendation,
  BudgetTier,
} from '@/types';
import type { Gift } from '@/db/schema';

const GIFT_MATCH_SYSTEM_PROMPT = `You are the Gift Match Elf in Santa's Workshop. Your job is to rank gift candidates based on how well they match the recipient's profile.

RANKING CRITERIA:
1. Interest alignment (40%) - How well does gift match stated interests?
2. Age appropriateness (25%) - Perfect fit for developmental stage?
3. Uniqueness (20%) - Avoid generic, prefer memorable
4. Value (15%) - Good quality within budget tier

For each gift, provide:
- A score from 0-100
- A brief reasoning (1-2 sentences)
- Which interests it matches

OUTPUT as valid JSON array:
[
  {
    "giftId": "uuid",
    "score": number 0-100,
    "reasoning": "Brief explanation of why this gift matches",
    "matchedInterests": ["interest1", "interest2"]
  }
]

Return the top 6-8 gifts sorted by score descending.`;

async function searchGiftInventory(
  categories: string[],
  ageGroup: string,
  budgetTier: BudgetTier,
  limit: number = 20
): Promise<Gift[]> {
  try {
    // Query gifts that match criteria
    const gifts = await db
      .select()
      .from(giftInventory)
      .where(
        and(
          eq(giftInventory.isActive, true),
          eq(giftInventory.priceRange, budgetTier),
          inArray(giftInventory.category, categories)
        )
      )
      .limit(limit);

    // If not enough gifts, expand search to all categories
    if (gifts.length < 10) {
      const moreGifts = await db
        .select()
        .from(giftInventory)
        .where(
          and(
            eq(giftInventory.isActive, true),
            eq(giftInventory.priceRange, budgetTier)
          )
        )
        .limit(limit);

      // Combine and deduplicate
      const allGifts = [...gifts, ...moreGifts];
      const seen = new Set<string>();
      return allGifts.filter((gift) => {
        if (seen.has(gift.id)) return false;
        seen.add(gift.id);
        return true;
      });
    }

    return gifts;
  } catch (error) {
    console.error('Gift search error:', error);
    return [];
  }
}

export async function runGiftMatchElf(
  input: GiftMatchElfInput
): Promise<GiftMatchElfOutput> {
  const { profile } = input;

  try {
    // Search for candidate gifts
    const allCategories = [
      ...profile.giftCategories,
      ...profile.primaryInterests,
    ].filter((cat, idx, arr) => arr.indexOf(cat) === idx);

    const candidates = await searchGiftInventory(
      allCategories,
      profile.ageGroup,
      profile.budgetTier,
      25
    );

    // If no gifts found, return empty recommendations
    if (candidates.length === 0) {
      console.warn('No gift candidates found in inventory');
      return { recommendations: [] };
    }

    // Format candidates for AI ranking
    const candidateList = candidates
      .map(
        (g) =>
          `- ID: ${g.id} | Name: ${g.name} | Category: ${g.category} | Nice Points: ${Math.round(Number(g.price))} | Description: ${g.description.slice(0, 100)}...`
      )
      .join('\n');

    const { text } = await generateText({
      model: models.fast,
      messages: [
        {
          role: 'system',
          content: GIFT_MATCH_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Rank these gifts for the following recipient profile:

RECIPIENT PROFILE:
- Name: ${profile.name}
- Age Group: ${profile.ageGroup}
- Primary Interests: ${profile.primaryInterests.join(', ')}
- Secondary Interests: ${profile.secondaryInterests.join(', ')}
- Personality Traits: ${profile.personalityTraits.join(', ')}
- Budget Tier: ${profile.budgetTier}
${profile.avoidCategories?.length ? `- Avoid: ${profile.avoidCategories.join(', ')}` : ''}

CANDIDATE GIFTS:
${candidateList}

Rank and return the top 6-8 best matching gifts as a JSON array.`,
        },
      ],
    });

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gift Match Elf response as JSON');
    }

    const rankings = JSON.parse(jsonMatch[0]) as Array<{
      giftId: string;
      score: number;
      reasoning: string;
      matchedInterests: string[];
    }>;

    // Map rankings to full gift objects
    const recommendations: ScoredRecommendation[] = rankings
      .map((ranking) => {
        const gift = candidates.find((g) => g.id === ranking.giftId);
        if (!gift) return null;

        return {
          gift,
          score: Math.max(0, Math.min(100, ranking.score)),
          reasoning: ranking.reasoning || 'Great match for this recipient!',
          matchedInterests: ranking.matchedInterests || [],
        };
      })
      .filter((r): r is ScoredRecommendation => r !== null)
      .slice(0, 8);

    return { recommendations };
  } catch (error) {
    console.error('Gift Match Elf error:', error);

    // Fallback: return first few candidates without AI ranking
    const candidates = await searchGiftInventory(
      profile.giftCategories,
      profile.ageGroup,
      profile.budgetTier,
      6
    );

    return {
      recommendations: candidates.map((gift, index) => ({
        gift,
        score: 80 - index * 5,
        reasoning: 'Selected based on category match.',
        matchedInterests: profile.primaryInterests.slice(0, 2),
      })),
    };
  }
}

export type { GiftMatchElfInput, GiftMatchElfOutput };
