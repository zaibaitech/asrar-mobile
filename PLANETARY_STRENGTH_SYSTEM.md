# Enhanced Planetary Strength Calculation System

## Overview

This system implements classical Islamic astrology factors for accurate planetary strength assessment. Instead of showing overly optimistic ratings (like 77% for Sun at 5° Aquarius), it now shows realistic power levels based on:

- **Degree-Based Strength** (Quwwat al-Darajāt) - Power curve from 0-30°
- **Essential Dignities** (Al-Karāmāt al-Dhātīyah) - Rulerships (domicile, exaltation, detriment, fall)
- **Combustion Rules** (Al-Iḥtirāq) - Weakness when too close to Sun
- **Retrograde Status** (Al-Rujūʿ) - Reduced power for outer work

## Architecture

### Core Service: `PlanetaryStrengthService.ts`

Implements all classical astrology calculations:

```typescript
// Main calculation function
calculateEnhancedPlanetaryPower(
  planet: Planet,
  sign: ZodiacSign,
  degree: number,
  longitude: number,
  sunLongitude: number,
  isRetrograde: boolean
): EnhancedPlanetaryPower
```

Returns detailed analysis including:
- Individual component scores (degree, dignity, combustion, retrograde)
- Final power percentage (0-100%)
- Specific recommendations and warnings
- Suitability for outer vs inner work

### Supporting Services

**`DailyPlanetaryAnalysisService.ts`**
- Analyzes all 7 planets for a given moment
- Identifies best planets for different work types
- Generates actionable recommendations
- Calculates overall daily energy score

**`useDailyPlanetaryAnalysis.ts` (Hook)**
- Fetches real-time planetary positions
- Auto-refreshes every 5 minutes
- Returns analysis results and UI state

### UI Components

**`PlanetaryStrengthAnalysis.tsx`**
- Displays detailed breakdown for single planet
- Shows calculation formula with factor badges
- Lists specific warnings and recommendations
- Compact or expanded mode

**`DailyPlanetaryAnalysisDisplay.tsx`**
- Full daily analysis panel
- Daily energy score
- Best hours recommendations
- Critical warnings
- Interactive planet details

## Key Calculations

### 1. Degree Strength (0-30° scale)

| Degree Range | Strength | Quality | Meaning |
|--------------|----------|---------|---------|
| 0-6°         | 40%      | Weak    | Just entered, not settled |
| 6-15°        | 70%      | Moderate| Gaining strength |
| 15-26°       | 100%     | Strong  | Peak power |
| 26-30°       | 60%      | Weakening| Preparing to leave |

**Example**: Sun at 5° Aquarius = 40% power (weak)

### 2. Essential Dignities

Classic rulerships affect planetary power significantly:

**Sun Example**:
- Own: Leo (+30% = 1.3x)
- Exaltation: Aries (+40% = 1.4x)
- Detriment: Aquarius (-30% = 0.7x) ⚠️ Current problem!
- Fall: Libra (-50% = 0.5x)

**All Dignities** (defined in `ESSENTIAL_DIGNITIES`):
- Sun: Leo(own), Aries(exalt), Aquarius(detriment), Libra(fall)
- Moon: Cancer(own), Taurus(exalt), Capricorn(detriment), Scorpio(fall)
- Mercury: Gemini/Virgo(own), Virgo(exalt), Sag/Pisces(detriment), Pisces(fall)
- Venus: Taurus/Libra(own), Pisces(exalt), Aries/Scorpio(detriment), Virgo(fall)
- Mars: Aries/Scorpio(own), Capricorn(exalt), Libra/Taurus(detriment), Cancer(fall)
- Jupiter: Sag/Pisces(own), Cancer(exalt), Gemini/Virgo(detriment), Capricorn(fall)
- Saturn: Capricorn/Aquarius(own), Libra(exalt), Cancer/Leo(detriment), Aries(fall)

### 3. Combustion (Within 8° of Sun)

| Distance | Status | Modifier |
|----------|--------|----------|
| < 8°     | Combust| 50% (severely weakened) |
| 8-15°    | Beams  | 75% (moderately weakened) |
| > 15°    | Clear  | 100% (normal) |

### 4. Retrograde Modifier

Retrograde planets have same power but different application:
- **Outer Work** (material/external): Less favorable, expect delays
- **Inner Work** (spiritual/reflection): More favorable, enhanced introspection

## Test Case: Sunday, Jan 25, 2026

**Sun at 5° Aquarius**:
```
Base: N/A (Sun)
Degree (5°): 40%
Dignity (Aquarius = detriment): 70%
Combustion: N/A
Retrograde: No
───────────────────
FINAL: 40% × 70% = 28% power
```

**Recommendation**: "Use Moon hours today instead - Moon at 25° Aries (85%)"

## Integration Points

### 1. Daily Guidance Screen
Add enhanced analysis to show why timing is good/bad:

```tsx
import { DailyPlanetaryAnalysisDisplay } from '@/components/timing/DailyPlanetaryAnalysisDisplay';

// In daily-guidance.tsx
<DailyPlanetaryAnalysisDisplay expanded={true} />
```

### 2. Planet Transit Screen
Show strength analysis for current transit:

```tsx
import { PlanetaryStrengthAnalysis } from '@/components/timing/PlanetaryStrengthAnalysis';

// Display for each planet
<PlanetaryStrengthAnalysis
  planet="Sun"
  sign="Aquarius"
  degree={5}
  longitude={315.42}
  sunLongitude={315.42}
  isRetrograde={false}
/>
```

### 3. Moment Alignment Screen
Enhance compatibility ratings with planetary power factors:

```tsx
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';

// For each planet in the moment
const power = calculateEnhancedPlanetaryPower(
  planet,
  sign,
  degree,
  longitude,
  sunLongitude,
  isRetrograde
);
```

## Component API Reference

### PlanetaryStrengthAnalysis

```tsx
interface PlanetaryStrengthAnalysisProps {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  longitude: number;
  sunLongitude: number;
  isRetrograde: boolean;
  compact?: boolean;  // Shows minimal view
}
```

**Features**:
- Calculation formula breakdown with factor badges
- Degree position details with guidance
- Essential dignity status
- Combustion analysis
- Retrograde impact explanation
- Warnings and recommendations
- Suitability for inner/outer work

### DailyPlanetaryAnalysisDisplay

```tsx
interface DailyPlanetaryAnalysisDisplayProps {
  expanded?: boolean;  // Full analysis vs compact summary
}
```

**Features**:
- Daily overall energy score
- Best hours recommendations
- Practice guidance
- Critical warnings
- Interactive planet cards with details

### useDailyPlanetaryAnalysis Hook

```tsx
const {
  analysis,           // Full DailyPlanetaryAnalysis
  dailyScore,        // Overall energy 0-100%
  bestHours,         // Top 5 planets with quality
  loading,
  error,
  refresh            // Manual refresh function
} = useDailyPlanetaryAnalysis();
```

## Data Structures

### EnhancedPlanetaryPower

```typescript
{
  planet: Planet;
  sign: ZodiacSign;
  degree: number;

  // Component scores
  degreeStrength: number;           // 0-1
  dignityModifier: number;          // 0.5-1.4
  combustionModifier: number;       // 0.5-1.0
  retrogradeModifier: number;       // 1.0 (or variations)

  // Final calculation
  finalPower: number;               // 0-100%

  // Detailed info
  degreeInfo: DegreeStrengthInfo;
  dignityInfo: DignityInfo;
  combustionInfo: CombustionInfo;
  retrogradeInfo: RetrogradeInfo;

  // Guidance
  recommendations: string[];
  warnings: string[];
  suitability: {
    outer: boolean;
    inner: boolean;
  };
}
```

### DailyPlanetaryAnalysis

```typescript
{
  planets: Record<Planet, EnhancedPlanetaryPower>;
  bestForGeneralWork: Planet | null;
  bestForSpiritualWork: Planet | null;
  planetsToAvoid: Planet[];
  criticalWarnings: string[];
  practiceRecommendations: string[];
}
```

## Migration Guide

### For Existing Timing Analysis

1. Import the new service:
```tsx
import { 
  calculateEnhancedPlanetaryPower,
  type EnhancedPlanetaryPower 
} from '@/services/PlanetaryStrengthService';
```

2. Update planetary power calculations:
```tsx
// Old
const power = getSimplePlanetaryPower(planet, element);

// New
const power = calculateEnhancedPlanetaryPower(
  planet,
  sign,
  degree,
  longitude,
  sunLongitude,
  isRetrograde
);
```

3. Use component for display:
```tsx
// Add to your detail screen
<PlanetaryStrengthAnalysis
  planet={planet}
  sign={sign}
  degree={degree}
  longitude={longitude}
  sunLongitude={sunLongitude}
  isRetrograde={isRetrograde}
/>
```

## Validation Examples

### Sun at 5° Aquarius (Weak)
- Degree: 40% (early degrees)
- Dignity: 70% (detriment)
- **Result**: 28% → Avoid, not suitable ❌

### Moon at 25° Aries (Strong)
- Degree: 100% (peak power)
- Dignity: 100% (neutral)
- **Result**: 100% → Excellent, highly recommended ✅

### Mercury at 12° Virgo (Very Strong)
- Degree: 70% (moderate)
- Dignity: 140% (own sign)
- **Result**: 98% → Excellent for communication/study ✅

### Saturn in Aries, retrograde
- Degree: 70% (moderate)
- Dignity: 50% (fall)
- Retrograde: 100% (same but different application)
- **Result**: 35% → Weak for outer work, acceptable for inner work ⚠️

## Common Patterns

### Weak Planets (< 40%)
- Early degrees (0-6°)
- Fall position
- Combustion (< 8° of Sun)
- Combination of above

**Action**: Look for alternative hour/day

### Moderate Planets (40-70%)
- Mid-range degrees (6-26°)
- Detriment position
- Under Sun's beams (8-15°)

**Action**: Acceptable but not ideal

### Strong Planets (70-100%)
- Peak degrees (15-26°)
- Domicile position
- Exalted position
- Clear of Sun

**Action**: Highly recommended, prioritize

## Future Enhancements

1. **Manazil Integration**: Combine with lunar mansion alignments
2. **Aspectarian Data**: Include planetary aspects in calculations
3. **Predictive Modeling**: Forecast best days/weeks ahead
4. **Historical Accuracy**: Validate against known Islamic astrology texts
5. **User Preferences**: Allow adjusting weights for different practice types

## References

- Al-Qabīsī (10th century Islamic astrologer)
- Ibn ʿArabī's astrological teachings
- Medieval Islamic astronomical traditions
- Traditional planetary rulerships (Classical systems)

## Notes

- All calculations use tropical zodiac internally; sidereal mapping handled separately
- Retrograde is binary (on/off); no intermediate states
- Combustion uses classical 8° rule; can be adjusted per tradition
- Ayanamsa is fixed (not precession-adjusted in real-time)
