import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gift, Share2, ListPlus, RefreshCw, ExternalLink } from 'lucide-react';
import { db } from '@/db';
import { sessions, kidProfiles, recommendations, giftInventory, santaLists } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  return {
    session,
    profile,
    recommendations: recs,
    santaNote: santaList?.santaNote || null,
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

  const { profile, recommendations: recs, santaNote } = data;
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
            <span className="text-2xl" aria-hidden="true">🎅</span>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {hasRealData ? (
            recs.map((rec) => (
              <Card key={rec.id} className="card-hover">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                      {rec.score}% Match
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {rec.gift.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{rec.gift.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{rec.gift.description}</p>
                  {rec.reasoning && (
                    <p className="text-green-700 text-xs italic mb-3">
                      &ldquo;{rec.reasoning}&rdquo;
                    </p>
                  )}
                  {rec.matchedInterests && (rec.matchedInterests as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(rec.matchedInterests as string[]).slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">
                      ${Number(rec.gift.price).toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      {rec.gift.affiliateUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={rec.gift.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <ListPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback placeholder if no real data
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" variant="secondary">
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </Button>
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
