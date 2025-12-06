'use client';

import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';
import { trackPublicListViewed } from '@/lib/analytics';

interface PublicListTrackerProps {
  itemCount: number;
  children: ReactNode;
}

export function PublicListTracker({
  itemCount,
  children,
}: PublicListTrackerProps): ReactElement {
  useEffect(() => {
    trackPublicListViewed(itemCount);
  }, [itemCount]);

  return <>{children}</>;
}
