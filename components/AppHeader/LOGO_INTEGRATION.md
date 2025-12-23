# Logo Integration - Quick Reference

## ✨ Logo in Centered Header

The sacred geometry Asrār logo is now integrated into the centered variant, perfectly aligned with the dark theme gradient.

### Visual Preview

```
┌───────────────────────────────────────────────┐
│  Gradient Background (#0f172a → #1e1b4b)      │
├───────────────────────────────────────────────┤
│                                               │
│    [☰]      ✦ Asrār        [EN│FR]           │
│              ↑                                │
│         Sacred geometry                       │
│       (8-pointed star)                        │
│                                               │
└───────────────────────────────────────────────┘
```

## Logo Specifications

### Design Elements
```
Sacred Geometry Components:
┌─────────────────────────────────┐
│  ✦  8-pointed star (Octagram)  │ ← Divine order
│  ○○○  3 concentric rings       │ ← أسرار = 462 → 3
│  •••  3 dots in triangle       │ ← Body, soul, spirit
│  ⌒   Subtle Ayn curve          │ ← Source/spring
│  ⊙   Center eye + dot          │ ← The "seed"
└─────────────────────────────────┘
```

### Color & Size
```typescript
Logo Properties:
├─ Size: 28px (compact, balanced)
├─ Color: rgba(255, 255, 255, 0.9)
├─ Position: Left of title
├─ Gap: 8px
└─ Alignment: Centered vertically
```

### Why This Color Works

**Dark Theme Requirements:**
- ❌ Dark logo on dark gradient = invisible
- ❌ Bright purple (#6B21A8) = too harsh, breaks calm aesthetic
- ✅ **White/light (rgba(255, 255, 255, 0.9))** = perfect visibility + soft elegance

**Visual Harmony:**
```
Background:  ████████  #0f172a (dark navy)
Logo:        ████████  rgba(255,255,255,0.9) (soft white)
Title:       ████████  #FFFFFF (pure white)
Language:    ████████  #6B5CA5 (muted purple)

↑ Graduated brightness creates depth
```

## Implementation

### In AppHeader.tsx

```tsx
<AsrarLogo 
  size={28} 
  variant="icon" 
  element="aether" 
  mono={true}
  monoColor="rgba(255, 255, 255, 0.9)"
/>
```

### New AsrarLogo Props

**Added `monoColor` prop:**
```typescript
interface AsrarLogoProps {
  // ... other props
  mono?: boolean;
  monoColor?: string;  // ← NEW: Custom monochrome color
}
```

**Usage:**
- `mono={true}` - Switches to monochrome mode
- `monoColor="..."` - Custom color (overrides default #6B21A8)

## Visual Comparison

### Before (No Logo)
```
┌─────────────────────────────┐
│  [☰]    Asrār    [EN│FR]   │
└─────────────────────────────┘
↑ Clean but lacks identity
```

### After (With Logo)
```
┌─────────────────────────────┐
│  [☰]   ✦ Asrār   [EN│FR]   │
└─────────────────────────────┘
↑ Spiritual identity + brand recognition
```

## Why Sacred Geometry?

The 8-pointed star (Octagram) connects to:

1. **Islamic Tradition**
   - Geometric patterns in Islamic art
   - Number 8 symbolism (8 gates of paradise)
   - Mathematical harmony

2. **ʿIlm al-Ḥurūf (Science of Letters)**
   - Sacred geometry foundations
   - Divine proportions
   - Numerical symbolism (3 rings, 3 dots)

3. **Visual Balance**
   - Symmetrical design
   - Centered composition
   - Spiritual gravitas

## Layout Details

### Title Row Structure

```tsx
<View style={styles.titleRow}>
  <AsrarLogo size={28} ... />  // 28px
  {/* 8px gap */}
  <Text style={styles.centeredTitle}>Asrār</Text>  // 20px font
</View>
```

### Spacing

```
Logo (28px) + Gap (8px) + Title (~60px) = ~96px total
```

### Vertical Alignment

```
centerSection (flex: 1, centered)
  └─ titleRow (flexDirection: row, gap: 8)
       ├─ AsrarLogo (28px × 28px)
       └─ Text (20px font, semi-bold)
```

## Dark Theme Harmony

### Color Hierarchy
```
1. Background gradient    ████  Darkest (recedes)
2. Logo outline          ████  Soft white (visible but calm)
3. Title text            ████  Pure white (emphasis)
4. Language accent       ████  Muted purple (interaction)
```

### Opacity Levels
```
Logo:         0.9  ← Slightly softer than text
Title:        1.0  ← Full opacity
Subtitle:     0.6  ← Faded
Icons:        0.7  ← Medium visibility
```

## Accessibility

**Logo serves multiple purposes:**
- ✅ Visual branding
- ✅ Spiritual identity marker
- ✅ Cultural authenticity
- ✅ Geometric balance
- ⚠️ Decorative (not interactive)

**Note:** Logo is decorative SVG, not accessible to screen readers. The title "Asrār" provides the text identity.

## Testing Checklist

- ✅ Logo visible on dark gradient background
- ✅ 28px size balanced with 20px title
- ✅ 8px gap provides breathing room
- ✅ White color (0.9 opacity) soft but clear
- ✅ Centered alignment with title
- ✅ No layout shift on subtitle toggle
- ✅ Sacred geometry details visible at small size
- ✅ Works on iOS notch devices
- ✅ Works on Android nav bar devices

## Result

The logo integration:
- ✅ Strengthens spiritual brand identity
- ✅ Maintains dark theme harmony
- ✅ Provides visual anchor for centered layout
- ✅ Connects to ʿIlm al-Ḥurūf traditions
- ✅ Balances modern UX with sacred aesthetics

---

**One-sentence summary:** The sacred geometry logo (white, 28px) perfectly complements the centered dark theme header, providing spiritual identity while maintaining visual harmony with the Home page gradient.
