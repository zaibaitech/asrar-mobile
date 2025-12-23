# Home Screen Component API Reference

## 🧩 Component Exports

```typescript
// Main exports from components/home/index.ts
export { ModuleCard } from './ModuleCard';
export { QuickDhikrWidget } from './QuickDhikrWidget';
export { WidgetBar } from './WidgetBar';
export * from './types';
```

---

## 📦 ModuleCard

### Import

```typescript
import { ModuleCard } from '@/components/home';
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✓ | - | English module name |
| `titleArabic` | `string` | ✓ | - | Arabic module name |
| `description` | `string` | ✓ | - | Brief feature description |
| `icon` | `string` | ✓ | - | Emoji or icon identifier |
| `element` | `ElementType` | ✓ | - | `'fire'` \| `'earth'` \| `'air'` \| `'water'` |
| `onPress` | `() => void` | ✓ | - | Handler for card tap |
| `comingSoon` | `boolean` | ✗ | `false` | Disables interaction, shows badge |

### Usage Example

```typescript
<ModuleCard
  title="Istikhara"
  titleArabic="الاستخارة"
  description="Spiritual consultation combining prayer guidance with numerology"
  icon="🌙"
  element="water"
  onPress={() => router.push('/istikhara')}
  comingSoon={false}
/>
```

### Styling Customization

```typescript
// Override styles by wrapping in View
<View style={{ marginHorizontal: 24 }}>
  <ModuleCard {...props} />
</View>
```

### Animation Behavior

- **Press In**: Scale to 97%, opacity to 85%
- **Press Out**: Spring back to 100%, opacity to 100%
- **Timing**: Spring physics with damping 15
- **Disabled**: No animation when `comingSoon={true}`

### Accessibility

```typescript
// Automatic labels
accessibilityLabel={`${title} module`}
accessibilityHint={comingSoon ? "Coming soon" : "Tap to open"}
accessibilityRole="button"
```

---

## 📦 QuickDhikrWidget

### Import

```typescript
import { QuickDhikrWidget } from '@/components/home';
```

### Props

None - fully self-contained component.

### Usage Example

```typescript
<QuickDhikrWidget />
```

### State Management

**Internal State**:
```typescript
const [count, setCount] = useState(0);
```

**Persistence**:
```typescript
// Automatically saves to AsyncStorage
const STORAGE_KEY = '@asrar_quick_dhikr_count';
```

### Methods (Internal)

| Method | Trigger | Effect |
|--------|---------|--------|
| `handleIncrement` | Tap counter | Increment count, animate, haptic feedback |
| `handleReset` | Tap reset button | Clear count, remove from storage |
| `loadCount` | Component mount | Load saved count |
| `saveCount` | Count changes | Persist to AsyncStorage |

### Animation Behavior

**On Increment**:
```typescript
scale: 1.0 → 1.1 → 1.0 (spring)
glowOpacity: 0 → 0.8 → 0 (timing)
haptic: Light impact
```

### Customization

```typescript
// Change icon
<Text style={styles.icon}>🕌</Text> // Replace 📿

// Change colors
<View style={[styles.glow, { backgroundColor: '#your-color' }]} />
```

---

## 📦 WidgetBar

### Import

```typescript
import { WidgetBar } from '@/components/home';
```

### Props

None - contains all widgets internally.

### Usage Example

```typescript
<WidgetBar />
```

### Child Widgets

1. **PrayerTimesWidget** - Next prayer time
2. **DailyQuoteWidget** - Daily spiritual reminder
3. **QuickDhikrWidget** - Tap-to-increment counter
4. **BlessedDayWidget** - Today's blessed day

### Scroll Behavior

```typescript
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
/>
```

### Adding New Widget

```typescript
// In WidgetBar.tsx
<View style={styles.widgetWrapper}>
  <YourCustomWidget />
</View>
```

### Widget Wrapper Styles

```typescript
widgetWrapper: {
  width: 160,   // Standard width
  height: 140,  // Standard height
  ...Shadows.subtle,
}
```

---

## 📦 PrayerTimesWidget

### Import

```typescript
import { PrayerTimesWidget } from '@/components/home/widgets/PrayerTimesWidget';
```

### Props

None - self-contained.

### Current Implementation

**Mock Data**:
```typescript
{
  name: 'Maghrib',
  nameArabic: 'المغرب',
  time: '17:45',
}
```

### TODO: Real Implementation

```typescript
// Use prayer times library
import PrayerTimes from 'prayer-times';

const calculatePrayerTimes = (lat: number, lng: number, date: Date) => {
  const times = new PrayerTimes();
  // Implementation
};
```

---

## 📦 DailyQuoteWidget

### Import

```typescript
import { DailyQuoteWidget } from '@/components/home/widgets/DailyQuoteWidget';
```

### Props

None - self-contained.

### Quote Rotation Logic

```typescript
// Based on day of year
const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) 
  / 86400000
);
const quoteIndex = dayOfYear % DAILY_QUOTES.length;
```

### Adding Quotes

```typescript
// In DailyQuoteWidget.tsx
const DAILY_QUOTES = [
  {
    text: "English translation",
    textArabic: "النص العربي",
    source: "Source attribution",
  },
  // Add more...
];
```

---

## 📦 BlessedDayWidget

### Import

```typescript
import { BlessedDayWidget } from '@/components/home/widgets/BlessedDayWidget';
```

### Props

None - self-contained.

### Day-Element Mapping

```typescript
const DAYS_INFO = [
  { dayName: 'Sunday', dayNameArabic: 'الأحد', element: 'fire', blessing: '☀️ Solar' },
  // ... for each day of week
];
```

### Dynamic Styling

```typescript
// Border and badge color based on element
const accent = ElementAccents[dayInfo.element];
borderColor: `${accent.primary}40`
```

---

## 📦 Type Definitions

### ElementType

```typescript
type ElementType = 'fire' | 'earth' | 'air' | 'water';
```

### ModuleCardProps

```typescript
interface ModuleCardProps {
  title: string;
  titleArabic: string;
  description: string;
  icon: string;
  element: ElementType;
  onPress: () => void;
  comingSoon?: boolean;
}
```

### WidgetProps

```typescript
interface WidgetProps {
  title: string;
  value: string | number;
  icon: string;
  element?: ElementType;
  onPress?: () => void;
}
```

### DhikrCounterState

```typescript
interface DhikrCounterState {
  count: number;
  lastUpdated: Date;
}
```

### DailyQuote

```typescript
interface DailyQuote {
  text: string;
  textArabic?: string;
  source: string;
  date: string;
}
```

### BlessedDayInfo

```typescript
interface BlessedDayInfo {
  dayName: string;
  dayNameArabic: string;
  blessing: string;
  element: ElementType;
}
```

---

## 🎨 Theming Integration

### Using ThemeContext

```typescript
import { useTheme } from '@/contexts/ThemeContext';

const { element, accent, theme } = useTheme();

<View style={{ 
  backgroundColor: theme.cardBackground,
  borderColor: accent.primary,
}} />
```

### Using ElementAccents Directly

```typescript
import { ElementAccents } from '@/constants/DarkTheme';

const accent = ElementAccents['fire'];

<LinearGradient colors={accent.gradient} />
```

---

## 🔧 Performance Tips

### Memoization

```typescript
// In parent component
const renderItem = useCallback(({ item }) => (
  <ModuleCard {...item} onPress={() => handlePress(item.title)} />
), [handlePress]);

const ListHeader = useMemo(() => (
  <WelcomeSection />
), []);
```

### FlatList Optimization

```typescript
<FlatList
  data={modules}
  renderItem={renderItem}
  keyExtractor={(item) => item.title}
  removeClippedSubviews={Platform.OS === 'android'}
  maxToRenderPerBatch={3}
  windowSize={5}
/>
```

### AsyncStorage Best Practices

```typescript
// Batch operations
const saveMultiple = async () => {
  await AsyncStorage.multiSet([
    ['@key1', 'value1'],
    ['@key2', 'value2'],
  ]);
};

// Use try-catch
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  console.error('Storage error:', error);
}
```

---

## 🧪 Testing Examples

### Unit Test - ModuleCard

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ModuleCard } from '@/components/home';

describe('ModuleCard', () => {
  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ModuleCard
        title="Test"
        titleArabic="اختبار"
        description="Test description"
        icon="🧪"
        element="fire"
        onPress={onPress}
      />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
  
  it('does not call onPress when comingSoon is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ModuleCard {...props} comingSoon={true} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### Integration Test - QuickDhikrWidget

```typescript
describe('QuickDhikrWidget', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });
  
  it('increments count on tap', async () => {
    const { getByText } = render(<QuickDhikrWidget />);
    
    fireEvent.press(getByText('0'));
    
    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });
  });
  
  it('persists count to storage', async () => {
    const { getByText } = render(<QuickDhikrWidget />);
    
    fireEvent.press(getByText('0'));
    
    await waitFor(async () => {
      const saved = await AsyncStorage.getItem('@asrar_quick_dhikr_count');
      expect(saved).toBe('1');
    });
  });
});
```

---

## 🔌 Hooks Usage

### useLanguage

```typescript
const { language, setLanguage, t } = useLanguage();

<Text>{t('welcome.title')}</Text>
```

### useTheme

```typescript
const { element, accent, setElement } = useTheme();

<View style={{ borderColor: accent.primary }} />
```

### useRouter (Expo Router)

```typescript
const router = useRouter();

onPress={() => router.push('/istikhara')}
onPress={() => router.back()}
onPress={() => router.replace('/home')}
```

### useSafeAreaInsets

```typescript
const insets = useSafeAreaInsets();

<View style={{ 
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
}} />
```

---

## 📚 Common Patterns

### Creating a New Module

```typescript
// 1. Add to MODULES array
{
  title: 'Your Module',
  titleArabic: 'وحدتك',
  description: 'Description',
  icon: '🎯',
  element: 'air',
  comingSoon: false,
}

// 2. Add navigation handler
case 'Your Module':
  router.push('/your-module');
  break;

// 3. Create the screen
// app/(tabs)/your-module.tsx
export default function YourModuleScreen() {
  return <View>...</View>;
}
```

### Creating a New Widget

```typescript
// 1. Create widget file
// components/home/widgets/YourWidget.tsx

export function YourWidget() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎯</Text>
      <Text style={styles.label}>Your Widget</Text>
      <Text style={styles.value}>Value</Text>
    </View>
  );
}

// 2. Add to WidgetBar
import { YourWidget } from './widgets/YourWidget';

<View style={styles.widgetWrapper}>
  <YourWidget />
</View>
```

### Adding Haptic Feedback

```typescript
import * as Haptics from 'expo-haptics';

// Light tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// Medium tap
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Success notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Error notification
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

---

## 🐛 Debugging Tips

### Check AsyncStorage

```typescript
// View all keys
const keys = await AsyncStorage.getAllKeys();
console.log('Storage keys:', keys);

// View specific value
const value = await AsyncStorage.getItem('@asrar_quick_dhikr_count');
console.log('Dhikr count:', value);

// Clear all (careful!)
await AsyncStorage.clear();
```

### Debug Animations

```typescript
// Log shared value changes
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';

const scale = useSharedValue(1);

useAnimatedReaction(
  () => scale.value,
  (currentValue) => {
    console.log('Scale:', currentValue);
  }
);
```

### Check Navigation State

```typescript
import { useNavigationState } from '@react-navigation/native';

const state = useNavigationState(state => state);
console.log('Navigation state:', state);
```

---

## 📖 Further Reading

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Haptics API](https://docs.expo.dev/versions/latest/sdk/haptics/)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)

---

**Ready to extend and customize!** 🚀
