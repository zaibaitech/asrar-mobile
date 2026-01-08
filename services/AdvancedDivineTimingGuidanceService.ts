/**
 * Advanced Divine Timing Guidance Service
 * ========================================
 * AI-powered contextual guidance using full spiritual profile and timing analysis
 * 
 * Integrates:
 * - User's Abjad spiritual profile (Ẓāhir + Bāṭin)
 * - Current Moment Alignment (planetary hour)
 * - Daily Guidance (daily planetary ruler)
 * - Divine Timing intention
 * - Advanced harmony score
 */

import { DivineTimingResult, IntentionCategory, UserAbjadResult } from '@/types/divine-timing';
import {
    GuidanceCategory,
    GuidanceResponse,
    TimeHorizon,
    UrgencyLevel
} from '@/types/divine-timing-guidance';
import type { UserProfile } from '@/types/user-profile';
import { z } from 'zod';
import { getAdvancedDivineTimingAnalysis, IntentionTimingAnalysis } from './AdvancedDivineTimingService';
import { AI_PROVIDER_NAME, containsEnglish, extractJSON, GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL } from './AIClientConfig';

type SupportedLocale = 'en' | 'fr' | 'ar';

/**
 * Enhanced guidance input with timing context
 */
export interface AdvancedGuidanceInput {
  questionText: string;
  category: GuidanceCategory;
  timeHorizon: TimeHorizon;
  urgency: UrgencyLevel;
  divineTimingResult: DivineTimingResult;
  userProfile?: UserProfile;
  userAbjad: UserAbjadResult;
  intention: IntentionCategory;
  advancedAnalysis?: IntentionTimingAnalysis;
  locale?: SupportedLocale;
}

/**
 * Enhanced guidance response with AI insights
 */
export interface AdvancedGuidanceResponse extends GuidanceResponse {
  // Enhanced fields
  contextualInsight: string;
  spiritualAlignment: {
    zahirAlignment: string; // Based on moment alignment
    batinAlignment: string; // Based on daily guidance
    harmonyScore: number;   // 0-100
    recommendation: string; // AI recommendation
  };
  personalizedSteps: Array<{
    step: string;
    timing: string;
    reasoning: string;
  }>;
  timingWindow: {
    bestTime: string;
    nextOptimal: string;
    avoid: string;
  };
  abjadWisdom: string; // Personalized based on name numerology
  generatedAt: string;
}

/**
 * Generate contextual insight based on full timing analysis
 */
async function generateContextualInsight(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<string> {
  const { questionText, category, userProfile, divineTimingResult, userAbjad } = input;
  const { harmonyScore, recommendation, currentMoment } = analysis;
  const insights: string[] = [];

  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  const element = userProfile?.derived?.element;
  const elementLabel = element ? `${element.charAt(0).toUpperCase()}${element.slice(1)}` : null;
  const momentAlignment = currentMoment.hourlyAlignment;
  const planetaryHour = currentMoment.planetaryHour;
  const dailyGuidance = currentMoment.dailyGuidance;

  const innerTone = userProfile?.motherName ? ` and an inner tone of ${userAbjad.saghir}` : '';
  insights.push(
    `${displayName}, your Abjad resonance carries a total value of ${userAbjad.kabir}${innerTone}.`
  );

  if (elementLabel) {
    insights.push(`Your essence expresses through the ${elementLabel} element.`);
  }

  if (momentAlignment && planetaryHour) {
    const statusDescriptions: Record<'ACT' | 'MAINTAIN' | 'HOLD', string> = {
      ACT: 'a direct invitation to take aligned action',
      MAINTAIN: 'support for steady, mindful progress',
      HOLD: 'a pause that favors preparation over bold moves',
    };
    insights.push(
      `We are within the ${planetaryHour.planet} hour, and your Ẓāhir alignment is ` +
      `${momentAlignment.status}. Expect ${statusDescriptions[momentAlignment.status]}.`
    );
  }

  const guidanceTone = dailyGuidance.timingQuality;
  insights.push(
    `Today's flow is ${guidanceTone}, highlighting ${dailyGuidance.message}`
  );

  if (harmonyScore >= 80) {
    insights.push(
      `Your harmony score of ${harmonyScore}/100 shows exceptional alignment. This window strongly favors committed action.`
    );
  } else if (harmonyScore >= 60) {
    insights.push(
      `With a ${harmonyScore}/100 harmony score, the energies are supportive. Move forward with attentive awareness.`
    );
  } else if (harmonyScore >= 40) {
    insights.push(
      `A harmony score of ${harmonyScore}/100 signals mixed conditions. Progress is possible with deliberate pacing.`
    );
  } else {
    insights.push(
      `The harmony score of ${harmonyScore}/100 suggests notable friction. Patience or deeper preparation may serve you well.`
    );
  }

  const recommendationText = recommendation.replace(/_/g, ' ');
  insights.push(
    `Regarding your question about ${getCategoryDisplayName(category).toLowerCase()}: "${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}", the Divine Timing quality is ${divineTimingResult.timingQuality} and the wisdom suggests you ${recommendationText}.`
  );

  return insights.join(' ');
}

/**
 * Generate spiritual alignment analysis
 */
async function generateSpiritualAlignment(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['spiritualAlignment']> {
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const dailyGuidance = analysis.currentMoment.dailyGuidance;
  
  // Ẓāhir (outward) alignment based on moment
  let zahirAlignment = '';
  if (momentAlignment) {
    if (momentAlignment.status === 'ACT') {
      zahirAlignment = 'Your outward expression (Ẓāhir) is perfectly aligned with the planetary hour. This is your moment to manifest and take visible action.';
    } else if (momentAlignment.status === 'MAINTAIN') {
      zahirAlignment = 'Your outward expression (Ẓāhir) flows harmoniously with the current hour. Maintain steady progress and consistent effort.';
    } else {
      zahirAlignment = 'Your outward expression (Ẓāhir) faces resistance from the current hour. Focus on internal work and preparation rather than external action.';
    }
  } else {
    zahirAlignment = 'Your outward expression (Ẓāhir) is in transition. Consider both inner reflection and gentle external steps.';
  }
  
  // Bāṭin (inward) alignment based on daily
  let batinAlignment = '';
  const flow = dailyGuidance.timingQuality;
  if (flow === 'favorable') {
    batinAlignment = 'Your inner essence (Bāṭin) is supported by today\'s energies. Trust your intuition and inner guidance throughout this day.';
  } else if (flow === 'neutral') {
    batinAlignment = 'Your inner essence (Bāṭin) experiences balanced energy today. Maintain equilibrium between your inner knowing and outer actions.';
  } else if (flow === 'delicate') {
    batinAlignment = 'Your inner essence (Bāṭin) requires careful attention today. Honor your need for rest, reflection, and gentle self-care.';
  } else {
    batinAlignment = 'Your inner essence (Bāṭin) is undergoing transformation today. Embrace the changes while staying grounded in your core values.';
  }
  
  return {
    zahirAlignment,
    batinAlignment,
    harmonyScore: analysis.harmonyScore,
    recommendation: analysis.recommendation.replace(/_/g, ' '),
  };
}

/**
 * Generate personalized action steps with timing and reasoning
 */
async function generatePersonalizedSteps(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['personalizedSteps']> {
  const { category, urgency, timeHorizon, userProfile } = input;
  const { practicalSteps } = analysis;
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const planetaryHour = analysis.currentMoment.planetaryHour;
  const next7Days = analysis.next7DaysOutlook || [];
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'you';
  
  const steps: AdvancedGuidanceResponse['personalizedSteps'] = [];
  
  //Convert practical steps to personalized steps with timing
  practicalSteps.forEach((step, index) => {
    let timing = '';
    let reasoning = '';
    
    if (index === 0) {
      // First step - immediate or today
      if (momentAlignment && momentAlignment.status === 'ACT' && urgency !== 'low') {
        const planetName = planetaryHour?.planet ?? 'current';
        timing = 'Within the next 2 hours (current planetary hour is favorable)';
        reasoning = `Your Ẓāhir (${displayName}) is aligned with the ${planetName} hour, creating optimal conditions for immediate action.`;
      } else {
        timing = 'Today, when you feel centered and ready';
        reasoning = `Begin with this foundation step while honoring your current energy state.`;
      }
    } else if (index === 1) {
      // Second step - today or tomorrow
      if (timeHorizon === 'today') {
        timing = 'Later today, after completing the first step';
        reasoning = `Build momentum gradually, allowing each step to inform the next.`;
      } else {
        timing = `Tomorrow or within ${timeHorizon === 'this_week' ? '2-3 days' : 'this week'}`;
        reasoning = `Give yourself time to integrate the first step before advancing.`;
      }
    } else {
      // Subsequent steps - within timeframe
      const bestDays = next7Days.filter((d) => d.overallScore >= 70);
      if (bestDays.length > 0) {
        const topDay = bestDays[0];
        timing = `Best on ${topDay.dayOfWeek} (harmony score: ${topDay.overallScore})`;
        reasoning = `This day offers optimal alignment for deeper engagement with your ${category.replace(/_/g, ' ')} intention.`;
      } else {
        timing = `Within ${timeHorizon === 'this_month' ? 'this month' : 'this week'}`;
        reasoning = `Progress at a sustainable pace that honors both urgency and quality.`;
      }
    }
    
    steps.push({ step, timing, reasoning });
  });
  
  return steps;
}

/**
 * Generate timing window recommendations
 */
async function generateTimingWindow(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis
): Promise<AdvancedGuidanceResponse['timingWindow']> {
  const momentAlignment = analysis.currentMoment.hourlyAlignment;
  const currentHour = analysis.currentMoment.planetaryHour;
  const next7Days = analysis.next7DaysOutlook || [];
  
  // Best time - current or upcoming
  let bestTime = '';
  if (momentAlignment && momentAlignment.status === 'ACT') {
    const planetName = currentHour?.planet ?? 'current';
    bestTime = `Now (current ${planetName} hour) - Perfect alignment for action!`;
  } else {
    // Find next best window
    const bestDays = next7Days.filter((d) => d.overallScore >= 70);
    if (bestDays.length > 0) {
      const topDay = bestDays[0];
      bestTime = `${topDay.dayOfWeek} when conditions are more favorable (harmony: ${topDay.overallScore})`;
    } else {
      bestTime = 'Later this week when conditions improve';
    }
  }
  
  // Next optimal
  const nextOptimal = next7Days
    .filter(d => d.overallScore >= 70)
    .slice(0, 2)
    .map(d => `${d.dayOfWeek} (score: ${d.overallScore})`)
    .join(', ') || 'Monitor daily guidance for emerging opportunities';
  
  // Times to avoid
  let avoid = '';
  const lowDays = next7Days.filter(d => d.overallScore < 40);
  if (lowDays.length > 0) {
    avoid = `Consider extra caution on ${lowDays.map(d => d.dayOfWeek).join(', ')} when harmony scores are lower`;
  } else {
    avoid = (momentAlignment && momentAlignment.status === 'HOLD')
      ? `Avoid forcing outcomes during HOLD periods${currentHour ? ` (current ${currentHour.planet} hour shows misalignment)` : ''}`
      : 'No critical timing conflicts detected';
  }
  
  return { bestTime, nextOptimal, avoid };
}

/**
 * Generate Abjad wisdom based on numerology
 */
function generateAbjadWisdom(
  input: AdvancedGuidanceInput
): string {
  const { userProfile, intention, userAbjad } = input;
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  const element = userProfile?.derived?.element;
  const totalValue = userAbjad.kabir;
  
  // Numerological patterns
  const reducedValue = totalValue.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  const finalDigit = reducedValue % 9 || 9;
  
  const wisdomTemplates: Record<number, string> = {
    1: `your Abjad resonates with unity and leadership (${finalDigit}). In matters of ${intention}, trust your ability to initiate and pioneer new paths.`,
    2: `your Abjad carries the energy of partnership and balance (${finalDigit}). For ${intention}, seek harmony and collaborate with trusted allies.`,
    3: `your Abjad vibrates with creativity and expression (${finalDigit}). Approach ${intention} with joyful innovation and authentic communication.`,
    4: `your Abjad embodies stability and structure (${finalDigit}). Ground your ${intention} in practical foundations and methodical progress.`,
    5: `your Abjad flows with change and adaptability (${finalDigit}). Embrace flexibility in your ${intention} while staying true to your core.`,
    6: `your Abjad radiates responsibility and service (${finalDigit}). Let ${intention} be guided by care for others and harmonious outcomes.`,
    7: `your Abjad holds wisdom and introspection (${finalDigit}). In ${intention}, honor both spiritual insight and analytical understanding.`,
    8: `your Abjad channels abundance and manifestation (${finalDigit}). Approach ${intention} with confidence in your ability to create tangible results.`,
    9: `your Abjad completes with compassion and completion (${finalDigit}). Let ${intention} be an act of service to the greater good.`,
  };
  
  const baseWisdom = wisdomTemplates[finalDigit] || wisdomTemplates[1];
  
  // Add element-specific wisdom
  const elementWisdom: Record<'fire' | 'earth' | 'air' | 'water', string> = {
    fire: 'Your Fire essence calls for courage and decisive action.',
    earth: 'Your Earth essence grounds you in patience and practical wisdom.',
    air: 'Your Air essence blesses you with clarity and intellectual discernment.',
    water: 'Your Water essence gifts you with emotional depth and intuitive knowing.',
  };
  
  const elementMessage = element ? elementWisdom[element] ?? '' : '';
  return `${displayName}, ${baseWisdom} ${elementMessage}`.trim();
}

const AdvancedGuidanceSchema = z.object({
  summaryTitle: z.string(),
  timingSignal: z.string(),
  recommendedApproach: z.array(z.string()),
  watchOuts: z.array(z.string()),
  nextStep: z.string(),
  reflection: z.object({
    surahNameEn: z.string(),
    surahNumber: z.number(),
    ayahNumber: z.number(),
    prompt: z.string(),
  }).optional(),
  contextualInsight: z.string(),
  spiritualAlignment: z.object({
    zahirAlignment: z.string(),
    batinAlignment: z.string(),
    harmonyScore: z.number(),
    recommendation: z.string(),
  }),
  personalizedSteps: z.array(z.object({
    step: z.string(),
    timing: z.string(),
    reasoning: z.string(),
  })),
  timingWindow: z.object({
    bestTime: z.string(),
    nextOptimal: z.string(),
    avoid: z.string(),
  }),
  abjadWisdom: z.string(),
  generatedAt: z.string().optional(),
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
};

function buildLocalizationSystemPrompt(locale: SupportedLocale): string {
  if (locale === 'fr') {
    return `OUTPUT LANGUAGE CONTRACT:\nLocale = fr. Reply ONLY in French. No English words.\n\nYou are Asrār's Divine Timing localization assistant.\n- Keep the JSON structure identical (same keys, arrays, order).\n- Preserve all numbers, punctuation, and ISO timestamps.\n- Do NOT add or remove fields.\n- Return ONLY valid JSON.`;
  }
  if (locale === 'ar') {
    return `OUTPUT LANGUAGE CONTRACT:\nLocale = ar. Reply ONLY in Arabic. No English or French words.\n\nYou are Asrār's Divine Timing localization assistant.\n- Keep the JSON structure identical (same keys, arrays, order).\n- Preserve all numbers, punctuation, and ISO timestamps.\n- Do NOT add or remove fields.\n- Return ONLY valid JSON.`;
  }
  return `OUTPUT LANGUAGE CONTRACT:\nLocale = en. Reply ONLY in English.\n\nYou are Asrār's Divine Timing localization assistant.\n- Keep the JSON structure identical (same keys, arrays, order).\n- Preserve all numbers, punctuation, and ISO timestamps.\n- Do NOT add or remove fields.\n- Return ONLY valid JSON.`;
}

function buildLocalizationUserPrompt(
  locale: SupportedLocale,
  response: AdvancedGuidanceResponse,
  input: AdvancedGuidanceInput
): string {
  const localeName = LOCALE_LABELS[locale];
  const base = JSON.stringify(response, null, 2);
  return `User locale: ${locale}. Respond in ${localeName} only.\nQuestion: ${input.questionText}\nCategory: ${getCategoryDisplayName(input.category)}\nTime horizon: ${input.timeHorizon}\nUrgency: ${input.urgency}\n\nRewrite the following JSON so every user-facing sentence is expressed in ${localeName}.\n- Do NOT change keys.\n- Keep bullet counts the same.\n- Preserve all numeric scores exactly.\n- Return ONLY JSON.\n\n${base}`;
}

async function callChatCompletion(
  messages: ChatMessage[],
  contextLabel: string,
  temperature = 0.4,
  maxTokens = 1500
): Promise<string | null> {
  if (!GROQ_API_KEY) {
    return null;
  }

  if (__DEV__) {
    const userMsg = messages.find((m) => m.role === 'user')?.content ?? '';
    console.log(`[DivineTiming][AI] ${contextLabel} → Provider: ${AI_PROVIDER_NAME}, Model: ${GROQ_MODEL}`);
    console.log('[DivineTiming][AI] System prompt (first 200 chars):', messages[0].content.substring(0, 200));
    console.log('[DivineTiming][AI] User prompt (first 400 chars):', userMsg.substring(0, 400));
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    if (__DEV__) {
      console.warn('[DivineTiming][AI] Chat completion failed:', response.status, await response.text());
    }
    return null;
  }

  const data = await response.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;

  if (__DEV__ && content) {
    console.log('[DivineTiming][AI] Raw model response (first 300 chars):', content.substring(0, 300));
  }

  return content ?? null;
}

function parseGuidanceJSON(content: string | null, context: string): AdvancedGuidanceResponse | null {
  if (!content) {
    return null;
  }
  const extracted = extractJSON(content);
  if (!extracted) {
    if (__DEV__) {
      console.warn(`[DivineTiming][AI] Failed to extract JSON (${context})`);
    }
    return null;
  }
  try {
    const parsed = JSON.parse(extracted);
    const validated = AdvancedGuidanceSchema.parse(parsed);
    return {
      ...validated,
      generatedAt: validated.generatedAt ?? new Date().toISOString(),
    } as AdvancedGuidanceResponse;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[DivineTiming][AI] JSON validation failed (${context}):`, error);
    }
    return null;
  }
}

/**
 * Simple fallback translation for when AI is unavailable
 * Uses cleaner, more natural French phrasing
 */
function simpleTranslateFallback(text: string, locale: SupportedLocale): string {
  if (locale !== 'fr') return text;
  
  const translations: Record<string, string> = {
    // Planetary hours - natural French
    'Venus hour': 'heure de Vénus',
    'Mars hour': 'heure de Mars',
    'Jupiter hour': 'heure de Jupiter',
    'Saturn hour': 'heure de Saturne',
    'Sun hour': 'heure du Soleil',
    'Moon hour': 'heure de la Lune',
    'Mercury hour': 'heure de Mercure',
    
    // Days
    'Sunday': 'dimanche',
    'Monday': 'lundi',
    'Tuesday': 'mardi',
    'Wednesday': 'mercredi',
    'Thursday': 'jeudi',
    'Friday': 'vendredi',
    'Saturday': 'samedi',
    
    // Phrases - improved natural French
    "Thursday's Air energy brings clarity and communication": "L'énergie de l'Air de jeudi apporte clarté et communication",
    "A day for learning and intellectual pursuits": "Journée propice à l'apprentissage et à la réflexion",
    "Balanced energies today": "Énergies équilibrées aujourd'hui",
    "steady ground for mindful action": "une énergie stable pour avancer avec lucidité",
    "Conditions are supportive": "Les conditions sont favorables à une action réfléchie",
    "Conditions are exceptionally aligned": "Les conditions sont exceptionnellement alignées",
    "highly favorable": "très favorable",
    
    // Categories
    'work & career': 'travail et carrière',
    'Work & Career': 'Travail et carrière',
    
    // States
    'HOLD': 'PAUSE',
    'ACT': 'AGIR',
    'MAINTAIN': 'MAINTENIR',
    'HIGHLY FAVORABLE': 'TRÈS FAVORABLE',
    'FAVORABLE': 'FAVORABLE',
    'MIXED CONDITIONS': 'CONDITIONS MIXTES',
    'PROCEED WITH CAUTION': 'PROCÉDER AVEC PRUDENCE',
    
    // Elements & qualities
    'favorable': 'favorable',
    'neutral': 'neutre',
    'delicate': 'délicat',
    'initiation': 'initiation',
    'start': 'démarrage',
    'fire': 'feu',
    'water': 'eau',
    'air': 'air',
    'earth': 'terre',
    'Fire': 'Feu',
    'Water': 'Eau',
    'Air': 'Air',
    'Earth': 'Terre',
    
    // Recommendations - natural phrasing
    'proceed with caution': 'procéder avec prudence',
    'move forward confidently': 'avancer avec confiance',
    'wait and observe': 'attendre et observer',
    'Make your move': 'Passez à l\'action',
    'Combine with prayer': 'Combinez avec la prière',
    'Double-check all arrangements': 'Vérifiez tous les arrangements',
    
    // Alignment descriptions - natural French
    'Your outward expression': 'Votre expression extérieure',
    'faces resistance from the current hour': 'rencontre une résistance durant cette heure',
    'Focus on internal work and preparation rather than external action': 'Privilégiez le travail intérieur et la préparation',
    'Your inner essence': 'Votre essence intérieure',
    'experiences balanced energy today': 'bénéficie d\'une énergie équilibrée aujourd\'hui',
    'Maintain equilibrium between your inner knowing and outer actions': 'Maintenez l\'équilibre entre votre intuition et vos actions',
    'Your eau essence gifts you': 'Votre essence Eau vous donne',
    
    // Timing windows - natural phrasing
    'Later this week when conditions improve': 'Plus tard cette semaine, quand les conditions s\'amélioreront',
    'Monitor daily guidance for emerging opportunities': 'Restez attentif aux guidances quotidiennes',
    'Avoid forcing outcomes during HOLD periods': 'Évitez de forcer les choses pendant les périodes de pause',
    'No critical timing conflicts detected': 'Aucun conflit majeur détecté',
    'when conditions are more favorable': 'lorsque les conditions seront plus favorables',
    
    // Steps - natural French
    'Within the next 2 hours': 'Dans les 2 prochaines heures',
    'Make your move': 'Passez à l\'action',
    'current planetary hour is favorable': 'l\'heure planétaire actuelle est propice',
    'Today, when you feel centered and ready': 'Aujourd\'hui, quand vous vous sentirez prêt',
    'Begin with this foundation step while honoring your current energy state': 'Commencez par cette étape fondamentale en respectant votre état actuel',
    'Build momentum gradually, allowing each step to inform the next': 'Construisez votre élan progressivement',
    'Progress at a sustainable pace that honors both urgency and quality': 'Avancez à un rythme qui honore urgence et qualité',
    
    // Harmony scores - more natural
    'Your harmony score of': 'Votre score d\'harmonie de',
    'shows exceptional alignment': 'révèle un alignement exceptionnel',
    'This window strongly favors committed action': 'Cette période favorise fortement l\'action engagée',
    'the energies are supportive': 'les énergies vous soutiennent',
    'Move forward with attentive awareness': 'Avancez avec conscience et attention',
    'suggests notable friction': 'suggère des frictions notables',
    'Patience or deeper preparation may serve you well': 'La patience et la préparation vous serviront mieux',
    'the Divine Timing quality is': 'le Timing Divin indique',
    'and the wisdom suggests you': 'et la sagesse suggère de',
    
    // Common phrases - improved and expanded
    'We are within the': 'Nous sommes dans l\'',
    'and your Ẓāhir alignment is': 'et votre alignement Ẓāhir est',
    'Expect': 'Attendez-vous à',
    "Today's flow is": 'Le flux d\'aujourd\'hui est',
    'highlighting': 'mettant en lumière',
    'Regarding your question about': 'Concernant votre question sur',
    
    // Additional deterministic phrases that need translation
    'is perfectly aligned with the planetary hour': 'est parfaitement aligné avec l\'heure planétaire',
    'This is your moment to manifest and take visible action': 'C\'est le moment d\'agir de manière visible',
    'is aligned with the': 'est aligné avec l\'',
    'creating optimal conditions for immediate action': 'créant des conditions optimales pour agir immédiatement',
    'Tomorrow or within': 'Demain ou dans',
    'Within this week': 'Cette semaine',
    'Within': 'Dans',
    'Your': 'Votre',
    'Perfect alignment for': 'Alignement parfait pour',
    'flows harmoniously with the current hour': 'est en harmonie avec l\'heure actuelle',
    'Maintain steady progress and consistent effort': 'Maintenez un progrès constant',
    'is in transition': 'est en transition',
    'Consider both inner reflection and gentle external steps': 'Considérez à la fois la réflexion intérieure et les actions douces',
    'is supported by today\'s energies': 'est soutenue par les énergies d\'aujourd\'hui',
    'Trust your intuition and inner guidance throughout this day': 'Faites confiance à votre intuition',
    'requires careful attention today': 'nécessite une attention particulière aujourd\'hui',
    'Honor your need for rest, reflection, and gentle self-care': 'Honorez votre besoin de repos et de réflexion',
    'is undergoing transformation today': 'traverse une transformation aujourd\'hui',
    'Embrace the changes while staying grounded in your core values': 'Accueillez les changements en restant ancré dans vos valeurs',
    
    // Steps - more complete translations
    'Make your decision': 'Prenez votre décision',
    'while alignment is strong': 'pendant que l\'alignement est fort',
    'Give yourself time to integrate the first step before advancing': 'Prenez le temps d\'intégrer la première étape',
    'and trust in divine wisdom': 'et faites confiance à la sagesse divine',
    'Document your decision-making process for future reflection': 'Documentez votre processus de décision',
    'this is an optimal time to': 'c\'est un moment optimal pour',
    
    // Common phrases - from original + additions
    'a direct invitation to take aligned action': 'une invitation directe à agir',
    'support for steady, mindful progress': 'un soutien pour progresser consciemment',
    'a pause that favors preparation over bold moves': 'une pause qui privilégie la préparation',
    'Your Abjad resonance carries a total value of': 'Votre résonance Abjad porte une valeur de',
    'Your essence expresses through the': 'Votre essence s\'exprime à travers l\'élément',
    'your Abjad vibrates with creativity and expression': 'votre Abjad vibre de créativité',
    'with joyful innovation and authentic communication': 'avec innovation joyeuse et communication authentique',
    'Approach': 'Abordez',
    'element': 'élément',
  };
  
  let translated = text;
  // Sort by length descending to replace longer phrases first
  const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  for (const [en, fr] of entries) {
    // Escape special regex characters and use word boundaries for single words
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (en.split(' ').length === 1 && !en.includes('\'')) {
      translated = translated.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), fr);
    } else {
      translated = translated.replace(new RegExp(escaped, 'gi'), fr);
    }
  }
  return translated;
}

async function localizeAdvancedGuidanceResponse(
  response: AdvancedGuidanceResponse,
  locale: SupportedLocale | undefined,
  input: AdvancedGuidanceInput
): Promise<AdvancedGuidanceResponse> {
  const targetLocale = locale || 'en';
  if (targetLocale === 'en') {
    return response;
  }
  
  // Try AI-powered localization if API key available
  if (GROQ_API_KEY) {
    const systemPrompt = buildLocalizationSystemPrompt(targetLocale);
    const userPrompt = buildLocalizationUserPrompt(targetLocale, response, input);
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const firstPass = await callChatCompletion(messages, `[localize:${targetLocale}][primary]`);
    let localized = parseGuidanceJSON(firstPass, 'localize-primary');
    if (!localized) {
      if (__DEV__) {
        console.warn('[DivineTiming][AI] AI localization failed, using simple fallback');
      }
    } else {
      if (targetLocale === 'fr' && containsEnglish(JSON.stringify(localized))) {
        if (__DEV__) {
          console.warn('[DivineTiming][AI] English detected after localization. Running guard rewrite.');
        }
        const correctionMessages: ChatMessage[] = [
          ...messages,
          { role: 'assistant', content: firstPass ?? '' },
          {
            role: 'user',
            content: 'Your last response still contained English words. Rewrite the exact same answer in French ONLY. No English words.',
          },
        ];
        const correction = await callChatCompletion(correctionMessages, `[localize:${targetLocale}][guard]`);
        const corrected = parseGuidanceJSON(correction, 'localize-guard');
        if (corrected && !containsEnglish(JSON.stringify(corrected))) {
          localized = corrected;
        }
      }
      return localized;
    }
  }
  
  // Fallback: Simple dictionary-based translation
  if (__DEV__) {
    console.log('[DivineTiming][Localization] Using simple dictionary fallback for', targetLocale);
  }
  
  return {
    ...response,
    contextualInsight: simpleTranslateFallback(response.contextualInsight, targetLocale),
    spiritualAlignment: {
      ...response.spiritualAlignment,
      zahirAlignment: simpleTranslateFallback(response.spiritualAlignment.zahirAlignment, targetLocale),
      batinAlignment: simpleTranslateFallback(response.spiritualAlignment.batinAlignment, targetLocale),
      recommendation: simpleTranslateFallback(response.spiritualAlignment.recommendation, targetLocale),
    },
    personalizedSteps: response.personalizedSteps?.map(step => ({
      step: simpleTranslateFallback(step.step, targetLocale),
      timing: simpleTranslateFallback(step.timing, targetLocale),
      reasoning: simpleTranslateFallback(step.reasoning, targetLocale),
    })) ?? [],
    timingWindow: {
      bestTime: simpleTranslateFallback(response.timingWindow?.bestTime ?? '', targetLocale),
      nextOptimal: simpleTranslateFallback(response.timingWindow?.nextOptimal ?? '', targetLocale),
      avoid: simpleTranslateFallback(response.timingWindow?.avoid ?? '', targetLocale),
    },
    abjadWisdom: simpleTranslateFallback(response.abjadWisdom, targetLocale),
  };
}

function buildAISystemPrompt(locale: SupportedLocale): string {
  const contract = locale === 'fr'
    ? 'OUTPUT LANGUAGE CONTRACT: Locale = fr. Respond ONLY in French. No English words.'
    : locale === 'ar'
      ? 'OUTPUT LANGUAGE CONTRACT: Locale = ar. Respond ONLY in Arabic. No English or French words.'
      : 'OUTPUT LANGUAGE CONTRACT: Locale = en. Respond ONLY in English.';

  return `${contract}

You are Asrār's Divine Timing AI guide. Craft reflective yet grounded guidance rooted in Islamic spiritual etiquette.

STRICT RULES:
1. NEVER predict guaranteed outcomes or issue religious rulings.
2. Base every statement on the provided timing analysis.
3. Keep tone humble, devotional, and practical.
4. Use short paragraphs and bullet points when helpful.
5. Return ONLY JSON matching this schema (no markdown, no commentary):
{
  "summaryTitle": string,
  "timingSignal": string,
  "recommendedApproach": string[],
  "watchOuts": string[],
  "nextStep": string,
  "contextualInsight": string,
  "spiritualAlignment": {
    "zahirAlignment": string,
    "batinAlignment": string,
    "harmonyScore": number,
    "recommendation": string
  },
  "personalizedSteps": [
    { "step": string, "timing": string, "reasoning": string }
  ],
  "timingWindow": {
    "bestTime": string,
    "nextOptimal": string,
    "avoid": string
  },
  "abjadWisdom": string,
  "generatedAt": string (ISO 8601)
}`;
}

function buildAIUserPrompt(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis,
  locale: SupportedLocale,
): string {
  const { questionText, category, timeHorizon, urgency, divineTimingResult, userAbjad, userProfile, intention } = input;
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  const moment = analysis.currentMoment;
  const steps = analysis.practicalSteps.map((step, index) => `${index + 1}. ${step}`).join('\n');
  const outlook = (analysis.next7DaysOutlook || [])
    .slice(0, 5)
    .map((day) => {
      const recommendation = day.recommendation ? day.recommendation.replace(/_/g, ' ') : 'balanced';
      return `${day.dayOfWeek}: score ${day.overallScore} (${recommendation})`;
    })
    .join('\n') || 'No extended outlook available';

  return `User locale: ${locale}
Question: ${questionText}
Category: ${getCategoryDisplayName(category)}
Time horizon: ${timeHorizon}
Urgency: ${urgency}

Divine Timing Snapshot:
- Timing quality: ${divineTimingResult.timingQuality}
- Cycle state: ${divineTimingResult.cycleState}
- Elemental tone: ${divineTimingResult.elementalTone}
- Recommendation keyword: ${analysis.recommendation}
- Harmony score: ${analysis.harmonyScore}

Moment Alignment:
- Planetary hour: ${moment.planetaryHour?.planet ?? 'unknown'}
- Hour status: ${moment.hourlyAlignment?.status ?? 'unknown'}
- Daily guidance quality: ${moment.dailyGuidance.timingQuality}
- Daily guidance message: ${moment.dailyGuidance.message}

User & Abjad Profile:
- Name reference: ${displayName}
- Abjad total (kabir): ${userAbjad.kabir}
- Inner tone (saghir): ${userAbjad.saghir}
- Dominant element: ${userAbjad.dominantElement}
- Profile element: ${userProfile?.derived?.element ?? 'unknown'}
- Intention: ${intention}

Practical Steps Seed (use as inspiration, do NOT copy verbatim):
${steps}

7-Day Outlook Seed:
${outlook}

TASK: Write reflective guidance that weaves these data points into spiritual insight, alignment analysis, actionable steps, timing window, and Abjad wisdom. Keep bullet counts between 2 and 4 items. Emphasize mindful caution if harmonyScore < 60.`;
}

async function generateAIAdvancedGuidance(
  input: AdvancedGuidanceInput,
  analysis: IntentionTimingAnalysis,
  locale: SupportedLocale
): Promise<AdvancedGuidanceResponse | null> {
  if (!GROQ_API_KEY) {
    return null;
  }

  const systemPrompt = buildAISystemPrompt(locale);
  const userPrompt = buildAIUserPrompt(input, analysis, locale);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const primaryContent = await callChatCompletion(messages, `[adv-guidance:${locale}][primary]`, 0.35, 2000);
  let parsed = parseGuidanceJSON(primaryContent, 'ai-primary');
  if (!parsed) {
    return null;
  }

  if (locale === 'fr' && containsEnglish(JSON.stringify(parsed))) {
    if (__DEV__) {
      console.warn('[DivineTiming][AI] English detected in AI guidance. Running correction.');
    }
    const correctionMessages: ChatMessage[] = [
      ...messages,
      { role: 'assistant', content: primaryContent ?? '' },
      {
        role: 'user',
        content: 'Your previous JSON still included English words. Rewrite the same content ONLY in French. Do not change structure or numbers.',
      },
    ];
    const correctionContent = await callChatCompletion(correctionMessages, `[adv-guidance:${locale}][guard]`, 0.3, 2000);
    const corrected = parseGuidanceJSON(correctionContent, 'ai-guard');
    if (corrected && !containsEnglish(JSON.stringify(corrected))) {
      parsed = corrected;
    }
  }

  return parsed;
}

/**
 * Main function: Generate advanced AI-powered guidance
 */
export async function generateAdvancedDivineTimingGuidance(
  input: AdvancedGuidanceInput
): Promise<AdvancedGuidanceResponse> {
  const { userProfile, intention, userAbjad, locale = 'en' } = input;
  if (__DEV__) {
    console.log('[DivineTiming][AskAI] Generating advanced guidance', {
      locale,
      question: input.questionText,
      category: input.category,
      timeHorizon: input.timeHorizon,
      urgency: input.urgency,
    });
  }
  const displayName = userProfile?.nameAr || userProfile?.nameLatin || 'Beloved seeker';
  
  // Get advanced timing analysis
  const advancedAnalysis = input.advancedAnalysis || 
    await getAdvancedDivineTimingAnalysis(userProfile, intention, userAbjad);

  // Primary path: AI-generated response with enforced locale
  let aiResponse: AdvancedGuidanceResponse | null = null;
  try {
    aiResponse = await generateAIAdvancedGuidance(input, advancedAnalysis, locale);
  } catch (error) {
    if (__DEV__) {
      console.warn('[DivineTiming][AI] Failed to generate AI guidance, will fall back to deterministic text:', error);
    }
  }
  if (aiResponse) {
    if (__DEV__) {
      console.log('[DivineTiming][AskAI] AI guidance generated successfully', { locale });
    }
    return aiResponse;
  }
  if (__DEV__) {
    console.warn('[DivineTiming][AskAI] AI generation unavailable, using deterministic fallback.');
  }
  
  // Generate all components (all async now)
  const [contextualInsight, spiritualAlignment, personalizedSteps, timingWindow] = await Promise.all([
    generateContextualInsight(input, advancedAnalysis),
    generateSpiritualAlignment(input, advancedAnalysis),
    generatePersonalizedSteps(input, advancedAnalysis),
    generateTimingWindow(input, advancedAnalysis),
  ]);
  
  const abjadWisdom = generateAbjadWisdom(input);
  
  // Build recommended approach from advanced analysis
  const recommendedApproach = [
    contextualInsight,
    ...advancedAnalysis.practicalSteps.map(step => `• ${step}`),
  ];
  
  // Build watch outs
  const watchOuts = [];
  if (spiritualAlignment.harmonyScore < 40) {
    watchOuts.push('Consider delaying major decisions until harmony improves');
  }
  if (spiritualAlignment.zahirAlignment.includes('resistance')) {
    watchOuts.push('Avoid forcing external outcomes during misaligned hours');
  }
  if (spiritualAlignment.batinAlignment.includes('delicate')) {
    watchOuts.push('Prioritize self-care and emotional balance');
  }
  
  const nextStep = personalizedSteps[0]?.step
    || advancedAnalysis.practicalSteps[0]
    || 'Pause for reflection and prayer before taking action.';
  
  // Base response structure (compatible with existing GuidanceResponse)
  const baseResponse: GuidanceResponse = {
    summaryTitle: `Divine Guidance for ${displayName}`,
    timingSignal: spiritualAlignment.recommendation,
    recommendedApproach,
    watchOuts,
    nextStep,
  };
  
  // Enhanced response with AI insights
  const enhancedResponse: AdvancedGuidanceResponse = {
    ...baseResponse,
    contextualInsight,
    spiritualAlignment,
    personalizedSteps,
    timingWindow,
    abjadWisdom,
    generatedAt: new Date().toISOString(),
  };

  const localizedResponse = await localizeAdvancedGuidanceResponse(enhancedResponse, locale, input);

  if (__DEV__) {
    console.log('[DivineTiming][AskAI] Advanced guidance ready (fallback path)', {
      locale,
      localized: locale !== 'en',
    });
  }

  return localizedResponse;
}

/**
 * Helper: Get category display name
 */
function getCategoryDisplayName(category: GuidanceCategory): string {
  const names: Record<GuidanceCategory, string> = {
    study_exam: 'Study & Exams',
    work_career: 'Work & Career',
    money_business: 'Money & Business',
    travel: 'Travel',
    relationships_family: 'Relationships & Family',
    health_wellbeing: 'Health & Wellbeing',
    spiritual_practice: 'Spiritual Practice',
    decisions_general: 'General Decisions',
  };
  return names[category];
}
