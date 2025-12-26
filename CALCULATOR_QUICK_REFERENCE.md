# Quick Reference - Abjad Calculator Functions

## 🔧 Core Functions (Import These)

### Normalization

```typescript
import { normalizeArabic, normalizeDhikrName } from './utils/arabic-normalization';

// Standard normalization (for General, Phrase, Qur'an)
const cleaned = normalizeArabic("بِسْمِ اللَّهِ"); 
// Result: "بسمالله"

// Dhikr normalization (strips ال and يا)
const dhikrCleaned = normalizeDhikrName("اللَّطِيف");
// Result: "لطيف"
```

### Calculation

```typescript
import { computeAbjadProfile } from './utils/abjad-unified-pipeline';

const text = "بسم الله";
const normalized = normalizeArabic(text);
const profile = computeAbjadProfile(text, normalized, 'maghribi', 'general');

// Access results:
console.log(profile.core.kabir);      // Grand total
console.log(profile.core.saghir);     // Digital root
console.log(profile.core.element);    // Element name
console.log(profile.core.burjName);   // Zodiac sign
console.log(profile.advanced.wusta);  // Advanced method
console.log(profile.elemental);       // Element composition
```

## 📐 Calculation Formulas

### Core Values
```typescript
kabir = Σ abjad(letter)         // Sum all letter values
saghir = digitalRoot(kabir)     // Recursive digit sum (1-9)
hadad = kabir % 4               // Element index (0-3)
burjIndex = (kabir % 12) || 12  // Zodiac index (1-12)
```

### Advanced Methods
```typescript
wusta = floor((kabir + saghir) / 2)  // Middle
kamal = kabir + saghir               // Perfection
bast = kabir × saghir                // Expansion
sirr = kabir - saghir                // Secret
```

### Elemental Composition
```typescript
firePercent = (fireLetters / totalLetters) × 100
balanceScore = 100 - (stdDev × 2.3)  // 0-100, higher = more balanced
```

## 🗺️ Mapping Tables

### Hadad → Element (kabir % 4)
```
0 → Earth (تراب)
1 → Fire (نار)
2 → Air (هواء)
3 → Water (ماء)
```

### Burj → Zodiac ((kabir % 12) || 12)
```
1  → Aries (الحمل) ♈
2  → Taurus (الثور) ♉
3  → Gemini (الجوزاء) ♊
4  → Cancer (السرطان) ♋
5  → Leo (الأسد) ♌
6  → Virgo (العذراء) ♍
7  → Libra (الميزان) ♎
8  → Scorpio (العقرب) ♏
9  → Sagittarius (القوس) ♐
10 → Capricorn (الجدي) ♑
11 → Aquarius (الدلو) ♒
12 → Pisces (الحوت) ♓
```

## 🎯 Common Patterns

### Calculate Qur'an Verse
```typescript
const verseText = await fetchAyahText(surahNum, ayahNum);
const normalized = normalizeArabic(verseText);
const profile = computeAbjadProfile(
  verseText,
  normalized,
  'maghribi',  // or 'mashriqi'
  'quran'
);
```

### Calculate Divine Name
```typescript
const divineName = "اللطيف";
const normalized = normalizeDhikrName(divineName);
const profile = computeAbjadProfile(
  divineName,
  normalized,
  'maghribi',
  'general'
);
```

### Compare Two Sources
```typescript
const source1 = "بِسۡمِ ٱللَّهِ"; // With tashkīl
const source2 = "بسم الله";       // Without
const norm1 = normalizeArabic(source1);
const norm2 = normalizeArabic(source2);

console.log(norm1 === norm2);  // true - consistent!
```

## 🧪 Quick Test

```typescript
// Test normalization
const test = normalizeArabic("قُلۡ هُوَ ٱللَّهُ أَحَدٌ");
console.assert(test === "قلهواللهاحد", "Normalization failed!");

// Test calculation
const profile = computeAbjadProfile(
  "بسم الله",
  normalizeArabic("بسم الله"),
  'maghribi',
  'general'
);
console.log(`Kabir: ${profile.core.kabir}`);  // Should be consistent
```

## 🚨 Common Mistakes

### ❌ Don't Do This
```typescript
// WRONG: Different normalization for calculation vs display
const display = rawText;
const calc = someOtherNormalization(rawText);
```

### ✅ Do This Instead
```typescript
// RIGHT: Same normalization everywhere
const normalized = normalizeArabic(rawText);
const profile = computeAbjadProfile(rawText, normalized, system, type);
```

### ❌ Don't Do This
```typescript
// WRONG: Calling multiple calculation functions
const kabir = calculateKabir(text);
const saghir = calculateSaghir(kabir);
const element = calculateElement(kabir);
```

### ✅ Do This Instead
```typescript
// RIGHT: One calculation, use profile
const profile = computeAbjadProfile(...);
const { kabir, saghir, element } = profile.core;
```

## 📚 Type Reference

### AbjadProfile
```typescript
interface AbjadProfile {
  originalText: string;       // Raw input
  normalizedText: string;     // Cleaned for calculation
  system: 'maghribi' | 'mashriqi';
  inputType: 'general' | 'dhikr' | 'quran';
  
  core: {
    kabir: number;
    saghir: number;
    hadad: number;
    element: 'fire' | 'water' | 'air' | 'earth';
    burjIndex: number;
    burjName: string;
    burjSymbol: string;
  };
  
  advanced: {
    wusta: number;
    kamal: number;
    bast: number;
    sirr: number;
  };
  
  elemental: {
    fire: number;             // Count
    water: number;
    air: number;
    earth: number;
    totalLetters: number;
    firePercent: number;      // 0-100
    waterPercent: number;
    airPercent: number;
    earthPercent: number;
    dominantElement: ElementType;
    weakestElement: ElementType | null;
    balanceScore: number;     // 0-100
  };
  
  letterFrequency: {
    letter: string;
    count: number;
    value: number;
    element: ElementType;
  }[];
}
```

## 🔗 Related Files

- **Implementation**: `CALCULATOR_ABJAD_IMPLEMENTATION.md`
- **QA Summary**: `CALCULATOR_QA_SUMMARY.md`
- **Normalization**: `utils/arabic-normalization.ts`
- **Pipeline**: `utils/abjad-unified-pipeline.ts`
- **Tests**: `utils/__tests__/arabic-normalization.test.ts`
