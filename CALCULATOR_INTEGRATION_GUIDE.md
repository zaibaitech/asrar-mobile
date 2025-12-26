# Calculator Integration Guide - Phases 1 & 2

## Quick Start: Using the Enhanced Calculator

### 1. Import Required Components

```typescript
// Main calculator screen
import { CalculatorInput } from './components/calculator/CalculatorInput';
import { EnhancedResultsDisplay } from './components/calculator/EnhancedResultsDisplay';
import { DivineNamesPicker } from './components/calculator/DivineNamesPicker';
import { SurahAyahSelector } from './components/calculator/SurahAyahSelector';

// Types
import { EnhancedCalculationResult, CalculationType } from './types/calculator-enhanced';

// Engine
import { EnhancedCalculatorEngine } from './services/EnhancedCalculatorEngine';
```

### 2. Set Up State

```typescript
const [calculationType, setCalculationType] = useState<CalculationType>('name');
const [arabicInput, setArabicInput] = useState('');
const [latinInput, setLatinInput] = useState('');
const [yourName, setYourName] = useState('');
const [motherName, setMotherName] = useState('');
const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
const [result, setResult] = useState<EnhancedCalculationResult | null>(null);
const [isLoading, setIsLoading] = useState(false);

// For pickers
const [showDivineNamesPicker, setShowDivineNamesPicker] = useState(false);
const [showSurahPicker, setShowSurahPicker] = useState(false);
const [selectedSurah, setSelectedSurah] = useState<number>();
const [selectedAyah, setSelectedAyah] = useState<number>();
```

### 3. Handle Calculation

```typescript
const handleCalculate = async () => {
  setIsLoading(true);
  try {
    const request: CalculationRequest = {
      type: calculationType,
      arabicInput,
      latinInput,
      yourName,
      motherName,
      surahNumber: selectedSurah,
      ayahNumber: selectedAyah,
      system,
      removeVowels: true,
      ignorePunctuation: true,
    };
    
    const calculationResult = await EnhancedCalculatorEngine.calculate(request);
    setResult(calculationResult);
  } catch (error) {
    console.error('Calculation error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Render Components

```typescript
return (
  <View style={styles.container}>
    {/* Input Screen */}
    <CalculatorInput
      calculationType={calculationType}
      onCalculationTypeChange={setCalculationType}
      arabicInput={arabicInput}
      latinInput={latinInput}
      onArabicChange={setArabicInput}
      onLatinChange={setLatinInput}
      yourName={yourName}
      motherName={motherName}
      onYourNameChange={setYourName}
      onMotherNameChange={setMotherName}
      system={system}
      onSystemChange={setSystem}
      onCalculate={handleCalculate}
      isLoading={isLoading}
    />
    
    {/* Results Screen */}
    {result && (
      <EnhancedResultsDisplay result={result} />
    )}
    
    {/* Pickers (in modals/drawers) */}
    <Modal visible={showDivineNamesPicker}>
      <DivineNamesPicker
        onSelectName={(name) => {
          setArabicInput(name.arabic);
          setShowDivineNamesPicker(false);
        }}
      />
    </Modal>
    
    <Modal visible={showSurahPicker}>
      <SurahAyahSelector
        onSelect={(surah, ayah) => {
          setSelectedSurah(surah);
          setSelectedAyah(ayah);
          setShowSurahPicker(false);
        }}
      />
    </Modal>
  </View>
);
```

---

## Full Example: Complete Calculator Screen

```typescript
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { CalculatorInput } from '../components/calculator/CalculatorInput';
import { EnhancedResultsDisplay } from '../components/calculator/EnhancedResultsDisplay';
import { DivineNamesPicker } from '../components/calculator/DivineNamesPicker';
import { SurahAyahSelector } from '../components/calculator/SurahAyahSelector';
import { EnhancedCalculatorEngine } from '../services/EnhancedCalculatorEngine';
import { 
  CalculationRequest,
  CalculationType, 
  EnhancedCalculationResult 
} from '../types/calculator-enhanced';

export default function EnhancedCalculatorScreen() {
  // State
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [calculationType, setCalculationType] = useState<CalculationType>('name');
  const [arabicInput, setArabicInput] = useState('');
  const [latinInput, setLatinInput] = useState('');
  const [yourName, setYourName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
  const [result, setResult] = useState<EnhancedCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pickers
  const [showDivineNamesPicker, setShowDivineNamesPicker] = useState(false);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState<number>();
  const [selectedAyah, setSelectedAyah] = useState<number>();
  
  // Handlers
  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const request: CalculationRequest = {
        type: calculationType,
        arabicInput,
        latinInput,
        yourName: calculationType === 'lineage' ? yourName : undefined,
        motherName: calculationType === 'lineage' ? motherName : undefined,
        surahNumber: calculationType === 'quran' ? selectedSurah : undefined,
        ayahNumber: calculationType === 'quran' ? selectedAyah : undefined,
        system,
        removeVowels: true,
        ignorePunctuation: true,
      };
      
      const calculationResult = await EnhancedCalculatorEngine.calculate(request);
      setResult(calculationResult);
      setActiveTab('results');
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openDivineNamesPicker = () => {
    if (calculationType === 'dhikr') {
      setShowDivineNamesPicker(true);
    }
  };
  
  const openSurahPicker = () => {
    if (calculationType === 'quran') {
      setShowSurahPicker(true);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('input')}>
          <Text>Input</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('results')} disabled={!result}>
          <Text>Results</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === 'input' ? (
        <ScrollView>
          <CalculatorInput
            calculationType={calculationType}
            onCalculationTypeChange={setCalculationType}
            arabicInput={arabicInput}
            latinInput={latinInput}
            onArabicChange={setArabicInput}
            onLatinChange={setLatinInput}
            yourName={yourName}
            motherName={motherName}
            onYourNameChange={setYourName}
            onMotherNameChange={setMotherName}
            system={system}
            onSystemChange={setSystem}
            onCalculate={handleCalculate}
            isLoading={isLoading}
          />
          
          {/* Picker Buttons */}
          {calculationType === 'dhikr' && (
            <TouchableOpacity onPress={openDivineNamesPicker}>
              <Text>Choose Divine Name</Text>
            </TouchableOpacity>
          )}
          
          {calculationType === 'quran' && (
            <TouchableOpacity onPress={openSurahPicker}>
              <Text>Select Surah & Ayah</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        result && <EnhancedResultsDisplay result={result} />
      )}
      
      {/* Modals */}
      <Modal
        visible={showDivineNamesPicker}
        animationType="slide"
        onRequestClose={() => setShowDivineNamesPicker(false)}
      >
        <DivineNamesPicker
          onSelectName={(name) => {
            setArabicInput(name.arabic);
            setShowDivineNamesPicker(false);
          }}
        />
      </Modal>
      
      <Modal
        visible={showSurahPicker}
        animationType="slide"
        onRequestClose={() => setShowSurahPicker(false)}
      >
        <SurahAyahSelector
          selectedSurah={selectedSurah}
          selectedAyah={selectedAyah}
          onSelect={(surah, ayah) => {
            setSelectedSurah(surah);
            setSelectedAyah(ayah);
            setShowSurahPicker(false);
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
});
```

---

## Migration from Old Calculator

### Before (Phase 0)
```typescript
// Old way
import { CalculatorService } from './services/CalculatorService';
import { CalculationResult } from './types/calculator';

const result = await CalculatorService.calculate(input, system);
// Result only has: kabir, saghir, hadath, element, burj
```

### After (Phases 1 & 2)
```typescript
// New way
import { EnhancedCalculatorEngine } from './services/EnhancedCalculatorEngine';
import { EnhancedCalculationResult } from './types/calculator-enhanced';

const result = await EnhancedCalculatorEngine.calculate(request);
// Result has:
//   - core: All 9 numeric values
//   - analytics: Letter frequency, element composition
//   - type-specific insights: nameInsights, lineageInsights, etc.
```

---

## Key Differences

| Feature | Old | New |
|---------|-----|-----|
| Input | Single string | Type-specific request object |
| Calculation | Basic | Type-routed with adapters |
| Results | Generic | Type-specific sections |
| UI | One result display | 6 specialized displays |
| Data | None | Divine names + Qur'an datasets |
| Insights | None | Rich, contextual insights |

---

## TypeScript Type Guards

```typescript
function handleResult(result: EnhancedCalculationResult) {
  // Always available
  console.log(result.core.kabir);
  console.log(result.analytics.balanceScore);
  
  // Type-specific (with guards)
  if (result.type === 'name' && result.nameInsights) {
    console.log(result.nameInsights.archetypeTitle);
  }
  
  if (result.type === 'lineage' && result.lineageInsights) {
    console.log(result.lineageInsights.familyPattern.harmony);
  }
  
  // etc.
}
```

---

## Best Practices

### 1. Always Use Type Guards
```typescript
// Good ✅
if (result.type === 'name' && result.nameInsights) {
  // TypeScript knows nameInsights exists
}

// Bad ❌
if (result.nameInsights) {
  // May cause runtime errors
}
```

### 2. Handle Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

const calculate = async () => {
  setIsLoading(true);
  try {
    const result = await EnhancedCalculatorEngine.calculate(request);
    setResult(result);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Validate Inputs
```typescript
const canCalculate = () => {
  switch (calculationType) {
    case 'lineage':
      return yourName.trim() && motherName.trim();
    case 'quran':
      return selectedSurah && selectedAyah;
    default:
      return arabicInput.trim() || latinInput.trim();
  }
};
```

---

## Testing Examples

```typescript
// Test name calculation
const nameRequest: CalculationRequest = {
  type: 'name',
  arabicInput: 'محمد',
  system: 'maghribi',
};

const result = await EnhancedCalculatorEngine.calculate(nameRequest);
expect(result.type).toBe('name');
expect(result.nameInsights).toBeDefined();
expect(result.nameInsights?.archetypeTitle).toBeTruthy();

// Test lineage calculation
const lineageRequest: CalculationRequest = {
  type: 'lineage',
  yourName: 'أحمد',
  motherName: 'فاطمة',
  system: 'maghribi',
};

const lineageResult = await EnhancedCalculatorEngine.calculate(lineageRequest);
expect(lineageResult.lineageInsights?.familyPattern).toBeDefined();
```

---

## Troubleshooting

### Issue: "nameInsights is undefined"
**Solution**: Check type guard
```typescript
if (result.type === 'name' && result.nameInsights) {
  // Now safe
}
```

### Issue: "Divine names not showing"
**Solution**: Ensure database is imported
```typescript
import { findDivineNamesByValue } from './data/divine-names';
```

### Issue: "Balance score still showing 0%"
**Solution**: Make sure using Phase 1's fixed formula in `ElementalComposition.tsx`

---

## Performance Tips

1. **Lazy Load Pickers**: Only render pickers when needed
2. **Memoize Results**: Use `useMemo` for expensive computations
3. **Virtualize Lists**: Use `FlatList` for long lists (already done in pickers)
4. **Optimize Re-renders**: Use `React.memo` for result section components

---

## Next Steps

1. Test all calculation types
2. Verify divine names matching
3. Test Qur'an link generation
4. Check jump navigation
5. Validate reflection notes storage (if implementing)
6. Add translations (if needed)
7. Deploy! 🚀

---

**Complete Integration**: Both phases work together seamlessly. The calculator is now a full ʿIlm al-Asrār tool! ✨
