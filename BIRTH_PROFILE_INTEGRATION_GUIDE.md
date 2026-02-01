# Birth Profile Integration Guide

## Overview
This guide shows how to integrate the Birth Profile calculator into the existing Calculator screen.

## Integration Steps

### 1. Import Components and Types

In `/app/calculator.tsx`:

```tsx
import { BirthProfileInput, BirthProfileData } from '../components/calculator/BirthProfileInput';
import { BirthProfileResults } from '../components/calculator/results/BirthResultSection';
import { calculateBirthProfile, validateBirthInput } from '../services/BirthProfileService';
import type { BirthInsights } from '../types/calculator-enhanced';
```

### 2. Add State Management

```tsx
const [calculationType, setCalculationType] = useState<CalculationType>('name');

// Add birth profile state
const [birthData, setBirthData] = useState<BirthProfileData>({
  dateOfBirth: null,
  timeOfBirth: null,
  timeKnown: false,
  placeCity: '',
  placeLatitude: '',
  placeLongitude: '',
  placeTimezone: '',
  linkWithName: false,
  arabicName: '',
  motherName: '',
});

// Add birth insights state
const [birthInsights, setBirthInsights] = useState<BirthInsights | null>(null);
```

### 3. Update Calculate Handler

```tsx
const handleCalculate = async () => {
  setIsLoading(true);
  setCalculationResult(null);
  setBirthInsights(null);

  try {
    // Handle birth profile calculation
    if (calculationType === 'birth') {
      const validation = validateBirthInput({
        dateOfBirth: birthData.dateOfBirth!,
        timeOfBirth: birthData.timeOfBirth ?? undefined,
        timeKnown: birthData.timeKnown,
        placeOfBirth: {
          city: birthData.placeCity,
          latitude: parseFloat(birthData.placeLatitude),
          longitude: parseFloat(birthData.placeLongitude),
          timezone: birthData.placeTimezone,
        },
        arabicName: birthData.linkWithName ? birthData.arabicName : undefined,
        motherName: birthData.linkWithName ? birthData.motherName : undefined,
      });

      if (!validation.valid) {
        Alert.alert('Validation Error', validation.errors.join('\n'));
        setIsLoading(false);
        return;
      }

      const insights = await calculateBirthProfile({
        dateOfBirth: birthData.dateOfBirth!,
        timeOfBirth: birthData.timeOfBirth ?? undefined,
        timeKnown: birthData.timeKnown,
        placeOfBirth: {
          city: birthData.placeCity,
          latitude: parseFloat(birthData.placeLatitude),
          longitude: parseFloat(birthData.placeLongitude),
          timezone: birthData.placeTimezone,
        },
        arabicName: birthData.linkWithName ? birthData.arabicName : undefined,
        motherName: birthData.linkWithName ? birthData.motherName : undefined,
      });

      setBirthInsights(insights);
      setActiveTab('results');
      setIsLoading(false);
      return;
    }

    // ... existing calculation logic for other types
  } catch (error) {
    console.error('Calculation error:', error);
    Alert.alert('Calculation Error', 'Unable to calculate. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Add Input Rendering

In the Input tab, add a case for birth profile:

```tsx
// Inside CalculatorInput component or main render
{calculationType === 'birth' && (
  <BirthProfileInput
    data={birthData}
    onChange={setBirthData}
  />
)}
```

### 5. Add Results Rendering

In the Results tab:

```tsx
{activeTab === 'results' && (
  <ScrollView style={styles.resultsContainer}>
    {calculationType === 'birth' && birthInsights ? (
      <BirthProfileResults insights={birthInsights} />
    ) : calculationResult ? (
      // ... existing results display
      <EnhancedResultsDisplay result={calculationResult} />
    ) : (
      <Text style={styles.noResults}>
        {t('calculator.noResults')}
      </Text>
    )}
  </ScrollView>
)}
```

### 6. Update Can Calculate Logic

```tsx
const canCalculate = () => {
  switch (calculationType) {
    case 'birth':
      return (
        birthData.dateOfBirth !== null &&
        birthData.placeLatitude !== '' &&
        birthData.placeLongitude !== '' &&
        birthData.placeTimezone !== '' &&
        (!birthData.timeKnown || birthData.timeOfBirth !== null)
      );
    
    // ... other cases
    default:
      return false;
  }
};
```

## Complete Example

Here's a complete minimal integration:

```tsx
import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { CalculationTypeSelector } from '../components/calculator/CalculationTypeSelector';
import { BirthProfileInput, BirthProfileData } from '../components/calculator/BirthProfileInput';
import { BirthProfileResults } from '../components/calculator/results/BirthResultSection';
import { calculateBirthProfile, validateBirthInput } from '../services/BirthProfileService';
import type { CalculationType, BirthInsights } from '../types/calculator-enhanced';

export default function CalculatorScreen() {
  const [calculationType, setCalculationType] = useState<CalculationType>('birth');
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [isLoading, setIsLoading] = useState(false);
  
  const [birthData, setBirthData] = useState<BirthProfileData>({
    dateOfBirth: null,
    timeOfBirth: null,
    timeKnown: false,
    placeCity: '',
    placeLatitude: '',
    placeLongitude: '',
    placeTimezone: '',
    linkWithName: false,
  });
  
  const [birthInsights, setBirthInsights] = useState<BirthInsights | null>(null);

  const handleCalculate = async () => {
    if (calculationType !== 'birth') return;

    setIsLoading(true);
    setBirthInsights(null);

    const validation = validateBirthInput({
      dateOfBirth: birthData.dateOfBirth!,
      timeOfBirth: birthData.timeOfBirth ?? undefined,
      timeKnown: birthData.timeKnown,
      placeOfBirth: {
        city: birthData.placeCity,
        latitude: parseFloat(birthData.placeLatitude),
        longitude: parseFloat(birthData.placeLongitude),
        timezone: birthData.placeTimezone,
      },
    });

    if (!validation.valid) {
      Alert.alert('Validation Error', validation.errors.join('\n'));
      setIsLoading(false);
      return;
    }

    try {
      const insights = await calculateBirthProfile({
        dateOfBirth: birthData.dateOfBirth!,
        timeOfBirth: birthData.timeOfBirth ?? undefined,
        timeKnown: birthData.timeKnown,
        placeOfBirth: {
          city: birthData.placeCity,
          latitude: parseFloat(birthData.placeLatitude),
          longitude: parseFloat(birthData.placeLongitude),
          timezone: birthData.placeTimezone,
        },
      });

      setBirthInsights(insights);
      setActiveTab('results');
    } catch (error) {
      Alert.alert('Error', 'Calculation failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const canCalculate = 
    birthData.dateOfBirth !== null &&
    birthData.placeLatitude !== '' &&
    birthData.placeLongitude !== '' &&
    birthData.placeTimezone !== '' &&
    (!birthData.timeKnown || birthData.timeOfBirth !== null);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Type Selector */}
      <CalculationTypeSelector 
        selectedType={calculationType}
        onTypeChange={setCalculationType}
      />

      {/* Tabs */}
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <TouchableOpacity onPress={() => setActiveTab('input')}>
          <Text style={{ color: activeTab === 'input' ? '#fff' : '#666' }}>
            Input
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('results')}>
          <Text style={{ color: activeTab === 'results' ? '#fff' : '#666' }}>
            Results
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView>
        {activeTab === 'input' && (
          <>
            <BirthProfileInput data={birthData} onChange={setBirthData} />
            
            <TouchableOpacity
              onPress={handleCalculate}
              disabled={!canCalculate || isLoading}
              style={{
                backgroundColor: canCalculate && !isLoading ? '#6366f1' : '#333',
                padding: 16,
                margin: 20,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {isLoading ? 'Calculating...' : 'Calculate'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'results' && birthInsights && (
          <BirthProfileResults insights={birthInsights} />
        )}
      </ScrollView>
    </View>
  );
}
```

## Error Handling

### Validation Errors
```tsx
const validation = validateBirthInput(input);
if (!validation.valid) {
  // Show user-friendly error
  Alert.alert('Please check:', validation.errors.join('\n'));
  return;
}
```

### Calculation Errors
```tsx
try {
  const insights = await calculateBirthProfile(input);
  setBirthInsights(insights);
} catch (error) {
  if (error.message.includes('ephemeris')) {
    Alert.alert('Astronomical data unavailable', 'Please check your internet connection');
  } else {
    Alert.alert('Calculation error', 'Please verify your input and try again');
  }
}
```

## State Persistence (Optional)

To persist birth data across app restarts:

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save on change
useEffect(() => {
  AsyncStorage.setItem('birthData', JSON.stringify(birthData));
}, [birthData]);

// Load on mount
useEffect(() => {
  AsyncStorage.getItem('birthData').then(data => {
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      if (parsed.dateOfBirth) {
        parsed.dateOfBirth = new Date(parsed.dateOfBirth);
      }
      if (parsed.timeOfBirth) {
        parsed.timeOfBirth = new Date(parsed.timeOfBirth);
      }
      setBirthData(parsed);
    }
  });
}, []);
```

## Performance Optimization

### Debounce Input
```tsx
import { useDebounce } from '../hooks/useDebounce';

const debouncedBirthData = useDebounce(birthData, 500);

useEffect(() => {
  // Validate on debounced changes
  const validation = validateBirthInput(debouncedBirthData);
  setValidationErrors(validation.errors);
}, [debouncedBirthData]);
```

### Memoize Expensive Calculations
```tsx
const canCalculate = useMemo(() => {
  return (
    birthData.dateOfBirth !== null &&
    birthData.placeLatitude !== '' &&
    // ... etc
  );
}, [birthData]);
```

## Testing Integration

```tsx
// Test that birth type is selectable
expect(screen.getByText('Birth Profile')).toBeTruthy();

// Test that input form renders
fireEvent.press(screen.getByText('Birth Profile'));
expect(screen.getByText('Date of Birth')).toBeTruthy();

// Test calculation button is disabled when invalid
expect(screen.getByText('Calculate')).toBeDisabled();

// Fill valid data and test calculation
// ... assertions
```

## Next Steps

1. ✅ Add birth profile to calculator screen
2. ✅ Test with real ephemeris data
3. ✅ Add loading states and error handling
4. ⏳ Add caching for calculated profiles
5. ⏳ Add export/share functionality
6. ⏳ Integrate name-birth resonance calculation

## Common Issues

**Issue:** "DateTimePicker not showing"
- **Solution:** Ensure `@react-native-community/datetimepicker` is installed

**Issue:** "Ephemeris request fails"
- **Solution:** Check internet connection, verify date is in range (1900-2100)

**Issue:** "Ascendant always undefined"
- **Solution:** Verify `timeKnown` is `true` and `timeOfBirth` is provided

**Issue:** "Translations missing"
- **Solution:** Run `i18n:check` script or verify keys in `translations.ts`
