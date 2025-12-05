import type { ReactElement } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gift, Share2, ListPlus, RefreshCw } from 'lucide-react';
import { getSessionWithProfile } from '@/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsPageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: 'Your Gift Recommendations',
};

// Placeholder gift recommendations
const placeholderGifts = [
  {
    id: '1',
    name: 'LEGO Creator 3-in-1 Set',
    description: 'Build and rebuild with this versatile construction set',
    price: '$49.99',
    category: 'Building',
    matchScore: 95,
  },
  {
    id: '2',
    name: 'National Geographic Science Kit',
    description: 'Exciting experiments for curious minds',
    price: '$29.99',
    category: 'Science',
    matchScore: 88,
  },
  {
    id: '3',
    name: 'Art Supply Mega Pack',
    description: 'Everything needed for creative expression',
    price: '$34.99',
    category: 'Creative',
    matchScore: 82,
  },
  {
    id: '4',
    name: 'Kindle Kids Edition',
    description: 'A dedicated reading device with thousands of books',
    price: '$119.99',
    category: 'Books',
    matchScore: 78,
  },
];

export default async function ResultsPage({
  params,
}: ResultsPageProps): Promise<ReactElement> {
  const { sessionId } = await params;
  const data = await getSessionWithProfile(sessionId);

  if (!data) {
    notFound();
  }

  const { profile } = data;
  const childName = profile?.name ?? 'your child';

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
            <span className="text-2xl">🎅</span>
            A Note from Santa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 italic leading-relaxed">
            &quot;Ho ho ho! My elves have been working hard to find the perfect
            gifts for {childName}! I can see they love {profile?.interests?.slice(0, 2).join(' and ') || 'so many wonderful things'}
            . These recommendations are handpicked just for them. Remember, the
            best gift is always given with love! Merry Christmas!&quot;
          </p>
          <p className="text-red-600 font-semibold mt-4 text-right">
            — Santa Claus 🎄
          </p>
        </CardContent>
      </Card>

      {/* Gift Recommendations */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Recommendations
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {placeholderGifts.map((gift) => (
            <Card key={gift.id} className="card-hover">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    {gift.matchScore}% Match
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {gift.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{gift.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{gift.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-green-600">{gift.price}</span>
                  <Button size="sm" variant="outline">
                    <ListPlus className="w-4 h-4 mr-1" />
                    Add to List
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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

      {/* Note about placeholder */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          🚧 This is a demo with placeholder data. Real AI recommendations
          coming soon!
        </p>
      </div>
    </div>
  );
}
