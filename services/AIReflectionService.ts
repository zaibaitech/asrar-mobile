/**
 * AI Reflection Service
 * ====================
 * Phase 6: Optional AI assistance for polishing Divine Timing guidance wording
 * 
 * CRITICAL RULES:
 * 1. AI is OFF by default (user must enable)
 * 2. AI ONLY rewrites existing deterministic outputs
 * 3. AI NEVER computes timing, elements, cycles, or decisions
 * 4. AI NEVER predicts outcomes or gives religious rulings
 * 5. Structure must be preserved exactly
 * 6. Silent fallback to original text if AI fails
 * 7. No logging of user data
 * 
 * SECURITY FIXES (Phase 6.1):
 * ⚠️ API key exposed in client - MUST move to server endpoint for production
 * ✅ Schema validation with Zod
 * ✅ Strict array length checking
 * ✅ Silent fallback (no console logs in production)
 */

import {
    AIRewriteRequest,
    AIRewriteResponse,
    AISettings,
    AITone,
    DEFAULT_AI_SETTINGS,
    IstikharaAIRewriteRequest,
    IstikharaAIRewriteResponse,
} from '@/types/ai-settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

// ============================================================================
// CONFIGURATION
// ============================================================================

const AI_SETTINGS_KEY = '@divine_timing_ai_settings';

/**
 * ⚠️ SECURITY WARNING: API key exposed in client code
 * 
 * EXPO_PUBLIC_* variables are bundled into the app and can be extracted.
 * This means users/attackers can take your key and use it.
 * 
 * PRODUCTION FIX REQUIRED:
 * - Move Groq calls to a server endpoint (Supabase Edge Function, Cloudflare Worker, etc.)
 * - Mobile app calls your endpoint, not Groq directly
 * - Keep the Groq key only on the server
 * 
 * Current setup is for DEVELOPMENT ONLY.
 */
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Feature flag: Build-time AI capability
 * 
 * Two-level control:
 * 1. ENABLE_AI_CAPABILITY (build-time): Can this build use AI at all?
 * 2. settings.enabled (runtime): Has the user enabled AI?
 * 
 * AI only runs if BOTH are true.
 * 
 * For production: Set to true and use settings.enabled for user control.
 * For development: Can disable here to prevent all AI calls.
 */
const ENABLE_AI_CAPABILITY = true; // Build-time capability flag

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Zod schema for AI rewrite response validation
 * Enforces exact structure and prevents malformed responses
 */
const AIRewriteResponseSchema = z.object({
  summaryTitle: z.string().min(1),
  timingSignal: z.string().min(1),
  recommendedApproach: z.array(z.string()),
  watchOuts: z.array(z.string()),
  nextStep: z.string().min(1),
  reflection: z.object({
    verseReference: z.string().optional(),
    reflectionPrompt: z.string(),
  }).optional(),
  disclaimer: z.string(),
  aiAssisted: z.boolean(),
});

const IstikharaAIRewriteResponseSchema = z.object({
  observationalSummary: z.string().min(1),
  aiAssisted: z.boolean(),
});

// ============================================================================
// JSON EXTRACTION HELPERS
// ============================================================================

/**
 * Extract JSON from AI response
 * Handles markdown code fences, extra text, and various edge cases
 * 
 * Examples handled:
 * - "```json\n{...}\n```"
 * - "Here's the result:\n{...}"
 * - "{...}\n\nLet me know if..."
 * - Plain "{...}"
 */
function extractJSON(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }
  
  // Try 1: Extract from markdown code fences (```json ... ``` or ``` ... ```)
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // Try 2: Find JSON object by braces (first { to last })
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = text.substring(firstBrace, lastBrace + 1);
    
    // Verify it looks like valid JSON structure
    try {
      JSON.parse(extracted);
      return extracted;
    } catch {
      // Not valid JSON, continue
    }
  }
  
  // Try 3: Maybe it's already pure JSON
  try {
    JSON.parse(text.trim());
    return text.trim();
  } catch {
    // Not pure JSON
  }
  
  return null;
}

// ============================================================================
// SETTINGS PERSISTENCE
// ============================================================================

/**
 * Load AI settings from AsyncStorage
 */
export async function loadAISettings(): Promise<AISettings> {
  try {
    const stored = await AsyncStorage.getItem(AI_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_AI_SETTINGS;
  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Failed to load settings:', error);
    }
    return DEFAULT_AI_SETTINGS;
  }
}

/**
 * Save AI settings to AsyncStorage
 */
export async function saveAISettings(settings: AISettings): Promise<void> {
  try {
    await AsyncStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    if (__DEV__) {
      console.error('[AI] Failed to save settings:', error);
    }
    throw error;
  }
}

/**
 * Check if AI is available
 * Requires:
 * 1. Build-time capability flag (ENABLE_AI_CAPABILITY)
 * 2. User settings enabled
 * 3. API key present
 */
export async function isAIAvailable(): Promise<boolean> {
  // Build-time capability check
  if (!ENABLE_AI_CAPABILITY) {
    return false;
  }
  
  // API key check (will be server endpoint in production)
  if (!GROQ_API_KEY) {
    if (__DEV__) {
      console.warn('[AI] Groq API key not found. Set EXPO_PUBLIC_GROQ_API_KEY in .env');
    }
    return false;
  }
  
  // User settings check
  const settings = await loadAISettings();
  return settings.enabled;
}

// ============================================================================
// AI SYSTEM PROMPT
// ============================================================================

/**
 * Build strict system prompt with safety rules
 */
function buildSystemPrompt(): string {
  return `You are a spiritual guidance editor for a Muslim reflection app.

STRICT RULES - MUST FOLLOW:
1. NEVER predict outcomes or future events
2. NEVER give religious rulings (fatwas) or verdicts
3. NEVER add new advice, recommendations, or interpretations
4. ONLY rewrite existing text for clarity and warmth
5. PRESERVE the exact structure and meaning
6. DO NOT change the count of bullet points
7. DO NOT add or remove sections
8. KEEP the disclaimer VERBATIM (word-for-word)
9. If Qur'an context provided, use for tone ONLY - NEVER interpret the verse

Your role: Polish wording only, nothing else.

Return ONLY valid JSON. No markdown, no extra text.`;
}

/**
 * Get tone-specific instructions
 * 
 * ⚠️ Warning: If Qur'an context is provided, never interpret or explain its meaning.
 * Use it only as background context for tone/warmth.
 */
function getToneInstructions(tone: AITone): string {
  switch (tone) {
    case 'concise':
      return 'Keep it brief and direct. No extra words.';
    case 'calm':
      return 'Use gentle, reassuring language. Warm but not flowery.';
    case 'reflective':
      return 'Invite contemplation. Use thoughtful, measured phrasing.';
    case 'poetic':
      return 'Use elegant, flowing language. Maintain dignity and beauty.';
  }
}

/**
 * Strict validation of AI response against original
 * Enforces Phase 6 constraints: structure preservation, no added advice
 */
function validateAIResponse(
  original: AIRewriteRequest['originalGuidance'],
  aiResponse: z.infer<typeof AIRewriteResponseSchema>
): { valid: boolean; reason?: string } {
  // Array length must match exactly
  if (aiResponse.recommendedApproach.length !== original.recommendedApproach.length) {
    return {
      valid: false,
      reason: `recommendedApproach length mismatch: expected ${original.recommendedApproach.length}, got ${aiResponse.recommendedApproach.length}`,
    };
  }
  
  if (aiResponse.watchOuts.length !== original.watchOuts.length) {
    return {
      valid: false,
      reason: `watchOuts length mismatch: expected ${original.watchOuts.length}, got ${aiResponse.watchOuts.length}`,
    };
  }
  
  // Disclaimer must be verbatim
  if (aiResponse.disclaimer !== original.disclaimer) {
    return {
      valid: false,
      reason: 'Disclaimer was modified (must be verbatim)',
    };
  }
  
  // Basic length check for nextStep (shouldn't add paragraphs)
  if (aiResponse.nextStep.length > original.nextStep.length * 2) {
    return {
      valid: false,
      reason: 'nextStep is too long (possible new advice added)',
    };
  }
  
  return { valid: true };
}

// ============================================================================
// AI REWRITE FUNCTIONS
// ============================================================================

/**
 * Rewrite Divine Timing guidance with AI
 * Returns enhanced guidance or original on failure
 */
export async function rewriteGuidanceWithAI(
  request: AIRewriteRequest
): Promise<AIRewriteResponse> {
  try {
    const systemPrompt = buildSystemPrompt();
    const toneInstructions = getToneInstructions(request.tone);
    
    // ⚠️ Warning: Qur'an context provided for warmth ONLY, never for interpretation
    const userPrompt = `
Tone: ${toneInstructions}

Original Guidance:
${JSON.stringify(request.originalGuidance, null, 2)}

${request.quranContext ? `Qur'an Context (BACKGROUND ONLY - DO NOT INTERPRET OR EXPLAIN):
${request.quranContext.verseReference}
"${request.quranContext.translationEn}"

USE THIS ONLY for context/tone. NEVER explain or interpret the verse.
` : ''}

Rewrite the guidance with the specified tone.
RETURN ONLY VALID JSON matching this structure:
{
  "summaryTitle": "...",
  "timingSignal": "...",
  "recommendedApproach": [...],
  "watchOuts": [...],
  "nextStep": "...",
  "reflection": { "verseReference": "...", "reflectionPrompt": "..." }, // optional
  "disclaimer": "${request.originalGuidance.disclaimer}",
  "aiAssisted": true
}
`;
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });
    
    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[AI] Groq API error: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from response (handles markdown code fences, extra text)
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in response:', content.substring(0, 200));
      }
      throw new Error('No valid JSON in AI response');
    }
    
    // Parse extracted JSON
    let parsed;
    try {
      parsed = JSON.parse(extractedJSON);
    } catch (parseError) {
      if (__DEV__) {
        console.warn('[AI] Failed to parse extracted JSON:', extractedJSON.substring(0, 100));
      }
      throw new Error('Invalid JSON from AI');
    }
    
    // Zod schema validation
    const validationResult = AIRewriteResponseSchema.safeParse(parsed);
    if (!validationResult.success) {
      if (__DEV__) {
        console.warn('[AI] Schema validation failed:', validationResult.error.issues);
      }
      throw new Error('AI response failed schema validation');
    }
    
    const aiResponse = validationResult.data;
    
    // Strict validation against original
    const strictValidation = validateAIResponse(request.originalGuidance, aiResponse);
    if (!strictValidation.valid) {
      if (__DEV__) {
        console.warn('[AI] Strict validation failed:', strictValidation.reason);
      }
      throw new Error('AI response failed strict validation');
    }
    
    return aiResponse;
  } catch (error) {
    // Silent fallback in production, warning in dev
    if (__DEV__) {
      console.warn('[AI] Fallback to original guidance:', error);
    }
    // Return original with aiAssisted: false
    return {
      ...request.originalGuidance,
      aiAssisted: false,
    };
  }
}

/**
 * Rewrite Istikhārah pattern summary with AI
 * Returns enhanced summary or original on failure
 */
export async function rewriteIstikharaSummaryWithAI(
  request: IstikharaAIRewriteRequest
): Promise<IstikharaAIRewriteResponse> {
  try {
    const systemPrompt = `You are a spiritual guidance editor.

STRICT RULES:
1. NEVER predict outcomes
2. NEVER give verdicts or recommendations
3. ONLY describe observed patterns
4. Keep it observational and reflective
5. DO NOT add interpretations beyond what the data shows
6. Maintain humility and neutrality

Your role: Polish observational summaries only.`;
    
    const toneInstructions = getToneInstructions(request.tone);
    
    const userPrompt = `
Tone: ${toneInstructions}

Original Summary:
"${request.originalSummary}"

Context:
- Total days: ${request.counts.totalDays}
- Calm: ${request.counts.calmDays}, Uneasy: ${request.counts.uneasyDays}
- Inclined: ${request.counts.inclinedDays}, Resistant: ${request.counts.resistantDays}
- Ease: ${request.counts.easeDays}, Obstacles: ${request.counts.obstacleDays}

Rewrite the summary with the specified tone.
KEEP IT OBSERVATIONAL. DO NOT add predictions or verdicts.

RETURN ONLY VALID JSON:
{
  "observationalSummary": "...",
  "aiAssisted": true
}
`;
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[AI] Groq API error for istikhara: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from response
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in istikhara response:', content.substring(0, 200));
      }
      throw new Error('No valid JSON in AI response');
    }
    
    // Parse extracted JSON
    let parsed;
    try {
      parsed = JSON.parse(extractedJSON);
    } catch (parseError) {
      if (__DEV__) {
        console.warn('[AI] Failed to parse istikhara JSON:', extractedJSON.substring(0, 100));
      }
      throw new Error('Invalid JSON from AI');
    }
    
    // Zod schema validation
    const validationResult = IstikharaAIRewriteResponseSchema.safeParse(parsed);
    if (!validationResult.success) {
      if (__DEV__) {
        console.warn('[AI] Istikhara schema validation failed:', validationResult.error.issues);
      }
      throw new Error('AI response failed schema validation');
    }
    
    return validationResult.data;
  } catch (error) {
    // Silent fallback in production
    if (__DEV__) {
      console.warn('[AI] Fallback to original istikhara summary:', error);
    }
    return {
      observationalSummary: request.originalSummary,
      aiAssisted: false,
    };
  }
}
