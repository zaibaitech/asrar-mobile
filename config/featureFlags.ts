/**
 * Feature Flags for Backend Migration
 * 
 * Purpose: Gradual rollout of Edge Function backend
 * 
 * Usage:
 * - Set USE_EDGE_FUNCTIONS to true to enable backend
 * - Adjust ROLLOUT_PERCENT for staged deployment (0-100)
 * - Keep fallback enabled for production safety
 */

export const BACKEND_FEATURE_FLAGS = {
  /**
   * Enable Edge Function backend for ephemeris data
   * When false: Direct NASA API calls (current behavior)
   * When true: Calls Supabase Edge Function with caching
   */
  USE_EPHEMERIS_EDGE_FUNCTION: true,

  /**
   * Enable Edge Function backend for AI features
   * When false: Direct Groq API calls (INSECURE - key exposed)
   * When true: Calls Supabase Edge Function (SECURE - key server-side)
   */
  USE_AI_EDGE_FUNCTION: true,

  /**
   * Rollout percentage (0-100)
   * For staged deployment: start at 10%, then 50%, then 100%
   * Random user sampling based on this percentage
   */
  EDGE_FUNCTION_ROLLOUT_PERCENT: 100,

  /**
   * Enable fallback to direct API calls on Edge Function failure
   * Recommended: true for production (graceful degradation)
   */
  ENABLE_FALLBACK: true,

  /**
   * Log performance metrics to console
   */
  ENABLE_PERFORMANCE_LOGGING: __DEV__,
} as const;

/**
 * Check if current user should use Edge Functions (rollout sampling)
 */
export function shouldUseEdgeFunctions(): boolean {
  if (!BACKEND_FEATURE_FLAGS.USE_EPHEMERIS_EDGE_FUNCTION) {
    return false;
  }

  // Always use in production (100% rollout)
  if (BACKEND_FEATURE_FLAGS.EDGE_FUNCTION_ROLLOUT_PERCENT === 100) {
    return true;
  }

  // Sample based on rollout percentage
  const random = Math.random() * 100;
  return random < BACKEND_FEATURE_FLAGS.EDGE_FUNCTION_ROLLOUT_PERCENT;
}

/**
 * Edge Function endpoints
 */
export const EDGE_FUNCTION_URLS = {
  EPHEMERIS: '/functions/v1/ephemeris',
  AI_REFLECTION: '/functions/v1/ai-reflection',
  PRECOMPUTE: '/functions/v1/precompute-ephemeris',
} as const;
