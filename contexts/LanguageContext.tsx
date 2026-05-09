import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
 * Get device language from system locale
 * Normalizes locale codes (e.g., fr-FR -> fr, en-GB -> en)
 * Returns a supported language or falls back to 'en'
 */
const getDeviceLanguage = (): Language => {
  try {
    const locales = Localization.getLocales();
    if (locales && locales.length > 0) {
      const primaryLocale = locales[0];
      const languageCode = primaryLocale.languageCode?.toLowerCase() || '';
      
      // Normalize and validate against supported languages
      if (languageCode.startsWith('fr')) return 'fr';
      if (languageCode.startsWith('ar')) return 'ar';
      if (languageCode.startsWith('en')) return 'en';
    }
  } catch (error) {
    console.warn('Failed to get device locale:', error);
  }
  
  // Default fallback
  return 'en';
};

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
    .replaceAll(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim();
  
  return withSpaces;
};

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  // Initialize with device language - will be overridden by saved preference if it exists
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => getDeviceLanguage());

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && ['en', 'fr', 'ar'].includes(savedLanguage)) {
          // User has explicitly chosen a language - use it
          setCurrentLanguage(savedLanguage as Language);
          console.log('[LanguageProvider] Loaded saved language:', savedLanguage);
          return;
        }

        // No saved preference - use device language (already set in initial state)
        const deviceLang = getDeviceLanguage();
        setCurrentLanguage(deviceLang);
        console.log('[LanguageProvider] Using device language:', deviceLang);
      } catch (error) {
        console.error('Failed to load language:', error);
        // Keep initial device language if loading fails
      }
    };

    loadLanguage().catch((error) => {
      console.error('Failed to initialize language:', error);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      // Save user's explicit language choice
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setCurrentLanguage(lang);
      console.log('[LanguageProvider] Language changed to:', lang);
    } catch (error) {
      // Handle storage full error with retry
      if (error instanceof Error && error.message.includes('SQLITE_FULL')) {
        console.warn('AsyncStorage full, clearing old data and retrying...');
        try {
          // Try to clear non-critical items to free up space
          const allKeys = await AsyncStorage.getAllKeys();
          const keysToRemove = allKeys.filter(key => 
            !key.startsWith('@asrar_') || 
            key === '@asrar_cache' || 
            key === '@asrar_temp'
          );
          
          if (keysToRemove.length > 0) {
            await AsyncStorage.multiRemove(keysToRemove);
            // Retry saving language
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            setCurrentLanguage(lang);
            console.log('[LanguageProvider] Language saved successfully after cleanup');
            return;
          }
        } catch (cleanupError) {
          console.error('Failed to cleanup storage:', cleanupError);
        }
      }
      
      // If we couldn't save to storage, at least update the state
      setCurrentLanguage(lang);
      console.error('Failed to save language to storage:', error);
    }
  }, []);

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

    // Alias: Birth Profile translations were historically nested at root `birth.*`
    // while UI/service keys use `calculator.birth.*`
    if (keys[0] === 'calculator' && keys[1] === 'birth') {
      const aliased = resolvePath(['birth', ...keys.slice(2)]);
      if (aliased) {
        return aliased;
      }
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

  const t = useCallback((key: string, params?: TranslationParams) => {
    const keys = key.split('.');
    const fallbackLanguage: Language = 'en';

    const primaryValue = resolveTranslation(currentLanguage, keys);
    if (primaryValue) {
      return applyParams(primaryValue, params);
    }

    const fallbackValue = currentLanguage === fallbackLanguage
      ? undefined
      : resolveTranslation(fallbackLanguage, keys);

    if (fallbackValue) {
      if (__DEV__ && !missingKeys.has(key)) {
        missingKeys.add(key);
        console.warn(`[i18n] Missing translation for "${key}" in language "${currentLanguage}". Falling back to ${fallbackLanguage}.`);
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
  }, [currentLanguage]);

  /**
   * Safe translation helper - returns fallback if key missing, NEVER shows raw keys
   * Tracks missing keys in DEV mode only (once per key, no spam)
   * 
   * @param key - Translation key to look up
   * @param fallback - Fallback text if translation missing
   * @param params - Optional parameters for string interpolation
   * @returns Translated string or fallback (never raw key)
   */
  const tSafe = useCallback((key: string, fallback: string, params?: TranslationParams): string => {
    const keys = key.split('.');
    const fallbackLanguage: Language = 'en';

    // Try primary language
    const primaryValue = resolveTranslation(currentLanguage, keys);
    if (primaryValue) {
      return applyParams(primaryValue, params);
    }

    // Try fallback language if different
    if (currentLanguage !== fallbackLanguage) {
      const fallbackLangValue = resolveTranslation(fallbackLanguage, keys);
      if (fallbackLangValue) {
        // Collect missing key in dev (once only)
        if (__DEV__ && !missingKeys.has(key)) {
          missingKeys.add(key);
          console.warn(`[tSafe] Missing "${key}" in "${currentLanguage}", using EN fallback`);
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
  }, [currentLanguage]);

  const contextValue = useMemo(() => ({
    language: currentLanguage,
    setLanguage,
    t,
    tSafe,
  }), [currentLanguage, setLanguage, t, tSafe]);

  return (
    <LanguageContext.Provider value={contextValue}>
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
