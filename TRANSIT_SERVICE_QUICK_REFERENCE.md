# 🌟 Transit Service Quick Reference

## When to Use What

### Use `TransitService` when you need:
- **WHERE** a planet is in the zodiac (sign position)
- Long-term planetary positions (weeks/months/years)
- Real astronomical data from ephemeris
- Example: "Jupiter is in Gemini"

### Use `PlanetaryHoursService` when you need:
- **WHICH** planet rules the current hour
- Hourly changing planetary rulers (60-90 min cycles)
- Traditional Chaldean order calculations
- Example: "Mars rules this hour (3:00-4:15 PM)"

---

## Quick Import Guide

```typescript
// For planetary transits (WHERE in sky)
import { getTransit, getAllTransits } from '@/services/TransitService';
import { PlanetTransit } from '@/types/planetary-systems';

// For planetary hours (WHEN/ruler)
import { calculatePlanetaryHours } from '@/services/PlanetaryHoursService';
import { PlanetaryHour } from '@/types/planetary-systems';

// For React components
import { usePlanetTransit, useAllTransits } from '@/hooks/useTransit';
```

---

## Common Patterns

### Pattern 1: Show Current Hour's Planet Transit
```typescript
// Get current planetary hour
const planetaryData = calculatePlanetaryHours(sunrise, sunset, nextSunrise, now);
const currentPlanet = planetaryData.currentHour.planet;

// Get WHERE that planet actually is in the sky
const transit = await getTransit(currentPlanet);

// Display
console.log(`${currentPlanet} rules this hour`);        // "Mars rules this hour"
console.log(`${currentPlanet} is in ${transit.sign}`);  // "Mars is in Cancer"
```

### Pattern 2: React Component with Hooks
```typescript
function PlanetInfo({ planet }: { planet: Planet }) {
  const { transit, loading, refresh } = usePlanetTransit(planet);
  
  if (loading) return <Loading />;
  
  return (
    <View>
      <Text>{planet} is in {transit.sign}</Text>
      <Text>At {transit.signDegree}°</Text>
      <Button onPress={refresh}>Refresh</Button>
    </View>
  );
}
```

### Pattern 3: All Transits at Once
```typescript
const { transits, loading } = useAllTransits();

if (transits) {
  console.log('Jupiter:', transits.Jupiter.sign);
  console.log('Saturn:', transits.Saturn.sign);
}
```

---

## Cache Behavior

| Planet  | Refresh Interval | Reason                        |
|---------|------------------|-------------------------------|
| Moon    | 6 hours          | Changes sign every ~2.5 days  |
| Mercury | 24 hours         | Moves ~1° per day             |
| Venus   | 24 hours         | Moves ~1° per day             |
| Mars    | 24 hours         | Moves ~0.5° per day           |
| Sun     | 24 hours         | Changes sign monthly          |
| Jupiter | 7 days           | Stays ~1 year per sign        |
| Saturn  | 7 days           | Stays ~2.5 years per sign     |

---

## Data Sources

### Primary: NASA JPL Horizons API
- URL: `https://ssd.jpl.nasa.gov/api/horizons.api`
- Provides: Real-time planetary positions
- Cache: 24 hours via `EphemerisService`

### Fallback: Static Positions
- Used when: API unavailable or offline
- Data: Approximate positions for current period
- Location: `TransitService.getFallbackTransits()`

---

## Zodiac Sign Reference

| Index | Sign        | Arabic  | Element | Symbol |
|-------|-------------|---------|---------|--------|
| 0     | Aries       | الحمل    | Fire    | ♈      |
| 1     | Taurus      | الثور   | Earth   | ♉      |
| 2     | Gemini      | الجوزاء | Air     | ♊      |
| 3     | Cancer      | السرطان | Water   | ♋      |
| 4     | Leo         | الأسد   | Fire    | ♌      |
| 5     | Virgo       | العذراء | Earth   | ♍      |
| 6     | Libra       | الميزان | Air     | ♎      |
| 7     | Scorpio     | العقرب  | Water   | ♏      |
| 8     | Sagittarius | القوس  | Fire    | ♐      |
| 9     | Capricorn   | الجدي   | Earth   | ♑      |
| 10    | Aquarius    | الدلو   | Air     | ♒      |
| 11    | Pisces      | الحوت   | Water   | ♓      |

---

## Troubleshooting

### Transit not updating?
```typescript
// Check cache age
const lastUpdate = await AsyncStorage.getItem('@asrar_transits_last_update');
console.log('Last update:', new Date(lastUpdate));

// Force refresh
await refreshTransits();
```

### Getting fallback data instead of real ephemeris?
```typescript
// Check network
import NetInfo from '@react-native-community/netinfo';
const netInfo = await NetInfo.fetch();
console.log('Connected:', netInfo.isConnected);

// Clear cache and retry
await clearTransitCache();
const fresh = await refreshTransits();
console.log('Source:', fresh.Jupiter.source); // Should be 'ephemeris'
```

### Widget showing wrong zodiac?
```typescript
// Verify you're using TransitService, not PlanetTransitService
import { getTransit } from '@/services/TransitService'; // ✅ Correct
import { getPlanetTransitNow } from '@/services/PlanetTransitService'; // ❌ Old/buggy
```

---

## Performance Tips

1. **Use hooks in components** - Automatic caching and updates
2. **Prefetch on WiFi** - Call `prefetchEphemerisData()` in background
3. **Batch reads** - Use `getAllTransits()` instead of multiple `getTransit()` calls
4. **Cleanup expired cache** - Call `cleanupExpiredEphemerisCache()` daily

---

## Example: Full Implementation

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { calculatePlanetaryHours } from '@/services/PlanetaryHoursService';
import { getTransit } from '@/services/TransitService';
import { PlanetTransit } from '@/types/planetary-systems';

function PlanetaryOverview() {
  const [currentHourPlanet, setCurrentHourPlanet] = useState(null);
  const [transit, setTransit] = useState<PlanetTransit | null>(null);
  
  useEffect(() => {
    const load = async () => {
      // Get current planetary hour
      const planetaryData = calculatePlanetaryHours(
        sunrise,
        sunset,
        nextSunrise,
        new Date()
      );
      
      const planet = planetaryData.currentHour.planet;
      setCurrentHourPlanet(planet);
      
      // Get real transit of that planet
      const planetTransit = await getTransit(planet);
      setTransit(planetTransit);
    };
    
    load();
  }, []);
  
  return (
    <View>
      <Text>Current Hour: {currentHourPlanet} ⏰</Text>
      <Text>In Zodiac: {transit?.sign} {transit?.element} 🌟</Text>
      <Text>Position: {transit?.signDegree}°</Text>
    </View>
  );
}
```

---

**Last Updated**: January 15, 2026  
**Version**: 1.0.0
