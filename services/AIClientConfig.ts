/**
 * Shared AI client configuration and helper utilities for AI requests
 */

export const AI_PROVIDER_NAME = 'Groq';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL || 'llama-3.3-70b-versatile';
export const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

/**
 * Extract JSON payloads from model responses
 */
export function extractJSON(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = text.substring(firstBrace, lastBrace + 1);
    try {
      JSON.parse(extracted);
      return extracted;
    } catch {
      // continue
    }
  }

  try {
    JSON.parse(text.trim());
    return text.trim();
  } catch {
    return null;
  }
}

/**
 * Detect common English words (used for locale enforcement)
 */
export function containsEnglish(text: string): boolean {
  const commonEnglishWords = [
    'the', 'and', 'your', 'we', 'you', 'is', 'are', 'this', 'that', 'with',
    'have', 'has', 'will', 'can', 'should', 'would', 'could', 'which', 'what',
    'when', 'where', 'how', 'why', 'who', 'an', 'for', 'from', 'about'
  ];

  const lowerText = text.toLowerCase();
  return commonEnglishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Detect common French words (used when enforcing EN output)
 */
export function containsFrench(text: string): boolean {
  const commonFrenchWords = [
    'le', 'la', 'les', 'un', 'une', 'des', 'et', 'est', 'sont', 'vous',
    'votre', 'nous', 'avec', 'pour', 'dans', 'sur', 'qui', 'que', 'quoi',
    'cette', 'ces', 'comment', 'pourquoi', 'où', 'quand'
  ];

  const lowerText = text.toLowerCase();
  return commonFrenchWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}
