# Basmalah Fix - Quick Reference Guide

## Overview
This fix eliminates double Basmalah display in the Qur'an reader and ensures calculator calculations exclude Basmalah from Ayah 1 (unless explicitly requested).

## Key Components

### 1. Core Utilities (`utils/basmalah.ts`)

```typescript
import { startsWithBasmalah, stripLeadingBasmalah, shouldDisplayBasmalah, getBasmalahText } from '@/utils/basmalah';

// Check if text starts with Basmalah
if (startsWithBasmalah(ayahText)) {
  // Handle accordingly
}

// Remove Basmalah from text
const cleanText = stripLeadingBasmalah(ayahText);

// Check if surah should display Basmalah (false only for Surah 9)
if (shouldDisplayBasmalah(surahNumber)) {
  // Show Basmalah header
}

// Get Basmalah text for display
const basmalah = getBasmalahText(true); // vocalized version
```

### 2. Qur'an Reader Integration

**File:** `app/(tabs)/quran/[surahNumber].tsx`

```typescript
// Display logic
const getCleanArabicText = (ayah: QuranAyahWithTranslation): string => {
  const text = ayah.arabic.text;
  
  if (ayah.numberInSurah === 1 && shouldDisplayBasmalah(surahNum)) {
    if (startsWithBasmalah(text)) {
      return stripLeadingBasmalah(text);
    }
  }
  
  return text;
};

// Header rendering
{shouldDisplayBasmalah(surahNum) && (
  <View style={styles.bismillahContainer}>
    <Text style={styles.bismillah}>{getBasmalahText(true)}</Text>
  </View>
)}
```

### 3. Calculator Integration

**Service:** `services/QuranResonanceService.ts`

```typescript
// For calculation purposes (auto-strips Basmalah from Ayah 1)
const ayahText = await fetchAyahTextForCalculation(surahNumber, ayahNumber);

// For display purposes (raw text)
const rawText = await fetchAyahText(surahNumber, ayahNumber);
```

**Engine:** `services/EnhancedCalculatorEngine.ts`

```typescript
// Automatically strips Basmalah when fetching Ayah 1
if (request.surahNumber && request.ayahNumber) {
  const ayahText = await fetchAyahTextForCalculation(
    request.surahNumber, 
    request.ayahNumber
  );
  rawText = ayahText.trim();
}
```

### 4. UI Components

**Basmalah Selection Button** (`components/calculator/SurahAyahSelector.tsx`):

```typescript
{hasBasmalah && (
  <TouchableOpacity
    style={styles.basmalahButton}
    onPress={() => handleAyahSelect('basmalah')}
  >
    <Text style={styles.basmalahArabic}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
    <Text style={styles.basmalahLabel}>Basmalah</Text>
  </TouchableOpacity>
)}
```

**Display Text** (`components/calculator/CalculatorInput.tsx`):

```typescript
{selectedSurah && selectedAyah
  ? selectedAyah === 'basmalah'
    ? `📿 Basmalah (بِسْمِ ٱللَّهِ)`
    : `📖 Surah ${selectedSurah}, Ayah ${selectedAyah}`
  : '📖 Select Surah & Ayah'}
```

**Calculator Handler** (`app/calculator.tsx`):

```typescript
case 'quran':
  if (selectedAyah === 'basmalah') {
    result = await EnhancedCalculatorEngine.calculate({
      type: 'quran',
      pastedAyahText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
      system
    });
  } else {
    result = await EnhancedCalculatorEngine.calculate({
      type: 'quran',
      surahNumber: selectedSurah,
      ayahNumber: selectedAyah,
      system
    });
  }
```

## Type Definitions

```typescript
// Updated types to support 'basmalah' selection
selectedAyah: number | 'basmalah' | null;
onAyahChange: (number: number | 'basmalah' | null) => void;
onSelect: (surahNumber: number, ayahNumber: number | 'basmalah') => void;
```

## Islamic Rules Summary

| Surah | Basmalah Header | Ayah 1 Processing |
|-------|----------------|-------------------|
| 1 (Al-Fatiha) | ✅ Show | Strip if present in data |
| 2-8, 10-114 | ✅ Show | Strip if present in data |
| 9 (At-Tawbah) | ❌ Don't show | No processing (no Basmalah) |

## Calculator Behavior

| User Action | Result |
|-------------|--------|
| Select "Basmalah" | Calculate only Basmalah text |
| Select "Surah X, Ayah 1" | Calculate ayah content (Basmalah excluded) |
| Select "Surah X, Ayah 2+" | Calculate full ayah text |
| Paste text with Basmalah at start | Auto-strip for calculation |

## Testing Scenarios

```typescript
// Test 1: Detect Basmalah
expect(startsWithBasmalah('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الحمد')).toBe(true);

// Test 2: Strip Basmalah
const result = stripLeadingBasmalah('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الحمد');
expect(result).toBe('الحمد');

// Test 3: Surah 9 check
expect(shouldDisplayBasmalah(9)).toBe(false);
expect(shouldDisplayBasmalah(1)).toBe(true);

// Test 4: Get display text
expect(getBasmalahText(true)).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ');
```

## Common Use Cases

### Adding Basmalah detection to new features

```typescript
import { startsWithBasmalah, stripLeadingBasmalah } from '@/utils/basmalah';

function processQuranText(text: string, ayahNumber: number, surahNumber: number) {
  // For Ayah 1, check if we need to handle Basmalah
  if (ayahNumber === 1 && startsWithBasmalah(text)) {
    const cleanText = stripLeadingBasmalah(text);
    // Use cleanText for calculations or display
  }
}
```

### Displaying Basmalah header

```typescript
import { shouldDisplayBasmalah, getBasmalahText } from '@/utils/basmalah';

function SurahHeader({ surahNumber }: { surahNumber: number }) {
  return (
    <>
      {shouldDisplayBasmalah(surahNumber) && (
        <Text style={styles.basmalah}>{getBasmalahText(true)}</Text>
      )}
    </>
  );
}
```

## Files Modified

- ✅ `utils/basmalah.ts` - Core utilities (NEW)
- ✅ `utils/__tests__/basmalah.test.ts` - Tests (NEW)
- ✅ `app/(tabs)/quran/[surahNumber].tsx` - Reader display
- ✅ `services/QuranResonanceService.ts` - Ayah fetching
- ✅ `services/EnhancedCalculatorEngine.ts` - Calculation logic
- ✅ `components/calculator/SurahAyahSelector.tsx` - Basmalah button
- ✅ `app/calculator.tsx` - Selection handler
- ✅ `components/calculator/CalculatorInput.tsx` - Display text

## Troubleshooting

### Basmalah still showing twice
- Check that `getCleanArabicText()` is being called in ayah rendering
- Verify `shouldDisplayBasmalah()` is used for header conditional

### Calculator including Basmalah in Ayah 1
- Ensure using `fetchAyahTextForCalculation()` instead of `fetchAyahText()`
- Check that `stripLeadingBasmalah()` is called for pasted text

### Type errors with 'basmalah' selection
- Verify all related types include `'basmalah'` in union: `number | 'basmalah' | null`
- Check function signatures accept the union type

## Performance Notes

- Basmalah detection uses fast direct string matching first (O(1))
- Falls back to normalized comparison only if needed
- Minimal performance impact on rendering and calculations

## Future Enhancements

1. Add UI toggle for "Include Basmalah in calculation"
2. Support more Qur'an API variations
3. Handle other special verses (Ta'awwudh, etc.)
4. User preference for Basmalah display style

---
---

# 🎯 LATEST UPDATE - Enhanced Fix

## Problem Solved ✅
**Critical Bug:** Partial stripping was leaving "الرحمن الرحيم" attached to Ayah 1

**Root Cause:** Original regex used specific diacritic characters (`بِ?سْ?`) which failed when API returned different Unicode combinations

**Solution:** Flexible regex with diacritic ranges:
```javascript
/^ب[\u064B-\u065F]*س[\u064B-\u065F]*م[\u064B-\u065F]*\s*ٱ?ل.../
```

## Test Results
```
✅ Surah 2:1: "بسم الله الرحمن الرحيم الم" → "الم"
✅ Surah 1:1: Complete removal (empty string)
✅ Surah 27:30: Internal Basmalah preserved
✅ No "الرحمن" or "الرحيم" remnants
```

## Quick Verification
```bash
# Test the fix
node << 'TEST'
const text = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ الٓمٓ';
const regex = /^[\u200F\uFEFF]*ب[\u064B-\u065F]*س[\u064B-\u065F]*م[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ل[\u064B-\u065F\u0651]*[\u064B-\u065F]*ه[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F\u0640]*ح[\u064B-\u065F\u0640]*م[\u064B-\u065F\u0640\u0670]*ن[\u064B-\u065F]*\s*ٱ?ل[\u064B-\u065F]*ر[\u064B-\u065F\u0651]*[\u064B-\u065F]*ح[\u064B-\u065F]*ي[\u064B-\u065F]*م[\u064B-\u065F]*\s*/;
console.log(text.replace(regex, '').trim() === 'الٓمٓ' ? '✅ PASS' : '❌ FAIL');
TEST
```

📖 **Full details:** [BASMALAH_FIX_COMPLETE.md](./BASMALAH_FIX_COMPLETE.md)
