# Basmalah Fix Implementation - Complete Documentation

## Problem Summary
The application had two critical issues related to Basmalah (بسم الله الرحمن الرحيم):

1. **Qur'an Reader**: Basmalah was displayed twice:
   - Once as a blue standalone header
   - Again as part of Ayah 1 text (embedded in the API data)

2. **Calculator (Qur'an mode)**: When calculating "Surah X, Ayah 1", the result included Basmalah even though the user requested ONLY the ayah content.

## Solution Overview

### Core Approach
We implemented "Basmalah normalization" in ONE centralized location and reused it across:
- Qur'an reader rendering
- Calculator verse selection/extraction

### Islamic/Qur'anic Rules Applied

**Basmalah Display Rules:**
- **Surah 9 (At-Tawbah)**: NO Basmalah at all
- **Surah 1 (Al-Fatiha)**: Show Basmalah header, strip from ayah 1 if present in data
- **Other surahs (2-114, except 9)**: Show Basmalah header, strip from ayah 1 if present in data

**Calculator Rules:**
- When user selects "Surah X, Ayah N", calculate ONLY that ayah's content
- For Ayah 1: automatically strip Basmalah (unless user explicitly selects "Basmalah" option)
- For Ayah 2+: use text as-is

## Implementation Details

### 1. New Utility Module: `utils/basmalah.ts`

**Key Functions:**

#### `startsWithBasmalah(arabicText: string): boolean`
- Detects if Arabic text begins with Basmalah
- Uses two strategies:
  1. Direct string matching against known variations
  2. Normalized comparison (handles edge cases)
- Covers all common Unicode representations and diacritical variations

#### `stripLeadingBasmalah(arabicText: string): string`
- Removes Basmalah from the beginning of text
- Preserves diacritics in the remaining text
- Returns original text if no Basmalah found

#### `shouldDisplayBasmalah(surahNumber: number): boolean`
- Returns `true` for all surahs except Surah 9
- Used to determine if Basmalah header should be shown

#### `getBasmalahText(vocalized: boolean = true): string`
- Returns standard Basmalah text for display
- Supports both vocalized and plain text versions

### 2. Qur'an Reader Updates

**File:** `app/(tabs)/quran/[surahNumber].tsx`

**Changes:**
```typescript
import { shouldDisplayBasmalah, startsWithBasmalah, stripLeadingBasmalah, getBasmalahText } from '@/utils/basmalah';

// Updated getCleanArabicText function
const getCleanArabicText = (ayah: QuranAyahWithTranslation): string => {
  const text = ayah.arabic.text;
  
  // Only process ayah 1 of surahs that display Basmalah separately
  if (ayah.numberInSurah === 1 && shouldDisplayBasmalah(surahNum)) {
    if (startsWithBasmalah(text)) {
      return stripLeadingBasmalah(text);
    }
  }
  
  return text;
};

// Updated header rendering
{shouldDisplayBasmalah(surahNum) && (
  <View style={styles.bismillahContainer}>
    <Text style={styles.bismillah}>{getBasmalahText(true)}</Text>
  </View>
)}
```

**Result:**
- Basmalah appears only ONCE as a header (for applicable surahs)
- Ayah 1 text no longer duplicates it
- Surah 9 shows no Basmalah header (correct)

### 3. Calculator Updates

**Files Modified:**
- `services/QuranResonanceService.ts`
- `services/EnhancedCalculatorEngine.ts`
- `components/calculator/SurahAyahSelector.tsx`
- `app/calculator.tsx`
- `components/calculator/CalculatorInput.tsx`

#### 3.1 QuranResonanceService

**New Function:**
```typescript
export async function fetchAyahTextForCalculation(
  surahNumber: number, 
  ayahNumber: number
): Promise<string> {
  const rawText = await fetchAyahText(surahNumber, ayahNumber);
  
  // For Ayah 1 of surahs that have Basmalah, strip it from calculation
  if (ayahNumber === 1 && shouldDisplayBasmalah(surahNumber)) {
    if (startsWithBasmalah(rawText)) {
      return stripLeadingBasmalah(rawText);
    }
  }
  
  return rawText;
}
```

**Purpose:** Provides calculation-ready ayah text (Basmalah automatically removed from Ayah 1)

#### 3.2 EnhancedCalculatorEngine

**Changes:**
```typescript
import { shouldDisplayBasmalah, startsWithBasmalah, stripLeadingBasmalah } from '../utils/basmalah';
import { fetchAyahText, fetchAyahTextForCalculation } from './QuranResonanceService';

// In resolveSourceText, quran case:
case 'quran': {
  // ... existing code ...
  
  // Strip Basmalah from pasted text if it's ayah 1
  if (directText?.trim()) {
    rawText = directText.trim();
    
    if (request.ayahNumber === 1 && request.surahNumber) {
      if (shouldDisplayBasmalah(request.surahNumber) && startsWithBasmalah(rawText)) {
        rawText = stripLeadingBasmalah(rawText);
      }
    }
    
    baseMeta.ayahText = rawText;
    break;
  }
  
  // Use fetchAyahTextForCalculation which auto-strips Basmalah
  if (request.surahNumber && request.ayahNumber) {
    const ayahText = await fetchAyahTextForCalculation(request.surahNumber, request.ayahNumber);
    rawText = ayahText.trim();
    baseMeta.ayahText = rawText;
  }
}
```

**Result:** Calculator now computes ONLY the ayah content, excluding Basmalah from Ayah 1

#### 3.3 Basmalah as Selectable Item

**SurahAyahSelector Component:**

Added special Basmalah button:
```typescript
{hasBasmalah && (
  <View style={styles.basmalahSection}>
    <TouchableOpacity
      style={styles.basmalahButton}
      onPress={() => handleAyahSelect('basmalah' as any)}
    >
      <Text style={styles.basmalahIcon}>📿</Text>
      <View style={styles.basmalahTextContainer}>
        <Text style={styles.basmalahArabic}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
        <Text style={styles.basmalahLabel}>Basmalah</Text>
      </View>
    </TouchableOpacity>
  </View>
)}
```

**Calculator Handler:**
```typescript
case 'quran':
  if (selectedSurah && selectedAyah) {
    // Special case: User selected "Basmalah" from the picker
    if (selectedAyah === 'basmalah' as any) {
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
  }
```

**Result:** Users can now explicitly calculate Basmalah if desired

## Test Coverage

Created comprehensive test suite: `utils/__tests__/basmalah.test.ts`

**Test Scenarios:**
1. ✅ Detection with full tashkīl (diacritics)
2. ✅ Detection without tashkīl
3. ✅ Alternative Unicode forms
4. ✅ BOM character handling
5. ✅ Stripping from Al-Fatiha ayah 1
6. ✅ Handling Surah 9 (no Basmalah)
7. ✅ Edge cases (whitespace, partial text, etc.)
8. ✅ Integration scenarios for different surahs

## Verification Checklist

### Qur'an Reader
- [ ] Surah 9, Ayah 1: No blue Basmalah, no duplication
- [ ] Surah 1, Ayah 1: Blue Basmalah header shows, ayah text doesn't repeat it
- [ ] Surah 2-8, 10-114, Ayah 1: Blue Basmalah header shows once, ayah 1 doesn't begin with Basmalah
- [ ] Any surah, Ayah 2+: Display unchanged, working correctly

### Calculator
- [ ] Surah 5, Ayah 1: Calculation excludes Basmalah
- [ ] Surah 5, Ayah 2+: Calculation uses full ayah text
- [ ] Surah 9, Ayah 1: Works correctly (no Basmalah to strip)
- [ ] "Basmalah" selection: Calculates only Basmalah text
- [ ] Pasted ayah text with Basmalah: Automatically stripped for ayah 1

## Files Changed

### New Files
- ✅ `utils/basmalah.ts` - Core utilities
- ✅ `utils/__tests__/basmalah.test.ts` - Test suite

### Modified Files
- ✅ `app/(tabs)/quran/[surahNumber].tsx` - Reader display logic
- ✅ `services/QuranResonanceService.ts` - Added fetchAyahTextForCalculation
- ✅ `services/EnhancedCalculatorEngine.ts` - Updated quran calculation logic
- ✅ `components/calculator/SurahAyahSelector.tsx` - Added Basmalah selection button
- ✅ `app/calculator.tsx` - Handle Basmalah selection
- ✅ `components/calculator/CalculatorInput.tsx` - Display "Basmalah" when selected

## Key Benefits

1. **Single Source of Truth**: All Basmalah detection/stripping logic in one module
2. **Consistent Behavior**: Same rules applied in reader and calculator
3. **Islamic Accuracy**: Respects traditional Qur'anic structure (Surah 9 exception)
4. **User Control**: Calculator users can explicitly choose to calculate Basmalah
5. **Clean UI**: No more duplicate Basmalah in reader
6. **Accurate Calculations**: Calculator results match user expectations

## Known Limitations

1. **Type Safety**: The 'basmalah' special value uses `as any` cast due to TypeScript type constraints. Consider adding proper union type if expanding this pattern.
2. **API Dependency**: Relies on Al-Quran Cloud API format. If switching APIs, may need to adjust Basmalah detection patterns.

## Future Enhancements (Optional)

1. Add "Include Basmalah" toggle in calculator UI
2. Support more Basmalah variations from different Qur'an editions
3. Add user preference to show/hide Basmalah header in reader
4. Extend to handle other special verses (e.g., Ta'awwudh)

## Conclusion

This implementation successfully resolves the double Basmalah issue while maintaining Islamic accuracy and providing users with explicit control over Basmalah calculations. The centralized utility approach ensures consistency and makes future maintenance straightforward.
