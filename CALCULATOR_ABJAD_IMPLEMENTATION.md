# Qur'an Verse Abjad Calculator - Implementation Guide

## 📋 Overview

This document describes the complete refactoring of the Abjad Calculator to ensure:
- **Accurate** calculations across all input types
- **Consistent** results regardless of Qur'an text source
- **Deterministic** outputs for the same input
- **Transparent** presentation of calculated vs suggested associations

## 🎯 Key Changes

### 1. Unified Arabic Normalization (`utils/arabic-normalization.ts`)

**Purpose**: Single source of truth for text cleaning before calculations

**Function**: `normalizeArabic(text: string): string`

**Process**:
1. Trim whitespace
2. Apply Unicode NFC normalization
3. Decompose ligatures (ﻻ → لا)
4. Remove ALL diacritics (َ ِ ُ ً ٍ ٌ ْ ّ etc.)
5. Remove Qur'anic marks (۝ ۞ ۚ ۗ ۖ etc.)
6. Remove tatweel (ـ)
7. Normalize letter variants:
   - أ إ آ ٱ → ا (alif variants)
   - ؤ → و (wāw with hamza)
   - ئ → ي (yā' with hamza)
   - **ة → ه** (tā' marbūṭa to hā')
   - **ى → ي** (alif maqṣūra to yā')
8. Remove digits, punctuation, whitespace, Latin chars
9. Strip non-Arabic letters

**Example**:
```typescript
const input = "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ";
const output = normalizeArabic(input);
// Result: "بسماللهالرحمنالرحيم"
```

**Critical Design Decision**: `ة → ه`
- Ensures "رحمة" (raḥmah) = "رحمه" in calculations
- Maintains consistency across different text sources
- Documented in code for transparency

### 2. Dhikr Name Normalization (`utils/arabic-normalization.ts`)

**Purpose**: Strip prefixes from Divine Names for correct calculation

**Function**: `normalizeDhikrName(text: string): string`

**Process**:
1. Apply standard normalization
2. Strip "يا" (yā) vocative prefix if present
3. Strip "ال" (al-) definite article if present
4. **Special case**: Preserve "الله" (Allah) as-is

**Example**:
```typescript
normalizeDhikrName("اللَّطِيف")  // → "لطيف"
normalizeDhikrName("يا الرحمن")  // → "رحمن"
normalizeDhikrName("اللَّه")      // → "الله" (preserved)
```

### 3. Unified Calculation Pipeline (`utils/abjad-unified-pipeline.ts`)

**Purpose**: Single function that computes ALL Abjad values

**Function**: `computeAbjadProfile(originalText, normalizedText, system, inputType): AbjadProfile`

**Returns**: Complete profile with:
- **Core Results**:
  - Kabīr (grand total)
  - Ṣaghīr (digital root)
  - Ḥadad (element index, mod 4)
  - Element (fire/water/air/earth)
  - Burj Index (zodiac index, mod 12)
  - Burj Name (zodiac sign)
  
- **Advanced Methods**:
  - Wusṭā = (kabir + saghir) / 2
  - Kamāl = kabir + saghir
  - Basṭ = kabir × saghir
  - Sirr = kabir - saghir
  
- **Elemental Composition**:
  - Letter counts per element
  - Percentages (fire/water/air/earth)
  - Dominant element
  - Weakest element
  - Balance score (0-100)
  
- **Letter Frequency**: Array of letters with counts, values, elements

**Key Principle**: Calculate everything ONCE, use everywhere

### 4. Burj (Zodiac) Mapping

**Formula**: `burjIndex = (kabir % 12) || 12`
- Result: 1-12 (not 0-11)
- Maps directly to zodiac signs

**Mapping Table**:
```
1  → Aries (الحمل)
2  → Taurus (الثور)
3  → Gemini (الجوزاء)
4  → Cancer (السرطان)
5  → Leo (الأسد)
6  → Virgo (العذراء)
7  → Libra (الميزان)
8  → Scorpio (العقرب)
9  → Sagittarius (القوس)
10 → Capricorn (الجدي)
11 → Aquarius (الدلو)
12 → Pisces (الحوت)
```

### 5. Ḥadad (Element) Mapping

**Formula**: `hadad = kabir % 4`
- Result: 0-3
- Maps to elements

**Mapping Table**:
```
0 → Earth (تراب)
1 → Fire (نار)
2 → Air (هواء)
3 → Water (ماء)
```

## 🔧 Integration Changes

### EnhancedCalculatorEngine

**Before**:
- Used local `normalizeArabic()` with options
- Had separate `computeCore()` and `computeAnalytics()`
- Text normalization varied by input type

**After**:
- Uses unified `normalizeArabic()` from utils
- Uses `normalizeDhikrName()` for Dhikr inputs
- Calls `computeAbjadProfile()` once
- Converts profile to legacy `CoreResults` format (for compatibility)

**Key Change**:
```typescript
// Old approach
const normalized = this.normalizeArabic(rawText, options);
const core = this.computeCore(normalized, system);
const analytics = this.computeAnalytics(normalized);

// New approach
const normalized = normalizeArabic(rawText);
const profile = computeAbjadProfile(rawText, normalized, system, inputType);
// profile contains EVERYTHING
```

### SurahAyahSelector

**Fixed**: Runtime crash "onSelect is not a function"

**Changes**:
1. Added JSDoc to clarify `onSelect` is REQUIRED
2. Enhanced type safety check before calling
3. Added error logging for debugging

```typescript
interface SurahAyahSelectorProps {
  /** REQUIRED: Parent must provide this handler */
  onSelect: (surahNumber: number, ayahNumber: number) => void;
  selectedSurah?: number | null;
  selectedAyah?: number | null;
}

// In handler:
if (!onSelect || typeof onSelect !== 'function') {
  console.error('[SurahAyahSelector] CRITICAL: onSelect handler missing');
  return;
}
```

### Qur'an Resonance Link

**Fixed**: Misleading "786 / Bismillah" associations

**Changes**:
1. Resonance is now **calculated** from Kabīr value
2. Shows nearest sacred number from sacred set
3. Displays distance from sacred number
4. Includes transparency flags

**Updated Type**:
```typescript
resonanceLink: {
  dominantElement: ElementType;
  sacredNumber: number;
  meaning: string;
  isCalculated?: boolean;  // NEW: flags as calculated
  kabir?: number;          // NEW: shows verse Kabīr
  distance?: number;       // NEW: distance to sacred number
}
```

**UI Update**:
```tsx
<Text style={styles.resonanceSubtitle}>
  {insights.resonanceLink.isCalculated 
    ? '📊 Calculated from verse Abjad value' 
    : '💭 Suggested association'}
</Text>
```

## ✅ Testing

### Unit Tests (`utils/__tests__/arabic-normalization.test.ts`)

**Test Coverage**:
1. Diacritic removal
2. Qur'anic mark removal
3. Tatweel removal
4. Letter variant normalization
5. Whitespace/punctuation removal
6. Dhikr name stripping
7. **Consistency across sources** (CRITICAL)
8. Deterministic calculations
9. Real-world Qur'an verses

**Example Test**:
```typescript
it('should produce same result from different Qur\'an sources', () => {
  const source1 = 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
  const source2 = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ';
  const source3 = 'بسم الله الرحمن الرحيم';
  
  const result1 = normalizeArabic(source1);
  const result2 = normalizeArabic(source2);
  const result3 = normalizeArabic(source3);
  
  expect(result1).toBe(result2);
  expect(result2).toBe(result3);
  expect(result1).toBe('بسماللهالرحمنالرحيم');
});
```

### Running Tests

```bash
# Install test dependencies (if not already installed)
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test

# Run specific test file
npm test arabic-normalization.test.ts

# Run with coverage
npm test -- --coverage
```

## 🎨 UI Improvements

### Core Results Grid (Always Visible)

**Requirement**: Show 4 core tiles at top for ALL modes

**Tiles**:
1. **Kabīr** (Grand Total)
2. **Ṣaghīr** (Digital Root)
3. **Ḥadad** (Element Index)
4. **Burj** (Zodiac Sign)

**Implementation**: Already in `CoreResultsGrid` component
- Ensure it's rendered in ALL mode result displays
- No conditional hiding in enhanced view

### Burj Name Wrapping

**Issue**: Long names like "Sagittarius" may overflow
**Fix**: Already handled with `flexWrap` in result cards

## 🐛 Troubleshooting

### Issue: Calculations show 0 in Qur'an mode

**Cause**: Text not normalized or empty normalized result
**Fix**: Check `normalizeArabic()` output
```typescript
console.log('Normalized:', normalizeArabic(verseText));
```

### Issue: Different results from same verse

**Cause**: Text source has different diacritics/marks
**Fix**: Use `normalizeArabic()` before comparison
```typescript
const text1 = normalizeArabic(source1);
const text2 = normalizeArabic(source2);
console.log('Match:', text1 === text2);
```

### Issue: Dhikr calculation includes "ال"

**Cause**: Using `normalizeArabic()` instead of `normalizeDhikrName()`
**Fix**: Use correct function in Dhikr input type
```typescript
const cleaned = normalizeDhikrName(divineNameInput);
```

### Issue: Runtime error in SurahAyahSelector

**Cause**: Parent component not passing `onSelect` prop
**Fix**: Ensure calculator passes handler:
```typescript
<SurahAyahSelector
  onSelect={(surah, ayah) => {
    setSelectedSurah(surah);
    setSelectedAyah(ayah);
  }}
/>
```

## 📊 Verification Checklist

After implementation, verify:

- [ ] Bismillah calculation is consistent across sources
- [ ] Dhikr names calculate without "ال" prefix
- [ ] Qur'an mode shows all 4 core tiles
- [ ] Resonance Link shows "Calculated from verse Abjad value"
- [ ] Same verse from different sources = same Kabīr
- [ ] SurahAyahSelector doesn't crash when selecting ayah
- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)

## 📚 File Reference

### New Files
- `utils/arabic-normalization.ts` - Normalization utilities
- `utils/abjad-unified-pipeline.ts` - Calculation pipeline
- `utils/__tests__/arabic-normalization.test.ts` - Unit tests

### Modified Files
- `services/EnhancedCalculatorEngine.ts` - Uses new pipeline
- `services/InsightAdapters.ts` - Enhanced Qur'an resonance
- `types/calculator-enhanced.ts` - Updated QuranInsights type
- `components/calculator/SurahAyahSelector.tsx` - Fixed prop handling
- `components/calculator/results/QuranResultSection.tsx` - Transparency UI

## 🔮 Future Enhancements

1. **Caching**: Cache normalized text for performance
2. **Validation**: Add stricter input validation
3. **Localization**: Support multiple translation sources
4. **Analytics**: Track calculation accuracy metrics
5. **Offline**: Store common verses locally

## 📞 Support

If calculations still show inconsistencies:
1. Check normalization output
2. Verify system selection (Maghribi/Mashriqi)
3. Confirm input type routing
4. Review console logs for warnings
5. Run unit tests to isolate issue

---

**Last Updated**: December 26, 2025
**Version**: 2.0.0
**Author**: Senior React Native + TypeScript Engineer
