/**
 * Edge Function Client
 * 
 * Purpose: Centralized client for calling Supabase Edge Functions
 * Features: Automatic retries, error handling, performance logging
 */

import { BACKEND_FEATURE_FLAGS, EDGE_FUNCTION_URLS } from '@/config/featureFlags';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const REQUEST_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

interface EdgeFunctionOptions {
  timeout?: number;
  retries?: number;
  logPerformance?: boolean;
}

/**
 * Call Supabase Edge Function with retry logic
 */
export async function callEdgeFunction<TRequest, TResponse>(
  endpoint: string,
  data: TRequest,
  options: EdgeFunctionOptions = {}
): Promise<TResponse> {
  const {
    timeout = REQUEST_TIMEOUT_MS,
    retries = MAX_RETRIES,
    logPerformance = BACKEND_FEATURE_FLAGS.ENABLE_PERFORMANCE_LOGGING,
  } = options;

  const url = `${SUPABASE_URL}${endpoint}`;
  const startTime = Date.now();

  let lastError: Error | null = null;
  let retryDelay = 1000;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      if (logPerformance) {
        console.log(`[EdgeFunction] Calling ${endpoint} (attempt ${attempt}/${retries})`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Edge Function error: HTTP ${response.status}`
        );
      }

      const result = await response.json();
      const duration = Date.now() - startTime;

      if (logPerformance) {
        const cacheStatus = response.headers.get('X-Cache-Status') || 'UNKNOWN';
        console.log(
          `[EdgeFunction] ${endpoint} completed in ${duration}ms (${cacheStatus})`
        );
      }

      return result as TResponse;
    } catch (error: any) {
      lastError = error;

      if (error.name === 'AbortError') {
        console.warn(`[EdgeFunction] ${endpoint} timeout after ${timeout}ms`);
      } else {
        console.warn(`[EdgeFunction] ${endpoint} failed (attempt ${attempt}):`, error.message);
      }

      if (attempt < retries) {
        console.log(`[EdgeFunction] Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError || new Error(`Edge Function call failed after ${retries} attempts`);
}

/**
 * Fetch planetary position from Edge Function
 */
export interface EphemerisRequest {
  date: string; // ISO 8601
  planet: string;
  timezone?: string;
}

export interface EphemerisResponse {
  planet_id: string;
  longitude: number;
  latitude: number;
  speed: number;
  distance: number;
  zodiac_sign: string;
  zodiac_degree: number;
  is_retrograde: boolean;
  cached_at?: string;
  cache_status?: 'HIT' | 'MISS';
  response_time_ms?: number;
}

export async function fetchEphemerisFromEdgeFunction(
  request: EphemerisRequest
): Promise<EphemerisResponse> {
  return callEdgeFunction<EphemerisRequest, EphemerisResponse>(
    EDGE_FUNCTION_URLS.EPHEMERIS,
    request
  );
}

/**
 * Fetch multiple planets in parallel
 */
export async function fetchMultipleEphemerisFromEdgeFunction(
  date: Date,
  planets: string[],
  timezone: string = 'UTC'
): Promise<Record<string, EphemerisResponse>> {
  const results = await Promise.all(
    planets.map(async (planet) => {
      const response = await fetchEphemerisFromEdgeFunction({
        date: date.toISOString(),
        planet,
        timezone,
      });
      return { planet, response };
    })
  );

  const positions: Record<string, EphemerisResponse> = {};
  for (const { planet, response } of results) {
    positions[planet] = response;
  }

  return positions;
}

/**
 * AI Reflection Edge Function
 */
export interface AIReflectionRequest {
  originalText: string;
  tone: 'formal' | 'conversational' | 'poetic' | 'spiritual' | 'scholarly';
  locale?: string;
  model?: string;
  temperature?: number;
}

export interface AIReflectionResponse {
  rewrittenText: string;
  aiAssisted: boolean;
  tone: string;
  locale: string;
  model: string;
  cached?: boolean;
  error?: string;
}

export async function callAIReflectionEdgeFunction(
  request: AIReflectionRequest
): Promise<AIReflectionResponse> {
  try {
    return await callEdgeFunction<AIReflectionRequest, AIReflectionResponse>(
      EDGE_FUNCTION_URLS.AI_REFLECTION,
      request,
      { timeout: 20000 } // AI calls can take longer
    );
  } catch (error: any) {
    // Return original text on error (graceful degradation)
    console.error('[EdgeFunction] AI Reflection failed:', error.message);
    return {
      rewrittenText: request.originalText,
      aiAssisted: false,
      tone: request.tone,
      locale: request.locale || 'en',
      model: request.model || 'unknown',
      error: error.message,
    };
  }
}
