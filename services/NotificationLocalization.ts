import type { AppLanguage } from './StaticI18n';

function toTitleCase(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatPlanetName(lang: AppLanguage, planet: string): string {
  const key = planet.toLowerCase();
  const map: Record<string, { en: string; fr: string; ar: string }> = {
    sun: { en: 'Sun', fr: 'Soleil', ar: 'الشمس' },
    moon: { en: 'Moon', fr: 'Lune', ar: 'القمر' },
    mercury: { en: 'Mercury', fr: 'Mercure', ar: 'عطارد' },
    venus: { en: 'Venus', fr: 'Vénus', ar: 'الزهرة' },
    mars: { en: 'Mars', fr: 'Mars', ar: 'المريخ' },
    jupiter: { en: 'Jupiter', fr: 'Jupiter', ar: 'المشتري' },
    saturn: { en: 'Saturn', fr: 'Saturne', ar: 'زحل' },
  };

  const item = map[key];
  if (!item) return toTitleCase(planet);
  return item[lang] ?? item.en;
}

export function formatElementName(lang: AppLanguage, element: string): string {
  const key = element.toLowerCase();
  const map: Record<string, { en: string; fr: string; ar: string }> = {
    fire: { en: 'Fire', fr: 'Feu', ar: 'نار' },
    water: { en: 'Water', fr: 'Eau', ar: 'ماء' },
    air: { en: 'Air', fr: 'Air', ar: 'هواء' },
    earth: { en: 'Earth', fr: 'Terre', ar: 'تراب' },
  };

  const item = map[key];
  if (!item) return toTitleCase(element);
  return item[lang] ?? item.en;
}
