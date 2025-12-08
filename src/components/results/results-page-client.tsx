'use client';

import type { ReactElement, ReactNode } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WishListDrawer } from './wish-list-drawer';
import { trackResultsViewed, trackWishListOpened } from '@/lib/analytics';

interface ResultsPageClientProps {
  sessionId: string;
  initialListCount: number;
  giftCount: number;
  nicePoints: number;
  children: ReactNode;
}

export function ResultsPageClient({
  sessionId,
  initialListCount,
  giftCount,
  nicePoints,
  children,
}: ResultsPageClientProps): ReactElement {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [listCount, setListCount] = useState(initialListCount);

  // Track results page view on mount
  useEffect(() => {
    trackResultsViewed(giftCount);
  }, [giftCount]);

  const handleOpenDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    trackWishListOpened(listCount);
  }, [listCount]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleItemRemoved = useCallback(() => {
    setListCount((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <>
      {/* Floating Wish List Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleOpenDrawer}
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-14 px-6"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          My List
          {listCount > 0 && (
            <span className="ml-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {listCount}
            </span>
          )}
        </Button>
      </div>

      {/* Wish List Drawer */}
      <WishListDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        sessionId={sessionId}
        nicePoints={nicePoints}
        onItemRemoved={handleItemRemoved}
      />

      {/* Page Content */}
      {children}
    </>
  );
}
