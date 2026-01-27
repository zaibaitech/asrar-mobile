// @ts-nocheck
/**
 * AI Reflection Edge Function
 * 
 * Purpose: Secure Groq API calls server-side with caching
 * 
 * SECURITY: Moves GROQ_API_KEY from client to server
 * PERFORMANCE: Caches identical requests for 5 minutes
 * COST: Reduces duplicate API calls
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const CACHE_TTL_MINUTES = 5;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIReflectionRequest {
  originalText: string;
  tone: 'formal' | 'conversational' | 'poetic' | 'spiritual' | 'scholarly';
  locale?: string;
  model?: string;
  temperature?: number;
}

interface AIReflectionResponse {
  rewrittenText: string;
  aiAssisted: boolean;
  tone: string;
  locale: string;
  model: string;
  cached?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  let supabase;

  try {
    // Get environment variables
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request
    const body: AIReflectionRequest = await req.json();
    const {
      originalText,
      tone,
      locale = 'en',
      model = 'mixtral-8x7b-32768',
      temperature = 0.7,
    } = body;

    if (!originalText || !tone) {
      await logMetric(supabase, {
        endpoint: 'ai-reflection',
        response_time_ms: Date.now() - startTime,
        status_code: 400,
        cache_hit: false,
        error_message: 'Missing required fields: originalText, tone',
      });

      return new Response(
        JSON.stringify({ error: 'Missing required fields: originalText, tone' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`[AI-Reflection] Request: ${tone} tone, ${locale} locale`);

    // Check cache (5-minute TTL for identical requests)
    const cacheKey = createCacheKey(originalText, tone, locale);
    const cached = await checkAICache(supabase, cacheKey);

    if (cached) {
      const responseTime = Date.now() - startTime;
      console.log(`[AI-Reflection] Cache HIT (${responseTime}ms)`);

      await logMetric(supabase, {
        endpoint: 'ai-reflection',
        cache_hit: true,
        cache_source: 'database',
        response_time_ms: responseTime,
        status_code: 200,
      });

      return new Response(
        JSON.stringify({
          ...cached,
          cached: true,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache-Status': 'HIT',
            'X-Response-Time': `${responseTime}ms`,
          },
        }
      );
    }

    console.log(`[AI-Reflection] Cache MISS, calling Groq API...`);

    // Build prompts
    const systemPrompt = buildSystemPrompt(tone, locale);
    const userPrompt = buildUserPrompt(originalText, tone);

    // Call Groq API
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API error ${groqResponse.status}: ${errorText}`);
    }

    const groqData = await groqResponse.json();
    const rewrittenText = groqData.choices[0]?.message?.content;

    if (!rewrittenText) {
      throw new Error('No response from Groq API');
    }

    const result: AIReflectionResponse = {
      rewrittenText,
      aiAssisted: true,
      tone,
      locale,
      model,
      cached: false,
    };

    // Store in cache
    await storeAICache(supabase, cacheKey, result);

    const responseTime = Date.now() - startTime;
    console.log(`[AI-Reflection] Groq API complete (${responseTime}ms)`);

    // Log metrics
    await logMetric(supabase, {
      endpoint: 'ai-reflection',
      cache_hit: false,
      cache_source: 'groq_api',
      response_time_ms: responseTime,
      status_code: 200,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache-Status': 'MISS',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error('[AI-Reflection] Error:', error);

    if (supabase) {
      await logMetric(supabase, {
        endpoint: 'ai-reflection',
        cache_hit: false,
        response_time_ms: responseTime,
        status_code: 500,
        error_message: error.message,
      });
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        aiAssisted: false,
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

/**
 * Create cache key from request parameters
 */
function createCacheKey(text: string, tone: string, locale: string): string {
  const content = `${text}:${tone}:${locale}`;
  // Simple hash using btoa (for production, use crypto.subtle.digest)
  return btoa(content).slice(0, 64);
}

/**
 * Check AI response cache
 */
async function checkAICache(supabase: any, cacheKey: string): Promise<any | null> {
  const ttlMinutes = CACHE_TTL_MINUTES;
  const expiryTime = new Date(Date.now() - ttlMinutes * 60 * 1000);

  const { data, error } = await supabase
    .from('ai_response_cache')
    .select('response_data')
    .eq('cache_key', cacheKey)
    .gt('cached_at', expiryTime.toISOString())
    .single();

  if (error || !data) {
    return null;
  }

  // Increment hit count
  await supabase
    .from('ai_response_cache')
    .update({ hit_count: supabase.sql`hit_count + 1` })
    .eq('cache_key', cacheKey);

  return data.response_data;
}

/**
 * Store AI response in cache
 */
async function storeAICache(supabase: any, cacheKey: string, data: any): Promise<void> {
  try {
    await supabase.from('ai_response_cache').upsert(
      {
        cache_key: cacheKey,
        response_data: data,
        request_type: 'reflection',
        locale: data.locale,
        model: data.model,
        cached_at: new Date().toISOString(),
      },
      { onConflict: 'cache_key' }
    );
  } catch (error) {
    console.error('[AI-Reflection] Cache store error:', error);
  }
}

/**
 * Build system prompt based on tone and locale
 */
function buildSystemPrompt(tone: string, locale: string): string {
  const basePrompt = `You are an Islamic spiritual guidance assistant specializing in personalized reflections.

Your role is to rewrite user reflections in a ${tone} tone while maintaining the original meaning and intent.

Guidelines:
- Preserve the core message and spiritual insights
- Adapt the language style to be ${tone}
- Keep the response concise and meaningful
- Maintain Islamic authenticity and respect
- Use ${locale === 'ar' ? 'Arabic' : locale === 'fr' ? 'French' : 'English'} naturally`;

  return basePrompt;
}

/**
 * Build user prompt
 */
function buildUserPrompt(text: string, tone: string): string {
  return `Rewrite the following spiritual reflection in a ${tone} tone:\n\n${text}`;
}

/**
 * Log metrics to database
 */
async function logMetric(
  supabase: any,
  metric: {
    endpoint: string;
    response_time_ms: number;
    status_code: number;
    cache_hit: boolean;
    cache_source?: string;
    error_message?: string;
  }
): Promise<void> {
  try {
    await supabase.from('api_call_metrics').insert(metric);
  } catch (error) {
    console.error('[Metrics] Error logging:', error);
  }
}
