import Statsig from 'statsig-node';

// Track initialization state
let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

// User interface for Statsig
export interface StatsigUser {
  userID: string;
  email?: string;
  custom?: Record<string, string | number | boolean | string[]>;
}

/**
 * Initialize Statsig SDK (server-side only).
 * Safe to call multiple times - will only initialize once.
 */
export async function initStatsig(): Promise<void> {
  // If already initialized, return immediately
  if (isInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  const serverKey = process.env.STATSIG_SERVER_API_KEY;

  if (!serverKey) {
    console.warn('[Statsig] No STATSIG_SERVER_API_KEY found. Feature flags will return defaults.');
    isInitialized = true;
    return;
  }

  initializationPromise = (async () => {
    try {
      await Statsig.initialize(serverKey, {
        environment: { tier: process.env.NODE_ENV },
      });
      isInitialized = true;
      console.log('[Statsig] Initialized successfully');
    } catch (error) {
      console.error('[Statsig] Failed to initialize:', error);
      isInitialized = true; // Mark as initialized to prevent retries
    }
  })();

  return initializationPromise;
}

/**
 * Check if a feature gate (flag) is enabled for a user.
 * Returns false if Statsig is not configured.
 */
export async function checkFeatureGate(
  gateName: string,
  user: StatsigUser
): Promise<boolean> {
  await initStatsig();

  if (!process.env.STATSIG_SERVER_API_KEY) {
    return false;
  }

  try {
    return Statsig.checkGate(user, gateName);
  } catch (error) {
    console.error(`[Statsig] Error checking gate "${gateName}":`, error);
    return false;
  }
}

/**
 * Get a dynamic config (remote config) for a user.
 * Returns empty object if Statsig is not configured.
 */
export async function getDynamicConfig(
  configName: string,
  user: StatsigUser
): Promise<Record<string, unknown>> {
  await initStatsig();

  if (!process.env.STATSIG_SERVER_API_KEY) {
    return {};
  }

  try {
    const config = Statsig.getConfig(user, configName);
    return config.value as Record<string, unknown>;
  } catch (error) {
    console.error(`[Statsig] Error getting config "${configName}":`, error);
    return {};
  }
}

/**
 * Get an experiment value for a user.
 * Returns empty object if Statsig is not configured.
 */
export async function getExperiment(
  experimentName: string,
  user: StatsigUser
): Promise<Record<string, unknown>> {
  await initStatsig();

  if (!process.env.STATSIG_SERVER_API_KEY) {
    return {};
  }

  try {
    const experiment = Statsig.getExperiment(user, experimentName);
    return experiment.value as Record<string, unknown>;
  } catch (error) {
    console.error(`[Statsig] Error getting experiment "${experimentName}":`, error);
    return {};
  }
}

/**
 * Log an event to Statsig for analytics.
 */
export async function logEvent(
  user: StatsigUser,
  eventName: string,
  value?: string | number,
  metadata?: Record<string, string>
): Promise<void> {
  await initStatsig();

  if (!process.env.STATSIG_SERVER_API_KEY) {
    return;
  }

  try {
    Statsig.logEvent(user, eventName, value, metadata);
  } catch (error) {
    console.error(`[Statsig] Error logging event "${eventName}":`, error);
  }
}

/**
 * Flush pending events before shutdown.
 * Call this in graceful shutdown handlers.
 */
export async function flushEvents(): Promise<void> {
  if (isInitialized && process.env.STATSIG_SERVER_API_KEY) {
    try {
      await Statsig.flush();
    } catch (error) {
      console.error('[Statsig] Error flushing events:', error);
    }
  }
}

/**
 * Common feature gates used in Santa's Workshop.
 * Add new feature flags here as constants for type safety.
 */
export const FEATURE_GATES = {
  // Example: Enable new reindeer animation styles
  NEW_REINDEER_ANIMATIONS: 'new_reindeer_animations',
  // Example: Show beta features to testers
  BETA_FEATURES: 'beta_features',
  // Example: Enable AI model upgrades
  AI_MODEL_UPGRADE: 'ai_model_upgrade',
} as const;

/**
 * Common experiments used in Santa's Workshop.
 */
export const EXPERIMENTS = {
  // Example: Test different recommendation algorithms
  RECOMMENDATION_ALGORITHM: 'recommendation_algorithm',
  // Example: Test different UI layouts
  WORKSHOP_LAYOUT: 'workshop_layout',
} as const;
