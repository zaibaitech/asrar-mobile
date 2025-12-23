# Asrār Everyday - Home Screen Implementation

## 📋 Overview

A professionally designed home screen featuring Islamic aesthetic principles with modern glassmorphism UI. Built with React Native, Expo SDK 54, and TypeScript.

## 🎨 Design Features

### Two-Tier Layout

1. **Primary Modules** (5 prominent cards)
   - Calculator (Abjad/numerology)
   - Name Destiny (name analysis)
   - Istikhara (spiritual consultation) ✅ *Active*
   - Compatibility (relationship analysis)
   - Divine Time (auspicious timing)

2. **Widget Bar** (4 quick access features)
   - Prayer Times
   - Daily Spiritual Quote
   - Quick Dhikr Counter (tap-to-increment)
   - Today's Blessed Day Reminder

### Visual Design

- **Glassmorphism Effects**: Semi-transparent backgrounds with subtle borders
- **Element-Based Theming**: Fire (red), Earth (brown/green), Air (cyan), Water (blue)
- **Arabic + English**: Bilingual labels with proper RTL considerations
- **Smooth Animations**: Spring physics for press interactions, glow effects
- **Dark Theme**: "Dark room with glowing embers" aesthetic for spiritual practices

## 📁 File Structure

```
components/home/
├── index.ts                          # Central exports
├── types.ts                          # TypeScript interfaces
├── ModuleCard.tsx                    # Primary module card component
├── WidgetBar.tsx                     # Widget container with horizontal scroll
├── QuickDhikrWidget.tsx              # Tap-to-increment dhikr counter
└── widgets/
    ├── PrayerTimesWidget.tsx         # Next prayer time display
    ├── DailyQuoteWidget.tsx          # Daily spiritual reminder
    └── BlessedDayWidget.tsx          # Today's blessed day info

app/(tabs)/
└── index.tsx                         # Main home screen
```

## 🛠 Component Architecture

### ModuleCard

**Purpose**: Primary feature cards with glassmorphism and element theming

**Key Features**:
- Element-based gradient backgrounds
- Accent bar on left edge (Islamic reading flow)
- Press animations with spring physics
- "Coming Soon" badge for unreleased features
- Subtle glow effects

**Props**:
```typescript
{
  title: string;                 // English title
  titleArabic: string;           // Arabic title
  description: string;           // Feature description
  icon: string;                  // Emoji icon
  element: ElementType;          // 'fire' | 'earth' | 'air' | 'water'
  onPress: () => void;           // Navigation handler
  comingSoon?: boolean;          // Disable if not yet available
}
```

**Cultural Significance**:
- Left accent bar follows right-to-left reading direction
- Symmetrical layout honors Islamic geometric principles
- Element associations based on traditional classifications

### WidgetBar

**Purpose**: Horizontal scrollable container for quick access features

**Key Features**:
- Smooth horizontal scrolling
- Fixed widget dimensions (160×140)
- Consistent glassmorphism styling
- Section header with title

### QuickDhikrWidget

**Purpose**: Tap-to-increment counter for dhikr (remembrance)

**Key Features**:
- Haptic feedback on tap (iOS & Android)
- Persistent count (AsyncStorage)
- Reset functionality
- Glow animation on increment
- Spring-based scale animation

**Spiritual Significance**:
- Encourages mindful remembrance throughout the day
- Tactile engagement through haptics
- Visual feedback reinforces spiritual practice

### Prayer Times Widget

**Purpose**: Display next prayer time with countdown

**Implementation Status**: Mock data (TODO: Integrate actual calculation)

**Requirements**:
- Location-based calculation
- Timezone awareness
- Support for multiple calculation methods

### Daily Quote Widget

**Purpose**: Rotating spiritual reminders

**Features**:
- Daily rotation based on day of year
- Arabic and English text
- Source attribution
- Compact display

**Current Quotes**:
1. Qur'an 13:28 - Hearts finding rest in remembrance
2. Hadith - Being beneficial to others
3. Islamic wisdom - Patience as key to relief

### Blessed Day Widget

**Purpose**: Show today's planetary and elemental associations

**Day-Element Mapping**:
- Sunday: Fire (Solar)
- Monday: Water (Lunar)
- Tuesday: Fire (Mars)
- Wednesday: Air (Mercury)
- Thursday: Air (Jupiter)
- Friday: Earth (Venus)
- Saturday: Earth (Saturn)

**Features**:
- Element-based color coding
- Arabic day names
- Planetary associations

## 🎭 Theming System

### Element Colors

```typescript
fire: {
  primary: '#FF6B6B',              // Coral red
  secondary: '#FF8A65',            // Salmon
  gradient: ['#FF6B6B', '#FF8A65', '#FFA07A'],
  glow: 'rgba(255, 107, 107, 0.2)',
}

earth: {
  primary: '#8B7355',              // Muted brown
  secondary: '#A0826D',            // Tan
  gradient: ['#8B7355', '#A0826D', '#B8956A'],
  glow: 'rgba(139, 115, 85, 0.2)',
}

air: {
  primary: '#64B5F6',              // Soft blue
  secondary: '#81D4FA',            // Light cyan
  gradient: ['#64B5F6', '#81D4FA', '#4FC3F7'],
  glow: 'rgba(100, 181, 246, 0.2)',
}

water: {
  primary: '#4FC3F7',              // Gentle teal
  secondary: '#26C6DA',            // Aqua
  gradient: ['#4FC3F7', '#26C6DA', '#00BCD4'],
  glow: 'rgba(79, 195, 247, 0.2)',
}
```

### Dark Theme Base

- **Screen Background**: `#1A1625` (Deep navy-purple)
- **Card Background**: `#2D1515` (Deep burgundy)
- **Text Primary**: `#FFFFFF` (Pure white)
- **Text Secondary**: `#E5E5E5` (Light gray)
- **Text Tertiary**: `#B0B0B0` (Medium gray)

## 🚀 Performance Optimizations

### FlatList Virtualization

```typescript
<FlatList
  removeClippedSubviews={Platform.OS === 'android'}
  maxToRenderPerBatch={3}
  updateCellsBatchingPeriod={50}
  windowSize={5}
/>
```

**Benefits**:
- Efficient rendering for large lists
- Reduced memory footprint
- Smooth scrolling on lower-end devices

### Component Memoization

- `useCallback` for render functions
- `useMemo` for header/footer components
- Prevents unnecessary re-renders

### Animation Optimization

- **react-native-reanimated**: All animations run on UI thread
- **Spring physics**: Natural, performant motion
- **Shared values**: Efficient animation state management

## 📱 Platform Considerations

### iOS
- Haptic feedback works out of the box
- Smooth animations with native drivers
- Safe area insets properly handled

### Android
- Elevation shadows for card depth
- Hardware acceleration for animations
- Remove clipped subviews for performance

### Cross-Platform
- Consistent visual appearance
- Graceful degradation of unsupported features
- Responsive layout for various screen sizes

## 🔄 Navigation

### Current Routes

```typescript
'/istikhara' → Istikhara module (active)
// Future routes to be added as modules are completed
```

### Adding New Modules

1. Update `handleModulePress` in [index.tsx](app/(tabs)/index.tsx)
2. Add route case for new module
3. Set `comingSoon: false` in MODULES array

## 🌍 Internationalization

### Supported Languages
- English (primary)
- Arabic (UI elements, spiritual terms)
- French (via translation system)

### Translation Keys Used
- `welcome.title`
- `nav.*`
- `common.*`

## 📝 Future Enhancements

### Widget Features
1. **Prayer Times**: Real calculation based on location
2. **Daily Quote**: Backend integration for larger database
3. **Dhikr Counter**: Cloud sync across devices
4. **Blessed Day**: Personalized recommendations based on user's element

### Module Expansion
1. Calculator module implementation
2. Name Destiny analysis
3. Compatibility checker
4. Divine Time calculator

### UI Improvements
1. Pull-to-refresh for widgets
2. Customizable widget order
3. Theme customization settings
4. Animation preferences

## 🎨 Design Guidelines

### Adding New Module Cards

```typescript
const newModule = {
  title: 'Module Name',
  titleArabic: 'اسم الوحدة',
  description: 'Clear, concise description',
  icon: '🎯',  // Relevant emoji
  element: 'fire',  // Choose appropriate element
  comingSoon: true,
};
```

### Creating New Widgets

1. Follow 160×140 dimension standard
2. Use glassmorphism styling pattern
3. Include icon and label
4. Implement press animation if interactive
5. Export from `widgets/` directory

## 🐛 Troubleshooting

### Animations Not Smooth
- Check react-native-reanimated configuration
- Ensure animations use `useSharedValue`
- Verify native module linking

### Widgets Not Updating
- Check AsyncStorage permissions
- Verify useEffect dependencies
- Ensure state updates trigger re-renders

### Theming Issues
- Confirm ThemeContext is wrapping components
- Verify element color mappings
- Check gradient array formatting

## 📚 Dependencies

**Core**:
- `react-native`: 0.81.5
- `expo`: ~54.0.30
- `typescript`: ~5.9.2

**Animation**:
- `react-native-reanimated`: ~4.1.1

**UI**:
- `expo-linear-gradient`: ^15.0.8
- `expo-haptics`: ~15.0.8

**Storage**:
- `@react-native-async-storage/async-storage`: 2.2.0

**Navigation**:
- `expo-router`: ~6.0.21

## 👨‍💻 Development

### Running the App

```bash
# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Testing Components

Individual components can be tested in isolation using Storybook or by temporarily importing them into a test screen.

## 📄 License

Part of the Asrār Everyday mobile application.

---

**Built with care for spiritual seekers worldwide** 🌙✨
