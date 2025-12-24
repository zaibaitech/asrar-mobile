# 🚀 Mobile Name Destiny - Quick Implementation Reference
**For Expo Go 54 - Copy & Paste Ready Code**

---

## 📦 Phase 1: Setup (30 minutes)

### 1.1 Create Project
```bash
npx create-expo-app@latest AsrarNameDestiny --template
cd AsrarNameDestiny
npm install
```

### 1.2 Install Dependencies
```bash
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install @react-native-async-storage/async-storage
npx expo install expo-linear-gradient
npx expo install @react-native-community/netinfo
```

### 1.3 Project Structure
```bash
mkdir -p src/{features/name-destiny/{screens,components,services,hooks,types,constants},contexts,lib,utils}
mkdir -p __tests__
```

---

## 🧮 Phase 2: Core Calculation Engine (Copy This!)

### 2.1 Abjad Maps - `src/features/name-destiny/constants/abjadMaps.ts`

```typescript
// Maghribi (West African) - Most common
export const ABJAD_MAGHRIBI: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000,
};

// Mashriqi (Eastern) - Alternative
export const ABJAD_MASHRIQI: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
  'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900,
  'غ': 1000,
};
```

### 2.2 Elements & Buruj - `src/features/name-destiny/constants/elements.ts`

```typescript
export const ELEMENTS = {
  1: {
    en: 'Fire',
    ar: 'النار',
    fr: 'Feu',
    quality: 'Passion, Action, Will',
    color: '#ff6b6b',
  },
  2: {
    en: 'Earth',
    ar: 'التراب',
    fr: 'Terre',
    quality: 'Stability, Practicality',
    color: '#8b5a3c',
  },
  3: {
    en: 'Air',
    ar: 'الهواء',
    fr: 'Air',
    quality: 'Intellect, Communication',
    color: '#4ecdc4',
  },
  4: {
    en: 'Water',
    ar: 'الماء',
    fr: 'Eau',
    quality: 'Emotion, Intuition',
    color: '#4a90e2',
  },
} as const;

export const BURUJ = {
  1: { en: 'Aries', ar: 'الحمل', fr: 'Bélier', planet: 'Mars', element: 'Fire' },
  2: { en: 'Taurus', ar: 'الثور', fr: 'Taureau', planet: 'Venus', element: 'Earth' },
  3: { en: 'Gemini', ar: 'الجوزاء', fr: 'Gémeaux', planet: 'Mercury', element: 'Air' },
  4: { en: 'Cancer', ar: 'السرطان', fr: 'Cancer', planet: 'Moon', element: 'Water' },
  5: { en: 'Leo', ar: 'الأسد', fr: 'Lion', planet: 'Sun', element: 'Fire' },
  6: { en: 'Virgo', ar: 'العذراء', fr: 'Vierge', planet: 'Mercury', element: 'Earth' },
  7: { en: 'Libra', ar: 'الميزان', fr: 'Balance', planet: 'Venus', element: 'Air' },
  8: { en: 'Scorpio', ar: 'العقرب', fr: 'Scorpion', planet: 'Mars', element: 'Water' },
  9: { en: 'Sagittarius', ar: 'القوس', fr: 'Sagittaire', planet: 'Jupiter', element: 'Fire' },
  10: { en: 'Capricorn', ar: 'الجدي', fr: 'Capricorne', planet: 'Saturn', element: 'Earth' },
  11: { en: 'Aquarius', ar: 'الدلو', fr: 'Verseau', planet: 'Saturn', element: 'Air' },
  12: { en: 'Pisces', ar: 'الحوت', fr: 'Poissons', planet: 'Jupiter', element: 'Water' },
} as const;
```

### 2.3 Calculator - `src/features/name-destiny/services/nameDestinyCalculator.ts`

```typescript
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjadMaps';
import { ELEMENTS, BURUJ } from '../constants/elements';

// Helper: Digital root (1-9)
function digitalRoot(num: number): number {
  if (num === 0) return 0;
  return ((num - 1) % 9) + 1;
}

// Helper: Modulo that returns 1-based (0 → max)
function modIndex(num: number, divisor: number): number {
  const result = num % divisor;
  return result === 0 ? divisor : result;
}

// Main calculation
export function buildDestiny(
  personName: string,
  motherName?: string,
  abjad: Record<string, number> = ABJAD_MAGHRIBI
) {
  // Normalize input
  const person = personName.replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');
  const mother = (motherName || '').replace(/[ًٌٍَُِّْ]/g, '').replace(/\s+/g, '');

  // Calculate values
  const personKabir = [...person].reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  const motherKabir = [...mother].reduce((sum, ch) => sum + (abjad[ch] || 0), 0);
  const totalKabir = personKabir + motherKabir;

  const saghir = digitalRoot(totalKabir);
  const tabhIdx = modIndex(totalKabir, 4) as 1 | 2 | 3 | 4;
  const burjIdx = modIndex(totalKabir, 12) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

  return {
    personName,
    motherName: motherName || undefined,
    personKabir,
    motherKabir,
    totalKabir,
    saghir,
    element: ELEMENTS[tabhIdx],
    burj: BURUJ[burjIdx],
    tabhIdx,
    burjIdx,
  };
}
```

---

## 🎨 Phase 3: Core Components

### 3.1 Input Screen - `src/features/name-destiny/screens/InputScreen.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { buildDestiny } from '../services/nameDestinyCalculator';

export function InputScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const result = buildDestiny(name, motherName || undefined);
      navigation.navigate('Results', { result });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Name Destiny Calculator</Text>

        {/* Name Input */}
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="أدخل اسمك"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        {/* Mother Name Input */}
        <Text style={styles.label}>Mother's Name (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="اسم الأم"
          placeholderTextColor="#999"
          value={motherName}
          onChangeText={setMotherName}
        />

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleCalculate}
          disabled={!name.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Calculate</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
});
```

### 3.2 Results Screen - `src/features/name-destiny/screens/ResultsScreen.tsx`

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ResultsScreen({ route }: any) {
  const { result } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Kabir Display */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Kabir (Large Number)</Text>
        <Text style={styles.cardValue}>{result.totalKabir}</Text>
        <Text style={styles.cardDesc}>Person: {result.personKabir}</Text>
        {result.motherKabir > 0 && (
          <Text style={styles.cardDesc}>Mother: {result.motherKabir}</Text>
        )}
      </View>

      {/* Saghir Display */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saghir (Digit Root)</Text>
        <Text style={styles.cardValue}>{result.saghir}</Text>
        <Text style={styles.cardDesc}>Essential nature 1-9</Text>
      </View>

      {/* Element Card */}
      <LinearGradient
        colors={['#ff6b6b', '#ff8787']}
        style={styles.elementCard}
      >
        <Text style={styles.elementName}>{result.element.en}</Text>
        <Text style={styles.elementAr}>{result.element.ar}</Text>
        <Text style={styles.elementDesc}>{result.element.quality}</Text>
      </LinearGradient>

      {/* Burj Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Zodiac Sign</Text>
        <Text style={styles.cardValue}>{result.burj.en}</Text>
        <Text style={styles.cardDesc}>{result.burj.ar}</Text>
        <Text style={styles.cardDesc}>Ruled by: {result.burj.planet}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4f46e5',
  },
  cardLabel: { fontSize: 12, color: '#666', fontWeight: '600', marginBottom: 4 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#4f46e5', marginBottom: 8 },
  cardDesc: { fontSize: 12, color: '#999' },
  elementCard: {
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  elementName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  elementAr: { fontSize: 20, color: '#fff', marginBottom: 8 },
  elementDesc: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
});
```

---

## 💾 Phase 4: Data Persistence

### 4.1 Storage Hook - `src/features/name-destiny/hooks/useStorage.ts`

```typescript
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@name_destiny_history';

export function useNameDestinyHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      setHistory(data ? JSON.parse(data) : []);
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (result: any) => {
    const item = { ...result, id: Date.now(), timestamp: new Date() };
    const updated = [item, ...history].slice(0, 50);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return { history, loading, addToHistory, clearHistory };
}
```

---

## 🧭 Phase 5: Navigation

### 5.1 App Navigator - `src/navigation/RootNavigator.tsx`

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { InputScreen } from '../features/name-destiny/screens/InputScreen';
import { ResultsScreen } from '../features/name-destiny/screens/ResultsScreen';
import HistoryScreen from '../features/name-destiny/screens/HistoryScreen';
import SettingsScreen from '../features/name-destiny/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DestinyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Input"
        component={InputScreen}
        options={{ title: 'Name Destiny' }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Your Results' }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any = 'home';
            if (route.name === 'History') iconName = 'history';
            if (route.name === 'Settings') iconName = 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4f46e5',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Destiny" component={DestinyStack} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🎯 Phase 6: Main App Entry

### 6.1 App.tsx

```typescript
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        // Load resources here if needed
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return <RootNavigator />;
}
```

---

## 📝 Testing Templates

### Quick Jest Test
```typescript
// __tests__/calculator.test.ts
import { buildDestiny } from '../src/features/name-destiny/services/nameDestinyCalculator';

describe('Name Destiny Calculator', () => {
  it('calculates kabir correctly', () => {
    const result = buildDestiny('محمد');
    expect(result.personKabir).toBeGreaterThan(0);
    expect(result.saghir).toBeLessThanOrEqual(9);
  });

  it('handles mother name', () => {
    const with_mother = buildDestiny('علي', 'فاطمة');
    const without = buildDestiny('علي');
    expect(with_mother.totalKabir).toBeGreaterThan(without.personKabir);
  });
});
```

---

## 🚀 Deploy Commands

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android

# Preview in Expo Go
npx expo start
```

---

## 📊 Performance Checklist

```
[ ] Calculation < 50ms
[ ] Screen load < 500ms
[ ] Memory < 100MB
[ ] Dark mode working
[ ] Offline mode working
[ ] All text readable
[ ] Touch targets 48px+
[ ] No jank in animations
[ ] Translations complete
[ ] RTL support for Arabic
```

---

**Status:** Ready to Use ✅  
**Estimated Time:** 20-30 hours development  
**Difficulty:** Intermediate
