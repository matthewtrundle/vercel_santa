'use server';

import { db } from '@/db';
import {
  analyticsEvents,
  sessions,
  kidProfiles,
  recommendations,
  santaListItems,
  santaLists,
  agentRuns,
  giftInventory,
} from '@/db/schema';
import { eq, sql, desc, count, avg, gte } from 'drizzle-orm';

// Track a custom analytics event
export async function trackAnalyticsEvent(
  eventType: string,
  eventData?: Record<string, unknown>,
  sessionId?: string
): Promise<void> {
  await db.insert(analyticsEvents).values({
    sessionId: sessionId || null,
    eventType,
    eventData: eventData || {},
  });
}

// Get overview stats for the dashboard
export async function getAnalyticsOverview() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Total sessions
  const [totalSessionsResult] = await db
    .select({ count: count() })
    .from(sessions);

  // Sessions in last 24 hours
  const [sessions24hResult] = await db
    .select({ count: count() })
    .from(sessions)
    .where(gte(sessions.createdAt, last24Hours));

  // Completed sessions
  const [completedSessionsResult] = await db
    .select({ count: count() })
    .from(sessions)
    .where(eq(sessions.status, 'completed'));

  // Total profiles created
  const [profilesResult] = await db
    .select({ count: count() })
    .from(kidProfiles);

  // Items marked as purchased
  const [purchasedItemsResult] = await db
    .select({ count: count() })
    .from(santaListItems)
    .where(eq(santaListItems.isPurchased, true));

  // Total recommendations generated
  const [recommendationsResult] = await db
    .select({ count: count() })
    .from(recommendations);

  // Shared lists
  const [sharedListsResult] = await db
    .select({ count: count() })
    .from(santaLists)
    .where(eq(santaLists.isPublic, true));

  // Calculate conversion rate
  const totalSessions = totalSessionsResult.count;
  const completedSessions = completedSessionsResult.count;
  const conversionRate = totalSessions > 0
    ? ((completedSessions / totalSessions) * 100).toFixed(1)
    : '0';

  return {
    totalSessions: totalSessions,
    sessions24h: sessions24hResult.count,
    completedSessions: completedSessions,
    conversionRate: `${conversionRate}%`,
    totalProfiles: profilesResult.count,
    purchasedItems: purchasedItemsResult.count,
    totalRecommendations: recommendationsResult.count,
    sharedLists: sharedListsResult.count,
  };
}

// Get age group distribution
export async function getAgeGroupStats() {
  const results = await db
    .select({
      ageGroup: kidProfiles.ageGroup,
      count: count(),
    })
    .from(kidProfiles)
    .groupBy(kidProfiles.ageGroup);

  return results;
}

// Get budget tier distribution
export async function getBudgetTierStats() {
  const results = await db
    .select({
      budgetTier: kidProfiles.budgetTier,
      count: count(),
    })
    .from(kidProfiles)
    .groupBy(kidProfiles.budgetTier);

  return results;
}

// Get most popular interests
export async function getPopularInterests() {
  // Get all profiles with their interests
  const profiles = await db
    .select({ interests: kidProfiles.interests })
    .from(kidProfiles);

  // Count interest occurrences
  const interestCounts: Record<string, number> = {};
  profiles.forEach((profile) => {
    const interests = profile.interests as string[];
    interests?.forEach((interest) => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });

  // Sort by count and return top 10
  return Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([interest, count]) => ({ interest, count }));
}

// Get most recommended gifts
export async function getTopRecommendedGifts() {
  const results = await db
    .select({
      giftId: recommendations.giftId,
      giftName: giftInventory.name,
      category: giftInventory.category,
      count: count(),
      avgScore: avg(recommendations.score),
    })
    .from(recommendations)
    .innerJoin(giftInventory, eq(recommendations.giftId, giftInventory.id))
    .groupBy(recommendations.giftId, giftInventory.name, giftInventory.category)
    .orderBy(desc(count()))
    .limit(10);

  return results;
}

// Get Nice Points (spin) distribution
export async function getNicePointsDistribution() {
  const sessionsWithPoints = await db
    .select({ metadata: sessions.metadata })
    .from(sessions)
    .where(sql`${sessions.metadata}->>'nicePoints' IS NOT NULL`);

  const distribution: Record<string, number> = {
    '0-200': 0,
    '201-400': 0,
    '401-600': 0,
    '601-800': 0,
    '801-1000': 0,
  };

  sessionsWithPoints.forEach((session) => {
    const metadata = session.metadata as Record<string, unknown>;
    const points = metadata?.nicePoints as number;
    if (points !== undefined) {
      if (points <= 200) distribution['0-200']++;
      else if (points <= 400) distribution['201-400']++;
      else if (points <= 600) distribution['401-600']++;
      else if (points <= 800) distribution['601-800']++;
      else distribution['801-1000']++;
    }
  });

  return Object.entries(distribution).map(([range, count]) => ({ range, count }));
}

// Get recent sessions with details
export async function getRecentSessions(limit: number = 20) {
  const recentSessions = await db
    .select({
      id: sessions.id,
      status: sessions.status,
      createdAt: sessions.createdAt,
      completedAt: sessions.completedAt,
      metadata: sessions.metadata,
      photoUrl: sessions.photoUrl,
    })
    .from(sessions)
    .orderBy(desc(sessions.createdAt))
    .limit(limit);

  // Get associated profiles for these sessions
  const sessionIds = recentSessions.map((s) => s.id);
  const profiles = await db
    .select({
      sessionId: kidProfiles.sessionId,
      name: kidProfiles.name,
      age: kidProfiles.age,
      interests: kidProfiles.interests,
      budgetTier: kidProfiles.budgetTier,
    })
    .from(kidProfiles)
    .where(sql`${kidProfiles.sessionId} = ANY(${sessionIds})`);

  // Get recommendation counts
  const recCounts = await db
    .select({
      sessionId: recommendations.sessionId,
      count: count(),
    })
    .from(recommendations)
    .where(sql`${recommendations.sessionId} = ANY(${sessionIds})`)
    .groupBy(recommendations.sessionId);

  // Get list item counts
  const listItemCounts = await db
    .select({
      sessionId: santaLists.sessionId,
      itemCount: count(santaListItems.id),
      purchasedCount: sql<number>`COUNT(CASE WHEN ${santaListItems.isPurchased} THEN 1 END)`,
    })
    .from(santaLists)
    .leftJoin(santaListItems, eq(santaListItems.listId, santaLists.id))
    .where(sql`${santaLists.sessionId} = ANY(${sessionIds})`)
    .groupBy(santaLists.sessionId);

  // Combine data
  return recentSessions.map((session) => {
    const profile = profiles.find((p) => p.sessionId === session.id);
    const recCount = recCounts.find((r) => r.sessionId === session.id);
    const listData = listItemCounts.find((l) => l.sessionId === session.id);
    const metadata = session.metadata as Record<string, unknown>;

    return {
      ...session,
      profile: profile || null,
      recommendationCount: recCount?.count || 0,
      listItemCount: listData?.itemCount || 0,
      purchasedCount: listData?.purchasedCount || 0,
      nicePoints: metadata?.nicePoints as number | undefined,
    };
  });
}

// Get agent performance stats
export async function getAgentPerformanceStats() {
  const results = await db
    .select({
      agentName: agentRuns.agentName,
      totalRuns: count(),
      avgDuration: avg(agentRuns.durationMs),
      successCount: sql<number>`COUNT(CASE WHEN ${agentRuns.status} = 'completed' THEN 1 END)`,
      failureCount: sql<number>`COUNT(CASE WHEN ${agentRuns.status} = 'failed' THEN 1 END)`,
    })
    .from(agentRuns)
    .groupBy(agentRuns.agentName);

  return results.map((r) => ({
    ...r,
    successRate: r.totalRuns > 0
      ? ((Number(r.successCount) / r.totalRuns) * 100).toFixed(1) + '%'
      : '0%',
    avgDurationMs: Math.round(Number(r.avgDuration) || 0),
  }));
}

// Get custom events summary
export async function getCustomEventsSummary() {
  const results = await db
    .select({
      eventType: analyticsEvents.eventType,
      count: count(),
    })
    .from(analyticsEvents)
    .groupBy(analyticsEvents.eventType)
    .orderBy(desc(count()));

  return results;
}

// Get sessions over time (for chart)
export async function getSessionsOverTime(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const results = await db
    .select({
      date: sql<string>`DATE(${sessions.createdAt})`,
      total: count(),
      completed: sql<number>`COUNT(CASE WHEN ${sessions.status} = 'completed' THEN 1 END)`,
    })
    .from(sessions)
    .where(gte(sessions.createdAt, startDate))
    .groupBy(sql`DATE(${sessions.createdAt})`)
    .orderBy(sql`DATE(${sessions.createdAt})`);

  return results;
}
