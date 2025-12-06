import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gift, RefreshCw } from 'lucide-react';
import { db } from '@/db';
import { sessions, kidProfiles, recommendations, giftInventory, santaLists, santaListItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GiftCard } from '@/components/results/gift-card';
import { ShareButton } from '@/components/results/share-button';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: 'Your Gift Recommendations',
};

async function getSessionResults(sessionId: string) {
  // Fetch session
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session) return null;

  // Fetch profile
  const [profile] = await db
    .select()
    .from(kidProfiles)
    .where(eq(kidProfiles.sessionId, sessionId))
    .limit(1);

  // Fetch recommendations with gift details
  const recs = await db
    .select({
      id: recommendations.id,
      score: recommendations.score,
      reasoning: recommendations.reasoning,
      matchedInterests: recommendations.matchedInterests,
      rank: recommendations.rank,
      gift: giftInventory,
    })
    .from(recommendations)
    .innerJoin(giftInventory, eq(recommendations.giftId, giftInventory.id))
    .where(eq(recommendations.sessionId, sessionId))
    .orderBy(asc(recommendations.rank));

  // Fetch Santa's note
  const [santaList] = await db
    .select()
    .from(santaLists)
    .where(eq(santaLists.sessionId, sessionId))
    .limit(1);

  // Get items already in list
  let listItemGiftIds: string[] = [];
  if (santaList) {
    const items = await db
      .select({ giftId: santaListItems.giftId })
      .from(santaListItems)
      .where(eq(santaListItems.listId, santaList.id));
    listItemGiftIds = items.map((item) => item.giftId);
  }

  return {
    session,
    profile,
    recommendations: recs,
    santaNote: santaList?.santaNote || null,
    listItemGiftIds,
  };
}

export default async function ResultsPage({
  params,
}: ResultsPageProps): Promise<ReactElement> {
  const { sessionId } = await params;
  const data = await getSessionResults(sessionId);

  if (!data) {
    notFound();
  }

  const { profile, recommendations: recs, santaNote, listItemGiftIds } = data;
  const childName = profile?.name ?? 'your child';
  const hasRealData = recs.length > 0;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4">
          <Gift className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Perfect Gifts for {childName}!
        </h1>
        <p className="text-gray-600">
          Our elves found these amazing recommendations just for you
        </p>
      </div>

      {/* Santa's Note */}
      <Card className="mb-8 bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <span className="text-2xl" aria-hidden="true">&#127877;</span>
            A Note from Santa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 italic leading-relaxed whitespace-pre-wrap">
            {santaNote || (
              `"Ho ho ho! My elves have been working hard to find the perfect
              gifts for ${childName}! I can see they love ${profile?.interests?.slice(0, 2).join(' and ') || 'so many wonderful things'}
              . These recommendations are handpicked just for them. Remember, the
              best gift is always given with love! Merry Christmas!"`
            )}
          </p>
          {!santaNote && (
            <p className="text-red-600 font-semibold mt-4 text-right">
              — Santa Claus
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gift Recommendations */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Top Recommendations
          </h2>
          {listItemGiftIds.length > 0 && (
            <span className="text-sm text-green-600 font-medium">
              {listItemGiftIds.length} gift{listItemGiftIds.length !== 1 ? 's' : ''} in your list
            </span>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {hasRealData ? (
            recs.map((rec) => (
              <GiftCard
                key={rec.id}
                sessionId={sessionId}
                gift={{
                  id: rec.gift.id,
                  name: rec.gift.name,
                  description: rec.gift.description,
                  category: rec.gift.category,
                  price: rec.gift.price,
                  affiliateUrl: rec.gift.affiliateUrl,
                }}
                score={rec.score}
                reasoning={rec.reasoning}
                matchedInterests={(rec.matchedInterests as string[]) || []}
                recommendationId={rec.id}
                isInList={listItemGiftIds.includes(rec.gift.id)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-500">
                No recommendations found. Please try processing again.
              </p>
              <Link href={`/workshop/${sessionId}/processing`}>
                <Button className="mt-4" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Processing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ShareButton sessionId={sessionId} />
        <Link href="/">
          <Button size="lg" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Start New Search
          </Button>
        </Link>
      </div>

      {/* AI-generated disclaimer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Recommendations powered by AI. Prices and availability may vary.
        </p>
      </div>
    </div>
  );
}
