import { getCompatibilityTierBadge, getCompatibilityTierLabelKey, tierRank, type CompatibilityTier } from '../compatibilityTier';

const ALL_TIERS: CompatibilityTier[] = ['saeed', 'mutadil', 'mahdhur'];

describe('compatibilityTier', () => {
  it('has exactly 3 tiers, matching the dignity system vocabulary', () => {
    for (const tier of ALL_TIERS) {
      const badge = getCompatibilityTierBadge(tier);
      expect(badge.tier).toBe(tier);
      expect(badge.labelAr.length).toBeGreaterThan(0);
    }
  });

  it('uses the correct transliteration casing (Muʿtadil, not mutadil)', () => {
    expect(getCompatibilityTierBadge('mutadil').translit).toBe('Muʿtadil');
    expect(getCompatibilityTierBadge('saeed').translit).toBe('Saʿīd');
    expect(getCompatibilityTierBadge('mahdhur').translit).toBe('Maḥdhūr');
  });

  it('every tier resolves to a distinct translation key', () => {
    const keys = ALL_TIERS.map(getCompatibilityTierLabelKey);
    expect(new Set(keys).size).toBe(3);
  });

  it('tierRank is strictly ordered mahdhur < mutadil < saeed', () => {
    expect(tierRank('mahdhur')).toBeLessThan(tierRank('mutadil'));
    expect(tierRank('mutadil')).toBeLessThan(tierRank('saeed'));
  });
});
