/**
 * Ephemeris Edge Function
 * 
 * Purpose: Fetch planetary positions with database caching to reduce NASA API calls
 * 
 * Performance targets:
 * - Cache hit: <100ms
 * - Cache miss: <3s
 * - Cache hit rate: >95%
 * 
 * Security: Protected by Supabase anonymous key (no JWT verification needed for caching)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { fetchFromDatabase, storeInDatabase, logMetric, roundToHour } from './cache.ts';
import { fetchFromHorizons } from './horizons.ts';
import type { EphemerisRequest, EphemerisResponse } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  let supabase;

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const body: EphemerisRequest = await req.json();
    const { date, planet, timezone = 'UTC' } = body;

    if (!date || !planet) {
      await logMetric(supabase, {
        endpoint: 'ephemeris',
        response_time_ms: Date.now() - startTime,
        status_code: 400,
        cache_hit: false,
        error_message: 'Missing required fields: date, planet',
      });

      return new Response(
        JSON.stringify({ error: 'Missing required fields: date, planet' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`[Ephemeris] Request: ${planet} at ${date}`);

    // Round date to nearest hour for cache bucketing
    const requestDate = new Date(date);
    const bucketedDate = roundToHour(requestDate);

    // 1. Try database cache first
    const cached = await fetchFromDatabase(supabase, planet, bucketedDate);

    if (cached) {
      const responseTime = Date.now() - startTime;
      console.log(`[Ephemeris] Cache HIT for ${planet} (${responseTime}ms)`);

      // Log cache hit
      await logMetric(supabase, {
        endpoint: 'ephemeris',
        cache_hit: true,
        cache_source: 'database',
        response_time_ms: responseTime,
        status_code: 200,
        request_params: { date, planet, timezone },
      });

      const response: EphemerisResponse = {
        ...cached,
        cache_status: 'HIT',
        response_time_ms: responseTime,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800', // 30 min CDN cache
          'X-Cache-Status': 'HIT',
          'X-Response-Time': `${responseTime}ms`,
        },
      });
    }

    console.log(`[Ephemeris] Cache MISS for ${planet}, fetching from NASA...`);

    // 2. Cache miss - fetch from NASA Horizons
    const horizonsData = await fetchFromHorizons(planet, bucketedDate);

    if (!horizonsData) {
      throw new Error('Failed to fetch from NASA Horizons');
    }

    // 3. Store in database for future requests
    await storeInDatabase(supabase, planet, bucketedDate, horizonsData);

    const responseTime = Date.now() - startTime;
    console.log(`[Ephemeris] NASA fetch complete for ${planet} (${responseTime}ms)`);

    // Log cache miss
    await logMetric(supabase, {
      endpoint: 'ephemeris',
      cache_hit: false,
      cache_source: 'nasa_horizons',
      response_time_ms: responseTime,
      status_code: 200,
      request_params: { date, planet, timezone },
    });

    const response: EphemerisResponse = {
      ...horizonsData,
      cache_status: 'MISS',
      response_time_ms: responseTime,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800',
        'X-Cache-Status': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[Ephemeris] Error:', error);

    // Log error
    if (supabase) {
      await logMetric(supabase, {
        endpoint: 'ephemeris',
        cache_hit: false,
        response_time_ms: responseTime,
        status_code: 500,
        error_message: error.message,
      });
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        cache_status: 'ERROR',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`,
        },
      }
    );
  }
});
