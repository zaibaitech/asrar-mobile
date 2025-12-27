/**
 * AI Reflection Service (Phase 6)
 * ================================
 * Optional AI assistance for polishing wording ONLY.
 * 
 * CRITICAL SAFETY RULES:
 * - AI is OFF by default
 * - AI NEVER computes timing, elements, or decisions
 * - AI only rewrites existing deterministic outputs
 * - AI must preserve structure exactly
 * - If AI fails, fallback to original text
 * - No logging of user data
 * - No cloud storage of reflections
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AISettings,
  DEFAULT_AI_SETTINGS,
  AIRewriteRequest,
  AIRewriteResponse,
  IstikharaAIRewriteRequest,
  IstikharaAIRewriteResponse,
  AITone,
} from '@/types/ai-settings';

const STORAGE_KEY_AI_SETTINGS = '@divine_timing_ai_settings';

// Feature flag - AI is OFF by default
const ENABLE_AI_REFLECTION = false;

// Groq API configuration (same as web app)
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Load AI settings
 */
export async function loadAISettings(): Promise<AISettings> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY_AI_SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_AI_SETTINGS;
  } catch (error) {
    console.error('Failed to load AI settings:', error);
    return DEFAULT_AI_SETTINGS;
  }
}

/**
 * Save AI settings
 */
export async function saveAISettings(settings: AISettings): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY_AI_SETTINGS,
      JSON.stringify({ ...settings, updatedAt: Date.now() })
    );
  } catch (error) {
    console.error('Failed to save AI settings:', error);
    throw error;
  }
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return ENABLE_AI_REFLECTION && !!GROQ_API_KEY;
}

/**
 * Build AI system prompt (strict guidelines)
 */
function buildSystemPrompt(): string {
  return `You are a reflective writing assistant for a spiritual guidance app.

CRITICAL RULES (NEVER VIOLATE):
1. You do NOT predict outcomes
2. You do NOT give religious rulings (fatwā)
3. You do NOT replace prayer or istikhārah
4. You do NOT add new advice or interpretations
5. You ONLY rewrite provided text for clarity and warmth
6. You MUST preserve the exact structure and meaning
7. You MUST keep all disclaimers verbatim

Your ONLY job:
- Improve wording clarity
- Add warmth and reflection
- Expand questions slightly (same intent)
- Adjust tone to user preference

If you cannot comply, respond with the original text unchanged.`;
}

/**
 * Build tone-specific instructions * 
 * ⚠️ Warning: If Qur'an context is provided, never interpret or explain its meaning.
 * Use it only as background context for tone/warmth. */
function getToneInstructions(tone: AITone): string {
  const toneMap: Record<AITone, string> = {
    concise: 'Keep sentences short and direct. Use simple, clear language.',
    calm: 'Use gentle, soothing language. Focus on peace and reflection.',
    reflective: 'Encourage deeper contemplation. Ask thoughtful questions.',
    poetic: 'Use slightly elevated, beautiful language. Light metaphors allowed.',
  };
  return toneMap[tone];
}

/**
 * Rewrite Divine Timing guidance with AI (preserves structure)
 */
export async function rewriteGuidanceWithAI(
  request: AIRewriteRequest
): Promise<AIRewriteResponse> {
  // Check if AI is enabled
  const settings = await loadAISettings();
  if (!settings.enabled || !isAIAvailable()) {
    // Fallback to original text
    return {
      ...request.originalGuidance,
      reflection: request.quranContext
        ? {
            verseReference: request.quranContext.verseReference,
            reflectionPrompt: `Reflect on this verse in the context of your situation.`,
          }
        : undefined,
      aiAssisted: false,
    };
  }

  try {
    const toneInstructions = getToneInstructions(request.tone);
    const systemPrompt = buildSystemPrompt();
    
    const userPrompt = `Rewrite the following spiritual guidance for clarity and ${request.tone} tone.

ORIGINAL GUIDANCE:
Summary: ${request.originalGuidance.summaryTitle}
Signal: ${request.originalGuidance.timingSignal}
Approaches: ${request.originalGuidance.recommendedApproach.join(' | ')}
Watch Outs: ${request.originalGuidance.watchOuts.join(' | ')}
Next Step: ${request.originalGuidance.nextStep}
${request.quranContext ? `\nQur'an Context: ${request.quranContext.verseReference} - ${request.quranContext.translationEn}` : ''}

TONE INSTRUCTIONS: ${toneInstructions}

REQUIREMENTS:
1. Keep the same number of approaches (${request.originalGuidance.recommendedApproach.length})
2. Keep the same number of watch outs (${request.originalGuidance.watchOuts.length})
3. DO NOT add new advice
4. DO NOT predict outcomes
5. DO NOT give religious rulings
6. Keep disclaimer: "${request.originalGuidance.disclaimer}"

Respond in JSON format:
{
  "summaryTitle": "...",
  "timingSignal": "...",
  "recommendedApproach": ["...", "..."],
  "watchOuts": ["...", "..."],
  "nextStep": "...",
  ${request.quranContext ? `"reflection": { "verseReference": "${request.quranContext.verseReference}", "reflectionPrompt": "..." },` : ''}
  "disclaimer": "${request.originalGuidance.disclaimer}"
}`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
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
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    const aiText = data.choices[0]?.message?.content || '';
    
    // Parse JSON response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      summaryTitle: parsed.summaryTitle,
      timingSignal: parsed.timingSignal,
      recommendedApproach: parsed.recommendedApproach,
      watchOuts: parsed.watchOuts,
      nextStep: parsed.nextStep,
      reflection: parsed.reflection,
      disclaimer: request.originalGuidance.disclaimer, // Always use original
      aiAssisted: true,
    };
  } catch (error) {
    console.error('AI rewrite failed, falling back to original:', error);
    
    // Silent fallback to original text
    return {
      ...request.originalGuidance,
      reflection: request.quranContext
        ? {
            verseReference: request.quranContext.verseReference,
            reflectionPrompt: `Reflect on this verse in the context of your situation.`,
          }
        : undefined,
      aiAssisted: false,
    };
  }
}

/**
 * Rewrite Istikhārah pattern summary with AI (observational only)
 */
export async function rewriteIstikharaSummaryWithAI(
  request: IstikharaAIRewriteRequest
): Promise<IstikharaAIRewriteResponse> {
  // Check if AI is enabled
  const settings = await loadAISettings();
  if (!settings.enabled || !isAIAvailable()) {
    // Fallback to original text
    return {
      observationalSummary: request.originalSummary,
      aiAssisted: false,
    };
  }

  try {
    const toneInstructions = getToneInstructions(request.tone);
    const systemPrompt = buildSystemPrompt();
    
    const userPrompt = `Rewrite the following istikhārah pattern summary with ${request.tone} tone.

ORIGINAL SUMMARY:
"${request.originalSummary}"

PATTERN DATA:
- Total days: ${request.counts.totalDays}
- Calm: ${request.counts.calmDays}, Uneasy: ${request.counts.uneasyDays}
- Inclined: ${request.counts.inclinedDays}, Resistant: ${request.counts.resistantDays}
- Ease: ${request.counts.easeDays}, Obstacles: ${request.counts.obstacleDays}

TONE INSTRUCTIONS: ${toneInstructions}

CRITICAL REQUIREMENTS:
1. Use ONLY observational language: "You noted...", "You recorded..."
2. DO NOT give verdicts or conclusions
3. DO NOT suggest a direction ("proceed" or "avoid")
4. DO NOT predict outcomes
5. MUST end with: "You may wish to reflect further or consult trusted counsel."

Respond with ONLY the rewritten summary text (no JSON, no quotes).`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
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
      throw new Error('AI API request failed');
    }

    const data = await response.json();
    const aiText = data.choices[0]?.message?.content || '';
    
    return {
      observationalSummary: aiText.trim(),
      aiAssisted: true,
    };
  } catch (error) {
    console.error('AI rewrite failed, falling back to original:', error);
    
    // Silent fallback to original text
    return {
      observationalSummary: request.originalSummary,
      aiAssisted: false,
    };
  }
}
