'use client';

import type { ReactElement } from 'react';
import Link from 'next/link';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackJourneyStarted } from '@/lib/analytics';

export function HowItWorksCta(): ReactElement {
  const handleClick = () => {
    trackJourneyStarted('how-it-works');
  };

  return (
    <Link href="/workshop/start" onClick={handleClick}>
      <Button
        size="xl"
        className="bg-white text-red-600 hover:bg-gray-100"
      >
        <Gift className="mr-2 h-5 w-5" />
        Start Your Gift Journey
      </Button>
    </Link>
  );
}
