# 🎯 Prayer Guidance Step 1.2 - Quick Reference

## At a Glance

**Status**: Step 1.2 Complete ✅  
**Divine Names Mapped**: 25 most common  
**Translation Coverage**: 100% EN/FR  
**Planetary Coverage**: All 7 planets  

---

## Quick Access

### Import
```typescript
import { 
  DIVINE_NAMES_PLANETARY,
  getDivineNamesByPlanet,
  getDivineNameByNumber,
  calculateNameCompatibility
} from '@/data/divine-names-planetary';
```

### Get Name by Number
```typescript
const name = getDivineNameByNumber(47); // Al-Wadūd
// Returns complete DivineNamePlanetary object
```

### Display with Translations
```typescript
const { t } = useLanguage();

<Text>{name.arabic}</Text>                    // الوَدُودُ
<Text>{t(name.translationKey)}</Text>         // "The Most Loving" / "Le Très-Aimant"
<Text>{t(name.benefitKeys[0])}</Text>         // Auto-translates benefits
```

---

## Divine Names by Planet

### 🔴 Mars (Strength)
- **Al-Qawiyy** (القَوِيُّ) #26 - The All-Strong
- **Al-Qahhār** (القَهَّارُ) #14 - The Subduer

### 💚 Venus (Love & Harmony)
- **Al-Wadūd** (الوَدُودُ) #47 - The Most Loving
- **Aṣ-Ṣabūr** (الصَّبُورُ) #99 - The Patient
- **Ar-Raḥīm** (الرَّحِيمُ) #2 - The Merciful
- **Al-Ḥalīm** (الحَلِيمُ) #36 - The Forbearing
- **Al-Jamīl** (الجَمِيلُ) #85 - The Beautiful

### 🔵 Jupiter (Expansion & Wisdom)
- **Ar-Razzāq** (الرَّزَّاقُ) #10 - The Provider
- **Al-Ḥakīm** (الحَكِيمُ) #48 - The All-Wise
- **Ar-Raḥmān** (الرَّحْمَنُ) #1 - The Beneficent
- **Al-Wahhāb** (الوَهَّابُ) #15 - The Bestower
- **Al-Wājid** (الوَاجِدُ) #65 - The Finder
- **Al-Mughnī** (المُغْنِي) #82 - The Enricher

### 🟡 Mercury (Knowledge)
- **Al-ʿAlīm** (العَلِيمُ) #12 - The All-Knowing
- **As-Samīʿ** (السَّمِيعُ) #28 - The All-Hearing
- **Al-Mujīb** (المُجِيبُ) #62 - The Responsive
- **Al-Hādī** (الهَادِي) #94 - The Guide (variant)

### ☀️ Sun (Guidance & Authority)
- **Al-Hādī** (الهَادِي) #21 - The Guide
- **An-Nūr** (النُّورُ) #24 - The Light
- **Al-Malik** (المَلِكُ) #3 - The King
- **Al-Kabīr** (الكَبِيرُ) #37 - The Great
- **Al-Ḥaqq** (الحَقُّ) #51 - The Truth

### 🌙 Moon (Intuition & Balance)
- **Al-Laṭīf** (اللَّطِيفُ) #50 - The Subtle
- **Al-Jamīl** (الجَمِيلُ) #85 - The Beautiful
- **Al-Muʾmin** (المُؤْمِنُ) #7 - The Granter of Security

### ⚫ Saturn (Protection & Discipline)
- **Al-Ḥafīẓ** (الحَفِيظُ) #22 - The Preserver
- **Al-Muqaddim** (المُقَدِّمُ) #88 - The Expediter
- **Al-Muʾakhkhir** (المُؤَخِّرُ) #89 - The Delayer

---

## Common Usage Patterns

### 1. Current Planetary Hour Practice
```typescript
// Get current hour's planet
const planet = getRulingPlanet('Sunday', 1); // 'Sun'

// Get Divine Names for this planet
const names = getDivineNamesByPlanet(planet);

// Display top recommendation
const topName = names[0];
console.log(`Recite: ${topName.transliteration}`);
console.log(`Count: ${topName.recommendedCounts[0]}x`);
```

### 2. Day-Based Recommendations
```typescript
// Get names suitable for Friday (Venus day)
const fridayNames = getDivineNamesForDay('Friday');

fridayNames.forEach(name => {
  console.log(`${name.transliteration} - ${name.recommendedCounts[0]}x`);
});
```

### 3. Prayer Time Recommendations
```typescript
// Get names for Fajr
const fajrNames = getDivineNamesForPrayer('Fajr');

// Filter by your element (e.g., Fire)
const fireNames = fajrNames.filter(n => n.element === 'Fire');
```

### 4. User Compatibility Check
```typescript
const userName = "Fatima";
const userAbjad = 135; // calculated from name

const name = getDivineNameByNumber(1); // Ar-Raḥmān
const match = calculateNameCompatibility(name, userAbjad);

if (match.compatible) {
  console.log(`${match.resonance} resonance`);
}
```

---

## Translation Keys Structure

```
divineNamesPlanetary.
  ├── names.{nameId}.meaning         // Name meaning
  └── benefits.{benefitId}            // Benefit description
```

### Examples
```typescript
// Name meaning
t('divineNamesPlanetary.names.alQawiyy.meaning')
// EN: "The All-Strong"
// FR: "Le Très-Fort"

// Benefit
t('divineNamesPlanetary.benefits.overcomingObstacles')
// EN: "Overcoming obstacles"
// FR: "Surmonter les obstacles"
```

---

## Data Structure Quick Ref

```typescript
interface DivineNamePlanetary {
  number: number;              // 1-99
  arabic: string;              // Arabic text
  transliteration: string;     // Latin letters
  translationKey: string;      // For meaning
  
  abjadValue: number;          // Maghribi system
  reduction: number;           // Single digit
  letterComposition: string[]; // Arabic letters
  
  primaryPlanet: Planet;       // Main correspondence
  secondaryPlanets: Planet[];  // Additional
  
  element: Element;            // Fire/Earth/Air/Water
  temperament: Temperament;    // hot/cold/moist/dry/balanced
  
  bestTimes: {
    prayers: Prayer[];
    planetaryHours: Planet[];
    daysOfWeek: DayOfWeek[];
  };
  
  recommendedCounts: number[]; // [11, 33, 100, ...]
  benefitKeys: string[];       // Translation keys
  sources: SourceAttribution[];
}
```

---

## Integration with Phase 1.1

### Combined Guidance
```typescript
import { getHourPractice } from '@/data/classical-hour-practices';
import { getDivineNamesByPlanet } from '@/data/divine-names-planetary';

function getCompleteGuidance(day: string, hour: number) {
  const practice = getHourPractice(day, hour);
  const names = getDivineNamesByPlanet(practice.planet);
  
  return {
    hour: practice.hourNumber,
    planet: practice.planet,
    classicalWorks: practice.recommendedWorks,
    divineNames: names.slice(0, 3),
    arabicText: practice.arabicText,
  };
}
```

---

## Best Practices

### 1. Always Use Translations
```typescript
// ✅ Good
<Text>{t(name.translationKey)}</Text>
<Text>{t(name.benefitKeys[0])}</Text>

// ❌ Avoid hardcoding
<Text>"The All-Strong"</Text>
```

### 2. Respect Traditional Counts
```typescript
// ✅ Show recommended counts
<Text>Recommended: {name.recommendedCounts.join(', ')}</Text>

// Common counts: 11, 33, 100, or the Abjad value itself
```

### 3. Show Source Attribution
```typescript
// ✅ Credit classical sources
{name.sources.map(source => (
  <Text key={source.text}>
    {source.tradition}: {source.text}
  </Text>
))}
```

### 4. Element-Based Filtering
```typescript
// Match user's natal element
const userElement = getUserElement(); // from profile
const matchingNames = getDivineNamesByElement(userElement);
```

---

## Planetary Hour + Divine Name Flow

```
1. Get Current Time
   ↓
2. Calculate Planetary Hour
   ↓
3. Get Ruling Planet
   ↓
4. Get Divine Names for Planet
   ↓
5. Filter by User Element (optional)
   ↓
6. Check Numerological Compatibility (optional)
   ↓
7. Display Top 3 Recommendations
```

---

## Sample UI Output

```
🔴 SUNDAY HOUR 1 - SUN ☀️

Classical Works:
• Talismans and Blessed Seals
• Reversal Work (al-Radd)
• Al-Maski

Divine Names:
━━━━━━━━━━━━━━━━━━━━━━━━

1. النُّورُ (An-Nūr)
   The Light
   
   Count: 256 times
   Element: Fire 🔥
   
   Benefits:
   • Spiritual light and illumination
   • Inner illumination
   • Insight and clarity
   
   Best Time: After Fajr or Dhuhr
   Tradition: Shadhili-Alawi

━━━━━━━━━━━━━━━━━━━━━━━━

2. المَلِكُ (Al-Malik)
   The King
   
   Count: 121 times
   Element: Fire 🔥
   
   Benefits:
   • Sovereignty over affairs
   • Spiritual kingship
   • Righteous authority
   
   Best Time: After Dhuhr or Asr
   Tradition: Shadhili

Classical Arabic Text:
الساعة الاولى منه للشمس...
```

---

## Files

### Data
- [data/divine-names-planetary.ts](data/divine-names-planetary.ts) - Core data (700+ lines)
- [data/classical-hour-practices.ts](data/classical-hour-practices.ts) - Planetary hours

### Translations
- [constants/translations.ts](constants/translations.ts) - EN/FR keys

### Documentation
- [PRAYER_GUIDANCE_STEP_1_2_COMPLETE.md](PRAYER_GUIDANCE_STEP_1_2_COMPLETE.md) - Full docs

---

## Statistics

- **Names Mapped**: 25/99 (most commonly used)
- **Planets**: 7/7 (100%)
- **Elements**: 4/4 (100%)
- **Translation Keys**: 107 (EN/FR)
- **Benefits**: 80+
- **Sources**: 8 traditions
- **Helper Functions**: 6

---

## What's Next

### Step 1.3 (Optional)
- Add remaining 74 Divine Names
- More source citations
- Variant traditions

### Phase 2
- Service layer for real-time calculations
- User preference storage
- Practice tracking
- Notification system

---

**Last Updated**: Step 1.2 Complete  
**Status**: ✅ Ready for Integration  
**Translation**: EN ✅ FR ✅  
**Authenticity**: Classical sources ✅
