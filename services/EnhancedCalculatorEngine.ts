/**
 * Enhanced Calculator Engine
 * Core computation engine for ʿIlm al-Asrār Calculator
 * Computes all numeric values once, then routes to type-specific adapters
 */

import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjad-maps';
import { calculateBurj } from '../constants/buruj';
import { getDivineNameByNumber } from '../data/divine-names';
import { getSurahByNumber } from '../data/quran-surahs';
import {
    CalculationOptions,
    CalculationRequest,
    CoreResults,
    ElementalAnalytics,
    EnhancedCalculationResult,
    InputMetadata,
    LetterFrequency,
    UnifiedInputType,
} from '../types/calculator-enhanced';
import { calculateAbjadTotal, getDigitalRoot } from '../utils/abjad-calculations';
import { elementOfLetter, hadathRemainder, hadathToElement, LETTER_ELEMENTS } from '../utils/hadad-core';
import { isArabicText } from '../utils/text-normalize';
import { ElementType } from '../utils/types';
import {
    computeDhikrInsights,
    computeGeneralInsights,
    computeLineageInsights,
    computeNameInsights,
    computePhraseInsights,
    computeQuranInsights,
} from './InsightAdapters';
import { fetchAyahText } from './QuranResonanceService';

export class EnhancedCalculatorEngine {
  private static async resolveSourceText(
    request: CalculationRequest
  ): Promise<{ rawText: string; inputType: UnifiedInputType; sourceMeta?: InputMetadata['sourceMeta'] }> {
    const baseMeta: NonNullable<InputMetadata['sourceMeta']> = {};
    let rawText = '';
    let inputType: UnifiedInputType = 'custom';

    switch (request.type) {
      case 'name': {
        inputType = 'name';
        rawText = request.arabicInput || request.latinInput || '';
        break;
      }

      case 'lineage': {
        inputType = 'name';
        baseMeta.yourName = request.yourName;
        baseMeta.motherName = request.motherName;
        baseMeta.fatherName = request.fatherName;
        rawText = `${request.yourName || ''} ${request.motherName || ''}`;
        break;
      }

      case 'phrase': {
        inputType = 'phrase';
        rawText = request.arabicInput || request.latinInput || '';
        break;
      }

      case 'quran': {
        inputType = 'quran';

        if (request.surahNumber) {
          baseMeta.surahNumber = request.surahNumber;
          const surah = getSurahByNumber(request.surahNumber);
          if (surah) {
            baseMeta.surahName = surah.name.transliteration;
          }
        }

        if (typeof request.ayahNumber === 'number') {
          baseMeta.ayahNumber = request.ayahNumber;
        }

        const directText = request.pastedAyahText || request.arabicInput;
        if (directText?.trim()) {
          rawText = directText.trim();
          baseMeta.ayahText = rawText;
          break;
        }

        if (request.surahNumber && request.ayahNumber) {
          try {
            const ayahText = await fetchAyahText(request.surahNumber, request.ayahNumber);
            rawText = ayahText.trim();
            baseMeta.ayahText = rawText;
          } catch (error) {
            console.warn('[EnhancedCalculatorEngine] Failed to fetch Qur\'an ayah text', error);
          }
        }
        break;
      }

      case 'dhikr': {
        inputType = 'custom';
        baseMeta.divineName = request.divineNameId;
        if (request.divineNameId) {
          const idAsNumber = Number(request.divineNameId);
          const divineName = Number.isFinite(idAsNumber) ? getDivineNameByNumber(idAsNumber) : undefined;
          if (divineName) {
            baseMeta.divineNameArabic = divineName.arabic;
            rawText = divineName.arabic;
            break;
          }
        }
        rawText = request.arabicInput || '';
        break;
      }

      case 'general': {
        inputType = 'custom';
        rawText = request.arabicInput || request.latinInput || '';
        break;
      }

      default: {
        inputType = 'custom';
        rawText = request.arabicInput || request.latinInput || '';
      }
    }

    const trimmed = rawText ? rawText.trim() : '';
    const meta = Object.keys(baseMeta).length ? baseMeta : undefined;
    return { rawText: trimmed, inputType, sourceMeta: meta };
  }

  /**
   * Normalize Arabic input
   * - Remove diacritics/tashkeel
   * - Normalize forms (أ/إ/آ -> ا, ة -> ه, ى -> ي)
   * - Optionally remove spaces and punctuation
   */
  static normalizeArabic(
    text: string,
    options: CalculationOptions = { removeVowels: true, ignorePunctuation: true, ignoreSpaces: true }
  ): string {
    if (!text) return '';
    
    let normalized = text.trim();
    
    // Remove tashkeel (diacritics) - always
    if (options.removeVowels) {
      normalized = normalized.replace(/[\u064B-\u065F\u0670]/g, '');
    }
    
    // Normalize Arabic letter forms
    normalized = normalized
      .replace(/[أإآ]/g, 'ا')  // Normalize alif forms
      .replace(/ى/g, 'ي')      // Alif maqsura to ya
      .replace(/ة/g, 'ه');     // Ta marbuta to ha (optional)
    
    // Remove punctuation
    if (options.ignorePunctuation) {
      normalized = normalized.replace(/[.,;:!?'"(){}[\]،؛]/g, '');
    }
    
    // Remove spaces
    if (options.ignoreSpaces) {
      normalized = normalized.replace(/\s+/g, '');
    } else {
      normalized = normalized.replace(/\s+/g, ' '); // Normalize whitespace
    }
    
    return normalized;
  }

  /**
   * Compute all core numbers in one pass
   */
  static computeCore(
    normalizedText: string,
    system: 'maghribi' | 'mashriqi' = 'maghribi'
  ): CoreResults {
    const map = system === 'maghribi' ? ABJAD_MAGHRIBI : ABJAD_MASHRIQI;
    
    const kabir = calculateAbjadTotal(normalizedText, map);
    const saghir = getDigitalRoot(kabir);
    const hadadMod4 = hadathRemainder(kabir);
    const element = hadathToElement(hadadMod4);
    const burjCalc = calculateBurj(kabir);
    
    const sirr = kabir - saghir;
    const wusta = Math.floor((kabir + saghir) / 2);
    const kamal = kabir + saghir;
    const bast = kabir * saghir;
    
    return {
      kabir,
      saghir,
      hadadMod4,
      burj: burjCalc.name,
      element,
      sirr,
      wusta,
      kamal,
      bast,
    };
  }

  /**
   * Compute elemental analytics
   * - Letter frequency
   * - Elemental composition percentages
   * - Dominant/weakest elements
   * - Balance score (FIXED formula)
   */
  static computeAnalytics(normalizedText: string): ElementalAnalytics {
    // Count letter frequencies
    const letterMap = new Map<string, { count: number; value: number; element: ElementType }>();
    
    Array.from(normalizedText).forEach(char => {
      if (LETTER_ELEMENTS[char]) {
        const existing = letterMap.get(char);
        const element = elementOfLetter(char);
        const value = ABJAD_MAGHRIBI[char] || 0;
        
        if (existing) {
          letterMap.set(char, { count: existing.count + 1, value, element });
        } else {
          letterMap.set(char, { count: 1, value, element });
        }
      }
    });
    
    const letterFreq: LetterFrequency[] = Array.from(letterMap.entries())
      .map(([letter, data]) => ({
        letter,
        count: data.count,
        value: data.value,
        element: data.element,
      }))
      .sort((a, b) => b.count - a.count);
    
    // Calculate elemental composition
    const elementCounts = { fire: 0, water: 0, air: 0, earth: 0 };
    let totalLetters = 0;
    
    letterFreq.forEach(({ element, count }) => {
      elementCounts[element] += count;
      totalLetters += count;
    });
    
    const elementPercents = {
      fire: totalLetters > 0 ? Math.round((elementCounts.fire / totalLetters) * 100) : 0,
      water: totalLetters > 0 ? Math.round((elementCounts.water / totalLetters) * 100) : 0,
      air: totalLetters > 0 ? Math.round((elementCounts.air / totalLetters) * 100) : 0,
      earth: totalLetters > 0 ? Math.round((elementCounts.earth / totalLetters) * 100) : 0,
    };
    
    // Find dominant and weakest
    const sorted = (Object.entries(elementPercents) as [ElementType, number][])
      .sort((a, b) => b[1] - a[1]);
    const dominantElement = sorted[0][0];
    const weakElement = sorted.find(([_, pct]) => pct === 0)?.[0] || null;
    
    // FIXED balance score calculation
    // Perfect balance = 25% each element
    // Calculate standard deviation and convert to 0-100 scale
    const ideal = 25;
    const values = Object.values(elementPercents);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - ideal, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Scale: 0 deviation = 100%, high deviation = 0%
    // Max reasonable deviation is ~43 (one element 100%, others 0%)
    const balanceScore = Math.max(0, Math.min(100, Math.round(100 - (stdDev * 2.3))));
    
    return {
      letterFreq,
      elementPercents,
      dominantElement,
      weakElement,
      balanceScore,
    };
  }

  /**
   * Main calculation method
   * Routes to type-specific adapters after computing core
   */
  static async calculate(request: CalculationRequest): Promise<EnhancedCalculationResult> {
    const { rawText, inputType, sourceMeta } = await this.resolveSourceText(request);

    if (!rawText) {
      console.warn('[EnhancedCalculatorEngine] Empty source text - skipping calculation for', request.type);
      throw new Error('EMPTY_SOURCE_TEXT');
    }

    // Normalize input
    const options: CalculationOptions = {
      removeVowels: request.removeVowels !== false,
      ignorePunctuation: request.ignorePunctuation !== false,
      ignoreSpaces: request.ignoreSpaces !== false,
    };
    
    const normalized = this.normalizeArabic(rawText, options);
    const hasArabic = /[\u0600-\u06FF]/.test(rawText);
    const hasLatin = /[A-Za-z]/.test(rawText);
    let languageDetected: InputMetadata['languageDetected'] = 'latin';
    if (hasArabic && hasLatin) {
      languageDetected = 'mixed';
    } else if (hasArabic || isArabicText(rawText)) {
      languageDetected = 'arabic';
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[EnhancedCalculatorEngine] CALC_INPUT', {
        calculationType: request.type,
        inputType,
        surah: sourceMeta?.surahNumber,
        ayah: sourceMeta?.ayahNumber,
        sourceLength: rawText.length,
        normalizedLength: normalized.length,
      });
    }
    
    // Build input metadata
    const input: InputMetadata = {
      raw: rawText,
      normalized,
      languageDetected,
      inputType,
      sourceMeta,
    };
    
    // Compute core numerics
    const core = this.computeCore(normalized, request.system);
    const analytics = this.computeAnalytics(normalized);
    
    // Create base result
    const result: EnhancedCalculationResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type: request.type,
      input,
      core,
      analytics,
      system: request.system,
    };
    
    // Route to type-specific adapter
    switch (request.type) {
      case 'name':
        result.nameInsights = computeNameInsights(core, analytics);
        break;
      
      case 'lineage':
        if (request.yourName && request.motherName) {
          const yourNameCore = this.computeCore(
            this.normalizeArabic(request.yourName, options),
            request.system
          );
          const motherNameCore = this.computeCore(
            this.normalizeArabic(request.motherName, options),
            request.system
          );
          
          result.lineageInsights = computeLineageInsights(
            yourNameCore.kabir,
            motherNameCore.kabir,
            yourNameCore.element,
            motherNameCore.element,
            core
          );
        }
        break;
      
      case 'phrase':
        result.phraseInsights = computePhraseInsights(core, analytics);
        break;
      
      case 'quran':
        result.quranInsights = computeQuranInsights(
          core,
          input.sourceMeta?.ayahText || input.raw,
          input.sourceMeta?.surahNumber,
          input.sourceMeta?.ayahNumber
        );
        break;
      
      case 'dhikr':
        result.dhikrInsights = computeDhikrInsights(
          core,
          request.arabicInput
        );
        break;
      
      case 'general':
        result.generalInsights = computeGeneralInsights(core, analytics);
        break;
    }
    
    return result;
  }
}
