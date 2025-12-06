'use client';

import { useState, useTransition } from 'react';
import type { ReactElement } from 'react';
import { ExternalLink, ScrollText, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addToSantaList, removeFromSantaList } from '@/actions/santa-list';
import { trackGiftSaved, trackGiftRemoved, trackGiftViewed } from '@/lib/analytics';

interface Gift {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  affiliateUrl: string | null;
}

interface GiftCardProps {
  sessionId: string;
  gift: Gift;
  score: number;
  reasoning: string | null;
  matchedInterests: string[];
  recommendationId: string;
  isInList: boolean;
}

export function GiftCard({
  sessionId,
  gift,
  score,
  reasoning,
  matchedInterests,
  recommendationId,
  isInList: initialIsInList,
}: GiftCardProps): ReactElement {
  const [isInList, setIsInList] = useState(initialIsInList);
  const [isPending, startTransition] = useTransition();

  const handleToggleList = () => {
    startTransition(async () => {
      if (isInList) {
        const result = await removeFromSantaList(sessionId, gift.id);
        if (result.success) {
          setIsInList(false);
          trackGiftRemoved(gift.id);
        }
      } else {
        const result = await addToSantaList(sessionId, gift.id, recommendationId);
        if (result.success) {
          setIsInList(true);
          trackGiftSaved(gift.id, gift.name);
        }
      }
    });
  };

  const handleViewProduct = () => {
    trackGiftViewed(gift.id, 0);
  };

  return (
    <Card className={`card-hover transition-all ${isInList ? 'ring-2 ring-green-500 bg-green-50/30' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
            {score}% Match
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
            {gift.category}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-1">{gift.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{gift.description}</p>

        {reasoning && (
          <p className="text-green-700 text-xs italic mb-3">
            &ldquo;{reasoning}&rdquo;
          </p>
        )}

        {matchedInterests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {matchedInterests.slice(0, 3).map((interest) => (
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
            ${Number(gift.price).toFixed(2)}
          </span>
          <div className="flex gap-2">
            {gift.affiliateUrl && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={gift.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleViewProduct}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </a>
              </Button>
            )}
            <Button
              size="sm"
              variant={isInList ? 'default' : 'outline'}
              onClick={handleToggleList}
              disabled={isPending}
              className={isInList ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isInList ? (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  On List!
                </>
              ) : (
                <>
                  <ScrollText className="w-4 h-4 mr-1" />
                  Add to List
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
