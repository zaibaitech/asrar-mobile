# Visual Design Reference - AppHeader Variants

## Quick Visual Comparison

### 1️⃣ Centered Variant (Recommended for Spiritual Screens)

```
┌─────────────────────────────────────────────┐
│ Gradient: #0f172a → #1e1b4b → rgba(...)    │
├─────────────────────────────────────────────┤
│                                             │
│  [☰]        ✦ Asrār         [EN│FR]        │ ← 56px height
│                                             │
└─────────────────────────────────────────────┘
    ↑           ↑                  ↑
  Menu      Logo+Title         Language
  icon    (sacred geometry)    (#6B5CA5)
```

**Features:**
- ✅ Same gradient as Home page
- ✅ Sacred geometry logo (8-pointed star)
- ✅ White logo color (rgba(255, 255, 255, 0.9))
- ✅ Centered "Asrār" title
- ✅ Muted purple buttons (#6B5CA5)
- ✅ Compact 56px height
- ✅ No hard borders
- ✅ Subtle shadow only

**Best For:**
- Home screen
- Istikhara
- Prayer Times
- Any spiritual context

---

### 2️⃣ Centered + Subtitle

```
┌─────────────────────────────────────────────┐
│ Gradient: #0f172a → #1e1b4b → rgba(...)    │
├─────────────────────────────────────────────┤
│                                             │
│  [☰]        ✦ Asrār         [EN│FR]        │
│          ʿIlm al-Ḥurūf & ʿAdad             │ ← Optional subtitle
│                                             │
└─────────────────────────────────────────────┘
```

**Features:**
- Same as centered variant
- ✅ Adds Arabic subtitle (faded)
- ✅ Logo remains visible above subtitle

**Best For:**
- Screens where context needs reinforcement
- Educational/informational flows

---

### 3️⃣ Minimal Variant

```
┌─────────────────────────────────────────────┐
│ Gradient: #0f172a → #1e1b4b → rgba(...)    │
├─────────────────────────────────────────────┤
│                                             │
│              ✦ Asrār                        │ ← Logo + Title only
│                                             │
└─────────────────────────────────────────────┘
```

**Features:**
- ✅ Logo + Title only, no icons
- ✅ Ultra-clean
- ✅ Maximum focus
- ✅ Sacred geometry remains visible

**Best For:**
- Meditation screens
- Focused spiritual practices
- Minimal distractions needed

---

### 4️⃣ Default Variant (Original)

```
┌─────────────────────────────────────────────┐
│ Background: #FFFFFF (or custom)             │
├─────────────────────────────────────────────┤
│                                             │
│ [Logo] Asrār    [👤] [EN FR] [📋] [☰]      │ ← 60px height
│                                             │
└─────────────────────────────────────────────┘
    ↑      ↑       ↑    ↑     ↑    ↑
  Logo   Name   Profile Lang Hist Menu
```

**Features:**
- ✅ Left-aligned logo + name
- ✅ Full icon set
- ✅ White/custom background
- ✅ Bottom border

**Best For:**
- Calculator
- Settings
- Profile
- Utility screens

---

## Color Palette Reference

### Logo Design (Sacred Geometry)

**The Asrār Logo includes:**
- 8-pointed star (Octagram) - divine order
- 3 concentric rings - أسرار = 462 → 4+6+2 = 12 → 3
- 3 dots in triangular formation - trinity of body, soul, spirit
- Subtle ع (Ayn) curve - source/spring
- Center eye with inner dot - the "seed"

**Logo Color in Dark Theme:**
```
Color: rgba(255, 255, 255, 0.9)
Size: 28px
Position: Left of title, centered vertically
Gap: 8px between logo and title
```

### Centered/Minimal Variants

```
Background Gradient:
┌─────────┬─────────┬──────────────────┐
│#0f172a  │#1e1b4b  │rgba(26,22,37,.95)│
│Navy Blue│Purple   │Theme Background  │
└─────────┴─────────┴──────────────────┘
```

```
Accent & Text Colors:
┌──────────────────────┬────────────────────────┐
│ Element              │ Color                  │
├──────────────────────┼────────────────────────┤
│ Active Lang Button   │ #6B5CA5 (muted purple) │
│ Text Primary         │ #FFFFFF                │
│ Text Secondary       │ rgba(255,255,255,0.6)  │
│ Icon Color           │ rgba(255,255,255,0.7)  │
│ Border/Background    │ rgba(255,255,255,0.1)  │
└──────────────────────┴────────────────────────┘
```

### Default Variant

```
┌──────────────────────┬────────────────────────┐
│ Element              │ Color                  │
├──────────────────────┼────────────────────────┤
│ Background           │ #FFFFFF (customizable) │
│ App Name             │ #6B21A8 (bright purple)│
│ Active Lang Button   │ #7C3AED                │
│ Inactive Lang Button │ #F3F4F6                │
│ Icon Color           │ #6B7280                │
│ Border               │ #F3F4F6                │
└──────────────────────┴────────────────────────┘
```

---

## Typography Comparison

### Home Screen Title
```
Asrār Everyday
────────────────
Font Size:  32px
Weight:     700 (Bold)
Color:      #FFFFFF
```

### Header Title (Centered)
```
Asrār
─────
Font Size:  20px
Weight:     600 (Semi-Bold)
Color:      #FFFFFF
```

**Relationship:** Header is slightly smaller to create visual hierarchy while maintaining the same font family.

### Subtitle (Optional)
```
ʿIlm al-Ḥurūf & ʿAdad
─────────────────────
Font Size:  11px
Weight:     400 (Regular)
Color:      rgba(255,255,255,0.6)
Spacing:    0.8 letter-spacing
```

---

## Spacing & Dimensions

### Centered/Minimal Variants

```
┌─────────────────────────────────┐
│ [Safe Area Top] (dynamic)       │ ← iOS notch / Android status
├─────────────────────────────────┤
│ ↕ 12px padding                  │
│ [Content: 56px min height]      │
│ ↕ 12px padding                  │
├─────────────────────────────────┤
│ [No border]                     │
└─────────────────────────────────┘

Horizontal Padding: 16px
Icon Size: 20px
Language Button: 32px min width
```

### Default Variant

```
┌─────────────────────────────────┐
│ [Safe Area Top] (dynamic)       │
├─────────────────────────────────┤
│ ↕ 10px padding                  │
│ [Content: 60px min height]      │
│ ↕ 10px padding                  │
├─────────────────────────────────┤
│ [Border: 1px #F3F4F6]           │
└─────────────────────────────────┘

Horizontal Padding: 12px
Logo Size: 42px (36px on small screens)
Icon Size: 18-20px
Language Button: 40px min width
```

---

## Shadow & Elevation

### Centered/Minimal (Subtle)

```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.1,
shadowRadius: 3,
elevation: 2,
```

**Effect:** Very subtle drop shadow, barely visible

### Default (Light)

```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.05,
shadowRadius: 4,
elevation: 3,
```

**Effect:** Light shadow + bottom border

---

## When to Use Which Variant

```
┌────────────────┬──────────┬─────────┬─────────┐
│ Screen Type    │ Centered │ Minimal │ Default │
├────────────────┼──────────┼─────────┼─────────┤
│ Home           │    ✅    │         │         │
│ Istikhara      │    ✅    │    ✅   │         │
│ Prayer Times   │    ✅    │         │         │
│ Calculator     │    ✅    │         │    ✅   │
│ Profile        │          │         │    ✅   │
│ Settings       │          │         │    ✅   │
│ Meditation     │          │    ✅   │         │
└────────────────┴──────────┴─────────┴─────────┘

Legend:
✅ Recommended
```

---

## Accessibility Notes

All variants include:

```typescript
<TouchableOpacity
  accessibilityLabel="English language"  // Screen reader
  accessibilityRole="button"             // Semantic role
  accessibilityHint="Switch to English"  // Action hint (optional)
  accessibilityState={{ selected: true }} // Current state
  activeOpacity={0.7}                    // Visual feedback
>
```

**Minimum Touch Targets:**
- All buttons: 34px × 34px minimum
- Language buttons: 40px × 34px
- Menu icon: 36px × 36px

---

## Implementation Checklist

### To Switch to Centered Variant:

1. ✅ Add `variant="centered"` prop
2. ✅ Remove `backgroundColor` (uses gradient)
3. ✅ Remove `logoSource` (not used)
4. ✅ Keep `currentLanguage`, `onLanguageChange`, `onMenuPress`, `onProfilePress`
5. ✅ Optional: Add `showSubtitle={true}`

### Example:

```tsx
// Before
<AppHeader
  currentLanguage={language}
  onLanguageChange={setLanguage}
  onMenuPress={handleMenu}
  onProfilePress={handleProfile}
/>

// After
<AppHeader
  variant="centered"  // ← Add this
  currentLanguage={language}
  onLanguageChange={setLanguage}
  onMenuPress={handleMenu}
  onProfilePress={handleProfile}
/>
```

---

**Visual Design Summary:** The centered variant creates visual harmony with the Home screen through matching gradients, muted purple accents, and centered typography. The compact height and subtle shadows maintain a premium feel while supporting the spiritual aesthetic.
