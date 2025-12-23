# Home Screen Visual Design Reference

## 📐 Layout Structure

```
┌─────────────────────────────────────────┐
│  ASRĀR EVERYDAY HOME SCREEN             │
├─────────────────────────────────────────┤
│                                         │
│  Welcome to Asrār Everyday              │ ← Welcome Section
│  Explore the ancient science...         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Quick Access                           │ ← Widget Bar Title
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │ 🕌 │ │ ✨ │ │ 📿 │ │ 📅 │ ← Scroll│
│  │Next│ │Quote│ │Dhikr│ │Day │    →   │
│  └────┘ └────┘ └────┘ └────┘          │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  Spiritual Modules                      │ ← Section Title
│                                         │
│  ┌─────────────────────────────────┐  │
│  │▌🧮 Calculator                   │  │
│  │  حاسبة الأبجد                   │  │ ← Module Cards
│  │  Advanced Abjad numerology...   │  │   (Glassmorphism)
│  │  [Coming Soon]                  │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │▌📜 Name Destiny                 │  │
│  │  قدر الأسماء                    │  │
│  │  Discover the spiritual...      │  │
│  │  [Coming Soon]                  │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │▌🌙 Istikhara              ✓     │  │ ← Active
│  │  الاستخارة                      │  │
│  │  Spiritual consultation...      │  │
│  └─────────────────────────────────┘  │
│                                         │
│  (More modules...)                      │
│                                         │
└─────────────────────────────────────────┘
```

## 🎨 Color Palette

### Background Gradients

```
Top:    #0f172a (Deep navy blue)
Middle: #1e1b4b (Deep purple)
Bottom: #1A1625 (Theme background)
```

### Element Colors

**Fire** 🔥
```
Primary:   ████ #FF6B6B (Coral red)
Secondary: ████ #FF8A65 (Salmon)
Glow:      ░░░░ rgba(255, 107, 107, 0.2)
```

**Earth** 🌱
```
Primary:   ████ #8B7355 (Muted brown)
Secondary: ████ #A0826D (Tan)
Glow:      ░░░░ rgba(139, 115, 85, 0.2)
```

**Air** 💨
```
Primary:   ████ #64B5F6 (Soft blue)
Secondary: ████ #81D4FA (Light cyan)
Glow:      ░░░░ rgba(100, 181, 246, 0.2)
```

**Water** 💧
```
Primary:   ████ #4FC3F7 (Gentle teal)
Secondary: ████ #26C6DA (Aqua)
Glow:      ░░░░ rgba(79, 195, 247, 0.2)
```

### Text Colors

```
Primary:   ████ #FFFFFF (Pure white)
Secondary: ████ #E5E5E5 (Light gray)
Tertiary:  ████ #B0B0B0 (Medium gray)
Muted:     ████ #808080 (Dark gray)
```

## 📏 Dimensions

### Module Cards

```
Width:         100% - 32px (16px margins each side)
Height:        Auto (content-based)
Border Radius: 16px
Padding:       20px
Accent Bar:    5px width (left edge)
Icon Size:     48px
Title:         20px (bold)
Arabic:        14px (medium)
Description:   16px (regular)
```

### Widget Bar

```
Widget Width:  160px
Widget Height: 140px
Gap:           12px
Scroll:        Horizontal
Border Radius: 16px
Padding:       12px
```

### Spacing Scale

```
xs:    4px   ▁
sm:    8px   ▂
md:    12px  ▃
lg:    16px  ▄
xl:    20px  ▅
xxl:   24px  ▆
xxxl:  32px  ▇
```

## 🎭 Animation Specs

### Module Card Press

```
Press In:
  Scale:   1.0 → 0.97 (spring, damping: 15)
  Opacity: 1.0 → 0.85 (timing, duration: 100ms)

Press Out:
  Scale:   0.97 → 1.0 (spring, damping: 15)
  Opacity: 0.85 → 1.0 (timing, duration: 100ms)
```

### Dhikr Counter Tap

```
Tap:
  Scale:   1.0 → 1.1 → 1.0 (spring, damping: 10)
  Glow:    0.0 → 0.8 → 0.0 (timing, 100ms + 400ms)
  Haptic:  Light impact feedback
```

## 🖼 Visual Effects

### Glassmorphism Recipe

```css
/* Base layer */
background: LinearGradient(
  element.primary @ 15% opacity,
  element.secondary @ 10% opacity,
  rgba(45, 21, 21, 0.6)
)

/* Glass overlay */
background: rgba(45, 21, 21, 0.4)
border: 1px solid rgba(255, 255, 255, 0.1)
border-radius: 16px
backdrop-filter: blur(10px)  /* Web only */

/* Accent bar */
position: absolute
left: 0
width: 5px
background: element.primary
```

### Shadow Depth

```
Card Shadow:
  color: #000
  offset: (0, 4)
  opacity: 0.3
  radius: 8
  elevation: 5 (Android)

Subtle Shadow:
  color: #000
  offset: (0, 2)
  opacity: 0.2
  radius: 4
  elevation: 2 (Android)
```

## 📱 Responsive Behavior

### Small Screens (<375px width)

- Module cards maintain full width
- Widget bar scrolls horizontally
- Text sizes remain consistent
- Padding reduces to 12px

### Large Screens (>768px width)

- Cards could display in 2 columns (future enhancement)
- Widget bar shows more items
- Increased padding for comfort

### Safe Area Handling

```
Top:    Automatic (status bar)
Bottom: Dynamic based on device
Sides:  16px minimum padding
```

## 🎯 Touch Targets

### Minimum Sizes (iOS HIG / Material Design)

```
Module Cards:   Full width × 120px min
Widgets:        160px × 140px
Dhikr Counter:  100px × 100px (tap area)
Reset Button:   44px × 44px min
```

## 🔤 Typography

### Font Sizes

```
h1 (Welcome):       32px
h2 (Section):       24px
h3 (Card Title):    20px
body (Description): 16px
label (Arabic):     14px
caption (Badge):    12px
```

### Font Weights

```
Light:     300
Regular:   400  ← Body text
Medium:    500  ← Arabic labels
Semibold:  600  ← Section titles
Bold:      700  ← Card titles
```

### Line Heights

```
Tight:    1.2 (Titles)
Normal:   1.5 (Body text)
Relaxed:  1.8 (Descriptions)
```

## 🌈 State Indicators

### Module States

**Active** (Istikhara):
- Full opacity
- Full color accent bar
- Pressable with animations

**Coming Soon**:
- Same opacity
- Badge: "قريباً • Coming Soon"
- Non-pressable

**Disabled** (future):
- 50% opacity
- Grayscale filter
- Non-pressable

### Widget States

**Active**:
- Full color
- Interactive feedback

**Loading**:
- Spinner overlay
- 70% opacity

**Error**:
- Red accent border
- Error icon

## 🎨 Design Principles

### Islamic Geometric Principles

1. **Symmetry**: Balanced card layouts
2. **Layered Depth**: Glassmorphism creates spiritual depth
3. **Sacred Geometry**: 16px grid system (multiples of 4)
4. **Calligraphy**: Arabic text given prominence

### Cultural Authenticity

1. **Right-to-Left Respect**: Accent bars on left
2. **Bilingual Labels**: Arabic + English
3. **Element Symbolism**: Traditional associations
4. **Spiritual Colors**: Muted, contemplative palette

### Modern UX

1. **Glassmorphism**: Contemporary visual trend
2. **Spring Animations**: Natural, satisfying motion
3. **Haptic Feedback**: Tactile engagement
4. **Progressive Disclosure**: Two-tier information hierarchy

## 📊 Accessibility

### Color Contrast (WCAG AA)

```
✓ White on Dark Background:  21:1 (AAA)
✓ Element Primary on Dark:    4.5:1+ (AA)
✓ Text Secondary on Dark:     14:1 (AAA)
```

### Touch Targets

```
✓ All interactive elements:  44×44px minimum
✓ Card tap areas:            Full width × 120px+
✓ Widget buttons:            160×140px
```

### Screen Reader Support

- Semantic labels for icons
- Descriptive button text
- Proper heading hierarchy

## 🎬 User Flow

### First Launch

```
1. View welcome message
2. Scroll widget bar (discover features)
3. Tap Istikhara card (only active module)
4. Navigate to form
```

### Daily Use

```
1. Glance at blessed day widget
2. Read daily quote
3. Tap dhikr counter throughout day
4. Access modules as needed
```

### Exploration

```
1. Scroll through all modules
2. Note "Coming Soon" badges
3. Understand element associations
4. Plan future features to explore
```

---

## 🎨 Visual Hierarchy

```
1. Welcome Title        (Largest, bold)
2. Section Headers      (Large, semibold)
3. Module Titles        (Medium, bold)
4. Arabic Labels        (Small, medium)
5. Descriptions         (Base, regular)
6. Captions/Badges      (Smallest, semibold)
```

## 🌟 Key Differentiators

### vs. Standard Material Design
- Deeper, richer color palette
- More dramatic shadows
- Glassmorphism instead of flat cards

### vs. iOS Human Interface
- Element-based theming
- Spiritual/cultural imagery
- Bilingual by default

### vs. Other Spiritual Apps
- Modern glassmorphism aesthetics
- Professional typography
- Performance-optimized animations
- Cohesive design system

---

**This design balances tradition with innovation** 🌙✨
