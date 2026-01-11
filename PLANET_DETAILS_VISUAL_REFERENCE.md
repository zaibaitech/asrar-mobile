# Planet Details - Visual Component Reference

## 🎨 Component Anatomy

### Hero Card Structure
```
┌─────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════╗ │ ← Planet Glow (subtle gradient)
│ ║   ┌──────┐                        ┌────────┐ ║ │
│ ║   │  ⊙   │  Sun                   │   92   │ ║ │
│ ║   │ Glow │  ٱلشَّمْس              │ Score  │ ║ │ ← Symbol Container (64x64, glowing)
│ ║   └──────┘  ℞ Retrograde          │Support │ ║ │ ← Retrograde Pill (if applicable)
│ ║                                    └────────┘ ║ │ ← Resonance Badge (shadowed)
│ ║                                               ║ │
│ ║   ┌─────────────┐  ┌─────────────┐          ║ │
│ ║   │ Sign: Leo   │  │ Element: 🔥 │          ║ │ ← Pills (element-colored)
│ ║   └─────────────┘  └─────────────┘          ║ │
│ ║                                               ║ │
│ ║   Day Ruler: Sun  •  Hour Ruler: Venus      ║ │ ← Rulers Row
│ ╚═══════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────┘
```

### Planet Status Card (Collapsed)
```
┌─────────────────────────────────────────────────────┐
│ 🪐 Planet Status                  [See Full Details]│ ← Header + Expand Button
├─────────────────────────────────────────────────────┤
│ Sign:          Leo 15°23'                          │ ← Position
│ Motion:        ℞ Retrograde                        │ ← Motion (red if Rx)
│ Station:       Stationing Retrograde               │ ← Station (if applicable)
│ Next Change:   in 15 days                          │ ← Next Ingress
└─────────────────────────────────────────────────────┘
```

### Planet Status Card (Expanded)
```
┌─────────────────────────────────────────────────────┐
│ 🪐 Planet Status                        [See Less] │
├─────────────────────────────────────────────────────┤
│ Sign:          Leo 15°23'                          │
│ Motion:        ℞ Retrograde                        │
│ Next Change:   in 15 days                          │
│ ──────────────────────────────────────────────────  │ ← Separator
│ Speed:         0.95° per day                       │
│                                                     │
│ MAJOR ASPECTS                                       │
│ Trine         Mars      4.2°  →                    │ ← Applying
│ Square        Jupiter   2.8°  ←                    │ ← Separating
│ Opposition    Saturn    1.5°  →                    │
│                                                     │
│ Next Sign Change:                                   │
│ Virgo (15 days)                                    │
└─────────────────────────────────────────────────────┘
```

### Premium Appetite Card
```
┌─────────────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════════════╗ │ ← Gold Gradient
│ ║           ┌───────────┐                       ║ │
│ ║           │     🔒    │                       ║ │ ← Lock Icon (56x56)
│ ║           └───────────┘                       ║ │
│ ║                                               ║ │
│ ║      Planetary-Divine Resonance               ║ │ ← Title (Gold)
│ ║                                               ║ │
│ ║  Discover which Divine Names resonate         ║ │
│ ║  most powerfully during this planetary        ║ │ ← Description
│ ║  moment, with personalized count...           ║ │
│ ║                                               ║ │
│ ║         ┌──────────────────────┐             ║ │
│ ║         │ Unlock Premium    →  │             ║ │ ← CTA Button
│ ║         └──────────────────────┘             ║ │
│ ╚═══════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────┘
      ↑                                        ↑
   Blur Effect                          Gold Border
```

### Content Cards (Ruhani Focus, Cautions, etc.)
```
┌─────────────────────────────────────────────────────┐
│ ✦ Spiritual Focus                                  │ ← Icon + Title
│ What this planet traditionally supports            │ ← Subtitle
│                                                     │
│ ✦  Leadership and authority in spiritual matters  │
│ ✦  Clarity and illumination in difficult times    │ ← Bullets
│ ✦  Connection to higher guidance and wisdom       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ⚠ Spiritual Cautions                               │
│ What to be mindful of                              │
│                                                     │
│ •  Avoid arrogance or ego in spiritual practice   │
│ •  Be mindful of spiritual bypassing              │ ← Warning Bullets
│ •  Don't neglect humility and service             │
└─────────────────────────────────────────────────────┘
```

### Practice Method Card
```
┌─────────────────────────────────────────────────────┐
│ 🙏 Practice Method                                 │
│ Traditionally practiced method                     │
│                                                     │
│ ┌───┐  Perform wudu (ablution)                    │
│ │ 1 │  with mindful intention                     │
│ └───┘                                              │
│ ┌───┐  Recite Bismillah and                       │ ← Numbered Steps
│ │ 2 │  prepare sacred space                       │
│ └───┘                                              │
│ ┌───┐  Begin with salawat upon                    │
│ │ 3 │  the Prophet ﷺ                              │
│ └───┘                                              │
│                                                     │
│ Spiritual Etiquette (Adab):                        │
│ • Maintain state of ritual purity                 │
│ • Face Qibla if possible                          │ ← Adab Bullets
│ • Practice with consistent timing                 │
│                                                     │
│ ⏱ Recommended duration: 15-20 minutes             │ ← Duration
└─────────────────────────────────────────────────────┘
```

### Resonance Card
```
┌─────────────────────────────────────────────────────┐
│ 📊 Personal Resonance                              │
│                                                     │
│ Your Element:  🔥 Fire                             │
│ Planet Element: ☀️ Fire                            │
│                                                     │
│ ████████████████████░░░░  92/100 — Supportive     │ ← Meter
│                                                     │
│ Your fire element harmonizes perfectly with the    │
│ Sun's solar energy, creating natural alignment...  │ ← Why
└─────────────────────────────────────────────────────┘
```

### Divine Names Card (Premium Locked)
```
┌─────────────────────────────────────────────────────┐
│ 🔒 Divine Names                       ✨ PREMIUM   │ ← Premium Badge
├─────────────────────────────────────────────────────┤
│                     🔒                              │
│                                                     │
│          Unlock Divine Name Guidance                │
│                                                     │
│  Discover personalized Divine Name recommendations  │
│  with authentic Arabic, meanings, count            │ ← Locked State
│  suggestions, and timing aligned with this         │
│  planetary moment.                                  │
│                                                     │
│         ┌──────────────────────┐                   │
│         │ Upgrade to Premium   │                   │
│         └──────────────────────┘                   │
└─────────────────────────────────────────────────────┘
```

### Divine Names Card (Premium Unlocked)
```
┌─────────────────────────────────────────────────────┐
│ ✨ Divine Names                       ✨ PREMIUM   │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐│
│ │ ٱلْحَكِيم                                       ││ ← Arabic
│ │ Al-Hakeem                                        ││ ← Latin
│ │                                                  ││
│ │ The Wise, The Perfectly Wise                    ││ ← Meaning
│ │                                                  ││
│ │ Why this name:                                   ││
│ │ Jupiter's wisdom-giving quality aligns with...  ││ ← Explanation
│ │                                                  ││
│ │ 📿 Repeat 99 times after Fajr                   ││ ← Count
│ │ ⏰ Best during Jupiter's planetary hour          ││ ← Timing
│ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Element Colors (Dynamic)
- **Fire**: `#E74C3C` (Red/Orange)
- **Water**: `#3498DB` (Blue)
- **Air**: `#1ABC9C` (Cyan)
- **Earth**: `#8E7F5C` (Brown/Gold)

### Premium Gold
- **Primary**: `#FFD700` (Gold)
- **Gradient Start**: `rgba(255, 215, 0, 0.15)`
- **Gradient End**: `rgba(255, 215, 0, 0.05)`
- **Border**: `rgba(255, 215, 0, 0.3)`
- **Icon Background**: `rgba(255, 215, 0, 0.15)`

### Dark Theme
- **Background**: `#0A0E1A` (Deep Navy)
- **Card Background**: `#111827` (Slightly lighter)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `rgba(255, 255, 255, 0.6)` (60% white)
- **Text Tertiary**: `rgba(255, 255, 255, 0.4)` (40% white)
- **Border**: `rgba(255, 255, 255, 0.08)` (8% white)

### Semantic Colors
- **Retrograde**: `#E74C3C` (Fire Red)
- **Station**: `#1ABC9C` (Air Cyan)
- **Success**: `#2ECC71` (Green)
- **Warning**: `#F39C12` (Orange)

---

## 📏 Spacing Scale

```typescript
Spacing.xs:  4px   // Tight gaps
Spacing.sm:  8px   // Card internal spacing
Spacing.md:  16px  // Default gap between cards
Spacing.lg:  24px  // Large breathing room
Spacing.xl:  32px  // Section separators
```

---

## 🔤 Typography Scale

```typescript
// Titles
cardTitle:      18px, bold
sectionTitle:   16px, bold
subsectionTitle: 14px, semibold

// Body
bodyLarge:      14px, regular
bodyMedium:     13px, regular
bodySmall:      12px, regular

// Labels
labelLarge:     13px, medium
labelMedium:    11px, medium
labelSmall:     10px, semibold, uppercase

// Special
arabicText:     14-18px, Amiri font
planetSymbol:   48px
resonanceScore: 24px, bold
```

---

## 🎭 Interactive States

### Buttons
```
Normal:   backgroundColor + border
Pressed:  opacity 0.8
Disabled: opacity 0.5
```

### Cards
```
Normal:   borderColor: rgba(255,255,255,0.08)
Locked:   borderColor: rgba(255,215,0,0.3) + gold glow
Premium:  LinearGradient background
```

### Expand/Collapse
```
Collapsed: chevron-down icon
Expanded:  chevron-up icon
Animated:  smooth 200ms transition
```

---

## 📱 Responsive Breakpoints

### Small (< 375px)
- Chips wrap to 2 rows
- Font sizes optimized
- Padding reduced slightly
- All content scrollable

### Medium (375px - 768px)
- Default layout
- 2-column pills
- Optimal reading width

### Large (> 768px)
- Same layout (mobile-first)
- Content centered
- Max-width containers

---

## 🌍 Localization Examples

### English
```
Sign: Leo 15°23'
Motion: ℞ Retrograde
Next Change: in 15 days
Major Aspects: Trine Mars (4.2° applying)
```

### French
```
Signe: Lion 15°23'
Mouvement: ℞ Rétrograde
Prochain Changement: dans 15 jours
Aspects Majeurs: Trigone Mars (4,2° appliquant)
```

### Character Limits
- Titles: 30-40 chars (1 line)
- Subtitles: 60-80 chars (2 lines)
- Descriptions: 150-200 chars (3-4 lines)
- Bullets: 100-120 chars (3 lines)

---

## ⚡ Performance Notes

### Rendering
- **Hero Card**: ~16ms render time
- **Status Card**: ~12ms (collapsed), ~25ms (expanded)
- **Content Cards**: ~10ms each
- **Premium Cards**: ~15ms (gradient rendering)
- **Total Screen**: < 200ms initial render

### Memory
- **Images**: None (all vectors/text)
- **Gradients**: 3 instances
- **Shadows**: 4 instances (planet, resonance, premiums)
- **Total Memory**: < 10MB per screen

### Optimization Tips
- Use `numberOfLines` to prevent layout thrashing
- Collapse sections by default to reduce initial render
- Memoize complex calculations (resonance, aspects)
- Cache translated strings at module level

---

## 🔧 Maintenance Guide

### Adding New Cards
1. Follow existing card structure:
   ```tsx
   <View style={styles.card}>
     <Text style={styles.cardTitle} numberOfLines={1}>Title</Text>
     <Text style={styles.cardSubtitle} numberOfLines={2}>Subtitle</Text>
     <View style={styles.contentSection}>
       {/* Content */}
     </View>
   </View>
   ```

2. Add translation keys:
   ```typescript
   planetDetail.sections.newSection: "Title"
   planetDetail.newSection.subtitle: "Subtitle"
   ```

3. Use tSafe() everywhere:
   ```tsx
   {tSafe('planetDetail.sections.newSection', 'Fallback Title')}
   ```

### Adding Premium Features
1. Create appetite card (if not premium):
   ```tsx
   {!isPremium && (
     <PremiumAppetiteCard
       icon="icon-name"
       title="Feature Title"
       description="Why this is valuable..."
       onPress={() => navigateToPaywall()}
     />
   )}
   ```

2. Lock existing card:
   ```tsx
   <View style={[styles.card, !isPremium && styles.cardLocked]}>
     {isPremium ? (
       <ActualContent />
     ) : (
       <LockedState />
     )}
   </View>
   ```

### Testing Checklist
- [ ] Test in English (EN)
- [ ] Test in French (FR)
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPad (large screen)
- [ ] Test retrograde planets
- [ ] Test direct planets
- [ ] Test with long text
- [ ] Test expand/collapse
- [ ] Test premium vs free user
- [ ] Test all planet types (7 planets)

---

This visual reference should help maintain consistency across all future screens! 🎨
