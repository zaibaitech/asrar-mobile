/** Ported from asrar.app's src/lib/ikhtiyarat/hijri.test.ts (Vitest -> Jest). */

import { gregorianToHijri, getSunnahBadges, HIJRI_MONTH_NAMES } from '../hijri';

describe('gregorianToHijri', () => {
  it('converts a known date deterministically', () => {
    const a = gregorianToHijri(new Date('2026-07-13T12:00:00Z'));
    const b = gregorianToHijri(new Date('2026-07-13T12:00:00Z'));
    expect(a).toEqual(b);
    expect(a.month).toBeGreaterThanOrEqual(1);
    expect(a.month).toBeLessThanOrEqual(12);
  });
});

describe('HIJRI_MONTH_NAMES (Wolof traditional names)', () => {
  it('has all 12 months with a Wolof name', () => {
    expect(HIJRI_MONTH_NAMES).toHaveLength(12);
    for (const month of HIJRI_MONTH_NAMES) {
      expect(month.wolof).toBeTruthy();
    }
  });

  it('maps each Islamic month to its traditional Wolof name', () => {
    const wolofByEnglish = Object.fromEntries(HIJRI_MONTH_NAMES.map(m => [m.en, m.wolof]));
    expect(wolofByEnglish['Muharram']).toBe('Tamxarit');
    expect(wolofByEnglish['Safar']).toBe('Diggi');
    expect(wolofByEnglish["Rabi' al-Awwal"]).toBe('Gàmmu');
    expect(wolofByEnglish["Rabi' al-Thani"]).toBe('Rakki Gàmmu');
    expect(wolofByEnglish['Jumada al-Awwal']).toBe('Rakkaati Gàmmu');
    expect(wolofByEnglish['Jumada al-Thani']).toBe('Maami Koor');
    expect(wolofByEnglish['Rajab']).toBe('Ndeyi Koor');
    expect(wolofByEnglish["Sha'ban"]).toBe('Baraxlu');
    expect(wolofByEnglish['Ramadan']).toBe('Koor');
    expect(wolofByEnglish['Shawwal']).toBe('Kori');
    expect(wolofByEnglish["Dhu al-Qi'dah"]).toBe('Diggi');
    expect(wolofByEnglish['Dhu al-Hijjah']).toBe('Tabaski');
  });

  it('gregorianToHijri returns a monthName including the Wolof name', () => {
    const hijri = gregorianToHijri(new Date('2026-07-13T12:00:00Z'));
    expect(hijri.monthName.wolof).toBe(HIJRI_MONTH_NAMES[hijri.month - 1].wolof);
  });
});

describe('getSunnahBadges', () => {
  it('flags Friday as a blessed day', () => {
    // 2026-07-17 is a Friday
    const badges = getSunnahBadges(new Date('2026-07-17T12:00:00Z'));
    expect(badges.some(b => b.id === 'jumuah')).toBe(true);
  });

  it('never returns a badge implying nikah is forbidden', () => {
    for (let i = 0; i < 30; i++) {
      const d = new Date(Date.UTC(2026, 0, 1 + i * 12));
      const badges = getSunnahBadges(d);
      for (const b of badges) {
        expect(b.note.en.toLowerCase()).not.toContain('forbidden');
        expect(b.note.en.toLowerCase()).not.toContain('haram');
      }
    }
  });
});
