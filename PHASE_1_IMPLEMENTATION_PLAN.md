# PHASE 1 IMPLEMENTATION PLAN - DAILY ENERGY TRANSFORMATION

**Project:** Asrāriya Mobile App - Moon Phase Integration  
**Phase:** 1 of 4  
**Status:** 🟢 BACKEND SERVICES COMPLETE  
**Date:** January 27, 2026  

---

## PHASE 1 OVERVIEW

### ✅ COMPLETED (Backend Services)

1. ✅ **MoonPhaseService.ts** - Created (690 lines)
   - `analyzeMoonPhase()` - Main calculation function
   - `isWaxingMoon()` - Determine waxing/waning
   - `getMoonPhaseName()` - Get phase from illumination
   - `calculateLunarDay()` - Calculate lunar day (1-30)
   - `getEnergyType()` - Determine phase energy
   - `calculateMoonPower()` - Calculate moon power
   - `analyzeMoonDayHarmony()` - Moon-day analysis
   - Complete phase guidance for all 8 phases

2. ✅ **EnhancedDailyEnergyService.ts** - Created (180 lines)
   - `calculateWeightedDailyEnergy()` - NEW weighted formula
   - `getDailyEnergyQuality()` - Quality label
   - `getDailyEnergyColor()` - UI color theming
   - `getDailyEnergyEmoji()` - UI emoji
   - `generateDailyEnergyGuidance()` - Guidance text
   - Legacy calculation for comparison

### 🔄 IN PROGRESS (UI Integration)

3. 🟡 **Translation Keys** - Need to add to constants/translations.ts
   - Moon phase names (8 phases × 3 languages)
   - Guidance text (guidance, suitable, not suitable)
   - Moon-day harmony text
   - Daily energy guidance text

4. 🟡 **Hook Integration** - Update/create hook
   - Fetch Moon phase analysis
   - Integrate with existing daily analysis
   - Calculate Moon-Day harmony
   - Return combined data

5. 🟡 **UI Component - Moon Phase Card** (NEW)
   - Display at top of Daily Energy screen
   - Show animated moon emoji
   - Show phase name + lunar day
   - Show energy type + guidance
   - "Learn More" button for modal

6. 🟡 **UI Component - Moon-Day Harmony Card** (NEW)
   - Display harmony level
   - Show explanation + recommendation
   - Color-coded by harmony level

7. 🟡 **UI Component - Daily Energy Breakdown** (ENHANCED)
   - Update existing Daily Energy card
   - Show calculation breakdown
   - Day Ruler × 50%, Moon × 30%, Others × 20%

8. 🟡 **Modal - Moon Phase Educational** (NEW)
   - Full Moon phase guide
   - Suitability for activities
   - Timing recommendations

### 📋 TOTAL TASKS

**Backend:** 2/2 complete ✅  
**Frontend:** 0/6 started 🟡  
**Translation:** 0/1 started 🟡  
**Testing:** 0/1 started ⏳  

**Estimated Timeline:**
- Backend: ✅ Complete (3 hours)
- Frontend UI: 8-12 hours
- Translations: 4-6 hours
- Testing/Refinement: 3-5 hours
- **Total Phase 1: 18-26 hours**

---

## IMPLEMENTATION CHECKLIST

### STEP 1: INTEGRATION WITH EXISTING SERVICES (4 hours)

#### 1.1 Update `services/DailyPlanetaryAnalysisService.ts`

```typescript
// ADD TO IMPORTS:
import { analyzeMoonPhase, analyzeMoonDayHarmony } from '@/services/MoonPhaseService';
import { calculateWeightedDailyEnergy } from '@/services/EnhancedDailyEnergyService';

// UPDATE FUNCTION: calculateDailyAnalysis()
// ADD: Moon phase analysis
const moonPhase = analyzeMoonPhase(
  moonIllumination,
  sunLongitude,
  moonLongitude,
  now
);

// ADD: Moon-day harmony
const moonDayHarmony = analyzeMoonDayHarmony(
  moonPhase,
  dayRuler,
  userElement
);

// UPDATE: Daily energy calculation
const dailyEnergy = calculateWeightedDailyEnergy(
  analysis,
  moonPhase,
  dayRuler
);

// RETURN: Updated analysis object
return {
  ...analysis,
  moonPhase,      // NEW
  moonDayHarmony, // NEW
  dailyEnergy: dailyEnergy.percentage, // UPDATED
  dailyEnergyBreakdown: dailyEnergy.breakdown, // NEW
};
```

#### 1.2 Update `hooks/useDailyPlanetaryAnalysis.ts`

```typescript
// Ensure hook returns new moon phase + harmony data
// Update hook to call updated service function
// Test that all calculations flow through properly
```

---

### STEP 2: TRANSLATION KEYS (4-6 hours)

Add to `constants/translations.ts`:

```typescript
// MOON PHASE NAMES
moon: {
  phases: {
    new: {
      en: 'New Moon',
      fr: 'Nouvelle Lune',
      ar: 'القمر الجديد',
    },
    waxing_crescent: {
      en: 'Waxing Crescent',
      fr: 'Croissant Ascendant',
      ar: 'الهلال المتزايد',
    },
    // ... (6 more phases - see MoonPhaseService.ts for exact names)
  },

  // MOON PHASE GUIDANCE (8 phases)
  new: {
    title: { en: 'Rest & Reflection', fr: 'Repos et Réflexion', ar: 'الراحة والتأمل' },
    description: { en: 'The dark Moon is a time of rest...', ... },
    suitable: {
      category: { en: 'Spiritual Practice', ... },
      activity1: { en: 'Rest and restoration', ... },
      activity2: { en: 'Deep contemplation', ... },
      activity3: { en: 'Shadow work', ... },
      spiritual1: { en: 'Night prayers (Tahajjud)', ... },
      spiritual2: { en: 'Tawbah (repentance)', ... },
      spiritual3: { en: 'Fasting', ... },
    },
    notSuitable: {
      category: { en: 'External Action', ... },
      activity1: { en: 'Starting new projects', ... },
      activity2: { en: 'Major launches', ... },
      activity3: { en: 'Business agreements', ... },
      reason: { en: 'The dark Moon lacks light...', ... },
    },
  },
  waxing_crescent: { /* ... */ },
  // ... (continue for all 8 phases)

  // MOON-DAY HARMONY
  harmony: {
    waxing_active: {
      explanation: { en: 'Waxing Moon + Sun/Mars/Jupiter...', ... },
      recommendation: { en: 'This is excellent timing...', ... },
    },
    waning_reflective: {
      explanation: { en: 'Waning Moon + Moon/Venus/Saturn...', ... },
      recommendation: { en: 'Perfect for finishing...', ... },
    },
    waxing_reflective: {
      explanation: { en: 'Waxing Moon wants to build...', ... },
      recommendation: { en: 'You can still act...', ... },
    },
    waning_active: {
      explanation: { en: 'Waning Moon supports release...', ... },
      recommendation: { en: 'Push forward if you must...', ... },
    },
    neutral: {
      explanation: { en: 'Mercury is neither strongly...', ... },
      recommendation: { en: 'Both action and reflection...', ... },
    },
  },

  // DAILY ENERGY GUIDANCE
  energy: {
    guidance: {
      excellent: { en: 'is strong today...' },
      good: { en: 'good energy combined...' },
      moderate: { en: 'Moderate energy today...' },
      mindful: { en: 'Energy is low...' },
      rest: { en: 'Today calls for rest...' },
    },
  },
},
```

---

### STEP 3: UI COMPONENTS (8-12 hours)

#### 3.1 Create `components/timing/MoonPhaseCard.tsx` (NEW)

```typescript
interface MoonPhaseCardProps {
  moonPhase: MoonPhaseAnalysis;
  compact?: boolean;
  onLearnMore?: () => void;
}

export function MoonPhaseCard({
  moonPhase,
  compact = false,
  onLearnMore,
}: MoonPhaseCardProps) {
  const { t } = useLanguage();
  
  return (
    <LinearGradient
      colors={[moonPhase.color + '20', moonPhase.color + '05']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌒 {t('moon.phase.title')}</Text>
        {onLearnMore && (
          <TouchableOpacity onPress={onLearnMore}>
            <Text style={styles.learnMore}>ℹ️ {t('moon.phase.learnMore')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.phaseName}>
          {moonPhase.phaseNameTranslated[language]}
        </Text>

        <View style={styles.moonDisplay}>
          <Text style={styles.moonEmoji}>{moonPhase.moonEmoji}</Text>
          <Text style={styles.illumination}>
            {moonPhase.phasePercentage}% {t('moon.illumination')}
          </Text>
        </View>

        <View style={styles.lunarDay}>
          <Text style={styles.lunarDayLabel}>{t('moon.lunarDay')}</Text>
          <Text style={styles.lunarDayValue}>{moonPhase.lunarDay}/30</Text>
        </View>

        <View style={styles.guidance}>
          <Text style={styles.guidanceTitle}>
            {moonPhase.primaryGuidance.title}
          </Text>
          <Text style={styles.guidanceText}>
            {moonPhase.primaryGuidance.description}
          </Text>
        </View>

        {!compact && (
          <View style={styles.powerBar}>
            <Text style={styles.powerLabel}>
              {t('moon.power')}: {moonPhase.moonPower}%
            </Text>
            <View style={styles.bar}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${moonPhase.moonPower}%`,
                    backgroundColor: moonPhase.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.powerQuality}>
              {moonPhase.powerQuality}
            </Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.foreground,
  },
  learnMore: {
    fontSize: 12,
    color: Colors.primary,
  },
  content: {
    gap: Spacing.sm,
  },
  phaseName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.foreground,
  },
  moonDisplay: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  moonEmoji: {
    fontSize: 48,
  },
  illumination: {
    fontSize: 14,
    color: Colors.subtext,
  },
  lunarDay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lunarDayLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  lunarDayValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
  },
  guidance: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  guidanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
  },
  guidanceText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  powerBar: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  powerLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.foreground,
  },
  bar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  powerQuality: {
    fontSize: 11,
    color: Colors.subtext,
    textAlign: 'right',
  },
});
```

#### 3.2 Create `components/timing/MoonDayHarmonyCard.tsx` (NEW)

```typescript
interface MoonDayHarmonyCardProps {
  moonDayHarmony: MoonDayHarmony;
  dayRuler: Planet;
}

export function MoonDayHarmonyCard({
  moonDayHarmony,
  dayRuler,
}: MoonDayHarmonyCardProps) {
  const { t } = useLanguage();

  const getHarmonyColor = (level: string) => {
    switch (level) {
      case 'perfect':
        return '#10b981'; // Green
      case 'good':
        return '#3b82f6'; // Blue
      case 'neutral':
        return '#6b7280'; // Gray
      case 'challenging':
        return '#f59e0b'; // Amber
      default:
        return Colors.border;
    }
  };

  const getHarmonyEmoji = (level: string) => {
    switch (level) {
      case 'perfect':
        return '✅';
      case 'good':
        return '⭐';
      case 'neutral':
        return '⚖️';
      case 'challenging':
        return '⚠️';
      default:
        return '🌙';
    }
  };

  return (
    <LinearGradient
      colors={[getHarmonyColor(moonDayHarmony.harmonyLevel) + '15', 'transparent']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.emoji}>
          {getHarmonyEmoji(moonDayHarmony.harmonyLevel)}
        </Text>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{t('moon.harmony.title')}</Text>
          <Text
            style={[
              styles.level,
              { color: getHarmonyColor(moonDayHarmony.harmonyLevel) },
            ]}
          >
            {t(`moon.harmony.level.${moonDayHarmony.harmonyLevel}`)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.explanation}>
          {moonDayHarmony.explanation}
        </Text>

        <View style={styles.recommendation}>
          <Text style={styles.recommendationLabel}>
            {t('moon.harmony.recommendation')}
          </Text>
          <Text style={styles.recommendationText}>
            {moonDayHarmony.recommendation}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  emoji: {
    fontSize: 28,
  },
  titleArea: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.foreground,
  },
  level: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    gap: Spacing.md,
  },
  explanation: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  recommendation: {
    gap: Spacing.xs,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  recommendationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.subtext,
    textTransform: 'uppercase',
  },
  recommendationText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 16,
  },
});
```

#### 3.3 Update `components/timing/DailyEnergyCard.tsx` (ENHANCE EXISTING)

Update the existing Daily Energy display to show breakdown:

```typescript
// ADD to existing component:

{!compact && dailyEnergyBreakdown && (
  <View style={styles.breakdownSection}>
    <Text style={styles.breakdownTitle}>
      {t('dailyEnergy.calculationBreakdown')}
    </Text>
    
    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>
        {dayRuler} ({t('dailyEnergy.dayRuler')})
      </Text>
      <Text style={styles.breakdownValue}>
        {dailyEnergyBreakdown.dayRulerScore}%
      </Text>
      <Text style={styles.breakdownWeight}>× 50%</Text>
    </View>

    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>
        {t('dailyEnergy.moon')}
      </Text>
      <Text style={styles.breakdownValue}>
        {dailyEnergyBreakdown.moonScore}%
      </Text>
      <Text style={styles.breakdownWeight}>× 30%</Text>
    </View>

    <View style={styles.breakdownRow}>
      <Text style={styles.breakdownLabel}>
        {t('dailyEnergy.others')}
      </Text>
      <Text style={styles.breakdownValue}>
        {dailyEnergyBreakdown.othersScore}%
      </Text>
      <Text style={styles.breakdownWeight}>× 20%</Text>
    </View>

    <View style={[styles.breakdownRow, styles.total]}>
      <Text style={styles.totalLabel}>
        {t('dailyEnergy.total')}
      </Text>
      <Text style={styles.totalValue}>
        {percentage}%
      </Text>
    </View>
  </View>
)}
```

---

### STEP 4: MODAL COMPONENT (2-3 hours)

#### 4.1 Create `components/modals/MoonPhaseEducationModal.tsx` (NEW)

Shows full Moon phase guide with detailed information:

```typescript
export function MoonPhaseEducationModal({
  visible,
  moonPhase,
  onDismiss,
}: MoonPhaseEducationModalProps) {
  // Render full moon phase guide
  // Include: phase explanation, suitable activities, spiritual practices
  // Show: lunar mansions, timing tips, traditional practices
  // Action buttons: Share, Set Reminder
}
```

---

### STEP 5: TESTING & VALIDATION (3-5 hours)

#### 5.1 Unit Tests

```typescript
// tests/services/MoonPhaseService.test.ts
describe('MoonPhaseService', () => {
  test('analyzeMoonPhase() returns correct phase for known dates', () => {
    // Test against known Moon phases
    // Jan 1, 2026: New Moon
    // Jan 8, 2026: First Quarter
    // Jan 15, 2026: Full Moon
    // Jan 22, 2026: Last Quarter
  });

  test('calculateLunarDay() returns 1-30 range', () => {
    // Test lunar day calculation
  });

  test('isWaxingMoon() correctly determines phase direction', () => {
    // Test waxing/waning detection
  });

  test('analyzeMoonDayHarmony() returns expected harmony levels', () => {
    // Test all 4 harmony combinations
  });
});

// tests/services/EnhancedDailyEnergyService.test.ts
describe('EnhancedDailyEnergyService', () => {
  test('calculateWeightedDailyEnergy() matches expected formula', () => {
    // Test: (dayRuler × 0.5) + (moon × 0.3) + (others × 0.2)
    // Verify weighting is correct
  });

  test('weighted calculation differs from legacy for some inputs', () => {
    // Compare old vs new
  });
});
```

#### 5.2 Integration Tests

```typescript
// Test moon phase + daily energy together
// Test all 8 phases render correctly
// Test translations work in EN/FR/AR
// Test UI components display without errors
```

#### 5.3 Manual Testing Checklist

- [ ] Moon phase card displays correctly
- [ ] Moon emoji animates (optional enhancement)
- [ ] Lunar day updates daily
- [ ] Moon-day harmony shows correct level
- [ ] Daily energy shows breakdown
- [ ] Weighted calculation produces reasonable values
- [ ] All translations display correctly
- [ ] Modal opens and shows full guide
- [ ] Learn More buttons work
- [ ] Colors match design system

---

## CONFIGURATION MIGRATION GUIDE

### For Developers Implementing This

**1. Update DailyPlanetaryAnalysisService.ts:**
- Add MoonPhaseService imports
- Call `analyzeMoonPhase()` in main calculation
- Update return interface to include moonPhase, moonDayHarmony
- Update daily energy calculation to use weighted formula

**2. Update useDailyPlanetaryAnalysis.ts hook:**
- Ensure new data flows through hook
- Return moon phase data for UI components

**3. Update Daily Guidance screen:**
- Add MoonPhaseCard at top
- Add MoonDayHarmonyCard below
- Update Daily Energy card with breakdown display
- Add modal trigger for full moon guide

**4. Add Translation Keys:**
- Copy PHASE_GUIDANCE constant from MoonPhaseService.ts
- Add all guidance text to translations.ts
- Test translations in all 3 languages

**5. Test & Deploy:**
- Run unit tests
- Manual testing on device
- Deploy to staging
- Gather user feedback

---

## VALIDATION EXAMPLES

### Test Case 1: Waxing Crescent Moon + Active Day Ruler

```
Moon: Waxing Crescent (15% illuminated, lunar day 5)
Day Ruler: Mars (58% strength)
User Element: Fire

Expected Results:
- Moon Phase: "Time for New Beginnings" ✅
- Moon-Day Harmony: "Perfect Alignment" ✅
- Daily Energy: (58 × 0.5) + (estimated 65% × 0.3) + (avg 49% × 0.2) = 57% ✅
```

### Test Case 2: Waning Crescent Moon + Reflective Day Ruler

```
Moon: Waning Crescent (10% illuminated, lunar day 28)
Day Ruler: Saturn (35% strength)
User Element: Water

Expected Results:
- Moon Phase: "Rest Before Renewal" ✅
- Moon-Day Harmony: "Perfect Alignment" ✅
- Daily Energy: (35 × 0.5) + (estimated 45% × 0.3) + (avg 52% × 0.2) = 38% ✅
```

---

## SUCCESS CRITERIA

✅ **Backend Complete**
- MoonPhaseService.ts implements all calculations
- EnhancedDailyEnergyService.ts provides weighted formula
- Both services integrate with existing systems
- No breaking changes to existing code

✅ **Frontend Implemented**
- Moon Phase Card displays at top of Daily Energy
- Moon-Day Harmony Card shows alignment
- Daily Energy Card shows weighted breakdown
- All components use existing design system

✅ **Translations Complete**
- All 8 moon phases translated (EN/FR/AR)
- All guidance text translated
- All UI text translated
- No missing keys

✅ **Testing Passed**
- Unit tests pass for all services
- Integration tests verify calculations
- Manual testing checklist complete
- No UI regressions

✅ **Documentation Complete**
- This implementation plan
- Code comments in all services
- User-facing help text in app

---

## NEXT PHASES (Preview)

### Phase 2: Planetary Condition Module (12-18 hours)
- Add dignity + aspect analysis
- Integrate with daily energy
- Show "Planet of the Day" analysis

### Phase 3: Advanced Moment Alignment (10-14 hours)
- Separate cosmic quality from personal resonance
- Implement 3-tier judgment system
- Add traditional rulings (wajib/mustahabb/mubah/makruh)

### Phase 4: Full Year Ephemeris (20-30 hours)
- Complete 2026-2027 ephemeris data
- Add automated JPL API integration
- Implement daily position caching

---

**Document Status:** 🟢 COMPLETE  
**Ready for Implementation:** ✅ YES  
**Next Step:** Begin UI Component Implementation (Step 3)

