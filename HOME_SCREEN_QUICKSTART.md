# Home Screen Quick Start Guide

## 🚀 Getting Started

Your new home screen is ready! Here's what you need to know to start using and customizing it.

## ✅ What's Already Working

### ✨ Active Features

1. **Istikhara Module** - Fully functional, tap to navigate
2. **Quick Dhikr Counter** - Tap to increment, auto-saves count
3. **Daily Quote Widget** - Rotates daily based on date
4. **Blessed Day Widget** - Shows today's element and planetary association
5. **Prayer Times Widget** - Displays mock data (needs integration)

### 🎨 Visual Effects

- ✅ Glassmorphism backgrounds
- ✅ Element-based color theming
- ✅ Smooth press animations
- ✅ Haptic feedback on dhikr counter
- ✅ Responsive layout with safe area insets

## 🎯 How to Use

### Navigate to Istikhara

1. Open the app
2. Tap the "Istikhara" card (🌙 icon)
3. You'll be taken to the Istikhara form

### Use Quick Dhikr Counter

1. Find the widget bar below the welcome message
2. Scroll horizontally to the "📿 Dhikr" widget
3. Tap to increment count
4. Tap "Reset" to clear (when count > 0)
5. Count is automatically saved

### View Daily Quote

1. Scroll to the "✨ Daily Reminder" widget
2. Quote changes daily automatically
3. Shows Arabic text and source

## 🛠 Customization Guide

### Add a New Module

1. Open [app/(tabs)/index.tsx](app/(tabs)/index.tsx)
2. Add to `MODULES` array:

```typescript
{
  title: 'Your Module',
  titleArabic: 'وحدتك',
  description: 'Description here',
  icon: '🎯',
  element: 'fire', // or 'earth', 'air', 'water'
  comingSoon: false, // true to disable
}
```

3. Add navigation in `handleModulePress`:

```typescript
case 'Your Module':
  router.push('/your-route');
  break;
```

### Change Element Colors

Edit [constants/DarkTheme.ts](constants/DarkTheme.ts):

```typescript
fire: {
  primary: '#FF6B6B',     // Change this
  secondary: '#FF8A65',   // And this
  // ...
}
```

### Add a New Widget

1. Create file: `components/home/widgets/YourWidget.tsx`
2. Copy structure from existing widget
3. Add to [WidgetBar.tsx](components/home/WidgetBar.tsx):

```typescript
<View style={styles.widgetWrapper}>
  <YourWidget />
</View>
```

### Modify Welcome Message

In [app/(tabs)/index.tsx](app/(tabs)/index.tsx):

```typescript
<Text style={styles.welcomeTitle}>
  Your Custom Title
</Text>
<Text style={styles.welcomeSubtitle}>
  Your custom subtitle
</Text>
```

## 🔧 Configuration

### Widget Dimensions

Default: 160×140 pixels

To change, edit [WidgetBar.tsx](components/home/WidgetBar.tsx):

```typescript
widgetWrapper: {
  width: 180,    // Adjust width
  height: 160,   // Adjust height
}
```

### Module Card Spacing

Edit [components/home/ModuleCard.tsx](components/home/ModuleCard.tsx):

```typescript
container: {
  marginHorizontal: Spacing.screenPadding,  // Side margins
  marginVertical: Spacing.sm,               // Top/bottom margins
}
```

### Animation Speed

In [ModuleCard.tsx](components/home/ModuleCard.tsx):

```typescript
scale.value = withSpring(0.97, { 
  damping: 15  // Higher = slower, lower = faster
});
```

## 📱 Testing

### Test on Device

```bash
# iOS
npm run ios

# Android
npm run android

# Expo Go app
npm start
# Scan QR code with Expo Go
```

### Test Specific Features

**Dhikr Counter**:
1. Tap widget multiple times
2. Close app completely
3. Reopen - count should persist

**Navigation**:
1. Tap each module card
2. Verify correct navigation or "Coming Soon" state

**Animations**:
1. Press and hold module cards
2. Observe scale-down effect
3. Release and observe spring-back

## 🎨 Styling Tips

### Glassmorphism Effect

Key properties:
- Semi-transparent background: `rgba(45, 21, 21, 0.4)`
- Border with low opacity: `rgba(255, 255, 255, 0.1)`
- Gradient overlay with element colors

### Element Selection Guide

- **Fire** 🔥: Action, transformation, energy (Calculator, Divine Time)
- **Earth** 🌱: Stability, growth, grounding (Name Destiny)
- **Air** 💨: Communication, intellect, connection (Compatibility)
- **Water** 💧: Emotion, intuition, spirituality (Istikhara)

## 🐛 Common Issues

### Widgets Not Scrolling

Check if `horizontal` prop is set:
```typescript
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
```

### Animations Laggy

1. Ensure `react-native-reanimated` is properly installed
2. Check that animations use `useSharedValue`
3. Run on physical device (simulator may be slow)

### AsyncStorage Errors

Add permission in `app.json`:
```json
{
  "expo": {
    "plugins": [
      "@react-native-async-storage/async-storage"
    ]
  }
}
```

### Cards Not Aligned

Check container margins in [index.tsx](app/(tabs)/index.tsx):
```typescript
scrollContent: {
  flexGrow: 1,
}
```

## 📊 Performance Tips

### Large Number of Modules

FlatList is already configured for virtualization. It will handle 20+ modules efficiently.

### Optimize Images

If adding images to widgets:
1. Use optimized formats (WebP on Android, HEIF on iOS)
2. Load images lazily
3. Cache with `expo-cached-image`

### Reduce Re-renders

Components are already memoized. If adding new ones:
```typescript
const MyComponent = React.memo(({ prop }) => {
  // Component code
});
```

## 🌐 Internationalization

### Add Translation

1. Edit [constants/translations.ts](constants/translations.ts)
2. Add key under each language:

```typescript
en: {
  home: {
    yourKey: "Your text"
  }
}
```

3. Use in component:
```typescript
const { t } = useLanguage();
<Text>{t('home.yourKey')}</Text>
```

## 📚 Next Steps

### Immediate
1. ✅ Test on physical device
2. ✅ Verify dhikr counter persistence
3. ✅ Check all navigation flows

### Short Term
1. 🔄 Implement real prayer times calculation
2. 🔄 Expand daily quotes database
3. 🔄 Add more modules (Calculator, Name Destiny)

### Long Term
1. 📱 Add widget customization settings
2. 🌐 Backend integration for quotes
3. ☁️ Cloud sync for dhikr counter

## 🎓 Learning Resources

### React Native Reanimated
- [Official Docs](https://docs.swmansion.com/react-native-reanimated/)
- Used for smooth animations

### Expo Haptics
- [Official Docs](https://docs.expo.dev/versions/latest/sdk/haptics/)
- Adds tactile feedback

### AsyncStorage
- [Official Docs](https://react-native-async-storage.github.io/async-storage/)
- Persistent key-value storage

---

**Ready to build!** 🚀

If you have questions, refer to the main [README.md](README.md) for detailed component documentation.
