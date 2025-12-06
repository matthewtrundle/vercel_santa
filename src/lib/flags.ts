import { get } from '@vercel/edge-config';
import { cookies } from 'next/headers';

/**
 * Feature Flags for Santa's Workshop
 *
 * Uses Vercel Edge Config for instant flag reads (<15ms)
 * Supports A/B testing with consistent user bucketing
 */

// Feature flag types
export interface FeatureFlags {
  // A/B test: Hero CTA copy variant
  ctaVariant: 'A' | 'B' | 'C';

  // A/B test: Photo upload required or optional
  requirePhoto: boolean;

  // A/B test: Short form (3 questions) vs full form (5 questions)
  shortForm: boolean;

  // A/B test: Gift results layout
  resultsLayout: 'grid' | 'list';

  // A/B test: Spinner shows coal (naughty theme) vs no coal (nice theme only)
  spinnerShowCoal: boolean;

  // Feature: Show elf "behind the scenes" by default
  expandElfDetails: boolean;

  // Feature: Enable list sharing
  enableSharing: boolean;

  // Feature: Show processing fun facts
  showProcessingFacts: boolean;

  // Maintenance mode
  maintenanceMode: boolean;
}

// Default values when Edge Config is unavailable
const defaultFlags: FeatureFlags = {
  ctaVariant: 'A',
  requirePhoto: true,
  shortForm: false,
  resultsLayout: 'grid',
  spinnerShowCoal: false, // Default to nice-only theme
  expandElfDetails: false,
  enableSharing: true,
  showProcessingFacts: true,
  maintenanceMode: false,
};

/**
 * Get all feature flags from Edge Config
 * Falls back to defaults if Edge Config is not configured
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const flags = await get<Partial<FeatureFlags>>('featureFlags');
    return { ...defaultFlags, ...flags };
  } catch {
    // Edge Config not configured or error - use defaults
    console.warn('Edge Config unavailable, using default feature flags');
    return defaultFlags;
  }
}

/**
 * Get a single feature flag value
 */
export async function getFlag<K extends keyof FeatureFlags>(
  key: K
): Promise<FeatureFlags[K]> {
  try {
    const value = await get<FeatureFlags[K]>(key);
    return value ?? defaultFlags[key];
  } catch {
    return defaultFlags[key];
  }
}

// A/B Testing utilities

/**
 * Get or create a consistent user bucket ID for A/B testing
 * Uses cookies to ensure users see consistent variants
 */
export async function getUserBucket(): Promise<string> {
  const cookieStore = await cookies();
  const existingBucket = cookieStore.get('ab_bucket')?.value;

  if (existingBucket) {
    return existingBucket;
  }

  // Generate new bucket ID (will be set by middleware)
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Determine which variant a user should see based on their bucket
 */
export function getVariant<T>(bucket: string, variants: T[], weights?: number[]): T {
  // Simple hash function to convert bucket to number
  const hash = bucket.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  const normalizedHash = Math.abs(hash) % 100;

  if (weights && weights.length === variants.length) {
    // Weighted distribution
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (normalizedHash < cumulative) {
        return variants[i];
      }
    }
  }

  // Equal distribution
  const index = normalizedHash % variants.length;
  return variants[index];
}

// CTA Variants for A/B testing
export const CTA_VARIANTS = {
  A: {
    text: 'Start Your Gift Journey',
    subtext: 'Find perfect gifts in 2 minutes',
  },
  B: {
    text: 'Find Perfect Gifts Now',
    subtext: "Let Santa's elves help you",
  },
  C: {
    text: 'Let the Magic Begin',
    subtext: 'Discover personalized gift ideas',
  },
} as const;

/**
 * Get CTA content based on variant flag
 */
export function getCTAContent(variant: FeatureFlags['ctaVariant']): {
  text: string;
  subtext: string;
} {
  return CTA_VARIANTS[variant];
}

// Type exports for components
export type CTAVariant = FeatureFlags['ctaVariant'];
export type ResultsLayout = FeatureFlags['resultsLayout'];
