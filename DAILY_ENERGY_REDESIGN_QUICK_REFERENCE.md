# Daily Energy Redesign - Quick Reference Guide

## 🎯 Quick Navigation

### Key Files
- **Main Screen:** `app/(tabs)/daily-guidance-details.tsx`
- **Services:**
  - `services/PlanetaryRelationshipService.ts` - Planet/element relationships
  - `services/DailySynthesisService.ts` - Synthesis generation
- **Components:**
  - `components/timing/TodaysRulerSection.tsx` - Day ruler display
  - `components/timing/UserPlanetSection.tsx` - User planet display
  - `components/timing/TodaysAlignmentSection.tsx` - Three factors
  - `components/timing/WhatThisMeansCard.tsx` - Main synthesis card
- **Translations:** `constants/translations.ts` - All text content

---

## 🔧 Common Customizations

### 1. Change Activity Recommendations

**File:** `services/DailySynthesisService.ts`
**Function:** `generateActivityLists()`
**Line:** ~350

```typescript
const activities: Record<Planet, { excellent: string[]; less: string[] }> = {
  Jupiter: {
    excellent: [
      'Starting new learning or teaching',
      // ADD YOUR ACTIVITIES HERE
    ],
    less: [
      'Detailed technical work',
      // ADD YOUR CAUTIONS HERE
    ],
  },
  // ... other planets
}
```

### 2. Modify Synthesis Templates

**File:** `constants/translations.ts`
**Section:** `dailyEnergy.synthesis`

```typescript
synthesis: {
  excellent: "Excellent {day} energy! {day}'s day of {quality}...",
  good: "Good {day} energy. {day}'s {quality}...",
  moderate: "Balanced {day} energy...",
  challenging: "Reflective {day} energy...",
}
```

**Variables available:**
- `{day}` - Day name (Thursday, Friday, etc.)
- `{quality}` - Day quality (expansion, action, etc.)
- `{user}` - User's planet (Jupiter, Mars, etc.)
- `{element}` - User's element (fire, water, etc.)
- `{lunar}` - Lunar phase text
- `{activities}` - Main activities for the day

### 3. Adjust Quality Thresholds

**File:** `services/DailySynthesisService.ts`
**Function:** `generateDailySynthesis()`
**Line:** ~90

```typescript
const averageScore = (friendshipScore + harmonyScore + strengthScore) / 3;

if (averageScore >= 80) overallQuality = 'excellent';      // CHANGE THESE
else if (averageScore >= 65) overallQuality = 'good';      // THRESHOLDS
else if (averageScore >= 45) overallQuality = 'moderate';  // TO ADJUST
else overallQuality = 'challenging';                       // SENSITIVITY
```

### 4. Change Planetary Friendships

**File:** `services/PlanetaryRelationshipService.ts`
**Constant:** `PLANETARY_FRIENDSHIPS`
**Line:** ~35

```typescript
const PLANETARY_FRIENDSHIPS: Record<string, PlanetaryRelationship> = {
  'Sun-Moon': 'friend',    // CHANGE THESE RELATIONSHIPS
  'Sun-Mars': 'friend',    // friend | neutral | enemy
  'Sun-Jupiter': 'friend',
  // ... etc
}
```

### 5. Modify Scoring Weights

**File:** `services/PlanetaryRelationshipService.ts`
**Functions:** `getRelationshipScore()` and `getElementScore()`

```typescript
export function getRelationshipScore(relationship: PlanetaryRelationship): number {
  switch (relationship) {
    case 'friend': return 90;   // CHANGE THESE
    case 'neutral': return 60;  // SCORES
    case 'enemy': return 30;    // (0-100)
  }
}
```

### 6. Change Colors

**File:** `services/DailySynthesisService.ts`
**Function:** `getStatusColor()`

```typescript
export function getStatusColor(score: number): string {
  if (score >= 80) return '#10b981'; // Green - CHANGE THESE
  if (score >= 60) return '#3b82f6'; // Blue  - HEX COLORS
  if (score >= 40) return '#f59e0b'; // Amber
  if (score >= 20) return '#ef4444'; // Red
  return '#991b1b'; // Dark red
}
```

---

## 🌍 Adding Translations

### English
**File:** `constants/translations.ts`
**Section:** `en.dailyEnergy`

### French
**File:** `constants/translations.ts`
**Section:** `fr.dailyEnergy`

### Arabic
**File:** `constants/translations.ts`
**Section:** `ar.dailyEnergy`

**Example:**
```typescript
// English
dailyEnergy: {
  todaysRuler: "TODAY'S PLANETARY RULER",
  // ... more keys
}

// French
dailyEnergy: {
  todaysRuler: "PLANÈTE DU JOUR",
  // ... more keys
}

// Arabic
dailyEnergy: {
  todaysRuler: "حاكم اليوم الكوكبي",
  // ... more keys
}
```

---

## 📊 Data Flow

```
User Profile (profile)
  ↓
getUserPlanet() → { planet, element, source }
  ↓
Daily Analysis Hook (dailyAnalysis)
  ↓
generateDailySynthesis()
  ├→ Calculate planetary friendship score
  ├→ Calculate elemental harmony score
  ├→ Get day ruler strength score
  ├→ Average → Determine overall quality
  ├→ Generate summary text
  ├→ Generate activity lists
  └→ Return DailySynthesis object
       ↓
   Components Render
     ├→ TodaysRulerSection
     ├→ UserPlanetSection
     ├→ TodaysAlignmentSection
     └→ WhatThisMeansCard
```

---

## 🐛 Troubleshooting

### Synthesis not generating?
**Check:**
1. Is `profile` loaded? → `console.log(profile)`
2. Is `dailyAnalysis` available? → `console.log(dailyAnalysis)`
3. Is `moonPhase` present? → `console.log(dailyAnalysis?.moonPhase)`

**Fix:** Ensure user has profile data and daily analysis is loaded

### Wrong user planet showing?
**Check:**
1. `profile.rulingPlanet` (from birth chart)
2. `profile.derived?.rulingPlanet` (from name)
3. Fallback to `'Sun'` if both missing

**Fix:** Update profile with correct ruling planet

### Translation key not found?
**Check:**
1. Key exists in all languages (en/fr/ar)
2. Correct path: `dailyEnergy.synthesis.excellent`
3. No typos in translation key

**Fix:** Add missing translation key to `constants/translations.ts`

### Styling looks wrong?
**Check:**
1. Dark theme colors: `DarkTheme.textPrimary`, etc.
2. Spacing: `Spacing.lg`, `Spacing.md`, etc.
3. Component styles match existing patterns

**Fix:** Use consistent DarkTheme and Spacing constants

---

## 🎨 Styling Guidelines

### Colors
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `rgba(255, 255, 255, 0.8)`
- **Text Tertiary:** `rgba(255, 255, 255, 0.6)`
- **Card Background:** `rgba(30, 20, 60, 0.6)`
- **Border:** `rgba(180, 170, 255, 0.3)`

### Spacing
- **Small:** `8px`
- **Medium:** `16px`
- **Large:** `24px`
- **XLarge:** `32px`

### Typography
- **Title:** `18px`, Bold
- **Subtitle:** `14px`, Semibold
- **Body:** `13-14px`, Regular
- **Caption:** `12px`, Regular

---

## 📝 Code Snippets

### Get User's Planet
```typescript
const { planet, source } = getUserPlanet(
  profile.rulingPlanet,
  profile.derived?.rulingPlanet
);
// Returns: { planet: 'Jupiter', source: 'birth' | 'name' | 'default' }
```

### Generate Synthesis
```typescript
const synthesis = generateDailySynthesis(
  dayRuler,           // 'Jupiter'
  userPlanet,         // 'Mars'
  userElement,        // 'fire'
  dayElement,         // 'air'
  moonPhase,          // 'waxing_gibbous'
  transitPower,       // 75
  t                   // translation function
);
```

### Check Planetary Relationship
```typescript
const relationship = getPlanetaryRelationship('Jupiter', 'Mars');
// Returns: 'friend' | 'neutral' | 'enemy'

const score = getRelationshipScore(relationship);
// Returns: 90 | 60 | 30
```

### Check Elemental Relationship
```typescript
const relation = getElementRelationship('fire', 'air');
// Returns: 'same' | 'supportive' | 'neutral' | 'tension'

const score = getElementScore(relation);
// Returns: 90 | 75 | 50 | 25
```

---

## 🔒 Type Safety

### Key Types
```typescript
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
type Element = 'fire' | 'water' | 'air' | 'earth';
type PlanetaryRelationship = 'friend' | 'neutral' | 'enemy';
type ElementRelation = 'same' | 'supportive' | 'neutral' | 'tension';
type DailyQuality = 'excellent' | 'good' | 'moderate' | 'challenging';

interface DailySynthesis {
  overallQuality: DailyQuality;
  summaryText: string;
  excellentFor: string[];
  lessFavorable: string[];
  peakHours: string;
  factors: {
    planetaryFriendship: { score: number; label: string; description: string };
    elementalHarmony: { score: number; label: string; description: string };
    dailyStrength: { score: number; label: string; description: string };
  };
}
```

---

## ⚡ Performance Tips

1. **Memoization:** User planet info is memoized with `useMemo`
2. **Conditional Rendering:** Components only render when data exists
3. **Effect Dependencies:** Synthesis regenerates only when needed
4. **Translation Caching:** Translation function is stable reference

---

## 🚀 Deployment Checklist

- [x] All TypeScript errors resolved
- [x] All components render without crashes
- [x] Translations complete for EN/FR/AR
- [x] Fallback values for missing data
- [x] Consistent styling with app theme
- [ ] Test on physical device (iOS/Android)
- [ ] Test with different user profiles
- [ ] Test with all 7 days of week
- [ ] Test all moon phases
- [ ] Test edge cases (no profile, no data)

---

## 📞 Support

For questions or issues with the Daily Energy Redesign:
1. Check this guide first
2. Review `DAILY_ENERGY_REDESIGN_IMPLEMENTATION_COMPLETE.md`
3. Check implementation plan
4. Test in development environment

**Happy Coding! 🌟**
