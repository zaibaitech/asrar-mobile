# ʿIlm al-Asrār Calculator - Code Snippets Reference

## Quick Code Examples

### 1. Using the Enhanced Calculator

```typescript
import { EnhancedCalculatorEngine } from './services/EnhancedCalculatorEngine';
import { CalculationRequest } from './types/calculator-enhanced';

// Example 1: Calculate a name
const nameRequest: CalculationRequest = {
  type: 'name',
  arabicInput: 'محمد',
  system: 'maghribi',
};

const result = await EnhancedCalculatorEngine.calculate(nameRequest);
console.log(result.nameInsights?.archetypeTitle); // "The Seeker"
console.log(result.core.kabir); // Total abjad value
console.log(result.analytics.balanceScore); // 67%

// Example 2: Calculate lineage (name + mother)
const lineageRequest: CalculationRequest = {
  type: 'lineage',
  yourName: 'أحمد',
  motherName: 'فاطمة',
  system: 'maghribi',
};

const lineageResult = await EnhancedCalculatorEngine.calculate(lineageRequest);
console.log(lineageResult.lineageInsights?.familyPattern.harmony); // 'support'
console.log(lineageResult.lineageInsights?.keyTakeaways); // Array of 3 insights

// Example 3: Calculate a phrase
const phraseRequest: CalculationRequest = {
  type: 'phrase',
  arabicInput: 'بسم الله الرحمن الرحيم',
  removeVowels: true,
  ignorePunctuation: true,
  system: 'maghribi',
};

const phraseResult = await EnhancedCalculatorEngine.calculate(phraseRequest);
console.log(phraseResult.phraseInsights?.themeDetection.dominantElement); // 'fire'
console.log(phraseResult.phraseInsights?.reflectionPrompts); // 3 questions
```

### 2. Core Normalization Functions

```typescript
import { EnhancedCalculatorEngine } from './services/EnhancedCalculatorEngine';

// Normalize Arabic text
const normalized = EnhancedCalculatorEngine.normalizeArabic('مُحَمَّد', {
  removeVowels: true,      // Remove tashkeel
  ignorePunctuation: true, // Remove punctuation
  ignoreSpaces: true,      // Remove spaces
});
// Result: "محمد"

// Normalize with letter form conversion
const text = 'إبراهيم'; // Alif hamza below
const norm = EnhancedCalculatorEngine.normalizeArabic(text, {
  removeVowels: true,
  ignorePunctuation: true,
  ignoreSpaces: true,
});
// Result: "ابراهيم" (normalized alif)
```

### 3. Using Calculation Type Selector

```tsx
import { CalculationTypeSelector } from './components/calculator/CalculationTypeSelector';
import { CalculationType } from './types/calculator-enhanced';

function MyComponent() {
  const [calcType, setCalcType] = useState<CalculationType>('name');
  
  return (
    <CalculationTypeSelector
      selectedType={calcType}
      onTypeChange={setCalcType}
    />
  );
}
```

### 4. Conditional Inputs Based on Type

```tsx
import { CalculatorInput } from './components/calculator/CalculatorInput';

function CalculatorScreen() {
  const [calcType, setCalcType] = useState<CalculationType>('name');
  const [arabicInput, setArabicInput] = useState('');
  const [yourName, setYourName] = useState('');
  const [motherName, setMotherName] = useState('');
  
  return (
    <CalculatorInput
      calculationType={calcType}
      onCalculationTypeChange={setCalcType}
      arabicInput={arabicInput}
      onArabicChange={setArabicInput}
      yourName={yourName}
      motherName={motherName}
      onYourNameChange={setYourName}
      onMotherNameChange={setMotherName}
      // ... other props
    />
  );
}
```

### 5. Accessing Type-Specific Insights

```typescript
// Name insights
if (result.type === 'name' && result.nameInsights) {
  const { archetypeTitle, spiritualGuidance, bestTimeWindow, powerDay } = result.nameInsights;
  console.log(`You are ${archetypeTitle}`);
  console.log(`Guidance: ${spiritualGuidance}`);
  console.log(`Best time: ${bestTimeWindow}`);
  console.log(`Power days: ${powerDay}`);
}

// Lineage insights
if (result.type === 'lineage' && result.lineageInsights) {
  const { yourNameValue, motherNameValue, combinedTotal, keyTakeaways, practicePlan } = result.lineageInsights;
  console.log(`Your name: ${yourNameValue}, Mother: ${motherNameValue}`);
  console.log(`Combined: ${combinedTotal}`);
  keyTakeaways.forEach(takeaway => console.log(`• ${takeaway}`));
}

// Phrase insights
if (result.type === 'phrase' && result.phraseInsights) {
  const { themeDetection, reflectionPrompts } = result.phraseInsights;
  console.log(`Dominant element: ${themeDetection.dominantElement}`);
  reflectionPrompts.forEach(prompt => console.log(`? ${prompt}`));
}

// Qur'an insights
if (result.type === 'quran' && result.quranInsights) {
  const { resonanceLink, quranComLink } = result.quranInsights;
  console.log(`Sacred number: ${resonanceLink.sacredNumber} - ${resonanceLink.meaning}`);
  if (quranComLink) console.log(`Read more: ${quranComLink}`);
}

// Dhikr insights
if (result.type === 'dhikr' && result.dhikrInsights) {
  const { suggestedCounts, practiceGuidance } = result.dhikrInsights;
  console.log(`Traditional counts: ${suggestedCounts.traditional.join(', ')}`);
  practiceGuidance.preparation.forEach(step => console.log(`✓ ${step}`));
}

// General insights
if (result.type === 'general' && result.generalInsights) {
  const { letterFrequencyChart, sacredResonance } = result.generalInsights;
  console.log(`Most frequent letter: ${letterFrequencyChart[0].letter}`);
  console.log(`Nearest sacred: ${sacredResonance.nearest} - ${sacredResonance.meaning}`);
}
```

### 6. Core Results (Always Available)

```typescript
// Every calculation has these core results
const { kabir, saghir, hadadMod4, burj, element, sirr, wusta, kamal, bast } = result.core;

console.log(`Kabīr (Total): ${kabir}`);
console.log(`Ṣaghīr (Digital Root): ${saghir}`);
console.log(`Ḥadad Mod-4: ${hadadMod4}`);
console.log(`Burj (Zodiac): ${burj}`);
console.log(`Element: ${element}`);
console.log(`Sirr (Secret): ${sirr}`);
console.log(`Wusṭā (Middle): ${wusta}`);
console.log(`Kamāl (Perfection): ${kamal}`);
console.log(`Basṭ (Expansion): ${bast}`);
```

### 7. Elemental Analytics (Always Available)

```typescript
const { letterFreq, elementPercents, dominantElement, weakElement, balanceScore } = result.analytics;

// Letter frequency
letterFreq.forEach(({ letter, count, value, element }) => {
  console.log(`${letter}: ${count}x (value: ${value}, element: ${element})`);
});

// Element composition
console.log(`Fire: ${elementPercents.fire}%`);
console.log(`Water: ${elementPercents.water}%`);
console.log(`Air: ${elementPercents.air}%`);
console.log(`Earth: ${elementPercents.earth}%`);

// Balance analysis
console.log(`Dominant: ${dominantElement}`);
console.log(`Weakest: ${weakElement || 'None (all present)'}`);
console.log(`Balance Score: ${balanceScore}%`);
```

### 8. Using Individual Adapters

```typescript
import {
  computeNameInsights,
  computeLineageInsights,
  computePhraseInsights,
} from './services/InsightAdapters';

// Name insights
const nameInsights = computeNameInsights(coreResults, analytics);

// Lineage insights
const lineageInsights = computeLineageInsights(
  123,  // yourNameValue
  456,  // motherNameValue
  'fire',  // yourElement
  'water', // motherElement
  combinedCore
);

// Phrase insights
const phraseInsights = computePhraseInsights(coreResults, analytics);
```

---

## TypeScript Type Guards

```typescript
import { EnhancedCalculationResult, CalculationType } from './types/calculator-enhanced';

function displayResult(result: EnhancedCalculationResult) {
  // Type guard for name insights
  if (result.type === 'name' && result.nameInsights) {
    // TypeScript knows nameInsights exists here
    const { archetypeTitle } = result.nameInsights;
    return <NameResultDisplay insights={result.nameInsights} />;
  }
  
  // Type guard for lineage insights
  if (result.type === 'lineage' && result.lineageInsights) {
    return <LineageResultDisplay insights={result.lineageInsights} />;
  }
  
  // ... other types
}
```

---

## Component Integration Example

```tsx
import React, { useState } from 'react';
import { EnhancedCalculatorEngine } from './services/EnhancedCalculatorEngine';
import { CalculationType, EnhancedCalculationResult } from './types/calculator-enhanced';
import { CalculatorInput } from './components/calculator/CalculatorInput';

export default function CalculatorScreen() {
  const [calcType, setCalcType] = useState<CalculationType>('name');
  const [arabicInput, setArabicInput] = useState('');
  const [result, setResult] = useState<EnhancedCalculationResult | null>(null);
  const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
  
  const handleCalculate = async () => {
    const request = {
      type: calcType,
      arabicInput,
      system,
    };
    
    const calculationResult = await EnhancedCalculatorEngine.calculate(request);
    setResult(calculationResult);
  };
  
  return (
    <View>
      <CalculatorInput
        calculationType={calcType}
        onCalculationTypeChange={setCalcType}
        arabicInput={arabicInput}
        onArabicChange={setArabicInput}
        onCalculate={handleCalculate}
        system={system}
        onSystemChange={setSystem}
        isLoading={false}
        // ... other props
      />
      
      {result && (
        <ResultDisplay result={result} />
      )}
    </View>
  );
}
```

---

## Constants Reference

```typescript
// Archetypes (1-9)
const ARCHETYPES = {
  1: 'The Pioneer',
  2: 'The Harmonizer',
  3: 'The Creator',
  4: 'The Builder',
  5: 'The Explorer',
  6: 'The Nurturer',
  7: 'The Seeker',
  8: 'The Achiever',
  9: 'The Sage',
};

// Element guidance
const ELEMENT_GUIDANCE = {
  fire: 'Passion and transformation...',
  water: 'Depth and intuition...',
  air: 'Clarity and communication...',
  earth: 'Stability and patience...',
};

// Best time windows
const BEST_TIME_WINDOWS = {
  fire: 'Dawn and sunrise (Fajr time)',
  water: 'Night and before sleep (Isha time)',
  air: 'Morning and afternoon (Dhuhr to Asr)',
  earth: 'Maghrib and grounding moments',
};

// Power days
const POWER_DAYS = {
  fire: 'Tuesday (Mars) and Sunday (Sun)',
  water: 'Monday (Moon) and Friday (Venus)',
  air: 'Wednesday (Mercury)',
  earth: 'Thursday (Jupiter) and Saturday (Saturn)',
};
```

---

This reference sheet provides quick copy-paste examples for all major features implemented in Phase 1.
