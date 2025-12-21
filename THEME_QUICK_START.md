# Quick Start Guide: Using the Dark Theme System

## 🚀 Quick Start (5 Minutes)

### 1. Import the Theme
```tsx
import { DarkTheme, ElementAccents, Spacing, Borders, Shadows, Typography } from '../constants/DarkTheme';
```

### 2. Get Your Element's Accent Colors
```tsx
// In your component
const elementKey = data.burujProfile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
const accent = ElementAccents[elementKey];
```

### 3. Apply to Your Styles
```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  card: {
    backgroundColor: DarkTheme.cardBackground,
    borderColor: accent.primary,
    borderWidth: Borders.standard,
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  header: {
    color: accent.primary,
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
  },
  body: {
    color: DarkTheme.textSecondary,
    fontSize: Typography.body,
    lineHeight: Typography.body * Typography.lineHeightNormal,
  },
});
```

---

## 📚 Common Patterns

### Standard Card
```tsx
<View style={[styles.card, { borderColor: accent.primary }]}>
  <View style={styles.cardHeader}>
    <IconComponent size={24} color={accent.primary} />
    <Text style={styles.cardTitle}>Title Here</Text>
  </View>
  <Text style={styles.cardBody}>Body content here...</Text>
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: DarkTheme.cardBackground,
    borderWidth: Borders.standard,
    borderRadius: Borders.radiusLg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  cardBody: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
});
```

### Emphasized Card (with left accent bar)
```tsx
<View style={[
  styles.card, 
  { 
    borderColor: accent.primary,
    borderLeftWidth: Borders.accent,
    borderLeftColor: accent.primary 
  }
]}>
  {/* Content */}
</View>
```

### Button
```tsx
<TouchableOpacity 
  style={[styles.button, { backgroundColor: accent.primary }]}
  onPress={handlePress}
>
  <Icon size={20} color={DarkTheme.textPrimary} />
  <Text style={styles.buttonText}>Action</Text>
</TouchableOpacity>

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Borders.radiusMd,
  },
  buttonText: {
    color: DarkTheme.textPrimary,
    fontSize: Typography.body,
    fontWeight: Typography.weightBold,
  },
});
```

### Progress Bar
```tsx
<View style={styles.progressContainer}>
  <View style={[styles.progressBackground, { backgroundColor: DarkTheme.cardBackgroundAlt }]}>
    <View style={[
      styles.progressFill, 
      { width: `${progress}%`, backgroundColor: accent.primary }
    ]} />
  </View>
  <Text style={styles.progressText}>{progress}%</Text>
</View>

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
  },
  progressBackground: {
    height: 12,
    borderRadius: Borders.radiusSm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
    textAlign: 'center',
  },
});
```

### Badge/Tag
```tsx
<View style={[styles.badge, { 
  backgroundColor: accent.glow, 
  borderColor: accent.primary 
}]}>
  <Icon size={16} color={accent.primary} />
  <Text style={[styles.badgeText, { color: accent.primary }]}>Tag</Text>
</View>

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Borders.radiusSm,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: Typography.caption,
    fontWeight: Typography.weightSemibold,
  },
});
```

### Expandable Section
```tsx
const [isExpanded, setIsExpanded] = useState(false);

<TouchableOpacity 
  style={[styles.card, { borderColor: accent.primary }]}
  onPress={() => setIsExpanded(!isExpanded)}
>
  <View style={styles.headerRow}>
    <View style={styles.titleSection}>
      <Icon size={24} color={accent.primary} />
      <Text style={styles.title}>Section Title</Text>
    </View>
    {isExpanded ? (
      <ChevronUp size={20} color={accent.primary} />
    ) : (
      <ChevronDown size={20} color={accent.primary} />
    )}
  </View>
  
  {isExpanded && (
    <View style={styles.expandedContent}>
      <Text style={styles.contentText}>Expanded content...</Text>
    </View>
  )}
</TouchableOpacity>

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  expandedContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DarkTheme.borderSubtle,
  },
  contentText: {
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
    lineHeight: Typography.body * Typography.lineHeightRelaxed,
  },
});
```

---

## 🎨 Color Decision Tree

### "What color should I use?"

```
Is it an ICON or HEADER?
  ├─ YES → Use accent.primary
  └─ NO → Continue...

Is it a BORDER?
  ├─ YES → Use accent.primary
  └─ NO → Continue...

Is it a BACKGROUND?
  ├─ Card → Use DarkTheme.cardBackground
  ├─ Screen → Use DarkTheme.screenBackground
  ├─ Nested → Use DarkTheme.cardBackgroundAlt
  └─ NO → Continue...

Is it TEXT?
  ├─ Main heading → Use DarkTheme.textPrimary (white)
  ├─ Body text → Use DarkTheme.textSecondary (light gray)
  ├─ Label/subtitle → Use DarkTheme.textTertiary (medium gray)
  ├─ De-emphasized → Use DarkTheme.textMuted (dark gray)
  └─ Special emphasis → Use accent.primary

Is it a PROGRESS/FILL element?
  ├─ Fill → Use accent.primary
  ├─ Background → Use DarkTheme.cardBackgroundAlt
  └─ NO → Continue...

When in doubt → Use DarkTheme colors, NOT accent colors
```

---

## ✅ Do's and Don'ts

### ✅ DO:
```tsx
// Use accent colors for icons
<Star size={24} color={accent.primary} />

// Use accent colors for borders
borderColor: accent.primary

// Use dark backgrounds
backgroundColor: DarkTheme.cardBackground

// Use white/gray for text
color: DarkTheme.textSecondary

// Use consistent spacing
marginBottom: Spacing.lg

// Use shadow constants
...Shadows.card
```

### ❌ DON'T:
```tsx
// Don't use accent colors for backgrounds
backgroundColor: accent.primary  // ❌

// Don't use gradients
<LinearGradient colors={[accent.primary, accent.secondary]}>  // ❌

// Don't use hardcoded colors
color: '#FF6B6B'  // ❌

// Don't use random spacing
marginBottom: 17  // ❌ Use Spacing constants

// Don't mix color systems
color: '#ef4444'  // ❌ Use DarkTheme or accent
```

---

## 🔧 Helper Functions

### Get Complete Theme for Element
```tsx
import { getElementTheme } from '../constants/DarkTheme';

const theme = getElementTheme('fire');
// Returns: { ...DarkTheme, accent: ElementAccents.fire }
```

### Create Card Style
```tsx
import { createCardStyle } from '../constants/DarkTheme';

const cardStyle = createCardStyle('fire', false);
// Returns complete card style object
```

### Create Accent Bar Card
```tsx
import { createAccentBarCard } from '../constants/DarkTheme';

const accentCard = createAccentBarCard('fire');
// Returns card with left accent bar
```

### Get Text Style
```tsx
import { getTextStyle } from '../constants/DarkTheme';

const headingStyle = getTextStyle('h2', accent.primary);
// Returns typography style for H2 with accent color
```

---

## 🎯 Common Mistakes

### Mistake #1: Using Accent for Large Areas
```tsx
// ❌ WRONG
<View style={{ backgroundColor: accent.primary }}>
  <Text>Lots of content...</Text>
</View>

// ✅ CORRECT
<View style={{ backgroundColor: DarkTheme.cardBackground, borderColor: accent.primary, borderWidth: 2 }}>
  <Text style={{ color: accent.primary }}>Header</Text>
  <Text style={{ color: DarkTheme.textSecondary }}>Lots of content...</Text>
</View>
```

### Mistake #2: Hardcoding Colors
```tsx
// ❌ WRONG
const styles = StyleSheet.create({
  text: { color: '#FFFFFF' },
});

// ✅ CORRECT
const styles = StyleSheet.create({
  text: { color: DarkTheme.textPrimary },
});
```

### Mistake #3: Ignoring Typography System
```tsx
// ❌ WRONG
const styles = StyleSheet.create({
  header: { fontSize: 23, fontWeight: '650' },
});

// ✅ CORRECT
const styles = StyleSheet.create({
  header: { 
    fontSize: Typography.h2, 
    fontWeight: Typography.weightSemibold 
  },
});
```

### Mistake #4: Random Spacing
```tsx
// ❌ WRONG
const styles = StyleSheet.create({
  container: { padding: 17, marginBottom: 13 },
});

// ✅ CORRECT
const styles = StyleSheet.create({
  container: { 
    padding: Spacing.lg, 
    marginBottom: Spacing.md 
  },
});
```

---

## 🧪 Testing Your Implementation

### Visual Check
```bash
# 1. View in different lighting
- ☐ Bright sunlight
- ☐ Indoor lighting
- ☐ Dark room

# 2. Check all element themes
- ☐ Fire (coral red)
- ☐ Earth (muted brown)
- ☐ Air (soft blue)
- ☐ Water (gentle teal)

# 3. Verify contrast
- ☐ Headers readable
- ☐ Body text comfortable
- ☐ Icons visible
- ☐ Borders clear
```

### Code Check
```bash
# 1. No hardcoded colors
grep -r "color: '#" components/  # Should return nothing

# 2. Using theme constants
grep -r "DarkTheme" components/  # Should find usage

# 3. No gradients
grep -r "LinearGradient" components/  # Should return nothing

# 4. Consistent spacing
grep -r "Spacing\." components/  # Should find usage
```

---

## 📖 Reference

### All Available Constants

```tsx
// Colors
DarkTheme.screenBackground
DarkTheme.cardBackground
DarkTheme.cardBackgroundAlt
DarkTheme.cardBackgroundLight
DarkTheme.textPrimary
DarkTheme.textSecondary
DarkTheme.textTertiary
DarkTheme.textMuted
DarkTheme.borderSubtle
DarkTheme.shadowColor

// Element Accents
accent.primary
accent.secondary
accent.gradient
accent.glow
accent.emoji

// Typography
Typography.h1, h2, h3
Typography.body
Typography.label
Typography.caption
Typography.weightLight, weightRegular, weightMedium, weightSemibold, weightBold
Typography.lineHeightTight, lineHeightNormal, lineHeightRelaxed

// Spacing
Spacing.xs, sm, md, lg, xl, xxl, xxxl
Spacing.screenPadding
Spacing.cardMargin
Spacing.cardPadding
Spacing.sectionGap
Spacing.elementGap

// Borders
Borders.standard
Borders.emphasized
Borders.accent
Borders.radiusSm, radiusMd, radiusLg, radiusXl, radiusCircle

// Shadows
Shadows.card
Shadows.subtle
Shadows.strong
```

---

## 🎓 Advanced Usage

### Dynamic Element Switching
```tsx
const [element, setElement] = useState<'fire' | 'earth' | 'air' | 'water'>('fire');

const switchElement = (newElement) => {
  Animated.timing(accentColor, {
    toValue: 0,
    duration: 300,
  }).start(() => {
    setElement(newElement);
    Animated.timing(accentColor, {
      toValue: 1,
      duration: 300,
    }).start();
  });
};
```

### Persisting Theme Preference
```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('elementTheme', element);

// Load
const savedElement = await AsyncStorage.getItem('elementTheme');
if (savedElement) {
  setElement(savedElement as ElementType);
}
```

---

## 🚨 Need Help?

### Common Issues

**Q: My accent colors aren't showing**
```tsx
// Check you're getting the element correctly
const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
console.log(elementKey); // Should be: fire, earth, air, or water
```

**Q: Text is hard to read**
```tsx
// Make sure you're using the right text color
<Text style={{ color: DarkTheme.textSecondary }}>  // ✅
<Text style={{ color: accent.primary }}>  // ❌ (only for headers)
```

**Q: Cards look flat**
```tsx
// Add shadows
const styles = StyleSheet.create({
  card: {
    ...Shadows.card,  // ← Don't forget this!
  },
});
```

---

**Ready to implement?** Start with a simple card and build up from there!
