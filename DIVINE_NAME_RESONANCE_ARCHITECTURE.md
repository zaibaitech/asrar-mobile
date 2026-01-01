# Divine Name Resonance - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────┐      ┌────────────────────────────┐ │
│  │    HomeScreen.tsx         │      │   ResultsScreen.tsx        │ │
│  │                           │      │                            │ │
│  │  - Input form             │      │  - Full results display    │ │
│  │  - Quick results preview  │      │  - Detailed breakdown      │ │
│  │  - DivineResonanceCard    │      │  - DivineResonanceCard     │ │
│  └───────────┬───────────────┘      └──────────┬─────────────────┘ │
│              │                                  │                    │
│              │ Calls buildDestiny()            │                    │
│              └──────────────┬──────────────────┘                    │
│                             │                                        │
└─────────────────────────────┼────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   nameDestinyCalculator.ts                                     │ │
│  │                                                                 │ │
│  │   buildDestiny(personName, motherName, abjadMap) {            │ │
│  │     1. Calculate Kabir, Saghir, Element, Burj, Hour           │ │
│  │     2. ──► computeDivineResonance(personName, abjadMap)       │ │
│  │     3. Return NameDestinyResult with divineResonance          │ │
│  │   }                                                             │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
│                              │                                       │
│                              │ Calls                                 │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   divineResonance.ts                                           │ │
│  │                                                                 │ │
│  │   computeDivineResonance(name, abjadMap) {                    │ │
│  │     1. normalized = normalizeArabicForResonance(name)         │ │
│  │     2. breakdown[] = calculate letter values                   │ │
│  │     3. total = sum(breakdown)                                  │ │
│  │     4. index = calculateResonanceIndex(total)                 │ │
│  │     5. {letter, divineName} = DIVINE_NAMES[index]            │ │
│  │     6. return DivineResonanceResult                           │ │
│  │   }                                                             │ │
│  │                                                                 │ │
│  │   normalizeArabicForResonance(text) {                         │ │
│  │     - Remove tashkeel                                          │ │
│  │     - Normalize variants (آ→ا, ة→ه, etc.)                    │ │
│  │     - Remove spaces, punctuation, tatweel                      │ │
│  │   }                                                             │ │
│  │                                                                 │ │
│  │   getResonanceExplanation(total, index) {                     │ │
│  │     - Generate user-friendly calculation explanation           │ │
│  │   }                                                             │ │
│  └───────────────────────────┬───────────────────────────────────┘ │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ Uses
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────┐      ┌────────────────────────────┐ │
│  │   abjadMaps.ts            │      │   divineResonance.ts       │ │
│  │                           │      │                            │ │
│  │   ABJAD_MAGHRIBI {        │      │   DIVINE_NAMES {           │ │
│  │     'ا': 1,               │      │     1: {                   │ │
│  │     'ب': 2,               │      │       letter: 'ا',         │ │
│  │     ...                   │      │       name: 'الله'         │ │
│  │     'غ': 1000             │      │     },                     │ │
│  │   }                       │      │     2: { ... },            │ │
│  │                           │      │     ...                    │ │
│  │   ABJAD_MASHRIQI { ... }  │      │     28: {                  │ │
│  └───────────────────────────┘      │       letter: 'غ',         │ │
│                                      │       name: 'غني'          │ │
│                                      │     }                      │ │
│                                      │   }                        │ │
│                                      └────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       TYPE DEFINITIONS                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  NameDestinyResult {                                                 │
│    personName, motherName,                                           │
│    totalKabir, saghir,                                               │
│    element, burj, hour,                                              │
│    divineResonance?: DivineResonanceResult  ◄── NEW                 │
│  }                                                                   │
│                                                                       │
│  DivineResonanceResult {                                             │
│    normalized: string          // Cleaned Arabic text                │
│    breakdown: LetterBreakdown[] // [{ch: 'م', value: 40}, ...]      │
│    total: number               // Sum of all letter values           │
│    index: number               // 1-28 resonance index               │
│    letter: string              // Resonant letter                    │
│    divineName: string          // Divine Name in Arabic              │
│  }                                                                   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CALCULATION FLOW                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Input: "محمد" (Muhammad)                                           │
│     │                                                                │
│     ▼                                                                │
│  Normalize: "محمد" (already normalized)                             │
│     │                                                                │
│     ▼                                                                │
│  Calculate letter values:                                            │
│     م = 40                                                           │
│     ح = 8                                                            │
│     م = 40                                                           │
│     د = 4                                                            │
│     │                                                                │
│     ▼                                                                │
│  Total = 40 + 8 + 40 + 4 = 92                                       │
│     │                                                                │
│     ▼                                                                │
│  Calculate Index:                                                    │
│     92 >= 28, so:                                                   │
│     92 % 28 = 8 (remainder)                                         │
│     Index = 8                                                        │
│     │                                                                │
│     ▼                                                                │
│  Lookup Divine Name:                                                 │
│     DIVINE_NAMES[8] = { letter: 'ح', name: 'حكيم' }                │
│     │                                                                │
│     ▼                                                                │
│  Result: {                                                           │
│    normalized: "محمد",                                              │
│    breakdown: [{ch:'م',value:40},{ch:'ح',value:8},...],            │
│    total: 92,                                                        │
│    index: 8,                                                         │
│    letter: 'ح',                                                     │
│    divineName: 'حكيم'                                               │
│  }                                                                   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         UI COMPONENT                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  DivineResonanceCard Component:                                      │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ✨ Divine Name Resonance                                     │   │
│  │                                                              │   │
│  │              ┌─────────────────┐                            │   │
│  │              │     حكيم         │  ← Large Divine Name       │   │
│  │              └─────────────────┘                            │   │
│  │                   [  ح  ]         ← Letter badge            │   │
│  │                                                              │   │
│  │  Abjad Total         92           ← Calculation details     │   │
│  │  Resonance Index     8                                      │   │
│  │  Letter              ح                                      │   │
│  │                                                              │   │
│  │  💭 92 ÷ 28 = 3 remainder 8 → Index 8  ← Explanation       │   │
│  │                                                              │   │
│  │  Letter Values:                   ← Optional breakdown      │   │
│  │  [م:40] [ح:8] [م:40] [د:4]                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       EDGE CASES HANDLED                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. Total < 28:                                                      │
│     Input: "ك" (total = 20)                                         │
│     Index = 20 (NO division)                                         │
│     Result: رحمن (Ar-Rahman)                                        │
│                                                                       │
│  2. Total = 28:                                                      │
│     Input: "اكز" (1+20+7 = 28)                                      │
│     28 % 28 = 0 → Index = 28                                        │
│     Result: غني (Al-Ghani)                                          │
│                                                                       │
│  3. Remainder 0:                                                     │
│     Input: "انه" (total = 56)                                       │
│     56 % 28 = 0 → Index = 28                                        │
│     Result: غني (Al-Ghani)                                          │
│                                                                       │
│  4. With Tashkeel:                                                   │
│     Input: "مُحَمَّد" (with diacritics)                             │
│     Normalized: "محمد" (tashkeel removed)                           │
│     Proceeds normally                                                │
│                                                                       │
│  5. No Valid Letters:                                                │
│     Input: "123 ABC" (no Arabic)                                     │
│     Throws: "No valid Arabic letters found in the name"              │
│     buildDestiny catches error gracefully                            │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## File Structure

```
asrar-mobile/
├── features/
│   └── name-destiny/
│       ├── services/
│       │   ├── divineResonance.ts          ◄── NEW: Core calculation logic
│       │   └── nameDestinyCalculator.ts    ◄── UPDATED: Integration
│       ├── components/
│       │   ├── DivineResonanceCard.tsx     ◄── NEW: UI component
│       │   └── index.ts                    ◄── UPDATED: Export
│       ├── screens/
│       │   ├── HomeScreen.tsx              ◄── UPDATED: Integration
│       │   └── ResultsScreen.tsx           ◄── UPDATED: Integration
│       ├── types/
│       │   └── index.ts                    ◄── UPDATED: New interface
│       ├── constants/
│       │   └── abjadMaps.ts                (existing)
│       └── __tests__/
│           └── divineResonance.test.ts     ◄── NEW: Test suite
└── docs/
    ├── DIVINE_NAME_RESONANCE_IMPLEMENTATION.md
    ├── DIVINE_NAME_RESONANCE_QUICK_REFERENCE.md
    └── DIVINE_NAME_RESONANCE_SUMMARY.md
```

## Data Flow Sequence

1. **User Input** → User enters name in HomeScreen
2. **Trigger** → User taps "Analyze Destiny"
3. **Calculate** → `buildDestiny()` called
4. **Process** → `computeDivineResonance()` called
5. **Normalize** → Text cleaned and normalized
6. **Compute** → Letter values summed
7. **Index** → Resonance index calculated
8. **Lookup** → Divine Name retrieved from table
9. **Return** → Result object created
10. **Display** → DivineResonanceCard renders result

## Key Design Decisions

1. **Optional Field**: `divineResonance?` is optional to maintain backward compatibility
2. **Error Handling**: Graceful failure in `buildDestiny()` - continues without resonance
3. **Reusability**: Service is standalone and can be used anywhere
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **UI Integration**: Conditional rendering - only shows if data available
6. **Normalization**: Separate function for testability and reuse
7. **Data Structure**: DIVINE_NAMES as constant for easy lookup
