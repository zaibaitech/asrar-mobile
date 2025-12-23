# 🌳 Component Tree & File Structure

## Component Hierarchy

```
HomeScreen (app/(tabs)/index.tsx)
│
├─── LinearGradient (Background)
│    └─── FlatList
│         │
│         ├─── ListHeaderComponent
│         │    │
│         │    ├─── WelcomeSection
│         │    │    ├─── Text (Welcome Title)
│         │    │    └─── Text (Welcome Subtitle)
│         │    │
│         │    ├─── WidgetBar
│         │    │    ├─── Text (Section Title: "Quick Access")
│         │    │    └─── ScrollView (Horizontal)
│         │    │         ├─── PrayerTimesWidget
│         │    │         │    ├─── View (Container)
│         │    │         │    ├─── Text (🕌 Icon)
│         │    │         │    ├─── Text (Label: "Next Prayer")
│         │    │         │    ├─── Text (Prayer Name Arabic)
│         │    │         │    └─── Text (Time)
│         │    │         │
│         │    │         ├─── DailyQuoteWidget
│         │    │         │    ├─── View (Container)
│         │    │         │    ├─── Text (✨ Icon)
│         │    │         │    ├─── Text (Label: "Daily Reminder")
│         │    │         │    ├─── Text (Quote Arabic)
│         │    │         │    └─── Text (Source)
│         │    │         │
│         │    │         ├─── QuickDhikrWidget
│         │    │         │    ├─── View (Container)
│         │    │         │    ├─── Animated.View (Glow Effect)
│         │    │         │    ├─── AnimatedPressable (Counter)
│         │    │         │    │    ├─── Text (📿 Icon)
│         │    │         │    │    ├─── Animated.Text (Count)
│         │    │         │    │    └─── Text (Label: "Dhikr")
│         │    │         │    └─── Pressable (Reset Button - conditional)
│         │    │         │         └─── Text ("Reset")
│         │    │         │
│         │    │         └─── BlessedDayWidget
│         │    │              ├─── View (Container with dynamic border)
│         │    │              ├─── Text (Label: "Today's Blessing")
│         │    │              ├─── Text (Day Name Arabic)
│         │    │              ├─── Text (Blessing with emoji)
│         │    │              └─── View (Element Badge)
│         │    │                   └─── Text (Element Name)
│         │    │
│         │    └─── Text (Section Title: "Spiritual Modules")
│         │
│         └─── renderItem (Module Cards x5)
│              │
│              └─── ModuleCard
│                   ├─── AnimatedPressable
│                   │    └─── LinearGradient
│                   │         └─── View (Glass Overlay)
│                   │              ├─── View (Accent Bar)
│                   │              ├─── View (Content)
│                   │              │    ├─── View (Header Row)
│                   │              │    │    ├─── Text (Icon Emoji)
│                   │              │    │    └─── View (Title Container)
│                   │              │    │         ├─── Text (Title English)
│                   │              │    │         └─── Text (Title Arabic)
│                   │              │    │
│                   │              │    ├─── Text (Description)
│                   │              │    │
│                   │              │    ├─── View (Coming Soon Badge - conditional)
│                   │              │    │    └─── Text ("قريباً • Coming Soon")
│                   │              │    │
│                   │              │    └─── View (Glow Effect)
│                   │              │
│                   │              └─── [Shadow/Elevation styling]
```

## File Structure with Dependencies

```
📁 asrar-mobile/
│
├── 📁 app/
│   └── 📁 (tabs)/
│       └── 📄 index.tsx ⭐ HOME SCREEN
│           │
│           ├─── import { LinearGradient } from 'expo-linear-gradient'
│           ├─── import { useRouter } from 'expo-router'
│           ├─── import { useSafeAreaInsets } from 'react-native-safe-area-context'
│           ├─── import { ModuleCard, WidgetBar } from '@/components/home'
│           ├─── import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme'
│           └─── import { useLanguage } from '@/contexts/LanguageContext'
│
├── 📁 components/
│   └── 📁 home/
│       │
│       ├── 📄 index.ts (Central exports)
│       │   └─── export { ModuleCard, WidgetBar, QuickDhikrWidget }
│       │
│       ├── 📄 types.ts (TypeScript interfaces)
│       │   └─── ModuleCardProps, WidgetProps, DhikrCounterState, etc.
│       │
│       ├── 📄 ModuleCard.tsx ⭐ PRIMARY CARD COMPONENT
│       │   │
│       │   ├─── import { LinearGradient } from 'expo-linear-gradient'
│       │   ├─── import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
│       │   ├─── import { ElementAccents, DarkTheme, Borders, Shadows } from '@/constants/DarkTheme'
│       │   └─── import { ModuleCardProps } from './types'
│       │
│       ├── 📄 WidgetBar.tsx ⭐ WIDGET CONTAINER
│       │   │
│       │   ├─── import { ScrollView } from 'react-native'
│       │   ├─── import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme'
│       │   ├─── import { PrayerTimesWidget } from './widgets/PrayerTimesWidget'
│       │   ├─── import { DailyQuoteWidget } from './widgets/DailyQuoteWidget'
│       │   ├─── import { QuickDhikrWidget } from './QuickDhikrWidget'
│       │   └─── import { BlessedDayWidget } from './widgets/BlessedDayWidget'
│       │
│       ├── 📄 QuickDhikrWidget.tsx ⭐ DHIKR COUNTER
│       │   │
│       │   ├─── import AsyncStorage from '@react-native-async-storage/async-storage'
│       │   ├─── import * as Haptics from 'expo-haptics'
│       │   ├─── import Animated, { useAnimatedStyle, withSequence } from 'react-native-reanimated'
│       │   └─── import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme'
│       │
│       ├── 📄 README.md (Detailed documentation)
│       │
│       └── 📁 widgets/
│           │
│           ├── 📄 PrayerTimesWidget.tsx
│           │   └─── import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme'
│           │
│           ├── 📄 DailyQuoteWidget.tsx
│           │   └─── import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme'
│           │
│           └── 📄 BlessedDayWidget.tsx
│               ├─── import { DarkTheme, ElementAccents, Spacing } from '@/constants/DarkTheme'
│               └─── import { ElementType } from '@/contexts/ThemeContext'
│
├── 📁 constants/
│   ├── 📄 DarkTheme.ts (Theme system)
│   │   └─── ElementAccents, Typography, Spacing, Borders, Shadows
│   │
│   ├── 📄 ElementColors.ts (Element color mappings)
│   └── 📄 translations.ts (i18n strings)
│
├── 📁 contexts/
│   ├── 📄 ThemeContext.tsx (Element theming)
│   │   └─── useTheme, ElementType
│   │
│   └── 📄 LanguageContext.tsx (Internationalization)
│       └─── useLanguage, translations
│
└── 📁 (Documentation)
    ├── 📄 HOME_SCREEN_IMPLEMENTATION.md ⭐ Main summary
    ├── 📄 HOME_SCREEN_QUICKSTART.md (Getting started)
    ├── 📄 HOME_SCREEN_VISUAL_REFERENCE.md (Design specs)
    └── 📄 HOME_SCREEN_API_REFERENCE.md (Component API)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────┐
│         User Interaction                │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│    HomeScreen Component                 │
│    - Renders module list                │
│    - Handles navigation                 │
└─────────┬───────────────┬───────────────┘
          │               │
          ▼               ▼
┌──────────────────┐  ┌──────────────────┐
│   ModuleCard     │  │   WidgetBar      │
│   - Press detect │  │   - Scroll mgmt  │
│   - Animations   │  │   - Widget host  │
└────────┬─────────┘  └────┬─────────────┘
         │                 │
         ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│  ThemeContext    │  │  QuickDhikr      │
│  - Element color │  │  - Count state   │
│  - Accent data   │  │  - AsyncStorage  │
└──────────────────┘  │  - Haptics       │
                      └────┬─────────────┘
                           │
                           ▼
                      ┌──────────────────┐
                      │  AsyncStorage    │
                      │  - Persist count │
                      │  - Load on mount │
                      └──────────────────┘
```

## State Management

### Component-Level State

```
HomeScreen
└─── No internal state (uses callbacks and memoization)

ModuleCard
├─── scale: SharedValue<number>
└─── opacity: SharedValue<number>

QuickDhikrWidget
├─── count: number (useState)
├─── scale: SharedValue<number>
└─── glowOpacity: SharedValue<number>

PrayerTimesWidget
└─── nextPrayer: PrayerTime (useState)

DailyQuoteWidget
└─── quote: DailyQuote (useState)

BlessedDayWidget
└─── dayInfo: DayInfo (useState)
```

### Global State (Context)

```
ThemeContext
├─── element: ElementType
├─── setElement: (element) => void
├─── theme: DarkTheme
└─── accent: ElementAccent

LanguageContext
├─── language: 'en' | 'fr' | 'ar'
├─── setLanguage: (lang) => void
└─── t: (key) => string
```

### Persistent State (AsyncStorage)

```
@asrar_quick_dhikr_count → number (dhikr count)
@asrar_language → 'en' | 'fr' | 'ar'
```

## Animation Pipelines

### ModuleCard Press Animation

```
User Press
    ↓
handlePressIn()
    ↓
scale.value = withSpring(0.97, { damping: 15 })
opacity.value = withTiming(0.85, { duration: 100 })
    ↓
animatedStyle updates
    ↓
UI Thread renders (60fps)
    ↓
User Release
    ↓
handlePressOut()
    ↓
scale.value = withSpring(1.0, { damping: 15 })
opacity.value = withTiming(1.0, { duration: 100 })
    ↓
UI Thread renders spring back
```

### Dhikr Counter Tap Animation

```
User Tap
    ↓
Haptics.impactAsync(Light)
    ↓
setCount(prev => prev + 1)
    ↓
scale.value = withSequence(
    withSpring(1.1),
    withSpring(1.0)
)
    ↓
glowOpacity.value = withSequence(
    withTiming(0.8, { duration: 100 }),
    withTiming(0, { duration: 400 })
)
    ↓
animatedStyle updates
    ↓
UI Thread renders
    ↓
AsyncStorage.setItem(key, count)
```

## Rendering Pipeline

```
App Launch
    ↓
HomeScreen mounts
    ↓
FlatList initializes
    ↓
ListHeaderComponent renders
    ├─── WelcomeSection (immediate)
    └─── WidgetBar mounts
         ├─── PrayerTimesWidget (immediate)
         ├─── DailyQuoteWidget (immediate)
         ├─── QuickDhikrWidget
         │    └─── AsyncStorage.getItem() → loadCount()
         └─── BlessedDayWidget (immediate)
    ↓
FlatList renders initial batch (3 cards)
    ├─── ModuleCard #1 (Calculator)
    ├─── ModuleCard #2 (Name Destiny)
    └─── ModuleCard #3 (Istikhara)
    ↓
User scrolls
    ↓
FlatList renders next batch
    ├─── ModuleCard #4 (Compatibility)
    └─── ModuleCard #5 (Divine Time)
```

## Import Dependency Graph

```
index.tsx
    ├─── expo-linear-gradient
    ├─── expo-router
    ├─── react-native-safe-area-context
    ├─── components/home
    │    ├─── ModuleCard
    │    │    ├─── expo-linear-gradient
    │    │    ├─── react-native-reanimated
    │    │    ├─── constants/DarkTheme
    │    │    └─── contexts/ThemeContext
    │    │
    │    ├─── WidgetBar
    │    │    ├─── widgets/PrayerTimesWidget
    │    │    │    └─── constants/DarkTheme
    │    │    │
    │    │    ├─── widgets/DailyQuoteWidget
    │    │    │    └─── constants/DarkTheme
    │    │    │
    │    │    ├─── QuickDhikrWidget
    │    │    │    ├─── @react-native-async-storage/async-storage
    │    │    │    ├─── expo-haptics
    │    │    │    ├─── react-native-reanimated
    │    │    │    └─── constants/DarkTheme
    │    │    │
    │    │    └─── widgets/BlessedDayWidget
    │    │         ├─── constants/DarkTheme
    │    │         └─── contexts/ThemeContext
    │    │
    │    └─── types
    │
    ├─── constants/DarkTheme
    │    └─── ElementAccents, Typography, Spacing, Borders, Shadows
    │
    └─── contexts/LanguageContext
         └─── constants/translations
```

## Performance Optimization Points

```
HomeScreen
├─── useCallback for renderModuleCard
├─── useMemo for ListHeaderComponent
├─── useMemo for ListFooterComponent
├─── keyExtractor memoized
└─── FlatList optimizations
     ├─── removeClippedSubviews (Android)
     ├─── maxToRenderPerBatch: 3
     ├─── updateCellsBatchingPeriod: 50
     └─── windowSize: 5

ModuleCard
├─── AnimatedPressable (prevents re-renders)
├─── useSharedValue (UI thread)
├─── withSpring (native driver)
└─── withTiming (native driver)

QuickDhikrWidget
├─── useSharedValue for animations
├─── Haptics on UI thread
└─── AsyncStorage batched writes
```

---

## 🎯 Summary

**Total Components**: 7 main + 3 sub-widgets = **10 components**  
**Total Props Interfaces**: **6 TypeScript interfaces**  
**Animation Instances**: **3 unique animation patterns**  
**Context Providers**: **2 (Theme + Language)**  
**Storage Keys**: **1 (Dhikr counter)**  

**Complexity**: Medium (well-structured, maintainable)  
**Performance**: Optimized (60fps animations, virtualized list)  
**Scalability**: High (easy to add modules/widgets)

---

*Component tree complete and ready for navigation* 🌳✨
