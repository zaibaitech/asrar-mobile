import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { translations } from '../constants/translations';

type Language = 'en' | 'fr' | 'ar';

type TranslationParams = Record<string, string | number>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
  tSafe: (key: string, fallback: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@asrar_language';

// Dev-only missing key tracker (collected once per key, no spam)
const missingKeys = new Set<string>();

/**
 * Humanize a translation key into a readable fallback
 * Examples:
 *   "home.now" => "Now"
 *   "planetaryDivineResonance" => "Planetary Divine Resonance"
 *   "planet.status.motion" => "Motion"
 */
const humanizeKey = (key: string): string => {
  // Get last segment after dots
  const lastSegment = key.split('.').pop() || key;
  
  // Convert camelCase to Title Case with spaces
  const withSpaces = lastSegment
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
  
  return withSpaces;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && ['en', 'fr', 'ar'].includes(savedLanguage)) {
        setLanguageState(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  // Translation function with nested key support (e.g., "common.calculate")
  const resolveTranslation = (lang: Language, keys: string[]) => {
    const resolvePath = (pathKeys: string[]) => {
      let value: any = translations[lang];

      for (const k of pathKeys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return undefined;
        }
      }

      return typeof value === 'string' ? value : undefined;
    };

    // Primary lookup
    const direct = resolvePath(keys);
    if (direct) {
      return direct;
    }

    // Alias: Prayer Guidance translations are nested under home.prayerGuidance
    if (keys[0] === 'prayerGuidance') {
      const aliased = resolvePath(['home', ...keys]);
      if (aliased) {
        return aliased;
      }
    }

    return undefined;
  };

  const applyParams = (text: string, params?: TranslationParams) => {
    if (!params) {
      return text;
    }

    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      const pattern = new RegExp(`{${paramKey}}`, 'g');
      return acc.replace(pattern, String(paramValue));
    }, text);
  };

  const t = (key: string, params?: TranslationParams) => {
    const keys = key.split('.');
    const fallbackLanguage: Language = 'en';

    const primaryValue = resolveTranslation(language, keys);
    if (primaryValue) {
      return applyParams(primaryValue, params);
    }

    const fallbackValue = language === fallbackLanguage
      ? undefined
      : resolveTranslation(fallbackLanguage, keys);

    if (fallbackValue) {
      if (__DEV__ && !missingKeys.has(key)) {
        missingKeys.add(key);
        console.warn(`[i18n] Missing translation for "${key}" in language "${language}". Falling back to ${fallbackLanguage}.`);
      }
      return applyParams(fallbackValue, params);
    }

    // NEVER return raw key - use humanized fallback instead
    const humanFallback = humanizeKey(key);
    
    if (__DEV__ && !missingKeys.has(key)) {
      missingKeys.add(key);
      console.warn(`[i18n] Missing translation for "${key}" in all languages. Using humanized fallback: "${humanFallback}"`);
    }

    return applyParams(humanFallback, params);
  };

  /**
   * Safe translation helper - returns fallback if key missing, NEVER shows raw keys
   * Tracks missing keys in DEV mode only (once per key, no spam)
   * 
   * @param key - Translation key to look up
   * @param fallback - Fallback text if translation missing
   * @param params - Optional parameters for string interpolation
   * @returns Translated string or fallback (never raw key)
   */
  const tSafe = (key: string, fallback: string, params?: TranslationParams): string => {
    const keys = key.split('.');
    const fallbackLanguage: Language = 'en';

    // Try primary language
    const primaryValue = resolveTranslation(language, keys);
    if (primaryValue) {
      return applyParams(primaryValue, params);
    }

    // Try fallback language if different
    if (language !== fallbackLanguage) {
      const fallbackLangValue = resolveTranslation(fallbackLanguage, keys);
      if (fallbackLangValue) {
        // Collect missing key in dev (once only)
        if (__DEV__ && !missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[tSafe] Missing "${key}" in "${language}", using EN fallback`);
        }
        return applyParams(fallbackLangValue, params);
      }
    }

    // Use provided fallback and collect in dev
    if (__DEV__ && !missingKeys.has(key)) {
      missingKeys.add(key);
      console.warn(`[tSafe] Missing "${key}" in all languages, using hardcoded fallback: "${fallback}"`);
    }

    return applyParams(fallback, params);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tSafe }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
