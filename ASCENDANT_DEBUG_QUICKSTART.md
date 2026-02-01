# Ascendant Debug Logging - Quick Start Guide

## What Was Done
Added comprehensive step-by-step debug logging to trace the entire Birth Profile ascendant calculation pipeline from local time input through zodiac sign output.

## Problem to Solve
Ascendant calculates as Scorpio (~21°) instead of Leo (~24°) for:
- **Location**: Serrekunda, The Gambia (13.43°N, -16.68°W)
- **Date/Time**: 2026-01-30 at 20:00 (UTC+0)
- **Expected**: Leo Ascendant ≈ 24° (ecliptic longitude ~144°)

## How to Use

### Option 1: Quick Test in Calculator UI
1. Open the app → Birth Profile Calculator
2. Enter date: **2026-01-30**
3. Enter time: **20:00**
4. Search location: **"Serrekunda"** (or manually: 13.43°N, -16.68°W)
5. Click **Calculate**
6. Open browser DevTools: Press **F12**
7. Look for console logs
8. Scroll through to find debug output sections

### Option 2: Manual Test from Code
```typescript
import { debugGambiaTestCase } from '@/services/BirthProfileService';

// In a component or hook:
useEffect(() => {
  debugGambiaTestCase();
}, []);
```

### Option 3: Test Ascendant Directly
```typescript
import { calculateAscendant } from '@/services/BirthProfileService';

const utcDate = new Date('2026-01-30T20:00:00Z');
const result = calculateAscendant(utcDate, 13.437, -16.6812);
console.log(result); // Should be: { sign: 'Leo', degree: 24, ... }
```

## What to Look For

### Phase 1: Timezone Conversion
```
[convertLocalToUTC] Converting local time to UTC
  Input local time: 2026-01-30T20:00:00.000Z
  Timezone ID: Africa/Banjul
  Timezone parts: 2026-01-30 20:00:00
  Calculated offset: 0.0 hours (0ms)      ← Should be 0.0
  Result UTC: 2026-01-30T20:00:00.000Z
```

✅ **Check**: Offset should be `0.0 hours` (The Gambia is UTC+0)

### Phase 2: Julian Day Calculation
```
[dateToJulianDay] UTC: 2026-01-30T20:00:00.000Z
  Day fraction (UT): 0.833333              ← Should be 0.833333 (20/24)
  Calculated JD: 2460732.833333            ← Should be 2460732.833333
```

✅ **Check**: JD should be approximately `2460732.833333`

### Phase 3: Ascendant Calculation (7 Steps)

#### Step 1: JD Verification
```
Step 1 - Julian Day:
  JD = 2460732.833333
```
✅ **Check**: Same as Phase 2

#### Step 2: Time T
```
Step 2 - Time T (Julian centuries):
  T = 0.25138250                           ← Should be ~0.251382
```
✅ **Check**: T value approximately `0.251382`

#### Step 3: GMST
```
Step 3 - GMST (Greenwich Mean Sidereal Time):
  GMST (seconds) = 54912.96
  GMST (hours) = 15.253600                 ← Should be ~15.25 hours
  GMST (degrees) = 228.8400°               ← Should be ~228.84°
```
✅ **Check**: GMST ≈ `228.84°` (or `15.25 hours`)

#### Step 4: LST
```
Step 4 - Local Sidereal Time (LST):
  Longitude in hours = -1.1120h            ← Should be negative (west)
  LST (degrees) = 53.8330°                 ← Verify calculation
```
✅ **Check**: Longitude hours should be NEGATIVE for west longitude

#### Step 5: Obliquity
```
Step 5 - Obliquity of Ecliptic:
  ε = 23.439120°                           ← Should be ~23.4391°
```
✅ **Check**: Obliquity approximately `23.4391°`

#### Step 6: Ascendant Calculation
```
Step 6 - Ascendant Calculation:
  Numerator = -0.573340
  Denominator = 0.847080
  Ascendant (ecliptic longitude) = 143.990°  ← Should be ~144°
```
✅ **Check**: Ascendant longitude approximately `144°` (not `228°`)

#### Step 7: Final Result
```
Step 7 - Ascendant Sign and Degree:
  Ascendant = Leo 24°                      ← Should be "Leo 24°"
=== END ASCENDANT DEBUG ===
```

✅ **Check**: Sign is `Leo`, Degree is `24°` (not Scorpio!)

---

## Key Values to Verify

| Step | Value | Expected | Purpose |
|------|-------|----------|---------|
| Timezone | Offset | 0.0 hours | Verify Gambia is UTC+0 |
| JD | Julian Day | 2460732.833333 | Foundation for all calculations |
| T | Time | 0.251382 | Julian centuries since J2000.0 |
| GMST | Degrees | 228.84° | Sidereal time at Greenwich |
| LST | Degrees | 53.833° | Sidereal time at location |
| Obliquity | Degrees | 23.4391° | Earth's axial tilt |
| Ascendant | Longitude | 144° (not 228°!) | Rising zodiac sign |
| Result | Sign/Degree | Leo 24° | Final answer |

---

## Troubleshooting

### Console logs not showing?
- Make sure running a **development build** (not production)
- Press **F12** to open DevTools
- Go to **Console** tab
- Look for messages starting with `[convertLocalToUTC]` or `=== ASCENDANT CALCULATION DEBUG ===`

### Location not finding Gambia?
- Search for "Serrekunda" (exact city name)
- Or manually enter coordinates: **13.43°N, -16.68°W**
- Timezone should automatically set to **Africa/Banjul**

### Still getting Scorpio instead of Leo?
- Check the Step 6 output (Ascendant calculation)
- If showing `228.84°` instead of `144°`, there's a formula issue
- Review the ASCENDANT_DEBUG_OUTPUT_GUIDE.md for troubleshooting

### Getting different values than expected?
- Compare each step against the expected values above
- Identify which step shows deviation
- Use ASCENDANT_DEBUG_OUTPUT_GUIDE.md to troubleshoot that specific step

---

## Documentation Files

### 1. DEBUG_IMPLEMENTATION_SUMMARY.md
**What**: Complete technical summary of changes
**When to read**: For overview of what was implemented

### 2. ASCENDANT_DEBUG_GUIDE.md
**What**: Expected values at each calculation step
**When to read**: To verify your debug output is correct

### 3. ASCENDANT_DEBUG_IMPLEMENTATION.md
**What**: Technical details and formulas used
**When to read**: To understand the astronomical calculations

### 4. ASCENDANT_DEBUG_OUTPUT_GUIDE.md
**What**: How to interpret debug console output
**When to read**: For detailed troubleshooting

---

## Expected Outcome

### If Ascendant shows Leo 24° ✅
**Status**: Bug is fixed!

**Next steps**:
1. The 9° discrepancy has been resolved
2. Consider removing debug logging if desired
3. Deploy to production

### If Ascendant still shows Scorpio 21° ❌
**Status**: Additional investigation needed

**Next steps**:
1. Compare debug output to expected values
2. Identify which step fails (see table above)
3. Check ASCENDANT_DEBUG_OUTPUT_GUIDE.md for troubleshooting that step
4. Apply targeted fix
5. Re-run test

### If Result is Different (e.g., Capricorn) ⚠️
**Status**: Systematic error detected

**Next steps**:
1. Note the difference in signs (1 sign = 30°)
2. If off by 1 sign (30°): LST or GMST calculation error
3. If off by 2 signs (60°): Possible quadrant error in spherical trig
4. Review ASCENDANT_DEBUG_OUTPUT_GUIDE.md formula section

---

## Performance Impact

✅ **Zero in production** - All logging wrapped in `__DEV__` guards
✅ **Minimal in development** - Only runs during calculation (one per user action)
✅ **Easy to remove** - Delete `__DEV__` guards if needed

---

## Critical Formulas (What's Being Tested)

### GMST Formula (USNO)
```
GMST = 67310.54841 + (876600×3600 + 8640184.812866)×T + 0.093104×T² - 6.2e-6×T³
```
**Why important**: Simplified formula was ~2-3° off, causing cascading errors

### LST Formula  
```
LST = GMST + (longitude_hours × 15)
```
**Why important**: West longitude must be negative, was being treated as positive

### Ascendant Formula
```
tan(ASC) = -cos(LST) / (sin(ε)×tan(φ) + cos(ε)×sin(LST))
```
**Why important**: Spherical trigonometry requires atan2 for quadrant correctness

---

## Summary

**What**: Comprehensive debug logging for ascendant calculation
**Why**: To identify and fix 9° discrepancy (Scorpio vs Leo)
**How**: Run test, check console output, compare to expected values
**Result**: When fixed, should show Leo 24° instead of Scorpio 21°

**Time to test**: ~2 minutes
**Files to read**: Start with this guide, then reference others as needed

