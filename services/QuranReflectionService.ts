/**
 * Qur'an Reflection Selection Service
 * ====================================
 * Deterministic verse selection for Divine Timing
 * 
 * IMPORTANT: This selects verses for reflection only.
 * It does NOT interpret verses or claim divine intent.
 */

import {
    getVerseBySurahAyah,
    QURAN_REFLECTION_VERSES,
    QuranReflectionVerse,
} from '@/data/quranReflectionVerses';
import { ElementalTone, IntentionCategory, TimingQuality } from '@/types/divine-timing';

/**
 * Input for verse selection
 */
export interface VerseSelectionInput {
  /** Timing quality from Divine Timing */
  timingQuality: TimingQuality;
  
  /** Cycle state */
  cycleState: string;
  
  /** Elemental tone */
  elementalTone: ElementalTone;
  
  /** User's intention category */
  intentionCategory: IntentionCategory;
  
  /** Seed for deterministic selection (typically YYYY-MM-DD) */
  seedKey: string;
}

/**
 * Reflection prompt for the verse
 */
export interface ReflectionPrompt {
  /** Short reflective question or instruction */
  text: string;
  
  /** Category of prompt */
  type: 'question' | 'instruction' | 'contemplation';
}

/**
 * Complete reflection package
 */
export interface QuranReflection {
  /** Selected verse */
  verse: QuranReflectionVerse;
  
  /** Reflection prompt */
  prompt: ReflectionPrompt;
  
  /** Deep link to Quran.com */
  quranComLink: string;
}

/**
 * Simple deterministic hash function for seed
 * Converts string to a number for selection
 */
function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Score a verse based on how well it matches the input criteria
 */
function scoreVerse(
  verse: QuranReflectionVerse,
  input: VerseSelectionInput
): number {
  let score = 0;
  
  // Tag matching (highest priority)
  const intentionTag = input.intentionCategory;
  if (verse.tags.includes(intentionTag)) {
    score += 10;
  }
  
  // General tag (fallback)
  if (verse.tags.includes('general')) {
    score += 2;
  }
  
  // Cycle state matching
  if (verse.cycleStates?.includes(input.cycleState)) {
    score += 5;
  }
  
  // Element matching
  if (verse.elements?.includes(input.elementalTone)) {
    score += 3;
  }
  
  return score;
}

/**
 * Select a reflection verse deterministically
 * 
 * Same inputs (including seedKey) always return the same verse.
 * 
 * @param input - Selection criteria
 * @returns Complete reflection package
 */
export function selectReflectionVerse(input: VerseSelectionInput): QuranReflection {
  // Score all verses
  const scoredVerses = QURAN_REFLECTION_VERSES.map(verse => ({
    verse,
    score: scoreVerse(verse, input),
  }));
  
  // Sort by score (highest first)
  scoredVerses.sort((a, b) => b.score - a.score);
  
  // Get top candidates (all verses with the highest score)
  const maxScore = scoredVerses[0].score;
  const topCandidates = scoredVerses.filter(sv => sv.score === maxScore);
  
  // Use seed to deterministically select from top candidates
  const seedHash = hashSeed(input.seedKey + input.intentionCategory);
  const selectedIndex = seedHash % topCandidates.length;
  const selectedVerse = topCandidates[selectedIndex].verse;
  
  // Generate reflection prompt
  const prompt = generateReflectionPrompt(selectedVerse, input);
  
  // Generate Quran.com link
  const quranComLink = `https://quran.com/${selectedVerse.surahNumber}/${selectedVerse.ayahNumber}`;
  
  return {
    verse: selectedVerse,
    prompt,
    quranComLink,
  };
}

/**
 * Generate a reflection prompt for the verse
 * 
 * RULES:
 * - No authoritative interpretations
 * - No predictions or promises
 * - Gentle, open-ended prompts
 * - Encourage personal reflection
 */
function generateReflectionPrompt(
  verse: QuranReflectionVerse,
  input: VerseSelectionInput
): ReflectionPrompt {
  // Prompts by timing quality
  const qualityPrompts: Record<TimingQuality, ReflectionPrompt[]> = {
    favorable: [
      {
        text: 'Read this verse slowly. What word resonates with you today?',
        type: 'question',
      },
      {
        text: 'Reflect on how this verse speaks to clarity and mindful action.',
        type: 'instruction',
      },
      {
        text: 'Consider what wisdom this verse offers for your current path.',
        type: 'contemplation',
      },
    ],
    neutral: [
      {
        text: 'What does this verse invite you to consider today?',
        type: 'question',
      },
      {
        text: 'Reflect on balance, patience, and attentive observation.',
        type: 'instruction',
      },
      {
        text: 'Notice which part of this verse draws your attention.',
        type: 'contemplation',
      },
    ],
    delicate: [
      {
        text: 'Read this verse with patience. What comfort does it offer?',
        type: 'question',
      },
      {
        text: 'Reflect on trust, stillness, and careful contemplation.',
        type: 'instruction',
      },
      {
        text: 'Consider how this verse speaks to wisdom in waiting.',
        type: 'contemplation',
      },
    ],
  };
  
  // Select prompt deterministically based on seed
  const prompts = qualityPrompts[input.timingQuality];
  const seedHash = hashSeed(input.seedKey);
  const promptIndex = seedHash % prompts.length;
  
  return prompts[promptIndex];
}

/**
 * Get a reflection for a manually selected verse
 * 
 * @param surahNumber - Surah number
 * @param ayahNumber - Ayah number
 * @param timingQuality - Current timing quality
 * @param seedKey - Seed for prompt selection
 * @returns Reflection package or null if verse not in dataset
 */
export function getManualReflection(
  surahNumber: number,
  ayahNumber: number,
  timingQuality: TimingQuality,
  seedKey: string
): QuranReflection | null {
  const verse = getVerseBySurahAyah(surahNumber, ayahNumber);
  
  if (!verse) {
    return null;
  }
  
  // Generate prompt based on timing quality
  const prompts: Record<TimingQuality, ReflectionPrompt[]> = {
    favorable: [
      {
        text: 'Read this verse slowly. What word resonates with you today?',
        type: 'question',
      },
    ],
    neutral: [
      {
        text: 'What does this verse invite you to consider today?',
        type: 'question',
      },
    ],
    delicate: [
      {
        text: 'Read this verse with patience. What comfort does it offer?',
        type: 'question',
      },
    ],
  };
  
  const seedHash = hashSeed(seedKey);
  const promptList = prompts[timingQuality];
  const prompt = promptList[seedHash % promptList.length];
  
  const quranComLink = `https://quran.com/${surahNumber}/${ayahNumber}`;
  
  return {
    verse,
    prompt,
    quranComLink,
  };
}

/**
 * Standard disclaimer for Qur'an reflection
 */
export const QURAN_REFLECTION_DISCLAIMER =
  'This verse is presented for reflection only. For tafsir and religious guidance, consult qualified scholars.';
