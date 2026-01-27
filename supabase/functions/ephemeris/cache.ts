// @ts-nocheck
/**
 * Database cache layer for ephemeris data
 */

import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { PlanetPosition } from './types.ts';

const CACHE_TTL_HOURS = 48;

/**
 * Fetch planet position from database cache
 */
export async function fetchFromDatabase(
  supabase: SupabaseClient,
  planet: string,
  date: Date
): Promise<PlanetPosition | null> {
  try {
    const { data, error } = await supabase
      .from('ephemeris_cache')
      .select('*')
      .eq('planet_id', planet.toLowerCase())
      .eq('date_hour', date.toISOString())
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - not an error, just cache miss
        return null;
      }
      console.error('[Cache] Database error:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      planet_id: data.planet_id,
      longitude: parseFloat(data.longitude),
      latitude: parseFloat(data.latitude),
      speed: parseFloat(data.speed),
      distance: parseFloat(data.distance),
      zodiac_sign: data.zodiac_sign,
      zodiac_degree: parseFloat(data.zodiac_degree),
      is_retrograde: data.is_retrograde || false,
      cached_at: data.cached_at,
    };
  } catch (error) {
    console.error('[Cache] Error fetching from database:', error);
    return null;
  }
}

/**
 * Store planet position in database cache
 */
export async function storeInDatabase(
  supabase: SupabaseClient,
  planet: string,
  date: Date,
  data: PlanetPosition
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + CACHE_TTL_HOURS * 60 * 60 * 1000);

    const { error } = await supabase.from('ephemeris_cache').upsert(
      {
        planet_id: planet.toLowerCase(),
        date_hour: date.toISOString(),
        longitude: data.longitude.toString(),
        latitude: data.latitude.toString(),
        speed: data.speed.toString(),
        distance: data.distance.toString(),
        zodiac_sign: data.zodiac_sign,
        zodiac_degree: data.zodiac_degree.toString(),
        is_retrograde: data.is_retrograde,
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: 'planet_id,date_hour',
      }
    );

    if (error) {
      console.error('[Cache] Error storing in database:', error);
      // Don't throw - cache write failures shouldn't break the response
    }
  } catch (error) {
    console.error('[Cache] Exception storing in database:', error);
  }
}

/**
 * Log API call metrics
 */
export async function logMetric(
  supabase: SupabaseClient,
  metric: {
    endpoint: string;
    method?: string;
    user_id?: string;
    session_id?: string;
    response_time_ms: number;
    status_code: number;
    cache_hit: boolean;
    cache_source?: string;
    error_message?: string;
    request_params?: Record<string, unknown>;
  }
): Promise<void> {
  try {
    await supabase.from('api_call_metrics').insert({
      endpoint: metric.endpoint,
      method: metric.method || 'POST',
      user_id: metric.user_id,
      session_id: metric.session_id,
      response_time_ms: metric.response_time_ms,
      status_code: metric.status_code,
      cache_hit: metric.cache_hit,
      cache_source: metric.cache_source,
      error_message: metric.error_message,
      request_params: metric.request_params,
    });
  } catch (error) {
    // Log to console but don't fail the request
    console.error('[Metrics] Error logging metric:', error);
  }
}

/**
 * Round date to nearest hour for cache bucketing
 */
export function roundToHour(date: Date): Date {
  const rounded = new Date(date);
  rounded.setMinutes(0, 0, 0);
  return rounded;
}
