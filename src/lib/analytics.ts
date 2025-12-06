import { track } from '@vercel/analytics';

/**
 * Custom Analytics Events for Santa's Workshop
 *
 * These events help track user journey through the gift recommendation flow
 * and measure conversion at each step of the funnel.
 */

// Event name constants for type safety
export const AnalyticsEvents = {
  // Journey start
  JOURNEY_STARTED: 'gift_journey_started',

  // Photo upload step
  PHOTO_UPLOADED: 'photo_uploaded',
  PHOTO_SKIPPED: 'photo_skipped',

  // Profile completion
  PROFILE_COMPLETED: 'profile_completed',

  // Processing events
  PROCESSING_STARTED: 'processing_started',
  PROCESSING_COMPLETE: 'processing_complete',
  PROCESSING_ERROR: 'processing_error',

  // Results interactions
  GIFT_VIEWED: 'gift_viewed',
  GIFT_SAVED: 'gift_saved',
  GIFT_REMOVED: 'gift_removed',

  // Sharing
  LIST_SHARED: 'list_shared',
  LIST_COPIED: 'list_copied',

  // A/B test tracking
  EXPERIMENT_VIEWED: 'experiment_viewed',

  // Page engagement
  HOW_IT_WORKS_VIEWED: 'how_it_works_viewed',
} as const;

type EventName = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];

// Type-safe event tracking functions

/**
 * Track when user starts the gift journey
 */
export function trackJourneyStarted(source: 'hero' | 'nav' | 'footer' | 'how-it-works'): void {
  track(AnalyticsEvents.JOURNEY_STARTED, { source });
}

/**
 * Track photo upload
 */
export function trackPhotoUploaded(fileSize: number, fileType: string): void {
  track(AnalyticsEvents.PHOTO_UPLOADED, {
    file_size_kb: Math.round(fileSize / 1024),
    file_type: fileType,
  });
}

/**
 * Track when user skips photo upload
 */
export function trackPhotoSkipped(): void {
  track(AnalyticsEvents.PHOTO_SKIPPED);
}

/**
 * Track profile completion with form data summary
 */
export function trackProfileCompleted(data: {
  hasPhoto: boolean;
  ageGroup: string;
  interestsCount: number;
}): void {
  track(AnalyticsEvents.PROFILE_COMPLETED, data);
}

/**
 * Track AI processing start
 */
export function trackProcessingStarted(): void {
  track(AnalyticsEvents.PROCESSING_STARTED);
}

/**
 * Track AI processing completion
 */
export function trackProcessingComplete(data: {
  durationMs: number;
  giftCount: number;
}): void {
  track(AnalyticsEvents.PROCESSING_COMPLETE, {
    duration_seconds: Math.round(data.durationMs / 1000),
    gift_count: data.giftCount,
  });
}

/**
 * Track processing errors
 */
export function trackProcessingError(error: string): void {
  track(AnalyticsEvents.PROCESSING_ERROR, { error });
}

/**
 * Track when user views a specific gift
 */
export function trackGiftViewed(giftId: string, position: number): void {
  track(AnalyticsEvents.GIFT_VIEWED, {
    gift_id: giftId,
    position,
  });
}

/**
 * Track when user saves a gift to their list
 */
export function trackGiftSaved(giftId: string, giftName: string): void {
  track(AnalyticsEvents.GIFT_SAVED, {
    gift_id: giftId,
    gift_name: giftName,
  });
}

/**
 * Track when user removes a gift from their list
 */
export function trackGiftRemoved(giftId: string): void {
  track(AnalyticsEvents.GIFT_REMOVED, { gift_id: giftId });
}

/**
 * Track list sharing
 */
export function trackListShared(method: 'link' | 'email' | 'social', itemCount: number): void {
  track(AnalyticsEvents.LIST_SHARED, {
    method,
    item_count: itemCount,
  });
}

/**
 * Track link copy
 */
export function trackListCopied(itemCount: number): void {
  track(AnalyticsEvents.LIST_COPIED, { item_count: itemCount });
}

/**
 * Track A/B test variant exposure
 */
export function trackExperimentViewed(experimentName: string, variant: string): void {
  track(AnalyticsEvents.EXPERIMENT_VIEWED, {
    experiment: experimentName,
    variant,
  });
}

/**
 * Track how-it-works page views with scroll depth
 */
export function trackHowItWorksViewed(scrollDepth?: number): void {
  track(AnalyticsEvents.HOW_IT_WORKS_VIEWED, {
    scroll_depth: scrollDepth,
  });
}

/**
 * Generic track function for custom events
 */
export function trackCustomEvent(name: EventName, properties?: Record<string, string | number | boolean>): void {
  track(name, properties);
}
