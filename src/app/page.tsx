'use client';

import type { ReactElement } from 'react';
import { useState, useCallback } from 'react';
import { SnowEffect, ScrollNav } from '@/components/magical';
import {
  HeroSection,
  WorkshopIntro,
  ElvesSection,
  SleighSection,
  ReindeerCorral,
  InventoryPreview,
  MagicalFooter,
} from '@/components/sections';
import { GiftJourneyModal } from '@/components/modals';

export default function MagicalHomePage(): ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartJourney = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <main className="relative">
      {/* Global Snow Effect */}
      <SnowEffect snowflakeCount={80} />

      {/* Scroll-based Navigation */}
      <ScrollNav onStartJourney={handleStartJourney} />

      {/* Hero Section */}
      <HeroSection onStartJourney={handleStartJourney} />

      {/* Workshop Introduction */}
      <WorkshopIntro />

      {/* Meet the AI Elves */}
      <ElvesSection />

      {/* Santa's Sleigh */}
      <SleighSection />

      {/* Reindeer Corral */}
      <ReindeerCorral />

      {/* Gift Inventory Preview */}
      <InventoryPreview />

      {/* Magical Footer */}
      <MagicalFooter />

      {/* Gift Journey Modal */}
      <GiftJourneyModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </main>
  );
}
