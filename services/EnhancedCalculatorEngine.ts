/**
 * Enhanced Calculator Engine
 * Core computation engine for ʿIlm al-Asrār Calculator
 * 
 * UPDATED: Now uses unified normalization and calculation pipeline
 * - Single source of truth: computeAbjadProfile()
 * - Consistent normalization: normalizeArabic() and normalizeDhikrName()
 * - Deterministic results across all input types
 */

import { getDivineNameByNumber } from '../data/divine-names';
import { getSurahByNumber } from '../data/quran-surahs';
import {
    CalculationRequest,
    CoreResults,
    ElementalAnalytics,
    EnhancedCalculationResult,
    InputMetadata,
    UnifiedInputType
} from '../types/calculator-enhanced';
import { computeAbjadProfile } from '../utils/abjad-unified-pipeline';
import { debugCurrentCalculation } from '../utils/abjadDebugTools';
import { normalizeArabic, normalizeDhikrName } from '../utils/arabic-normalization';
import { shouldStripBasmalah, startsWithBasmalah, stripLeadingBasmalah } from '../utils/basmalah';
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
import { fetchAyahTextForCalculation } from './QuranResonanceService';

export class EnhancedCalculatorEngine {
  /**
   * Debug mode flag - set to true to enable detailed calculation logging
   * Useful for diagnosing Web vs Mobile calculation discrepancies
   */
  private static DEBUG_MODE = false;
  
  /**
   * Enable/disable debug mode
   */
  static setDebugMode(enabled: boolean): void {
    this.DEBUG_MODE = enabled;
    console.log(`[EnhancedCalculatorEngine] Debug mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }
  
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
          
          // Strip Basmalah from pasted text if applicable
          // (Ayah 1, except Surah 9 and special cases like Surah 27:30)
          if (request.ayahNumber && request.surahNumber) {
            if (shouldStripBasmalah(request.surahNumber, request.ayahNumber)) {
              if (startsWithBasmalah(rawText)) {
                rawText = stripLeadingBasmalah(rawText);
              }
            }
          }
          
          baseMeta.ayahText = rawText;
          break;
        }

        if (request.surahNumber && request.ayahNumber) {
          try {
            // Use fetchAyahTextForCalculation which automatically strips Basmalah when needed
            const ayahText = await fetchAyahTextForCalculation(request.surahNumber, request.ayahNumber);
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
   * Main calculation method
   * Routes to type-specific adapters after computing core using unified pipeline
   * 
   * CRITICAL CHANGES:
   * - Uses normalizeArabic() for all text (except Dhikr)
   * - Uses normalizeDhikrName() for Dhikr input
   * - Uses computeAbjadProfile() for all calculations
   * - Ensures consistency across Qur'an sources
   */
  static async calculate(request: CalculationRequest): Promise<EnhancedCalculationResult> {
    const { rawText, inputType, sourceMeta } = await this.resolveSourceText(request);

    if (!rawText) {
      console.warn('[EnhancedCalculatorEngine] Empty source text - skipping calculation for', request.type);
      throw new Error('EMPTY_SOURCE_TEXT');
    }

    // Determine normalization strategy based on input type
    let normalizedText = '';
    let calculatedFrom: string | undefined;
    let calculationNote: string | undefined;
    let warning: string | undefined;
    
    if (request.type === 'dhikr') {
      // Special handling for Dhikr: strip "ال" and "يا"
      normalizedText = normalizeDhikrName(rawText);
      calculatedFrom = normalizedText;
      
      if (!normalizedText) {
        warning = 'Could not extract Divine Name from input';
        normalizedText = normalizeArabic(rawText); // Fallback
      } else if (normalizedText !== normalizeArabic(rawText)) {
        calculationNote = 'Calculated without ال/يا prefixes';
      }
    } else {
      // Standard normalization for all other types
      normalizedText = normalizeArabic(rawText);
    }

    // Detect language
    const hasArabic = /[\u0600-\u06FF]/.test(rawText);
    const hasLatin = /[A-Za-z]/.test(rawText);
    let languageDetected: InputMetadata['languageDetected'] = 'latin';
    if (hasArabic && hasLatin) {
      languageDetected = 'mixed';
    }
    
    // Optional: Debug detailed normalization (when DEBUG_MODE is true)
    if (this.DEBUG_MODE && request.type === 'quran') {
      console.log('[EnhancedCalculatorEngine] 🔍 QURAN CALCULATION DEBUG MODE ACTIVE');
      debugCurrentCalculation(rawText, undefined, undefined, request.system || 'maghribi');
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
        normalizedLength: normalizedText.length,
        normalized: normalizedText.substring(0, 50) + (normalizedText.length > 50 ? '...' : ''),
      });
    }
    
    // Build input metadata
    const input: InputMetadata = {
      raw: rawText,
      normalized: normalizedText,
      languageDetected,
      inputType,
      sourceMeta,
    };

    if (calculatedFrom) {
      input.calculatedFrom = calculatedFrom;
    }

    if (calculationNote) {
      input.calculationNote = calculationNote;
    }

    if (warning) {
      input.warning = warning;
    }
    
    // USE UNIFIED PIPELINE - Single source of truth
    const emptyInput = normalizedText.length === 0;
    
    if (emptyInput) {
      // Return empty result
      const core: CoreResults = {
        kabir: 0,
        saghir: 0,
        hadadMod4: 0,
        burj: '—',
        element: 'water' as ElementType,
        sirr: 0,
        wusta: 0,
        kamal: 0,
        bast: 0,
      };
      
      const analytics: ElementalAnalytics = {
        letterFreq: [],
        elementPercents: { fire: 0, water: 0, air: 0, earth: 0 },
        dominantElement: 'fire' as ElementType,
        weakElement: null,
        balanceScore: 0,
      };
      
      const result: EnhancedCalculationResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: request.type,
        input,
        core,
        analytics,
        system: request.system,
      };
      
      return result;
    }
    
    // Compute using unified pipeline
    const profile = computeAbjadProfile(
      rawText,
      normalizedText,
      request.system,
      inputType === 'quran' ? 'quran' : inputType === 'custom' ? 'general' : 'general'
    );
    
    // Convert profile to legacy CoreResults format (for compatibility)
    const core: CoreResults = {
      kabir: profile.core.kabir,
      saghir: profile.core.saghir,
      hadadMod4: profile.core.hadad,
      burj: profile.core.burjName,
      element: profile.core.element,
      sirr: profile.advanced.sirr,
      wusta: profile.advanced.wusta,
      kamal: profile.advanced.kamal,
      bast: profile.advanced.bast,
    };
    
    // Convert profile to legacy ElementalAnalytics format
    const analytics: ElementalAnalytics = {
      letterFreq: profile.letterFrequency,
      elementPercents: {
        fire: profile.elemental.firePercent,
        water: profile.elemental.waterPercent,
        air: profile.elemental.airPercent,
        earth: profile.elemental.earthPercent,
      },
      dominantElement: profile.elemental.dominantElement,
      weakElement: profile.elemental.weakestElement,
      balanceScore: profile.elemental.balanceScore,
    };
    
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
          const yourProfile = computeAbjadProfile(
            request.yourName,
            normalizeArabic(request.yourName),
            request.system,
            'general'
          );
          const motherProfile = computeAbjadProfile(
            request.motherName,
            normalizeArabic(request.motherName),
            request.system,
            'general'
          );
          
          result.lineageInsights = computeLineageInsights(
            yourProfile.core.kabir,
            motherProfile.core.kabir,
            yourProfile.core.element,
            motherProfile.core.element,
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
          request.arabicInput || input.sourceMeta?.divineNameArabic || input.raw
        );
        break;
      
      case 'general':
        result.generalInsights = computeGeneralInsights(core, analytics);
        break;
    }
    
    return result;
  }
}
