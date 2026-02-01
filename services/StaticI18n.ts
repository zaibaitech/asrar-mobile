import { translations } from '@/constants/translations';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'en' | 'fr' | 'ar';

type TranslationParams = Record<string, string | number>;

const LANGUAGE_STORAGE_KEY = '@asrar_language';

const humanizeKey = (key: string): string => {
  const lastSegment = key.split('.').pop() || key;
  return lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

export async function getStoredLanguage(): Promise<AppLanguage> {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage === 'en' || savedLanguage === 'fr' || savedLanguage === 'ar') {
      return savedLanguage;
    }
  } catch {
    // ignore
  }
  return 'en';
}

const resolvePath = (lang: AppLanguage, pathKeys: string[]): string | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = (translations as any)[lang];

  for (const k of pathKeys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }

  return typeof value === 'string' ? value : undefined;
};

const applyParams = (text: string, params?: TranslationParams) => {
  if (!params) return text;

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    const pattern = new RegExp(`{${paramKey}}`, 'g');
    return acc.replace(pattern, String(paramValue));
  }, text);
};

export function tStatic(lang: AppLanguage, key: string, params?: TranslationParams): string {
  const keys = key.split('.');

  const primary = resolvePath(lang, keys);
  if (primary) return applyParams(primary, params);

  // Alias: Birth Profile translations may live under root `birth.*`
  // while callers use `calculator.birth.*`
  if (keys[0] === 'calculator' && keys[1] === 'birth') {
    const aliased = resolvePath(lang, ['birth', ...keys.slice(2)]);
    if (aliased) return applyParams(aliased, params);
  }

  const fallback = lang === 'en' ? undefined : resolvePath('en', keys);
  if (fallback) return applyParams(fallback, params);

  if (lang !== 'en' && keys[0] === 'calculator' && keys[1] === 'birth') {
    const fallbackAliased = resolvePath('en', ['birth', ...keys.slice(2)]);
    if (fallbackAliased) return applyParams(fallbackAliased, params);
  }

  return applyParams(humanizeKey(key), params);
}
