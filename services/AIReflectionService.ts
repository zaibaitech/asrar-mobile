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
    CalculatorAIRequest,
    CalculatorAIResponse,
    CompatibilityAIRequest,
    CompatibilityAIResponse,
    DEFAULT_AI_SETTINGS,
    IstikharaAIRewriteRequest,
    IstikharaAIRewriteResponse,
    NameDestinyAIRequest,
    NameDestinyAIResponse,
    PeakWindowsAIRequest,
    PeakWindowsAIResponse
} from '@/types/ai-settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';
import { AI_PROVIDER_NAME, GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL, containsEnglish, containsFrench, extractJSON } from './AIClientConfig';

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
const DEFAULT_MODEL = GROQ_MODEL || 'llama-3.3-70b-versatile';

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
// SETTINGS STORAGE HELPERS
// ============================================================================

export async function loadAISettings(): Promise<AISettings> {
  try {
    const stored = await AsyncStorage.getItem(AI_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Failed to load settings:', error);
    }
  }
  return { ...DEFAULT_AI_SETTINGS };
}

export async function saveAISettings(settings: AISettings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      AI_SETTINGS_KEY,
      JSON.stringify({ ...settings, updatedAt: Date.now() })
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Failed to save settings:', error);
    }
    throw error;
  }
}

export function isAIAvailable(): boolean {
  return ENABLE_AI_CAPABILITY && Boolean(GROQ_API_KEY);
}

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
// AI SYSTEM PROMPT
// ============================================================================

/**
 * Build strict system prompt with safety rules and language enforcement
 * @param locale - The app's current language locale ('en', 'fr', or 'ar')
 */
function buildSystemPrompt(locale: 'en' | 'fr' | 'ar' = 'en'): string {
  // OUTPUT LANGUAGE CONTRACT - Short and strict (models obey short rules better)
  const languageContract = locale === 'fr'
    ? `OUTPUT LANGUAGE CONTRACT:
The app locale is "fr" (French).
- You MUST reply ONLY in French. No English words or sentences.
- Even if the user writes in English or Arabic, respond in French.
- If you cannot comply, return: "[LANGUAGE_ERROR]"`
    : locale === 'ar'
    ? `OUTPUT LANGUAGE CONTRACT:
The app locale is "ar" (Arabic).
- You MUST reply ONLY in Arabic. No English or French words.
- Even if the user writes in English or French, respond in Arabic.
- If you cannot comply, return: "[LANGUAGE_ERROR]"`
    : `OUTPUT LANGUAGE CONTRACT:
The app locale is "en" (English).
- You MUST reply ONLY in English. No French or Arabic words.
- If you cannot comply, return: "[LANGUAGE_ERROR]"`;

  return `${languageContract}

You are Asrār's Divine Timing assistant, a spiritual guidance editor for a Muslim reflection app.

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
10. Do not mix languages in the same sentence

STYLE:
- Spiritual, reflective, grounded, respectful
- Use short paragraphs and bullet points when helpful
- Reference the provided context (Abjad, element, planetary hour, timing quality, harmony score) naturally
- End with 1 practical next step

Your role: Polish wording only, nothing else.

OUTPUT:
Return ONLY valid JSON. No markdown, no extra text, no language notes.`;
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
    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    const systemPrompt = buildSystemPrompt(locale);
    const toneInstructions = getToneInstructions(request.tone);
    
    // DEV LOGGING: Confirm locale and system prompt
    if (__DEV__) {
      console.log('[AI] 🌍 Locale:', locale);
      console.log('[AI] 🤝 Provider/Model:', AI_PROVIDER_NAME, DEFAULT_MODEL);
      console.log('[AI] 📝 System prompt (first 200 chars):', systemPrompt.substring(0, 200));
    }
    
    // ⚠️ Warning: Qur'an context provided for warmth ONLY, never for interpretation
    const languageName = locale === 'fr' ? 'French' : locale === 'ar' ? 'Arabic' : 'English';
    const userPrompt = `
  User locale: ${locale}. Respond in ${languageName} only.
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
    if (__DEV__) {
      console.log('[AI] 📤 User prompt (first 400 chars):', userPrompt.substring(0, 400));
    }
    
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
    let content = data.choices[0].message.content;
    
    // DEV LOGGING: First 120 chars of AI response
    if (__DEV__) {
      console.log('[AI] 🤖 AI response (first 300 chars):', content.substring(0, 300));
    }
    
    // POST-CHECK: Validate language compliance
    if (locale === 'fr' && containsEnglish(content)) {
      if (__DEV__) {
        console.warn('[AI] ⚠️ LANGUAGE VIOLATION: English detected in FR mode. Re-calling AI...');
      }
      
      // Re-call AI with correction message
      const correctionResponse = await fetch(GROQ_API_URL, {
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
            { role: 'assistant', content: content },
            { role: 'user', content: 'Your last response contained English. Rewrite the exact same answer in French ONLY. No English words.' },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });
      
      if (correctionResponse.ok) {
        const correctionData = await correctionResponse.json();
        content = correctionData.choices[0].message.content;
        
        if (__DEV__) {
          console.log('[AI] ✅ Correction applied. New response (first 300 chars):', content.substring(0, 300));
        }
      }
    } else if (locale === 'en' && containsFrench(content)) {
      if (__DEV__) {
        console.warn('[AI] ⚠️ LANGUAGE VIOLATION: French detected in EN mode. Re-calling AI...');
      }
      
      // Re-call AI with correction message
      const correctionResponse = await fetch(GROQ_API_URL, {
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
            { role: 'assistant', content: content },
            { role: 'user', content: 'Your last response contained French. Rewrite the SAME answer in English ONLY. Keep the meaning, but remove all French words.' },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });
      
      if (correctionResponse.ok) {
        const correctionData = await correctionResponse.json();
        content = correctionData.choices[0].message.content;
        
        if (__DEV__) {
          console.log('[AI] ✅ Correction applied. New response (first 120 chars):', content.substring(0, 120));
        }
      }
    }
    
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
    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    const systemPrompt = `You are a spiritual guidance editor.

STRICT RULES:
1. NEVER predict outcomes
2. NEVER give verdicts or recommendations
3. ONLY describe observed patterns
4. Keep it observational and reflective
5. DO NOT add interpretations beyond what the data shows
6. Maintain humility and neutrality

${locale === 'fr' ? "Vous DEVEZ écrire l'ENTIÈRE réponse en français uniquement." : locale === 'ar' ? 'يجب عليك كتابة الرد بالكامل بالعربية فقط.' : 'You MUST write the ENTIRE response in English only.'}

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

// ============================================================================
// NAME DESTINY AI ENHANCEMENT
// ============================================================================

/**
 * Enhance Name Destiny explanation with AI
 * Returns enhanced explanations or empty strings on failure
 */
export async function enhanceNameDestinyWithAI(
  request: NameDestinyAIRequest
): Promise<NameDestinyAIResponse> {
  try {
    // Check if AI is enabled
    const settings = await loadAISettings();
    if (!isAIAvailable() || !settings.enabled) {
      return {
        elementExplanation: '',
        burjExplanation: '',
        aiAssisted: false,
      };
    }

    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    const systemPrompt = `You are a spiritual guidance educator specializing in Islamic numerology.

STRICT RULES:
1. Explain element and zodiac meanings ONLY
2. NEVER predict future events
3. NEVER give religious rulings
4. Keep explanations educational and reflective
5. If user profile provided, connect their birth chart to name calculation
6. Use 2-3 sentences per explanation
7. Maintain humility and avoid certainty

${locale === 'fr' ? "Vous DEVEZ écrire l'ENTIÈRE réponse en français uniquement." : locale === 'ar' ? 'يجب عليك كتابة الرد بالكامل بالعربية فقط.' : 'You MUST write the ENTIRE response in English only.'}

Your role: Educate and contextualize, not predict.`;

    const toneInstructions = getToneInstructions(request.tone);
    
    // Build user prompt with personalization
    let userPrompt = `
Tone: ${toneInstructions}

Name Calculation Results:
- Element: ${request.element}
- Burj (Zodiac): ${request.burj}
${request.planetaryRuler ? `- Planetary Ruler: ${request.planetaryRuler}` : ''}
`;

    if (request.userElement || request.userBurj) {
      userPrompt += `\nUser's Birth Chart:
- Birth Element: ${request.userElement || 'Unknown'}
- Birth Burj: ${request.userBurj || 'Unknown'}
${request.userLocationCity ? `- Location: ${request.userLocationCity}` : ''}
`;
    }

    userPrompt += `\nProvide:
1. Element explanation (2-3 sentences)
2. Burj explanation (2-3 sentences)
${request.userElement || request.userBurj ? '3. Personalized insight connecting birth chart to name calculation (2-3 sentences)' : ''}

RETURN ONLY VALID JSON:
{
  "elementExplanation": "...",
  "burjExplanation": "...",
  ${request.userElement || request.userBurj ? '"personalizedInsight": "...",' : ''}
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
        console.warn(`[AI] Groq API error for name destiny: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in name destiny response');
      }
      throw new Error('No valid JSON in AI response');
    }

    // Parse and return
    const parsed = JSON.parse(extractedJSON);
    
    return {
      elementExplanation: parsed.elementExplanation || '',
      burjExplanation: parsed.burjExplanation || '',
      personalizedInsight: parsed.personalizedInsight,
      aiAssisted: true,
    };

  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Name destiny enhancement failed:', error);
    }
    
    // Silent fallback to empty strings
    return {
      elementExplanation: '',
      burjExplanation: '',
      aiAssisted: false,
    };
  }
}

/**
 * Enhance Relationship Compatibility analysis with AI
 * 
 * Phase 6.3: AI-assisted compatibility explanation
 * 
 * AI RULES:
 * - Explains relationship dynamics ONLY
 * - NEVER predicts relationship outcomes
 * - NEVER gives relationship rulings or advice
 * - Educational and reflective tone
 * - Respects user privacy
 * 
 * @param request Compatibility AI request
 * @returns Enhanced compatibility explanations or fallback
 */
export async function enhanceCompatibilityWithAI(
  request: CompatibilityAIRequest
): Promise<CompatibilityAIResponse> {
  try {
    // Check capability
    if (!ENABLE_AI_CAPABILITY || !GROQ_API_KEY) {
      return {
        enhancedSummary: '',
        enhancedSpiritualExplanation: '',
        enhancedElementalExplanation: '',
        enhancedPlanetaryExplanation: '',
        aiAssisted: false,
      };
    }

    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    // System prompt with strict rules
    const systemPrompt = `You are a spiritual guidance educator specializing in Islamic numerology and relationship compatibility analysis.

STRICT RULES:
1. Explain compatibility patterns and elemental dynamics ONLY
2. NEVER predict relationship outcomes or future events
3. NEVER give relationship advice or rulings
4. Keep explanations educational and reflective
5. If user profile provided, contextualize the relationship analysis
6. Use 2-3 sentences per explanation
7. Maintain humility and avoid certainty
8. Respect cultural sensitivity around relationships

${locale === 'fr' ? "Vous DEVEZ écrire l'ENTIÈRE réponse en français uniquement." : locale === 'ar' ? 'يجب عليك كتابة الرد بالكامل بالعربية فقط.' : 'You MUST write the ENTIRE response in English only.'}

Your role: Educate about compatibility patterns, not predict or advise.`;

    const toneInstructions = getToneInstructions(request.tone);
    
    const relationshipContext = request.relationshipType 
      ? `\nRelationship Type: ${request.relationshipType}` 
      : '';
    
    // Build user prompt
    let userPrompt = `
Tone: ${toneInstructions}

Compatibility Analysis:
- ${request.person1Name} (${request.person1Element} element)
- ${request.person2Name} (${request.person2Element} element)
- Overall Score: ${request.overallScore}/100 (${request.overallQuality})
- Spiritual Destiny: ${request.spiritualScore}/100
- Elemental Temperament: ${request.elementalScore}/100
- Planetary Cosmic: ${request.planetaryScore}/100${relationshipContext}
`;

    if (request.userElement || request.userBurj) {
      userPrompt += `\nUser's Context:
- Birth Element: ${request.userElement || 'Unknown'}
- Birth Burj: ${request.userBurj || 'Unknown'}
`;
    }

    userPrompt += `\nProvide:
1. Enhanced overall summary (2-3 sentences explaining the score)
2. Enhanced spiritual destiny explanation (2-3 sentences)
3. Enhanced elemental temperament explanation (2-3 sentences)
4. Enhanced planetary cosmic explanation (2-3 sentences)
${request.userElement || request.userBurj ? '5. Personalized insight for the user viewing this analysis (2-3 sentences)' : ''}

RETURN ONLY VALID JSON:
{
  "enhancedSummary": "...",
  "enhancedSpiritualExplanation": "...",
  "enhancedElementalExplanation": "...",
  "enhancedPlanetaryExplanation": "...",
  ${request.userElement || request.userBurj ? '"personalizedInsight": "...",' : ''}
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
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[AI] Groq API error for compatibility: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in compatibility response');
      }
      throw new Error('No valid JSON in AI response');
    }

    // Parse and return
    const parsed = JSON.parse(extractedJSON);
    
    return {
      enhancedSummary: parsed.enhancedSummary || '',
      enhancedSpiritualExplanation: parsed.enhancedSpiritualExplanation || '',
      enhancedElementalExplanation: parsed.enhancedElementalExplanation || '',
      enhancedPlanetaryExplanation: parsed.enhancedPlanetaryExplanation || '',
      personalizedInsight: parsed.personalizedInsight,
      aiAssisted: true,
    };

  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Compatibility enhancement failed:', error);
    }
    
    // Silent fallback to empty strings
    return {
      enhancedSummary: '',
      enhancedSpiritualExplanation: '',
      enhancedElementalExplanation: '',
      enhancedPlanetaryExplanation: '',
      aiAssisted: false,
    };
  }
}

/**
 * Enhance Abjad Calculator results with AI
 * 
 * Phase 6.4: AI-assisted calculator explanation
 * 
 * AI RULES:
 * - Explains numerical meanings and patterns ONLY
 * - NEVER predicts outcomes or future events
 * - NEVER gives spiritual or religious rulings
 * - Educational and reflective tone
 * - Type-aware (name, lineage, phrase, Quran, dhikr)
 * 
 * @param request Calculator AI request
 * @returns Enhanced calculator explanations or fallback
 */
export async function enhanceCalculatorWithAI(
  request: CalculatorAIRequest
): Promise<CalculatorAIResponse> {
  try {
    // Check capability
    if (!ENABLE_AI_CAPABILITY || !GROQ_API_KEY) {
      return {
        enhancedNumericalExplanation: '',
        enhancedElementExplanation: '',
        enhancedBurjExplanation: '',
        aiAssisted: false,
      };
    }

    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    // System prompt with strict rules
    const systemPrompt = `You are a spiritual guidance educator specializing in Islamic numerology (ʿIlm al-Ḥurūf).

STRICT RULES:
1. Explain numerical patterns and letter values ONLY
2. NEVER predict outcomes or future events
3. NEVER give spiritual or religious rulings
4. Keep explanations educational and reflective
5. If user profile provided, contextualize the calculation
6. Use 2-3 sentences per explanation
7. Maintain humility and avoid certainty
8. Type-specific context: ${request.calculationType}

${locale === 'fr' ? "Vous DEVEZ écrire l'ENTIÈRE réponse en français uniquement." : locale === 'ar' ? 'يجب عليك كتابة الرد بالكامل بالعربية فقط.' : 'You MUST write the ENTIRE response in English only.'}

Your role: Educate about numerical meanings, not predict or prescribe.`;

    const toneInstructions = getToneInstructions(request.tone);
    
    // Build context description
    const contextDesc = request.context 
      ? (request.calculationType === 'lineage' 
          ? `\nNames: ${request.context.yourName} + ${request.context.motherName}`
          : request.calculationType === 'quran'
          ? `\nSurah: ${request.context.surahName}, Ayah ${request.context.ayahNumber}`
          : request.calculationType === 'dhikr'
          ? `\nDivine Name: ${request.context.divineName}`
          : '')
      : '';
    
    // Build user prompt
    let userPrompt = `
Tone: ${toneInstructions}

Abjad Calculation Results:
- Type: ${request.calculationType}
- Input: ${request.inputText}${contextDesc}
- Kabīr (Grand Total): ${request.kabir}
- Ṣaghīr (Digital Root): ${request.saghir}
- Element: ${request.element}
- Burj (Zodiac): ${request.burj}
`;

    if (request.userElement || request.userBurj) {
      userPrompt += `\nUser's Context:
- Birth Element: ${request.userElement || 'Unknown'}
- Birth Burj: ${request.userBurj || 'Unknown'}
`;
    }

    userPrompt += `\nProvide:
1. Enhanced numerical explanation for Kabīr ${request.kabir} and Ṣaghīr ${request.saghir} (2-3 sentences)
2. Enhanced element explanation for ${request.element} (2-3 sentences)
3. Enhanced Burj explanation for ${request.burj} (2-3 sentences)
4. Type-specific insight for ${request.calculationType} calculation (2-3 sentences)
${request.userElement || request.userBurj ? '5. Personalized insight connecting user\'s birth chart to this calculation (2-3 sentences)' : ''}

RETURN ONLY VALID JSON:
{
  "enhancedNumericalExplanation": "...",
  "enhancedElementExplanation": "...",
  "enhancedBurjExplanation": "...",
  "enhancedTypeInsight": "...",
  ${request.userElement || request.userBurj ? '"personalizedInsight": "...",' : ''}
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
        max_tokens: 900,
      }),
    });

    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[AI] Groq API error for calculator: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in calculator response');
      }
      throw new Error('No valid JSON in AI response');
    }

    // Parse and return
    const parsed = JSON.parse(extractedJSON);
    
    return {
      enhancedNumericalExplanation: parsed.enhancedNumericalExplanation || '',
      enhancedElementExplanation: parsed.enhancedElementExplanation || '',
      enhancedBurjExplanation: parsed.enhancedBurjExplanation || '',
      enhancedTypeInsight: parsed.enhancedTypeInsight,
      personalizedInsight: parsed.personalizedInsight,
      aiAssisted: true,
    };

  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Calculator enhancement failed:', error);
    }
    
    // Silent fallback to empty strings
    return {
      enhancedNumericalExplanation: '',
      enhancedElementExplanation: '',
      enhancedBurjExplanation: '',
      aiAssisted: false,
    };
  }
}

/**
 * Enhance Peak Windows timing guidance with AI
 * 
 * Phase 6.5: AI-assisted peak windows explanation
 * 
 * AI RULES:
 * - Explains time segment characteristics ONLY
 * - NEVER predicts specific outcomes
 * - NEVER gives deterministic timing advice
 * - Educational and reflective tone
 * - Location and element-aware
 * 
 * @param request Peak Windows AI request
 * @returns Enhanced timing explanations or fallback
 */
export async function enhancePeakWindowsWithAI(
  request: PeakWindowsAIRequest
): Promise<PeakWindowsAIResponse> {
  try {
    // Check capability
    if (!ENABLE_AI_CAPABILITY || !GROQ_API_KEY) {
      return {
        enhancedSegmentExplanation: '',
        enhancedActivityRecommendations: '',
        enhancedTimingWisdom: '',
        aiAssisted: false,
      };
    }

    // Get locale from request, default to 'en'
    const locale = request.language || 'en';
    // System prompt with strict rules
    const systemPrompt = `You are a spiritual guidance educator specializing in Islamic sacred timing wisdom.

STRICT RULES:
1. Explain time segment characteristics and general patterns ONLY
2. NEVER predict specific outcomes or success
3. NEVER give deterministic timing advice
4. Keep explanations educational and reflective
5. If user profile provided, contextualize with their element/location
6. Use 2-3 sentences per explanation
7. Maintain humility and avoid certainty
8. Focus on reflection and intention, not prediction

${locale === 'fr' ? "Vous DEVEZ écrire l'ENTIÈRE réponse en français uniquement." : locale === 'ar' ? 'يجب عليك كتابة الرد بالكامل بالعربية فقط.' : 'You MUST write the ENTIRE response in English only.'}

Your role: Educate about time patterns, not prescribe or predict.`;

    const toneInstructions = getToneInstructions(request.tone);
    
    // Build user prompt
    let userPrompt = `
Tone: ${toneInstructions}

Peak Window Analysis:
- Time Segment: ${request.segment}
- Time Range: ${request.timeRange.start} - ${request.timeRange.end}
- Harmony Score: ${request.harmonyScore}/100
- Guidance: ${request.guidance}
`;

    if (request.userElement || request.userBurj) {
      userPrompt += `\nUser's Context:
- Birth Element: ${request.userElement || 'Unknown'}
- Birth Burj: ${request.userBurj || 'Unknown'}
${request.userLocationCity ? `- Location: ${request.userLocationCity}` : ''}
`;
    }

    userPrompt += `\nProvide:
1. Enhanced time segment explanation (2-3 sentences about ${request.segment} characteristics)
2. Enhanced activity recommendations (2-3 sentences suggesting general activity types)
3. Enhanced timing wisdom (2-3 sentences about spiritual reflection during this period)
${request.userElement || request.userBurj ? '4. Personalized insight connecting user\'s element/burj to this time window (2-3 sentences)' : ''}

RETURN ONLY VALID JSON:
{
  "enhancedSegmentExplanation": "...",
  "enhancedActivityRecommendations": "...",
  "enhancedTimingWisdom": "...",
  ${request.userElement || request.userBurj ? '"personalizedInsight": "...",' : ''}
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
        max_tokens: 700,
      }),
    });

    if (!response.ok) {
      if (__DEV__) {
        console.warn(`[AI] Groq API error for peak windows: ${response.status}`);
      }
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const extractedJSON = extractJSON(content);
    if (!extractedJSON) {
      if (__DEV__) {
        console.warn('[AI] No valid JSON found in peak windows response');
      }
      throw new Error('No valid JSON in AI response');
    }

    // Parse and return
    const parsed = JSON.parse(extractedJSON);
    
    return {
      enhancedSegmentExplanation: parsed.enhancedSegmentExplanation || '',
      enhancedActivityRecommendations: parsed.enhancedActivityRecommendations || '',
      enhancedTimingWisdom: parsed.enhancedTimingWisdom || '',
      personalizedInsight: parsed.personalizedInsight,
      aiAssisted: true,
    };

  } catch (error) {
    if (__DEV__) {
      console.warn('[AI] Peak windows enhancement failed:', error);
    }
    
    // Silent fallback to empty strings
    return {
      enhancedSegmentExplanation: '',
      enhancedActivityRecommendations: '',
      enhancedTimingWisdom: '',
      aiAssisted: false,
    };
  }
}

