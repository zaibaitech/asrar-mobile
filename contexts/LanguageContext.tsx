import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { translations } from '../constants/translations';

type Language = 'en' | 'fr' | 'ar';

type TranslationParams = Record<string, string | number>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@asrar_language';

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
    let value: any = translations[lang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return typeof value === 'string' ? value : undefined;
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
      if (__DEV__) {
        console.warn(`Missing translation for "${key}" in language "${language}". Falling back to ${fallbackLanguage}.`);
      }
      return applyParams(fallbackValue, params);
    }

    if (__DEV__) {
      console.warn(`Missing translation for "${key}" in language "${language}" and fallback language.`);
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
