import { flag } from 'flags/next';

/**
 * Vercel Flags SDK configuration for Santa's Workshop.
 *
 * These flags automatically integrate with:
 * - Vercel Web Analytics (flag values are tracked)
 * - Vercel Toolbar (can override flags in development)
 * - Edge Middleware (for personalization)
 */

/**
 * Beta Features Flag
 * Enable experimental features for testing
 */
export const betaFeaturesFlag = flag<boolean>({
  key: 'beta-features',
  description: 'Enable beta features for testers',
  defaultValue: false,
  decide: async () => {
    // Could add logic based on user, % rollout, etc.
    // For demo, check environment variable
    return process.env.ENABLE_BETA_FEATURES === 'true';
  },
  options: [
    { value: true, label: 'Enabled' },
    { value: false, label: 'Disabled' },
  ],
});

/**
 * New Reindeer Animations Flag
 * Toggle enhanced animation styles
 */
export const newReindeerAnimationsFlag = flag<boolean>({
  key: 'new-reindeer-animations',
  description: 'Enable new reindeer animation styles',
  defaultValue: false,
  decide: async () => {
    // 20% rollout
    return Math.random() < 0.2;
  },
  options: [
    { value: true, label: 'New Animations' },
    { value: false, label: 'Classic Animations' },
  ],
});

/**
 * AI Model Upgrade Flag
 * Use upgraded AI models for recommendations
 */
export const aiModelUpgradeFlag = flag<boolean>({
  key: 'ai-model-upgrade',
  description: 'Use upgraded AI models for better recommendations',
  defaultValue: true,
  decide: async () => {
    return true; // Always use upgraded models
  },
  options: [
    { value: true, label: 'Upgraded Models' },
    { value: false, label: 'Standard Models' },
  ],
});

/**
 * Recommendation Algorithm Experiment
 * A/B test different recommendation strategies
 */
export const recommendationAlgorithmFlag = flag<'default' | 'collaborative' | 'content-based'>({
  key: 'recommendation-algorithm',
  description: 'Which recommendation algorithm to use',
  defaultValue: 'default',
  decide: async () => {
    const rand = Math.random();
    if (rand < 0.33) return 'collaborative';
    if (rand < 0.66) return 'content-based';
    return 'default';
  },
  options: [
    { value: 'default', label: 'Default Algorithm' },
    { value: 'collaborative', label: 'Collaborative Filtering' },
    { value: 'content-based', label: 'Content-Based' },
  ],
});

/**
 * Workshop Layout Experiment
 * A/B test different UI layouts
 */
export const workshopLayoutFlag = flag<'classic' | 'modern' | 'minimal'>({
  key: 'workshop-layout',
  description: 'Which workshop UI layout to show',
  defaultValue: 'classic',
  decide: async () => {
    const rand = Math.random();
    if (rand < 0.33) return 'modern';
    if (rand < 0.66) return 'minimal';
    return 'classic';
  },
  options: [
    { value: 'classic', label: 'Classic Layout' },
    { value: 'modern', label: 'Modern Layout' },
    { value: 'minimal', label: 'Minimal Layout' },
  ],
});

/**
 * Spinner Coal Flag
 * A/B test whether to show coal option in Nice Points spinner
 */
export const spinnerShowCoalFlag = flag<boolean>({
  key: 'spinner-show-coal',
  description: 'Whether to show coal as a possible outcome in the spinner',
  defaultValue: false,
  decide: async () => {
    // 50/50 A/B test
    return Math.random() < 0.5;
  },
  options: [
    { value: true, label: 'Show Coal' },
    { value: false, label: 'No Coal' },
  ],
});
