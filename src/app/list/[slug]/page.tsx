import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gift, ExternalLink, Check, Sparkles } from 'lucide-react';
import { getPublicSantaList } from '@/actions/santa-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ListPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSantaList(slug);

  if (!data) {
    return {
      title: 'List Not Found',
    };
  }

  const childName = data.profile?.name || 'a special child';
  const itemCount = data.items.length;

  return {
    title: `${childName}'s Gift List`,
    description: `A personalized gift list with ${itemCount} wonderful gift ideas created by Santa's Workshop.`,
    openGraph: {
      title: `${childName}'s Gift List from Santa's Workshop`,
      description: `Check out these ${itemCount} amazing gift recommendations!`,
      type: 'website',
    },
  };
}

export default async function PublicListPage({
  params,
}: ListPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const data = await getPublicSantaList(slug);

  if (!data) {
    notFound();
  }

  const { list, items, recommendations } = data;

  // Map recommendations by gift ID for quick lookup
  const recsByGiftId = new Map(
    recommendations.map((r) => [r.giftId, r])
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-green-100 mb-4">
          <Gift className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {list.name}
        </h1>
        <p className="text-gray-600">
          A personalized gift list from Santa&apos;s Workshop
        </p>
      </div>

      {/* Santa's Note */}
      {list.santaNote && (
        <Card className="mb-8 bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <span className="text-2xl" aria-hidden="true">&#127877;</span>
              A Note from Santa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 italic leading-relaxed whitespace-pre-wrap">
              {list.santaNote}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Gift List */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Gift Ideas
          </h2>
          <span className="text-sm text-gray-500">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </div>

        {items.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item) => {
              const rec = recsByGiftId.get(item.giftId);
              return (
                <Card
                  key={item.id}
                  className={`transition-all ${
                    item.isPurchased
                      ? 'bg-green-50 border-green-200 opacity-75'
                      : ''
                  }`}
                >
                  <CardContent className="pt-6">
                    {item.isPurchased && (
                      <div className="flex items-center gap-1 text-green-600 text-sm mb-2">
                        <Check className="w-4 h-4" />
                        Already purchased!
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      {rec && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {rec.score}% Match
                        </span>
                      )}
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {item.gift.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">
                      {item.gift.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.gift.description}
                    </p>

                    {rec?.reasoning && (
                      <p className="text-green-700 text-xs italic mb-3">
                        &ldquo;{rec.reasoning}&rdquo;
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-gray-500 text-sm mb-3 bg-gray-50 p-2 rounded">
                        Note: {item.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">
                        ${Number(item.gift.price).toFixed(2)}
                      </span>
                      {item.gift.affiliateUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={item.gift.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Product
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No gifts have been added to this list yet.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-br from-red-50 to-green-50 rounded-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Create Your Own Gift List!
        </h3>
        <p className="text-gray-600 mb-4">
          Let Santa&apos;s elves help you find the perfect gifts too.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
            <Gift className="w-4 h-4 mr-2" />
            Start Your List
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Powered by Santa&apos;s AI Workshop. Prices and availability may vary.
        </p>
      </div>
    </div>
  );
}
