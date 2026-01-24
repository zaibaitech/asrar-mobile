# 💎 Zodiac Stones Tab - Visual Preview

## Tab Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Overview | Personality | Career | Blessed | Spiritual | 💎  │ ← Tabs
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃        [Gradient: #74B9FF → #A29BFE (Air)]          ┃  │
│  ┃                                                      ┃  │
│  ┃                      ♎                               ┃  │
│  ┃                                                      ┃  │
│  ┃                    Libra                             ┃  │
│  ┃                   الميزان                            ┃  │
│  ┃                                                      ┃  │
│  ┃         🌪️               ♀                          ┃  │
│  ┃       Element            Planet                      ┃  │
│  ┃         Air              Venus                       ┃  │
│  ┃                                                      ┃  │
│  ┃           du 24 septembre au 23 octobre              ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  💎  Beneficial Stones & Crystals                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  These stones resonate with your zodiac energy and can     │
│  support your spiritual practice                            │
│                                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                │
│  │ ✨  │ │ ✨  │ │ ✨  │ │ ✨  │ │ ✨  │   ← Scroll →    │
│  │Aqua │ │Chrys│ │Jade │ │Kunz │ │Opal │                │
│  │marine│ │ocolla│ │     │ │ite  │ │     │                │
│  │زبرجد│ │كريزو│ │يشم  │ │كونزيت│ │أوبال│                │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                │
│                                                             │
│                    12 stones                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ℹ️  How to Use These Stones              [+]      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [When expanded:]                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ • Wear as jewelry (rings, bracelets, necklaces)     │  │
│  │ • Hold during meditation or dhikr practice          │  │
│  │ • Carry in your pocket or bag for daily energy      │  │
│  │ • Place in your living space or prayer area         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Color Schemes by Element

### Fire Signs (Aries, Leo, Sagittarius)
```
╔════════════════════════════════╗
║  Gradient: #FF6B6B → #FF8E53  ║  🔥
║        Red-Orange Warm         ║
╚════════════════════════════════╝
```

### Earth Signs (Taurus, Virgo, Capricorn)
```
╔════════════════════════════════╗
║  Gradient: #8B7355 → #A0826D  ║  🌍
║        Brown-Green Earthy      ║
╚════════════════════════════════╝
```

### Air Signs (Gemini, Libra, Aquarius)
```
╔════════════════════════════════╗
║  Gradient: #74B9FF → #A29BFE  ║  🌪️
║        Blue-Purple Light       ║
╚════════════════════════════════╝
```

### Water Signs (Cancer, Scorpio, Pisces)
```
╔════════════════════════════════╗
║  Gradient: #00B894 → #00CEC9  ║  💧
║        Teal-Turquoise Fluid    ║
╚════════════════════════════════╝
```

## Stone Card Detail

```
┌─────────────────┐
│                 │
│   ┌─────────┐   │
│   │   ✨    │   │  ← Icon with element background
│   └─────────┘   │
│                 │
│   Aquamarine    │  ← English name
│   زبرجد        │  ← Arabic name
│                 │
└─────────────────┘
   120px wide
```

## Interaction Flow

```
User Journey:
1. Complete "Who Am I" calculation
   ↓
2. View results tabs
   ↓
3. Tap "💎 Zodiac Stones" tab
   ↓
4. See zodiac header with symbol + element
   ↓
5. Scroll through beneficial stones →→→
   ↓
6. Tap "How to Use" to expand guide
   ↓
7. [Future] Tap individual stone for details
```

## Language Variations

### English
```
Tab: "Zodiac Stones"
Header: "Beneficial Stones & Crystals"
Guide: "How to Use These Stones"
```

### French
```
Tab: "Pierres"
Header: "Pierres et Cristaux Bénéfiques"
Guide: "Comment Utiliser Ces Pierres"
```

### Arabic (RTL)
```
Tab: "الأحجار"
Header: "الأحجار والبلورات المفيدة"
Guide: "كيفية استخدام هذه الأحجار"
```

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Horizontal scroll for stones
- Full-width cards
- Collapsible sections

### Tablet (768px - 1024px)
- Wider cards
- More stones visible per scroll
- Expanded spacing

### Desktop (> 1024px)
- Grid layout for stones
- All elements visible
- Enhanced animations

## Accessibility Features

✅ **Touch Targets**: 44x44px minimum  
✅ **Color Contrast**: 4.5:1 ratio  
✅ **Screen Readers**: ARIA labels on all interactive elements  
✅ **Haptic Feedback**: Light impact on button press  
✅ **Keyboard Navigation**: Full support (web)  
✅ **RTL Support**: Arabic text and layout  

## Animation Details

### On Load
- Header slides in from top (0.3s)
- Stones fade in sequentially (0.1s delay each)
- Usage guide ready to expand

### On Interaction
- Usage guide slides down (0.2s ease-out)
- Stone cards scale on press (1.05x)
- Haptic feedback on all taps

### On Scroll
- Parallax effect on header (subtle)
- Stone cards slide in from right
- Smooth momentum scrolling

---

*Visual design matches existing app dark theme with element-specific gradients*
