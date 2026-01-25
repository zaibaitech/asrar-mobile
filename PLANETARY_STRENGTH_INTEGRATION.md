# Integration Guide: Enhanced Planetary Strength System

## Quick Start

### 1. Import and Use the Daily Analysis Display

Add to your daily guidance screen or home screen:

```tsx
import { DailyPlanetaryAnalysisDisplay } from '@/components/timing/DailyPlanetaryAnalysisDisplay';

export default function YourScreen() {
  return (
    <ScrollView>
      {/* Your existing content */}
      
      {/* Add planetary analysis section */}
      <DailyPlanetaryAnalysisDisplay expanded={false} />
      
      {/* More content */}
    </ScrollView>
  );
}
```

### 2. Use the Hook Directly (Advanced)

For custom implementations:

```tsx
import { useDailyPlanetaryAnalysis } from '@/hooks/useDailyPlanetaryAnalysis';

export default function CustomAnalysisScreen() {
  const { analysis, dailyScore, bestHours, loading, error, refresh } = 
    useDailyPlanetaryAnalysis();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;
  if (!analysis) return <Text>No data</Text>;

  return (
    <View>
      <Text>Daily Score: {dailyScore}%</Text>
      <Text>Best Planet: {analysis.bestForGeneralWork}</Text>
      
      {analysis.practiceRecommendations.map((rec, idx) => (
        <Text key={idx}>• {rec}</Text>
      ))}
    </View>
  );
}
```

### 3. Use Individual Planet Analysis

For detailed breakdown of specific planets:

```tsx
import { PlanetaryStrengthAnalysis } from '@/components/timing/PlanetaryStrengthAnalysis';

// Inside your component
<PlanetaryStrengthAnalysis
  planet="Sun"
  sign="aquarius"
  degree={5}
  longitude={315.42}
  sunLongitude={315.42}
  isRetrograde={false}
  compact={false}
/>
```

## Integration Points

### Daily Guidance Screen
Add to show why today's energy is favorable/unfavorable:

```tsx
// app/daily-guidance.tsx
import { DailyPlanetaryAnalysisDisplay } from '@/components/timing/DailyPlanetaryAnalysisDisplay';

export default function DailyGuidanceScreen() {
  // ... existing code ...
  
  return (
    <ScrollView>
      {/* Existing Daily Guidance Content */}
      
      {/* NEW: Add Enhanced Planetary Analysis */}
      <View style={styles.section}>
        <DailyPlanetaryAnalysisDisplay expanded={true} />
      </View>
    </ScrollView>
  );
}
```

### Planet Transit Screen
Show strength of each planet:

```tsx
// Wrap existing transit display with analysis
import { PlanetaryStrengthAnalysis } from '@/components/timing/PlanetaryStrengthAnalysis';

{planets.map(p => (
  <View key={p.planet}>
    <TransitCard planet={p} />
    
    {/* Add strength analysis */}
    <PlanetaryStrengthAnalysis
      planet={p.planet}
      sign={p.sign}
      degree={p.signDegree}
      longitude={p.longitude}
      sunLongitude={sun.longitude}
      isRetrograde={p.isRetrograde}
      compact={true}
    />
  </View>
))}
```

### Moment Alignment Screen
Use to improve compatibility ratings:

```tsx
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';

// For each planet in the compatibility analysis
for (const planet of planets) {
  const power = calculateEnhancedPlanetaryPower(
    planet.name,
    planet.sign,
    planet.degree,
    planet.longitude,
    sunLongitude,
    planet.isRetrograde
  );
  
  // Use power.finalPower instead of simple element harmony
  const adjustedScore = baseScore * (power.finalPower / 100);
}
```

## Testing

### Test the Service Directly

```typescript
import { calculateEnhancedPlanetaryPower } from '@/services/PlanetaryStrengthService';

// Test case: Sun at 5° Aquarius
const result = calculateEnhancedPlanetaryPower(
  'Sun',
  'aquarius',
  5,       // degree
  315.42,  // longitude
  315.42,  // sunLongitude (same as Sun)
  false    // not retrograde
);

console.log('Final Power:', result.finalPower); // Should be ~28%
console.log('Warnings:', result.warnings);
console.log('Recommendations:', result.recommendations);
```

### Test Case Expected Results

**Sun at 5° Aquarius (Jan 25, 2026)**:
```
✅ finalPower: 28% (weak - early degree + detriment)
✅ degreeStrength: 0.4 (40% - early in sign)
✅ dignityModifier: 0.7 (70% - Aquarius is detriment)
✅ Warnings: ["Sun at 5° - planet just entered sign", "Sun in Aquarius (detriment)"]
✅ Recommendations: ["Wait 1-2 days for planet to settle", "Avoid this planet"]
```

**Moon at 25° Aries**:
```
✅ finalPower: 100% (strong - peak degrees)
✅ degreeStrength: 1.0 (100% - peak power)
✅ dignityModifier: 1.0 (neutral territory)
✅ Recommendations: ["Excellent degree - planet at peak power"]
```

## Performance Considerations

- **Caching**: Hook auto-refreshes every 5 minutes
- **API calls**: Only fetches if data is > 5min old
- **Memory**: Stores in memory until component unmounts
- **Re-renders**: Memoized calculations, minimal overhead

## Customization

### Adjust Refresh Frequency

In `useDailyPlanetaryAnalysis.ts`:
```typescript
// Change from 5 minutes to custom interval
const interval = setInterval(refresh, CUSTOM_INTERVAL_MS);
```

### Change Degree Strength Thresholds

In `PlanetaryStrengthService.ts`:
```typescript
function getDegreeStrength(degree: number) {
  // Modify these ranges as needed:
  if (degree < 6) return 0.4;  // ← Adjust threshold
  if (degree < 15) return 0.7;
  // ... etc
}
```

### Adjust Dignity Modifiers

```typescript
const DIGNITY_MODIFIERS = {
  EXALTED: 1.5,    // ← Increase/decrease as needed
  DOMICILE: 1.3,
  NEUTRAL: 1.0,
  DETRIMENT: 0.7,
  FALL: 0.5,
};
```

## Troubleshooting

### Data not showing
- Check that TransitService is returning `AllPlanetTransits` properly
- Verify planets are indexed with capitalized names (Sun, Moon, etc.)
- Check network connectivity

### Loading forever
- Verify EphemerisService is working (test in EphemerisService console)
- Check cache status - may need AsyncStorage setup

### Wrong power calculations
- Verify sign names are lowercase (aquarius, not Aquarius)
- Check degree is 0-30 range
- Verify longitude is 0-360 range

## API Reference

### DailyPlanetaryAnalysisDisplay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `expanded` | boolean | false | Show full analysis vs compact summary |

### PlanetaryStrengthAnalysis Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `planet` | Planet | Yes | Planet name (Sun, Moon, etc.) |
| `sign` | ZodiacSign | Yes | Zodiac sign (lowercase) |
| `degree` | number | Yes | Degree within sign (0-30) |
| `longitude` | number | Yes | Ecliptic longitude (0-360) |
| `sunLongitude` | number | Yes | Sun's longitude for combustion calc |
| `isRetrograde` | boolean | Yes | Retrograde status |
| `compact` | boolean | false | Show minimal view |

### useDailyPlanetaryAnalysis Hook Return

```typescript
{
  analysis: DailyPlanetaryAnalysis | null;     // Full analysis result
  dailyScore: number | null;                   // 0-100% overall energy
  bestHours: PlanetHourQuality[] | null;       // Top 5 planets by power
  loading: boolean;                            // Data loading state
  error: Error | null;                         // Any errors
  refresh: () => Promise<void>;                // Manual refresh function
}
```

### calculateEnhancedPlanetaryPower() Return

```typescript
{
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  
  // Component scores (0.0-1.0 or 0.5-1.4)
  degreeStrength: number;
  dignityModifier: number;
  combustionModifier: number;
  retrogradeModifier: number;
  
  // Final result (0-100%)
  finalPower: number;
  
  // Detailed analysis
  degreeInfo: DegreeStrengthInfo;
  dignityInfo: DignityInfo;
  combustionInfo: CombustionInfo;
  retrogradeInfo: RetrogradeInfo;
  
  // Actionable guidance
  recommendations: string[];
  warnings: string[];
  suitability: {
    outer: boolean;  // Suitable for material/external work
    inner: boolean;  // Suitable for spiritual/internal work
  };
}
```

## Next Steps

1. ✅ Add components to your screens (daily-guidance, planet-transit, etc.)
2. ✅ Test with real planetary data (use today's transits)
3. ✅ Customize thresholds based on your astrology tradition
4. ✅ Gather user feedback on accuracy
5. ✅ Consider adding to settings for user preferences

## References

- [PLANETARY_STRENGTH_SYSTEM.md](./PLANETARY_STRENGTH_SYSTEM.md) - Full technical documentation
- PlanetaryStrengthService.ts - Service implementation
- DailyPlanetaryAnalysisService.ts - Daily analysis logic
- useDailyPlanetaryAnalysis.ts - React hook
- PlanetaryStrengthAnalysis.tsx - Display component
- DailyPlanetaryAnalysisDisplay.tsx - Full panel component
