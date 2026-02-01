# Daily Energy Screen Redesign - Implementation Plan

## Overview
Transform Daily Energy from a metrics dashboard into a narrative-driven spiritual guidance system that shows how TODAY'S planetary ruler interacts with the USER'S personal nature.

---

## Current State Analysis

### What Exists Now:
- `app/(tabs)/daily-guidance-details.tsx` - Current detail screen (~1800 lines)
- Components:
  - `MoonPhaseHeaderCard` - Moon phase display ✅ Keep
  - `MoonDayHarmonyCard` - Moon/day synthesis ✅ Keep  
  - `DailyEnergyCard` - Score breakdown ❌ Remove
  - `TodayDetailsCard` - Day ruler info ✅ Enhance
  - `TimingGuidanceCard` - Hourly guidance ✅ Keep
  - `TimingAnalysisSection` - Asrariya analysis ✅ Keep
  - `DailyPlanetaryAnalysisDisplay` - Transit details ✅ Enhance

### What's Missing:
- User's personal planet display
- Planetary friendship/harmony analysis
- Day ruler × User planet interaction logic
- Holistic synthesis paragraph generation
- "What this means for you" guidance

---

## Phase 1: Translation Keys (30 min)

### File: `constants/translations.ts`

Add new section after `dailyGuidanceDetails`:

```typescript
dailyEnergy: {
  // Section Headers
  todaysRuler: "TODAY'S PLANETARY RULER",
  yourPlanet: "YOUR BIRTH PLANET", 
  todaysAlignment: "TODAY'S ALIGNMENT",
  lunarInfluence: "LUNAR INFLUENCE",
  whatThisMeans: "What This Means For You",
  excellentForToday: "Excellent For Today",
  lessFavorable: "Less Favorable",
  bestForToday: "Best For Today",
  
  // Day descriptions
  dayEnergy: {
    expansion: "Day of expansion, wisdom, and growth",
    action: "Day of action, courage, and decisive movement",
    communication: "Day of communication, learning, and commerce",
    love: "Day of love, beauty, and harmony",
    discipline: "Day of discipline, structure, and mastery",
    vitality: "Day of vitality, leadership, and personal power",
    intuition: "Day of emotions, intuition, and nurturing",
  },
  
  // Alignment factors
  factors: {
    planetaryFriendship: "Planetary Friendship",
    elementalHarmony: "Elemental Harmony",
    dailyStrength: "Daily Strength",
  },
  
  // Relationship descriptions
  friendship: {
    strongFriends: "Strong Friends",
    friends: "Friends",
    neutral: "Neutral",
    tension: "Tension",
    friendsDesc: "{day} blesses {user}'s drive with {quality}",
    harmonySupportDesc: "{dayElement} ({day}'s day) supports your {userElement} nature through {mechanism}",
  },
  
  // Synthesis templates
  synthesis: {
    excellent: "Excellent {day} energy! {day}'s day of {quality} harmonizes beautifully with your {user}-{element} nature. {lunar}. Today favors {activities}.",
    good: "Good {day} energy. {day}'s {quality} works well with your {user}-{element} nature. {lunar}. Favorable for {activities}.",
    moderate: "Balanced {day} energy. {day}'s {quality} offers steady support. {lunar}. Good for {activities}.",
    challenging: "Reflective {day} energy. {day}'s {quality} invites careful navigation. {lunar}. Better for {activities}.",
  },
  
  // Lunar additions
  lunarPhase: {
    waxing: "The waxing moon adds building momentum",
    waning: "The waning moon supports release and completion",
    full: "The full moon amplifies all energies",
    new: "The new moon offers fresh beginnings",
  },
},

// Day ruler labels
dayRulers: {
  sunday: {
    name: "Sunday • Sun Day",
    desc: "Day of vitality, leadership, and personal power",
    element: "Fire",
  },
  monday: {
    name: "Monday • Moon Day", 
    desc: "Day of emotions, intuition, and nurturing",
    element: "Water",
  },
  tuesday: {
    name: "Tuesday • Mars Day",
    desc: "Day of action, courage, and decisive movement", 
    element: "Fire",
  },
  wednesday: {
    name: "Wednesday • Mercury Day",
    desc: "Day of communication, learning, and commerce",
    element: "Air",
  },
  thursday: {
    name: "Thursday • Jupiter Day",
    desc: "Day of expansion, wisdom, and growth",
    element: "Air",
  },
  friday: {
    name: "Friday • Venus Day",
    desc: "Day of love, beauty, and harmony",
    element: "Water",
  },
  saturday: {
    name: "Saturday • Saturn Day",
    desc: "Day of discipline, structure, and mastery",
    element: "Earth",
  },
},

// Planetary friendships
planetaryRelations: {
  jupiterMars: "Jupiter blesses Mars's drive with wisdom and expansion",
  marsMercury: "Mars energizes Mercury's communication with bold action",
  venusMoon: "Venus harmonizes with Moon's emotional nature",
  saturnSun: "Saturn gives structure to Sun's vitality",
  // ... etc for all combinations
},
```

### French Translations (Copy structure):
```typescript
fr: {
  dailyEnergy: {
    todaysRuler: "PLANÈTE DU JOUR",
    yourPlanet: "VOTRE PLANÈTE",
    todaysAlignment: "ALIGNEMENT DU JOUR",
    // ... etc
  }
}
```

### Arabic Translations (Copy structure):
```typescript
ar: {
  dailyEnergy: {
    todaysRuler: "حاكم اليوم الكوكبي",
    yourPlanet: "كوكبك الشخصي",
    todaysAlignment: "توافق اليوم",
    // ... etc
  }
}
```

---

## Phase 2: Service Logic (45 min)

### File: `services/PlanetaryRelationshipService.ts` (NEW)

```typescript
/**
 * Planetary Relationship Service
 * Analyzes friendship/enmity between planets
 * Based on traditional Jyotish/Islamic astrology
 */

export type PlanetaryRelationship = 'friend' | 'neutral' | 'enemy';

// Classical friendships matrix
const PLANETARY_FRIENDSHIPS: Record<string, PlanetaryRelationship> = {
  'Sun-Moon': 'friend',
  'Sun-Mars': 'friend',
  'Sun-Jupiter': 'friend',
  'Sun-Mercury': 'neutral',
  'Sun-Venus': 'enemy',
  'Sun-Saturn': 'enemy',
  
  'Moon-Sun': 'friend',
  'Moon-Mercury': 'friend',
  'Moon-Mars': 'neutral',
  'Moon-Jupiter': 'neutral',
  'Moon-Venus': 'neutral',
  'Moon-Saturn': 'enemy',
  
  'Mars-Sun': 'friend',
  'Mars-Moon': 'friend',
  'Mars-Jupiter': 'friend',
  'Mars-Mercury': 'neutral',
  'Mars-Venus': 'enemy',
  'Mars-Saturn': 'neutral',
  
  'Mercury-Sun': 'friend',
  'Mercury-Venus': 'friend',
  'Mercury-Moon': 'neutral',
  'Mercury-Mars': 'enemy',
  'Mercury-Jupiter': 'neutral',
  'Mercury-Saturn': 'neutral',
  
  'Jupiter-Sun': 'friend',
  'Jupiter-Moon': 'friend',
  'Jupiter-Mars': 'friend',
  'Jupiter-Mercury': 'neutral',
  'Jupiter-Venus': 'enemy',
  'Jupiter-Saturn': 'neutral',
  
  'Venus-Mercury': 'friend',
  'Venus-Saturn': 'friend',
  'Venus-Mars': 'enemy',
  'Venus-Jupiter': 'enemy',
  'Venus-Sun': 'neutral',
  'Venus-Moon': 'neutral',
  
  'Saturn-Mercury': 'friend',
  'Saturn-Venus': 'friend',
  'Saturn-Jupiter': 'neutral',
  'Saturn-Mars': 'neutral',
  'Saturn-Sun': 'enemy',
  'Saturn-Moon': 'enemy',
};

export function getPlanetaryRelationship(
  planet1: Planet,
  planet2: Planet
): PlanetaryRelationship {
  const key = `${planet1}-${planet2}`;
  return PLANETARY_FRIENDSHIPS[key] || 'neutral';
}

export function getRelationshipScore(
  relationship: PlanetaryRelationship
): number {
  switch (relationship) {
    case 'friend': return 90;
    case 'neutral': return 60;
    case 'enemy': return 30;
  }
}

export function getRelationshipLabel(
  relationship: PlanetaryRelationship,
  t: (key: string) => string
): string {
  switch (relationship) {
    case 'friend': return t('dailyEnergy.friendship.strongFriends');
    case 'neutral': return t('dailyEnergy.friendship.neutral');
    case 'enemy': return t('dailyEnergy.friendship.tension');
  }
}
```

### File: `services/DailySynthesisService.ts` (NEW)

```typescript
/**
 * Daily Synthesis Service
 * Generates holistic guidance combining day ruler, user planet, and lunar phase
 */

import type { Planet, Element } from './PlanetaryHoursService';
import type { MoonPhase } from './LunarService';

export interface DailySynthesis {
  overallQuality: 'excellent' | 'good' | 'moderate' | 'challenging';
  summaryText: string;
  excellentFor: string[];
  lessFavorable: string[];
  peakHours: string;
  
  factors: {
    planetaryFriendship: {
      score: number;
      label: string;
      description: string;
    };
    elementalHarmony: {
      score: number;
      label: string;
      description: string;
    };
    dailyStrength: {
      score: number;
      label: string;
      description: string;
    };
  };
}

export function generateDailySynthesis(
  dayRuler: Planet,
  userPlanet: Planet,
  userElement: Element,
  dayElement: Element,
  moonPhase: MoonPhase,
  dayRulerTransitPower: number,
  t: (key: string) => string
): DailySynthesis {
  // 1. Planetary friendship
  const relationship = getPlanetaryRelationship(dayRuler, userPlanet);
  const friendshipScore = getRelationshipScore(relationship);
  
  // 2. Elemental harmony
  const elementRelation = getElementRelationship(userElement, dayElement);
  const harmonyScore = getElementScore(elementRelation);
  
  // 3. Day ruler strength
  const strengthScore = dayRulerTransitPower;
  
  // Calculate overall quality
  const averageScore = (friendshipScore + harmonyScore + strengthScore) / 3;
  let overallQuality: DailySynthesis['overallQuality'];
  if (averageScore >= 80) overallQuality = 'excellent';
  else if (averageScore >= 65) overallQuality = 'good';
  else if (averageScore >= 45) overallQuality = 'moderate';
  else overallQuality = 'challenging';
  
  // Generate synthesis text
  const summaryText = generateSummaryText(
    dayRuler, userPlanet, userElement, 
    moonPhase, overallQuality, t
  );
  
  // Generate activity lists based on day ruler + quality
  const { excellentFor, lessFavorable } = generateActivityLists(
    dayRuler, overallQuality, t
  );
  
  return {
    overallQuality,
    summaryText,
    excellentFor,
    lessFavorable,
    peakHours: `${dayRuler} hours`, // Will show in Moment Alignment
    factors: {
      planetaryFriendship: {
        score: friendshipScore,
        label: getRelationshipLabel(relationship, t),
        description: getPlanetaryFriendshipDesc(dayRuler, userPlanet, t),
      },
      elementalHarmony: {
        score: harmonyScore,
        label: getElementRelationLabel(elementRelation, t),
        description: getElementalHarmonyDesc(dayElement, userElement, t),
      },
      dailyStrength: {
        score: strengthScore,
        label: getStrengthLabel(strengthScore, t),
        description: getDailyStrengthDesc(dayRuler, strengthScore, t),
      },
    },
  };
}

function generateSummaryText(
  dayRuler: Planet,
  userPlanet: Planet,
  userElement: Element,
  moonPhase: MoonPhase,
  quality: string,
  t: (key: string) => string
): string {
  // Example: "Excellent Thursday energy! Jupiter's day of expansion 
  // harmonizes beautifully with your Mars-Water nature. The waxing 
  // moon adds building momentum. Today favors growth, learning, and 
  // taking bold action with wisdom."
  
  const dayName = getDayName(dayRuler);
  const dayQuality = getDayQuality(dayRuler, t);
  const lunarAddition = getLunarPhaseText(moonPhase, t);
  const activities = getMainActivities(dayRuler, t);
  
  const template = t(`dailyEnergy.synthesis.${quality}`);
  return template
    .replace('{day}', dayName)
    .replace('{quality}', dayQuality)
    .replace('{user}', userPlanet)
    .replace('{element}', userElement)
    .replace('{lunar}', lunarAddition)
    .replace('{activities}', activities);
}

function generateActivityLists(
  dayRuler: Planet,
  quality: string,
  t: (key: string) => string
): { excellentFor: string[]; lessFavorable: string[] } {
  // Jupiter day examples
  const activities: Record<Planet, {
    excellent: string[];
    less: string[];
  }> = {
    Jupiter: {
      excellent: [
        'Starting new learning or teaching',
        'Business expansion and opportunities',
        'Seeking guidance or mentorship',
        'Travel planning or philosophical study',
        'Social connections and networking',
      ],
      less: [
        'Detailed technical work (wait for Mercury day)',
        'Financial conservatism (Jupiter encourages expansion)',
      ],
    },
    Mars: {
      excellent: [
        'Physical training and athletics',
        'Starting bold initiatives',
        'Competitive activities',
        'Overcoming obstacles',
        'Decisive action',
      ],
      less: [
        'Delicate negotiations',
        'Emotional conversations',
        'Patience-requiring tasks',
      ],
    },
    // ... etc for each planet
  };
  
  return activities[dayRuler] || activities.Jupiter;
}
```

---

## Phase 3: New Components (60 min)

### Component 1: `TodaysRulerSection.tsx`

```typescript
interface TodaysRulerSectionProps {
  dayRuler: Planet;
  dayElement: Element;
  dayDescription: string;
  transitPower: number;
  transitSign?: string;
  transitDignity?: string;
}

export function TodaysRulerSection({
  dayRuler,
  dayElement,
  dayDescription,
  transitPower,
  transitSign,
  transitDignity,
}: TodaysRulerSectionProps) {
  const { t } = useLanguage();
  const planetInfo = getPlanetInfo(dayRuler);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('dailyEnergy.todaysRuler')}
      </Text>
      
      <View style={styles.planetDisplay}>
        <Text style={styles.planetIcon}>{planetInfo.symbol}</Text>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>
            {t(`planets.${dayRuler.toLowerCase()}`)} • {planetInfo.arabicName}
          </Text>
          <View style={styles.elementRow}>
            <Text>{getElementIcon(dayElement)}</Text>
            <Text>{t(`elements.${dayElement}`)} Element</Text>
          </View>
          <Text style={styles.description}>{dayDescription}</Text>
        </View>
      </View>
      
      {transitSign && (
        <View style={styles.transitInfo}>
          <Text style={styles.label}>{t('dailyEnergy.currentTransit')}</Text>
          <View style={styles.badge}>
            <Text>In {transitSign} ({transitDignity})</Text>
          </View>
          <StrengthBar 
            value={transitPower} 
            label={getStrengthLabel(transitPower, t)} 
          />
        </View>
      )}
    </View>
  );
}
```

### Component 2: `UserPlanetSection.tsx`

```typescript
interface UserPlanetSectionProps {
  userPlanet: Planet;
  userElement: Element;
  source: 'name' | 'birth';
}

export function UserPlanetSection({
  userPlanet,
  userElement,
  source,
}: UserPlanetSectionProps) {
  const { t } = useLanguage();
  const planetInfo = getPlanetInfo(userPlanet);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('dailyEnergy.yourPlanet')}
      </Text>
      
      <View style={styles.planetDisplay}>
        <Text style={styles.planetIcon}>{planetInfo.symbol}</Text>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>
            {t(`planets.${userPlanet.toLowerCase()}`)} • {planetInfo.arabicName}
          </Text>
          <View style={styles.elementRow}>
            <Text>{getElementIcon(userElement)}</Text>
            <Text style={styles.element}>
              {t(`elements.${userElement}`)} (from {source === 'name' ? 'Name + Mother' : 'Birth Chart'})
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
```

### Component 3: `TodaysAlignmentSection.tsx`

```typescript
interface TodaysAlignmentSectionProps {
  synthesis: DailySynthesis;
}

export function TodaysAlignmentSection({
  synthesis,
}: TodaysAlignmentSectionProps) {
  const { t } = useLanguage();
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('dailyEnergy.todaysAlignment')}
      </Text>
      
      {/* Planetary Friendship */}
      <AlignmentFactor
        icon="🤝"
        label={t('dailyEnergy.factors.planetaryFriendship')}
        status={synthesis.factors.planetaryFriendship.label}
        statusColor={getStatusColor(synthesis.factors.planetaryFriendship.score)}
        detail={synthesis.factors.planetaryFriendship.description}
      />
      
      {/* Elemental Harmony */}
      <AlignmentFactor
        icon="🌊"
        label={t('dailyEnergy.factors.elementalHarmony')}
        status={synthesis.factors.elementalHarmony.label}
        statusColor={getStatusColor(synthesis.factors.elementalHarmony.score)}
        detail={synthesis.factors.elementalHarmony.description}
      />
      
      {/* Daily Strength */}
      <AlignmentFactor
        icon="⭐"
        label={t('dailyEnergy.factors.dailyStrength')}
        status={synthesis.factors.dailyStrength.label}
        statusColor={getStatusColor(synthesis.factors.dailyStrength.score)}
        detail={synthesis.factors.dailyStrength.description}
      />
    </View>
  );
}

function AlignmentFactor({ icon, label, status, statusColor, detail }) {
  return (
    <View style={styles.factor}>
      <View style={styles.factorHeader}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.status, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
      </View>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}
```

### Component 4: `WhatThisMeansCard.tsx`

```typescript
interface WhatThisMeansCardProps {
  synthesis: DailySynthesis;
}

export function WhatThisMeansCard({ synthesis }: WhatThisMeansCardProps) {
  const { t } = useLanguage();
  
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        ✨ {t('dailyEnergy.whatThisMeans')}
      </Text>
      
      <Text style={styles.summary}>{synthesis.summaryText}</Text>
      
      {/* Excellent For */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>
          🟢 {t('dailyEnergy.excellentForToday')}
        </Text>
        {synthesis.excellentFor.map((item, index) => (
          <Text key={index} style={styles.actionItem}>• {item}</Text>
        ))}
      </View>
      
      {/* Less Favorable */}
      {synthesis.lessFavorable.length > 0 && (
        <View style={styles.actionSection}>
          <Text style={styles.sectionTitle}>
            ⚠️ {t('dailyEnergy.lessFavorable')}
          </Text>
          {synthesis.lessFavorable.map((item, index) => (
            <Text key={index} style={styles.actionItem}>• {item}</Text>
          ))}
        </View>
      )}
      
      {/* Peak Hours Note */}
      <View style={styles.timingNote}>
        <Text style={styles.noteIcon}>💡</Text>
        <Text style={styles.noteText}>
          Peak Hours: {synthesis.peakHours} (check Moment Alignment for specific times)
        </Text>
      </View>
    </View>
  );
}
```

---

## Phase 4: Restructure Main Screen (90 min)

### File: `app/(tabs)/daily-guidance-details.tsx`

**Key Changes:**

1. **Remove:**
   - `DailyEnergyCard` (standalone percentage)
   - Separate disconnected sections

2. **Reorganize Structure:**
```tsx
<ScrollView>
  {/* Header with overall status */}
  <DailyHeader />
  
  {/* Main Analysis Card */}
  <AnalysisCard>
    <TodaysRulerSection />
    <Divider />
    <UserPlanetSection />
    <Divider />
    <TodaysAlignmentSection />
  </AnalysisCard>
  
  {/* Lunar Influence Card */}
  <MoonPhaseHeaderCard /> {/* Keep existing */}
  
  {/* What This Means For You */}
  <WhatThisMeansCard />
  
  {/* Best For Today (chips) */}
  <RecommendationsCard />
  
  {/* Collapsible Sections */}
  <CollapsibleSection title="Today's Hourly Timeline">
    <HourlyTimeline />
  </CollapsibleSection>
  
  <CollapsibleSection title="Planetary Strength Breakdown">
    <DailyPlanetaryAnalysisDisplay /> {/* Keep existing */}
  </CollapsibleSection>
  
  <CollapsibleSection title="Your Lunar Baseline">
    <LunarBaselineInfo />
  </CollapsibleSection>
  
  <CollapsibleSection title="Timing Analysis For You">
    <TimingAnalysisSection /> {/* Keep existing */}
  </CollapsibleSection>
</ScrollView>
```

3. **Add State for Synthesis:**
```typescript
const [dailySynthesis, setDailySynthesis] = useState<DailySynthesis | null>(null);

useEffect(() => {
  if (profile && dailyAnalysis) {
    const synthesis = generateDailySynthesis(
      dailyAnalysis.dayRulingPlanet,
      profile.rulingPlanet || 'Sun',
      profile.zahirElement || 'fire',
      dayElement,
      dailyAnalysis.moonPhase,
      dailyAnalysis.dayRulerPower || 50,
      t
    );
    setDailySynthesis(synthesis);
  }
}, [profile, dailyAnalysis]);
```

---

## Phase 5: Testing Checklist

### Functional Testing:
- [ ] Day ruler displays correctly for each day of week
- [ ] User planet shown (from name calculation or birth chart)
- [ ] Planetary friendship calculated correctly
- [ ] Elemental harmony shows proper relationship
- [ ] Daily strength reflects transit power
- [ ] Synthesis text generates appropriately for quality level
- [ ] Activity lists show relevant suggestions
- [ ] Lunar phase integrates into narrative
- [ ] All collapsible sections expand/collapse

### Translation Testing:
- [ ] All new keys exist in EN/FR/AR
- [ ] Day names translate correctly
- [ ] Planet names show with Arabic
- [ ] Element labels translate
- [ ] Synthesis paragraphs make sense in all languages

### UI/UX Testing:
- [ ] Narrative flows logically (ruler → your → interaction → lunar → synthesis)
- [ ] No orphaned percentages
- [ ] Cards have proper spacing/dividers
- [ ] Icons/colors match theme
- [ ] Touch targets are accessible
- [ ] Scrolling is smooth
- [ ] Premium sections clearly marked (if applicable)

### Edge Cases:
- [ ] User has no birth data (show name-based planet)
- [ ] User has no name (show generic guidance)
- [ ] Day ruler transit data unavailable
- [ ] Moon phase calculation fails
- [ ] Missing translations fall back gracefully

---

## Implementation Timeline

### Day 1 (4 hours):
- ✅ Phase 1: Translation keys
- ✅ Phase 2: Service logic

### Day 2 (4 hours):
- ✅ Phase 3: New components
- ✅ Phase 4: Restructure main screen (part 1)

### Day 3 (3 hours):
- ✅ Phase 4: Restructure main screen (part 2)
- ✅ Phase 5: Testing & refinement

**Total: ~11 hours**

---

## Files to Create

```
services/
  PlanetaryRelationshipService.ts (NEW)
  DailySynthesisService.ts (NEW)

components/timing/
  TodaysRulerSection.tsx (NEW)
  UserPlanetSection.tsx (NEW)
  TodaysAlignmentSection.tsx (NEW)
  WhatThisMeansCard.tsx (NEW)
  AlignmentFactor.tsx (NEW) - subcomponent
  RecommendationsCard.tsx (NEW)
```

## Files to Modify

```
constants/translations.ts
  - Add dailyEnergy section
  - Add dayRulers section
  - Add planetaryRelations section

app/(tabs)/daily-guidance-details.tsx
  - Restructure entire layout
  - Remove DailyEnergyCard
  - Add synthesis generation logic
  - Reorganize collapsible sections
```

## Files to Keep (Reuse)

```
components/timing/
  MoonPhaseHeaderCard.tsx ✅
  MoonDayHarmonyCard.tsx ✅
  TimingGuidanceCard.tsx ✅
  DailyPlanetaryAnalysisDisplay.tsx ✅
  
components/timing/TimingAnalysisSection.tsx ✅
components/common/CollapsibleSection.tsx ✅
```

---

## Success Metrics

Before redesign:
- ❌ Users see "89%" without context
- ❌ Disconnected sections feel like separate metrics
- ❌ No clear story about today's energy
- ❌ Missing the "why" behind guidance

After redesign:
- ✅ Clear narrative: "Jupiter's day interacts with your Mars-Water nature"
- ✅ Holistic synthesis paragraph explains overall meaning
- ✅ Specific activities recommended based on day + user combination
- ✅ All analysis flows into coherent guidance
- ✅ Feels like spiritual guidance, not a dashboard

---

## Next Steps After Review

1. **Approve plan** - Confirm approach and scope
2. **Priority phases** - Which phases to implement first?
3. **Translation help** - Need French/Arabic native speakers for synthesis templates?
4. **Design review** - Any mockups/screenshots to reference?
5. **Begin implementation** - Start with Phase 1 (translations)

---

## Questions for Clarification

1. **User Planet Source**: Prioritize name-based calculation or birth chart?
2. **Premium Gating**: Should synthesis be free or premium?
3. **Activity Lists**: Use generic templates or generate dynamically?
4. **Lunar Integration**: How detailed should lunar phase description be?
5. **Hourly Timeline**: Keep existing component or redesign?

---

## Alternative: Minimal Version (4 hours)

If timeline is tight, we can do a **simplified redesign**:

### Keep:
- Current structure mostly intact
- Existing components

### Add:
- User planet display section
- Synthesis paragraph card (top of screen)
- "What This Means" summary
- Planetary friendship/harmony in existing analysis

### Remove:
- Standalone percentage card

This gives 70% of the benefit with 30% of the work.

**Recommend full version** for best results, but minimal version is viable if needed.
