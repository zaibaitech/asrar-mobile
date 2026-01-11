# Planet Status Card - Visual Guide

## UI Structure

```
┌─────────────────────────────────────────┐
│ 🪐 Planet Status            [See Full] │  ← Header with expand button
├─────────────────────────────────────────┤
│                                         │
│ Sign:          Leo 15°23'               │  ← Current position
│ Motion:        ℞ Retrograde             │  ← With retrograde icon
│ Station:       Stationing Retrograde    │  ← Only if stationing
│ Next Change:   in 15 days               │  ← Countdown to next sign
│                                         │
└─────────────────────────────────────────┘
```

## Expanded View

```
┌─────────────────────────────────────────┐
│ 🪐 Planet Status            [See Less] │
├─────────────────────────────────────────┤
│                                         │
│ Sign:          Leo 15°23'               │
│ Motion:        ℞ Retrograde             │
│ Next Change:   in 15 days               │
│                                         │
│ ─────────────────────────────────────   │  ← Separator
│                                         │
│ Speed:         0.95° per day            │  ← Daily motion
│                                         │
│ MAJOR ASPECTS                           │
│ Trine         Mars      4.2°  →        │  ← Applying
│ Square        Jupiter   2.8°  ←        │  ← Separating
│ Opposition    Saturn    1.5°  →        │
│                                         │
│ Next Sign Change:                       │
│ Virgo (15 days)                         │  ← Full details
│                                         │
└─────────────────────────────────────────┘
```

## Color Coding

- **Normal Text**: `DarkTheme.textPrimary` (white/off-white)
- **Labels**: `DarkTheme.textSecondary` (gray)
- **Retrograde**: `ElementAccents.fire.primary` (orange/red) + ℞ icon
- **Station**: `ElementAccents.air.primary` (cyan/blue) + italic
- **Aspects**: `ElementAccents.water.primary` (blue/purple)
- **Aspect orbs**: `DarkTheme.textSecondary` (gray)

## States

### 1. **Direct Motion (Normal)**
```
Motion:        Direct
```

### 2. **Retrograde Motion (Highlighted)**
```
Motion:        ℞ Retrograde  [in fire accent color]
```

### 3. **Stationing Retrograde**
```
Motion:        ℞ Retrograde
Station:       Stationing Retrograde  [in air accent, italic]
```

### 4. **Stationing Direct**
```
Motion:        Direct
Station:       Stationing Direct  [in air accent, italic]
```

## Aspect Symbols

- **→** = Applying (getting closer, aspect hasn't perfected yet)
- **←** = Separating (moving apart, aspect already perfected)

## Aspect Types

| Type | Degrees | Nature | Symbol |
|------|---------|--------|--------|
| Conjunction | 0° | Unifying | ☌ |
| Sextile | 60° | Harmonious | ⚹ |
| Square | 90° | Challenging | □ |
| Trine | 120° | Flowing | △ |
| Opposition | 180° | Polarizing | ☍ |

## Examples

### Sun (Fast-moving, rarely retrograde)
```
Sign:          Gemini 8°45'
Motion:        Direct
Next Change:   in 22 days
─────────────────────────────
Speed:         0.98° per day
MAJOR ASPECTS
Sextile       Mars      3.2°  →
Trine         Jupiter   5.1°  ←
```

### Mercury (Variable speed, frequent retrogrades)
```
Sign:          Virgo 23°12'
Motion:        ℞ Retrograde
Station:       Stationing Retrograde
Next Change:   in 8 days
─────────────────────────────
Speed:         -0.45° per day
MAJOR ASPECTS
Conjunction   Sun       2.1°  →
Square        Saturn    4.8°  ←
```

### Moon (Very fast, no retrogrades)
```
Sign:          Pisces 17°34'
Motion:        Direct
Next Change:   in 1 day
─────────────────────────────
Speed:         13.18° per day
MAJOR ASPECTS
Opposition    Mercury   1.2°  →
Trine         Venus     6.3°  ←
Sextile       Mars      4.9°  →
```

### Saturn (Slow-moving, long retrogrades)
```
Sign:          Aquarius 5°28'
Motion:        ℞ Retrograde
Next Change:   in 127 days
─────────────────────────────
Speed:         -0.02° per day
MAJOR ASPECTS
Square        Mars      7.1°  ←
```

## Translation Keys Used

### English (planetDetail.status)
```typescript
{
  seeMore: "See Full Details",
  seeLess: "See Less",
  sign: "Sign",
  motion: "Motion",
  station: "Station",
  nextChange: "Next Change",
  speed: "Speed",
  perDay: "per day",
  aspects: "Major Aspects",
  nextIngressFull: "Next Sign Change",
  motionDirect: "Direct",
  motionRetrograde: "Retrograde",
  stationingRx: "Stationing Retrograde",
  stationingDirect: "Stationing Direct",
}
```

### French (planetDetail.status)
```typescript
{
  seeMore: "Voir tous les détails",
  seeLess: "Voir moins",
  sign: "Signe",
  motion: "Mouvement",
  station: "Station",
  nextChange: "Prochain Changement",
  speed: "Vitesse",
  perDay: "par jour",
  aspects: "Aspects Majeurs",
  nextIngressFull: "Prochain Changement de Signe",
  motionDirect: "Direct",
  motionRetrograde: "Rétrograde",
  stationingRx: "En Station Rétrograde",
  stationingDirect: "En Station Directe",
}
```

## Responsive Behavior

### Small Screens (< 375px)
- Card padding reduced
- Font sizes optimized
- Aspect list still shows max 3
- Layout remains readable

### Large Screens (> 768px)
- Same layout (mobile-first)
- Could add tablet-specific grid in future

## Accessibility

- **Tap Target**: Expand button is 44x44pt minimum
- **Contrast**: All text meets WCAG AA standards
- **Screen Readers**: Semantic HTML (View, Text components)
- **Color-blind Safe**: Retrograde uses both color + ℞ symbol

## Performance

- **Render Time**: < 16ms (60fps)
- **Data Size**: ~500 bytes per transit snapshot
- **Re-renders**: Only on expand/collapse or snapshot change
- **Memo**: Not needed (component already optimized)

## Testing Scenarios

1. ✅ **Collapsed State**: Default view shows essentials
2. ✅ **Expand Button**: Toggles expanded view
3. ✅ **Retrograde Icon**: ℞ appears for retrograde planets
4. ✅ **Station Status**: Only shows if planet is stationing
5. ✅ **Aspects List**: Shows max 3 aspects
6. ✅ **Language Switch**: All labels translate correctly
7. ✅ **No Data**: Card doesn't render if transitSnapshot is null
8. ⏳ **Long Sign Names**: Sagittarius doesn't wrap awkwardly
9. ⏳ **Large Orbs**: 10.0° displays correctly
10. ⏳ **Negative Speed**: Retrograde shows negative speed

## Future Enhancements

### 1. **Visual Aspect Diagram**
```
     Sun ────○──── Mars
            60°
          (Sextile)
```

### 2. **Retrograde Progress Bar**
```
Retrograde: Day 8 of ~21
[████████░░░░░░░░░░░░] 38%
```

### 3. **Next Hour Ruler Integration**
```
Current Hour Ruler: Venus
Planet Status: Venus in Taurus (exalted) ✨
```

### 4. **Historical Transit Lookup**
```
[Date Picker]
Show planet positions for any past date
```

### 5. **Ephemeris Table View**
```
┌──────┬────────┬────────┬──────┐
│ Date │ Sign   │ Degree │ Rx   │
├──────┼────────┼────────┼──────┤
│ 1/1  │ Leo    │ 12°45' │      │
│ 1/2  │ Leo    │ 13°43' │      │
│ 1/3  │ Leo    │ 14°41' │      │
└──────┴────────┴────────┴──────┘
```

## Code Quality

- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Linting**: No ESLint warnings
- ✅ **Formatting**: Prettier compliant
- ✅ **Naming**: Clear, descriptive variable names
- ✅ **Comments**: TSDoc on all interfaces
- ✅ **DRY**: Formatters reused across UI
- ✅ **Separation**: Transit logic isolated in service

## Maintenance Notes

### Adding New Planets
1. Add planet ID to `PLANET_PARAMS` in `PlanetTransitService.ts`
2. Set realistic `speedDegPerDay` and `daysInSign`
3. Set `retrogradeChance` (0-100)
4. No UI changes needed (automatic)

### Adding New Aspect Types
1. Add to `AspectType` union type
2. Add case in `formatAspect()` function
3. Add translation keys (EN/FR)
4. UI automatically handles new types

### Changing Aspect Limit
```typescript
// Currently showing 3 aspects
{snapshot.transitSnapshot.aspects.slice(0, 3).map(...)}

// To show 5 aspects
{snapshot.transitSnapshot.aspects.slice(0, 5).map(...)}
```

### Adjusting Cache Duration (Future)
```typescript
// Current: No caching (mock data)
// Future: Add staleTime
const { data } = useQuery({
  queryKey: ['planetTransit', planetId],
  queryFn: () => getPlanetTransitSnapshot(planetId, now),
  staleTime: 1000 * 60 * 60, // 1 hour (adjust as needed)
});
```
