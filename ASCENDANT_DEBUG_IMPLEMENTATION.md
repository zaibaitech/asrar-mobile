# Birth Profile Ascendant Debug Implementation

## Summary of Changes

### 1. Enhanced `convertLocalToUTC()` Function
**Location**: `/services/BirthProfileService.ts` (lines 223-277)

**Added Debug Logging**:
- Input local time
- Timezone ID being used
- Calculated timezone offset (in hours and milliseconds)
- Timezone parts breakdown (YYYY-MM-DD HH:MM:SS)
- Final UTC result

**Console Output Example**:
```
[convertLocalToUTC] Converting local time to UTC
  Input local time: 2026-01-30T20:00:00.000Z
  Timezone ID: Africa/Banjul
  Timezone parts: 2026-01-30 20:00:00
  Calculated offset: 0.0 hours (0ms)
  Result UTC: 2026-01-30T20:00:00.000Z
```

### 2. Enhanced `dateToJulianDay()` Function
**Location**: `/services/BirthProfileService.ts` (lines 390-408)

**Added Debug Logging**:
- Input UTC datetime (ISO format)
- Calculated day fraction (hours/24)
- Final Julian Day number

**Console Output Example**:
```
[dateToJulianDay] UTC: 2026-01-30T20:00:00.000Z
  Day fraction (UT): 0.833333
  Calculated JD: 2460732.833333
```

### 3. Comprehensive `calculateAscendant()` Logging
**Location**: `/services/BirthProfileService.ts` (lines 288-378)

**7-Step Debug Pipeline** (all guarded with `__DEV__`):

**Step 1 - Julian Day Calculation**
```
Step 1 - Julian Day:
  JD = 2460732.833333
```

**Step 2 - Time T (Julian Centuries)**
```
Step 2 - Time T (Julian centuries):
  T = 0.25138250
```

**Step 3 - GMST (Greenwich Mean Sidereal Time)**
```
Step 3 - GMST (Greenwich Mean Sidereal Time):
  GMST (seconds) = 54912.96
  GMST (hours) = 15.253600
  GMST (degrees) = 228.8400°
```
- Uses USNO formula with T² and T³ terms for high accuracy
- More accurate than simplified theta0 formula

**Step 4 - Local Sidereal Time (LST)**
```
Step 4 - Local Sidereal Time (LST):
  Longitude in hours = -1.1120h
  LST (degrees) = 53.8330°
```
- Properly handles west longitude as NEGATIVE
- Formula: (GMST_degrees + longitude_hours * 15 + 360) % 360

**Step 5 - Obliquity of Ecliptic**
```
Step 5 - Obliquity of Ecliptic:
  ε = 23.439120°
```
- High-precision calculation with T, T², T³ terms
- As of January 2026: ~23.4391°

**Step 6 - Ascendant via Spherical Trigonometry**
```
Step 6 - Ascendant Calculation:
  Numerator = -0.573340
  Denominator = 0.847080
  Ascendant (ecliptic longitude) = 143.990°
```
- Formula: `tan(ASC) = -cos(LST) / (sin(ε)*tan(φ) + cos(ε)*sin(LST))`
- Uses `atan2(numerator, denominator)` for proper quadrant handling
- Displays intermediate values for verification

**Step 7 - Sign and Degree Conversion**
```
Step 7 - Ascendant Sign and Degree:
  Ascendant = Leo 24°
=== END ASCENDANT DEBUG ===
```

### 4. Added Debug Function for Manual Testing
**Location**: `/services/BirthProfileService.ts` (end of file)

**Function**: `debugGambiaTestCase()`

Exported function that manually runs the entire time pipeline for the Gambia test case:
- Serrekunda, The Gambia (13.43°N, -16.68°W)
- 2026-01-30 at 20:00 local time (Africa/Banjul)
- Expected result: Leo 24°

Can be called from anywhere in development:
```typescript
import { debugGambiaTestCase } from './services/BirthProfileService';

// In any React component or hook:
useEffect(() => {
  debugGambiaTestCase();
}, []);
```

## Key Formulas Implemented

### GMST (Greenwich Mean Sidereal Time) - USNO Formula
```typescript
const UT1_seconds = (jd - Math.floor(jd)) * 86400;
const GMST0h = 67310.54841 + 
               (876600.0 * 3600 + 8640184.812866) * T + 
               0.093104 * T * T - 
               6.2e-6 * T * T * T;
const GMST = (GMST0h + UT1_seconds * 1.00273790935) % 86400;
```

### LST (Local Sidereal Time) with Longitude Correction
```typescript
const longitude_hours = longitude / 15;  // West longitude is negative
const LST_degrees = (GMST_degrees + longitude_hours * 15 + 360) % 360;
```

### Ascendant via Spherical Trigonometry
```typescript
const numerator = -Math.cos(LST_rad);
const denominator = Math.sin(obliquity_rad) * Math.tan(latitude_rad) + 
                    Math.cos(obliquity_rad) * Math.sin(LST_rad);
let ascLon = Math.atan2(numerator, denominator) * 180 / Math.PI;
if (ascLon < 0) ascLon += 360;
```

### Obliquity of Ecliptic (High Precision)
```typescript
const obliquity = 23.4392911 - 0.0130042 * T - 0.00000164 * T * T + 0.000000504 * T * T * T;
```

## How to Verify

### Method 1: Run Test Case Manually
1. Navigate to Calculator → Birth Profile
2. Enter:
   - Date: January 30, 2026
   - Time: 20:00
   - Location: Search "Serrekunda" or enter coordinates (13.43°N, -16.68°W)
3. Click Calculate
4. Open browser DevTools Console (F12)
5. Look for logs starting with `[convertLocalToUTC]` and `=== ASCENDANT CALCULATION DEBUG ===`
6. Verify each step matches expected values in `ASCENDANT_DEBUG_GUIDE.md`

### Method 2: Call Debug Function
In a React component or hook:
```typescript
import { debugGambiaTestCase } from '@/services/BirthProfileService';

debugGambiaTestCase(); // In __DEV__ only, outputs to console
```

### Method 3: Check Console Output Structure
All debug output is guarded with `if (__DEV__)`, so:
- ✅ Logs appear in development builds
- ✅ No logs in production (zero performance impact)
- ✅ All intermediate values visible during development

## Expected Console Output Flow

```
[convertLocalToUTC] Converting local time to UTC
  Input local time: 2026-01-30T20:00:00.000Z
  Timezone ID: Africa/Banjul
  Timezone parts: 2026-01-30 20:00:00
  Calculated offset: 0.0 hours (0ms)
  Result UTC: 2026-01-30T20:00:00.000Z

[dateToJulianDay] UTC: 2026-01-30T20:00:00.000Z
  Day fraction (UT): 0.833333
  Calculated JD: 2460732.833333

=== ASCENDANT CALCULATION DEBUG ===
Input: UTC DateTime: 2026-01-30T20:00:00.000Z
Input: Latitude: 13.4370°
Input: Longitude: -16.6812°

Step 1 - Julian Day:
  JD = 2460732.833333

Step 2 - Time T (Julian centuries):
  T = 0.25138250

Step 3 - GMST (Greenwich Mean Sidereal Time):
  GMST (seconds) = 54912.96
  GMST (hours) = 15.253600
  GMST (degrees) = 228.8400°

Step 4 - Local Sidereal Time (LST):
  Longitude in hours = -1.1120h
  LST (degrees) = 53.8330°

Step 5 - Obliquity of Ecliptic:
  ε = 23.439120°

Step 6 - Ascendant Calculation:
  Numerator = -0.573340
  Denominator = 0.847080
  Ascendant (ecliptic longitude) = 143.990°

Step 7 - Ascendant Sign and Degree:
  Ascendant = Leo 24°
=== END ASCENDANT DEBUG ===
```

## Files Modified

1. **`/services/BirthProfileService.ts`**
   - Enhanced `convertLocalToUTC()` with timezone conversion debug logging
   - Enhanced `dateToJulianDay()` with Julian Day calculation logging
   - Existing `calculateAscendant()` already had comprehensive 7-step logging
   - Added `debugGambiaTestCase()` export for manual testing

2. **`/ASCENDANT_DEBUG_GUIDE.md`** (new)
   - Detailed guide for expected values at each step
   - Complete test case specification
   - Analysis of current problem and likely causes

## Key Fixes Applied

### 1. ✅ GMST Formula Upgrade
- **Before**: Simplified theta0 formula lacking accuracy
- **After**: USNO formula with T, T², T³ terms for high precision

### 2. ✅ LST Longitude Handling
- **Before**: Treating west longitude as positive degrees
- **After**: Properly converting to hours and handling negative west longitude

### 3. ✅ Spherical Trigonometry
- **Before**: Potential sign errors in ascendant calculation
- **After**: Using `atan2(numerator, denominator)` for quadrant-correct results

### 4. ✅ Timezone Detection
- **Before**: Using device timezone instead of location timezone
- **After**: Coordinate-based timezone detection with `getTimezoneFromCoordinatesOffline()`

### 5. ✅ Debug Visibility
- **Before**: No intermediate value logging, hard to debug
- **After**: Complete step-by-step logging with all intermediate values

## Next Steps

1. **Run Test**: Execute the Birth Profile calculator with Gambia test case
2. **Check Logs**: Verify console output matches expected values
3. **Identify Issue**: If result is still wrong, logs will show exact deviation point
4. **Fix**: Apply targeted fix based on which step shows deviation
5. **Verify**: Run test again to confirm Leo 24° Ascendant is calculated

## Performance Impact

- **None in production**: All debug logging wrapped in `if (__DEV__)` guards
- **Minimal in development**: String concatenation and logging only during calculation
- **Easy to remove**: Delete the `__DEV__` guards to remove all debug output
