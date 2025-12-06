'use client';

import { useState, useTransition } from 'react';
import type { ReactElement } from 'react';
import { Share2, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shareSantaList } from '@/actions/santa-list';
import { trackListShared, trackListCopied } from '@/lib/analytics';

interface ShareButtonProps {
  sessionId: string;
}

export function ShareButton({ sessionId }: ShareButtonProps): ReactElement {
  const [isPending, startTransition] = useTransition();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = () => {
    startTransition(async () => {
      setError(null);
      const result = await shareSantaList(sessionId);

      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);

        // Try native share API first (mobile)
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Santa's Gift List",
              text: "Check out this personalized gift list from Santa's Workshop!",
              url: result.shareUrl,
            });
            trackListShared('social', 0);
          } catch {
            // User cancelled or share failed, just show the URL
          }
        } else {
          trackListShared('link', 0);
        }
      } else {
        setError(result.error || 'Failed to generate share link');
      }
    });
  };

  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackListCopied(0);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (shareUrl) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full max-w-md">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Share this link with family and friends!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        size="lg"
        variant="secondary"
        onClick={handleShare}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Share2 className="w-4 h-4 mr-2" />
        )}
        Share Results
      </Button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
