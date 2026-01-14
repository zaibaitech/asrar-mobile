# 🎯 Prayer Guidance - Quick Reference

## At a Glance

**Status**: Phase 1 Foundation Complete ✅  
**Translation Coverage**: 100% EN/FR  
**Data Coverage**: Sunday 12/12 hours, 6 more days pending  

---

## Quick Start

### 1. Import
```typescript
import { getHourPractice } from '@/data/classical-hour-practices';
import { useLanguage } from '@/contexts/LanguageContext';
```

### 2. Get Hour Data
```typescript
const hourData = getHourPractice('Sunday', 1);
// Returns: { day, hourNumber, planet, recommendedWorks, avoidWorks, arabicText, source }
```

### 3. Display Translated
```typescript
const { t } = useLanguage();

// Planet name (auto-translates based on user language)
<Text>{t(`prayerGuidance.planets.${hourData.planet}`)}</Text>

// Work name
{hourData.recommendedWorks.map(work => (
  <Text>{t(work.nameKey)}</Text>
))}
```

---

## Translation Keys

### Structure
```
prayerGuidance.
  ├── title                    "Prayer Guidance" / "Guidance de Prière"
  ├── subtitle                 Classical practices description
  ├── days.{day}               "Sunday" / "Dimanche"
  ├── planets.{planet}         "Sun" / "Soleil"
  ├── hours.{label}            Hour-related labels
  └── works.{workId}.
        ├── name               "Talismans and Blessed Seals"
        └── description        Detailed description
```

### Quick Access
```typescript
// Days
t('prayerGuidance.days.Sunday')    // Sunday / Dimanche

// Planets  
t('prayerGuidance.planets.Sun')    // Sun / Soleil

// Works
t('prayerGuidance.works.talismansSeals.name')  
// "Talismans and Blessed Seals" / "Talismans et Sceaux Bénis"
```

---

## Available Works (31 Total)

### By Planet

**Sun** (Hours 1, 8)
- `talismansSeals`, `reversalWork`, `alMaski`, `hinduBinding`, `burntWoolInk`
- `authorityLeadership`, `honorsRecognition`

**Venus** (Hours 2, 9)
- `correctnessSweetness`, `dominanceRulers`, `worksJudges`
- `loveAttraction`, `beautyArts`, `harmonyPeace`

**Mercury** (Hours 3, 10)
- `learningStudy`, `communication`, `tradeCommerce`
- `writingDocumentation`, `contractsAgreements`, `intellectualPursuits`

**Moon** (Hours 4, 11)
- `journeysTravel`, `waterWorks`, `emotionalMatters`
- `dreamsVisions`, `intuitionWork`, `feminineMatters`

**Saturn** (Hours 5, 12)
- `bindingRestriction`, `protectionWork`, `endingsClosures`, `deepMeditation`, `ancestralWork`
- ⚠️ **Avoid**: `marriageMatters`, `joyfulWorks`, `newBeginnings`

**Jupiter** (Hour 6)
- `seekingFavor`, `wealthExpansion`, `religiousMatters`

**Mars** (Hour 7)
- `courageStrength`, `conflictResolution`
- ⚠️ **Avoid**: `peacefulNegotiations`

---

## Sunday Hour Sequence

| Hour | Planet  | Key Works |
|------|---------|-----------|
| 1    | ☀️ Sun  | Talismans, Sacred Works |
| 2    | ♀ Venus | Harmony, Authority |
| 3    | ☿ Mercury | Learning, Communication |
| 4    | ☽ Moon  | Journeys, Emotions |
| 5    | ♄ Saturn | Binding, Protection ⚠️ |
| 6    | ♃ Jupiter | Blessings, Expansion |
| 7    | ♂ Mars  | Courage, Conflict ⚠️ |
| 8    | ☀️ Sun  | Leadership, Honors |
| 9    | ♀ Venus | Love, Beauty |
| 10   | ☿ Mercury | Writing, Contracts |
| 11   | ☽ Moon  | Dreams, Intuition |
| 12   | ♄ Saturn | Endings, Meditation ⚠️ |

---

## Helper Functions

### getRulingPlanet()
```typescript
const planet = getRulingPlanet('Sunday', 5);
// Returns: "Saturn"
```

### getHourPractice()
```typescript
const hour = getHourPractice('Sunday', 1);
// Returns: ClassicalHourPractice object or null
```

### getHourPracticesForDay()
```typescript
const allHours = getHourPracticesForDay('Sunday');
// Returns: Array of 12 ClassicalHourPractice objects
```

---

## Common Patterns

### Display Hour Card
```typescript
function HourCard({ day, hour }) {
  const { t } = useLanguage();
  const data = getHourPractice(day, hour);
  
  return (
    <View>
      <Text>{t('prayerGuidance.hours.hourNumber', { number: hour })}</Text>
      <Text>{t(`prayerGuidance.planets.${data.planet}`)}</Text>
      {data.recommendedWorks.map(w => <Text>{t(w.nameKey)}</Text>)}
    </View>
  );
}
```

### Filter by Work Type
```typescript
const protectionHours = sundayHourPractices.filter(h =>
  h.recommendedWorks.some(w => w.id.includes('protection'))
);
```

### Language Switching
```typescript
const { language, setLanguage } = useLanguage();

// Toggle language
<Button onPress={() => setLanguage(language === 'en' ? 'fr' : 'en')}>
  Switch to {language === 'en' ? 'FR' : 'EN'}
</Button>

// All translations update automatically!
```

---

## TypeScript Types

```typescript
type DayOfWeek = 'Sunday' | 'Monday' | ... | 'Saturday';
type Planet = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
type HourNumber = 1 | 2 | 3 | ... | 12;

interface ClassicalWork {
  id: string;
  nameKey: string;
  descriptionKey?: string;
}

interface ClassicalHourPractice {
  day: DayOfWeek;
  hourNumber: HourNumber;
  planet: Planet;
  recommendedWorks: ClassicalWork[];
  avoidWorks: ClassicalWork[];
  arabicText: string;
  source: { title: string; tradition: string; page?: string };
  notes?: string;
}
```

---

## Files

### Data
- [data/classical-hour-practices.ts](data/classical-hour-practices.ts) - Core data structure

### Translations
- [constants/translations.ts](constants/translations.ts) - EN/FR keys under `prayerGuidance`

### Documentation
- [PRAYER_GUIDANCE_PHASE_1_COMPLETE.md](PRAYER_GUIDANCE_PHASE_1_COMPLETE.md) - Full docs
- [PRAYER_GUIDANCE_USAGE_EXAMPLES.tsx](PRAYER_GUIDANCE_USAGE_EXAMPLES.tsx) - Code examples
- [PRAYER_GUIDANCE_PHASE_1_SUMMARY.md](PRAYER_GUIDANCE_PHASE_1_SUMMARY.md) - Implementation summary

---

## What's Next

### To Complete Phase 1
Add remaining days (Monday-Saturday) following Sunday pattern:
1. Copy Sunday structure
2. Use `PLANETARY_HOUR_SEQUENCE[day]` for correct planet order
3. Add classical Arabic texts
4. Reuse existing work translation keys

### Phase 2 (Services)
- Astronomical calculations (sunrise/sunset)
- Current hour detection
- User preferences
- Caching layer

### Phase 3 (UI)
- Hour detail screens
- Day selector
- Current hour widget
- Notification system

---

## Quick Checklist

Phase 1 Foundation:
- [x] Data structure created
- [x] Sunday 12 hours complete
- [x] 31 works defined
- [x] 100% EN/FR translation coverage
- [x] Helper functions added
- [x] Documentation complete
- [ ] Monday-Saturday (pending)

Ready for:
- [x] UI development
- [x] Service layer integration
- [x] Testing
- [x] User feedback

---

**Last Updated**: Phase 1 Foundation Complete  
**Version**: 1.0.0  
**Translation Coverage**: EN ✅ FR ✅  
**Type Safety**: Full TypeScript ✅
